  -- Risolve i warning del Supabase linter (performance + sicurezza).
  -- Idempotente e autosufficiente: sostituisce le policy esistenti (anche quelle con nomi inglesi
  -- create da strumenti esterni) con un set minimo e coerente.

  -- 1. has_role in uno schema NON esposto da PostgREST (private) --------------------------------
  --    Le policy RLS lo chiamano ancora, ma non è più invocabile via /rest/v1/rpc.
  CREATE SCHEMA IF NOT EXISTS private;
  REVOKE ALL ON SCHEMA private FROM PUBLIC;
  GRANT USAGE ON SCHEMA private TO authenticated;

  CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
  AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
  $$;
  REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

  -- 2. Rimuove tutte le policy esistenti sulle tabelle applicative e sull'audio -----------------
  DO $$
  DECLARE
    p record;
  BEGIN
    FOR p IN
      SELECT schemaname, tablename, policyname
      FROM pg_policies
      WHERE (schemaname = 'public'
            AND tablename IN ('dictionary_entries', 'suggestions', 'user_roles', 'word_views'))
        OR (schemaname = 'storage' AND tablename = 'objects'
            AND (coalesce(qual, '') ILIKE '%audio%' OR coalesce(with_check, '') ILIKE '%audio%'))
    LOOP
      EXECUTE format('DROP POLICY %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    END LOOP;
  END $$;

  -- 3. dictionary_entries: lettura pubblica, scrittura solo admin -------------------------------
  CREATE POLICY "dictionary_entries_select" ON public.dictionary_entries
    FOR SELECT TO anon, authenticated USING (true);

  CREATE POLICY "dictionary_entries_insert_admin" ON public.dictionary_entries
    FOR INSERT TO authenticated
    WITH CHECK (private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "dictionary_entries_update_admin" ON public.dictionary_entries
    FOR UPDATE TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'))
    WITH CHECK (private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "dictionary_entries_delete_admin" ON public.dictionary_entries
    FOR DELETE TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'));

  -- 4. suggestions: invio pubblico validato, gestione solo admin --------------------------------
  CREATE POLICY "suggestions_insert_public" ON public.suggestions
    FOR INSERT TO anon, authenticated
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

  CREATE POLICY "suggestions_select_admin" ON public.suggestions
    FOR SELECT TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "suggestions_update_admin" ON public.suggestions
    FOR UPDATE TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'))
    WITH CHECK (private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "suggestions_delete_admin" ON public.suggestions
    FOR DELETE TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'));

  -- 5. user_roles: una sola policy SELECT (niente "multiple permissive"), scrittura solo admin --
  CREATE POLICY "user_roles_select" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()) OR private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "user_roles_insert_admin" ON public.user_roles
    FOR INSERT TO authenticated
    WITH CHECK (private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "user_roles_update_admin" ON public.user_roles
    FOR UPDATE TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'))
    WITH CHECK (private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "user_roles_delete_admin" ON public.user_roles
    FOR DELETE TO authenticated
    USING (private.has_role((SELECT auth.uid()), 'admin'));

  -- 6. word_views: sola lettura; la scrittura passa solo da increment_word_view ------------------
  CREATE POLICY "word_views_select" ON public.word_views
    FOR SELECT TO anon, authenticated USING (true);

  CREATE OR REPLACE FUNCTION public.increment_word_view(
    p_dialect_word text,
    p_italian_word text
  ) RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
  BEGIN
    IF p_dialect_word IS NULL OR p_italian_word IS NULL
      OR char_length(p_dialect_word) NOT BETWEEN 1 AND 200
      OR char_length(p_italian_word) NOT BETWEEN 1 AND 200 THEN
      RAISE EXCEPTION 'invalid word';
    END IF;

    -- Conta solo parole realmente presenti nel dizionario (evita righe spazzatura)
    IF NOT EXISTS (
      SELECT 1 FROM public.dictionary_entries
      WHERE lower(dialect_word) = lower(p_dialect_word)
    ) THEN
      RETURN;
    END IF;

    INSERT INTO public.word_views (dialect_word, italian_word, view_count, last_viewed_at)
    VALUES (p_dialect_word, p_italian_word, 1, now())
    ON CONFLICT (dialect_word) DO UPDATE
    SET view_count = public.word_views.view_count + 1,
        last_viewed_at = now();
  END;
  $$;
  REVOKE ALL ON FUNCTION public.increment_word_view(text, text) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.increment_word_view(text, text) TO anon, authenticated;

  -- 7. Funzioni non usate dall'app: nessun accesso via API ---------------------------------------
  DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

  DO $$
  BEGIN
    IF to_regprocedure('public.admin_db_stats()') IS NOT NULL THEN
      REVOKE ALL ON FUNCTION public.admin_db_stats() FROM PUBLIC, anon, authenticated;
    END IF;
  END $$;

  CREATE OR REPLACE FUNCTION public.purge_old_suggestions(retention_months integer DEFAULT 24)
  RETURNS integer
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
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

  -- 8. Storage audio: niente listing pubblico, niente upload anonimo -----------------------------
  --    Gli URL pubblici (getPublicUrl) funzionano senza policy SELECT per anon.
  --    Gli admin hanno SELECT perché DELETE/UPDATE su storage.objects lo richiedono.
  UPDATE storage.buckets SET file_size_limit = 10485760 WHERE id = 'audio';

  CREATE POLICY "audio_select_admin" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'audio' AND private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "audio_insert_admin" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'audio'
      AND (storage.foldername(name))[1] = 'entries'
      AND private.has_role((SELECT auth.uid()), 'admin')
    );

  CREATE POLICY "audio_update_admin" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'audio' AND private.has_role((SELECT auth.uid()), 'admin'))
    WITH CHECK (bucket_id = 'audio' AND private.has_role((SELECT auth.uid()), 'admin'));

  CREATE POLICY "audio_delete_admin" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'audio' AND private.has_role((SELECT auth.uid()), 'admin'));
