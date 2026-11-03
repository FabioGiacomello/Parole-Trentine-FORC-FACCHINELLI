-- Sicurezza e minimizzazione dei dati (art. 5 e 32 GDPR)

-- 1. Contatori visualizzazioni: la scrittura avviene solo tramite increment_word_view (SECURITY DEFINER),
--    quindi non serve (ed è rischioso) permettere INSERT/UPDATE diretti a chiunque.
DROP POLICY IF EXISTS "word_views_insert" ON public.word_views;
DROP POLICY IF EXISTS "word_views_update" ON public.word_views;

-- 2. Suggerimenti: chi invia può creare solo righe "in attesa", senza note né revisione e con lunghezze limitate.
DROP POLICY IF EXISTS "Chiunque può inviare suggerimenti" ON public.suggestions;
CREATE POLICY "Chiunque può inviare suggerimenti"
ON public.suggestions
FOR INSERT
WITH CHECK (
  status = 'pending'
  AND admin_notes IS NULL
  AND reviewed_at IS NULL
  AND char_length(dialect_word) BETWEEN 1 AND 200
  AND char_length(italian_word) BETWEEN 1 AND 200
  AND (definition IS NULL OR char_length(definition) <= 2000)
  AND (submitter_name IS NULL OR char_length(submitter_name) <= 200)
  AND (submitter_email IS NULL OR char_length(submitter_email) <= 320)
);

-- 3. Storage: nessun upload pubblico (l'app non lo usa); gli admin hanno già la policy dedicata (migrazione 05).
DROP POLICY IF EXISTS "Chiunque può caricare audio per i suggerimenti" ON storage.objects;

-- 4. Conservazione: cancella i suggerimenti più vecchi di 24 mesi (limite indicato nell'informativa).
--    Da eseguire periodicamente, ad esempio con pg_cron: SELECT cron.schedule('purge-suggestions', '0 3 * * 0', 'SELECT public.purge_old_suggestions()');
CREATE OR REPLACE FUNCTION public.purge_old_suggestions(retention_months integer DEFAULT 24)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted integer;
BEGIN
  DELETE FROM public.suggestions
  WHERE created_at < now() - make_interval(months => retention_months);
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$;
REVOKE ALL ON FUNCTION public.purge_old_suggestions(integer) FROM PUBLIC, anon, authenticated;
