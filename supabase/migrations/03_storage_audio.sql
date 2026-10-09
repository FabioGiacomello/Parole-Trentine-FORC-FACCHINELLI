-- Crea il bucket di storage per i file audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Permette a chiunque di caricare file audio nella cartella suggerimenti
CREATE POLICY "Chiunque può caricare audio per i suggerimenti"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio' AND (storage.foldername(name))[1] = 'suggestions');

-- Consente l'accesso pubblico in lettura a tutti i file audio
CREATE POLICY "I file audio sono accessibili pubblicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

-- Permette agli admin di eliminare i file audio
CREATE POLICY "Gli admin possono eliminare i file audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));
