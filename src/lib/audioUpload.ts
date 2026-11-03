import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'audio';
const FOLDER = 'entries';
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const AUDIO_EXTENSIONS = ['wav', 'mp3', 'ogg', 'm4a', 'aac', 'webm'];

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'audio';

/** Restituisce un messaggio d'errore se il file non è un audio valido, altrimenti null. */
export function validateAudioFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!file.type.startsWith('audio/') && !AUDIO_EXTENSIONS.includes(extension)) {
    return 'Il file deve essere un audio (wav, mp3, ogg, m4a).';
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return 'Il file audio supera il limite di 10 MB.';
  }
  return null;
}

/** Carica l'audio nello storage e restituisce l'URL pubblico. */
export async function uploadEntryAudio(file: File, dialectWord: string): Promise<string> {
  const error = validateAudioFile(file);
  if (error) throw new Error(error);

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'wav';
  const path = `${FOLDER}/${crypto.randomUUID()}-${slugify(dialectWord)}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (uploadError) throw uploadError;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Elimina dallo storage un audio caricato dall'admin (ignora URL esterni). */
export async function deleteEntryAudio(audioUrl: string): Promise<void> {
  const marker = `/${BUCKET}/`;
  const index = audioUrl.indexOf(marker);
  if (index === -1) return;
  const path = decodeURIComponent(audioUrl.slice(index + marker.length));
  if (!path.startsWith(`${FOLDER}/`)) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
