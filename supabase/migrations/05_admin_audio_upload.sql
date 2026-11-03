-- Permette agli admin di caricare e sostituire i file audio delle voci del dizionario
CREATE POLICY "Gli admin possono caricare audio delle voci"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio'
  AND (storage.foldername(name))[1] = 'entries'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Gli admin possono aggiornare i file audio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));
