-- Tabella per tracciare le visualizzazioni globali delle parole
CREATE TABLE IF NOT EXISTS public.word_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dialect_word text NOT NULL,
  italian_word text NOT NULL,
  view_count bigint DEFAULT 1 NOT NULL,
  last_viewed_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(dialect_word)
);

-- Abilita RLS
ALTER TABLE public.word_views ENABLE ROW LEVEL SECURITY;

-- Tutti possono leggere le statistiche
CREATE POLICY "word_views_select" ON public.word_views
  FOR SELECT USING (true);

-- Tutti possono inserire visualizzazioni (anonimi inclusi)
CREATE POLICY "word_views_insert" ON public.word_views
  FOR INSERT WITH CHECK (true);

-- Tutti possono aggiornare i contatori
CREATE POLICY "word_views_update" ON public.word_views
  FOR UPDATE USING (true);

-- Funzione upsert atomica per incrementare il contatore
CREATE OR REPLACE FUNCTION public.increment_word_view(
  p_dialect_word text,
  p_italian_word text
) RETURNS void AS $$
BEGIN
  INSERT INTO public.word_views (dialect_word, italian_word, view_count, last_viewed_at)
  VALUES (p_dialect_word, p_italian_word, 1, now())
  ON CONFLICT (dialect_word) DO UPDATE
  SET view_count = word_views.view_count + 1,
      last_viewed_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
