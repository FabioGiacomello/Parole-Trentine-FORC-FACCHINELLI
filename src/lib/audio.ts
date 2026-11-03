const MANIFEST_URL = `${import.meta.env.BASE_URL}audio/manifest.json`;

const normalize = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('it');
const accentless = (value: string) => normalize(value.normalize('NFD').replace(/\p{Diacritic}/gu, ''));

let manifestPromise: Promise<Map<string, string>> | undefined;

function loadManifest(): Promise<Map<string, string>> {
  manifestPromise ??= fetch(MANIFEST_URL)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<Record<string, string>>;
    })
    .then(json => new Map(Object.entries(json)))
    .catch(error => {
      console.error('Manifest audio non disponibile:', error);
      manifestPromise = undefined;
      return new Map<string, string>();
    });
  return manifestPromise;
}

/** Risolve l'URL audio: prima quello salvato nel database, poi i file locali in /audio. */
export async function resolveAudioUrl(dialectWord: string, audioUrl?: string): Promise<string | undefined> {
  if (audioUrl) return audioUrl;
  const manifest = await loadManifest();
  const exact = manifest.get(normalize(dialectWord));
  if (exact) return `${import.meta.env.BASE_URL}audio/${exact}`;
  const target = accentless(dialectWord);
  for (const [key, file] of manifest) {
    if (accentless(key) === target) return `${import.meta.env.BASE_URL}audio/${file}`;
  }
  return undefined;
}

export async function hasAudio(dialectWord: string, audioUrl?: string): Promise<boolean> {
  return Boolean(await resolveAudioUrl(dialectWord, audioUrl));
}
