-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload audio files to suggestions folder
CREATE POLICY "Anyone can upload audio suggestions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio' AND (storage.foldername(name))[1] = 'suggestions');

-- Allow public read access to all audio files
CREATE POLICY "Audio files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

-- Allow admins to delete audio files
CREATE POLICY "Admins can delete audio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));