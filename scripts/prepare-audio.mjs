import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadImportDataset, objectPathForAudio, repairMojibake } from './import-dictionary.mjs';

// Copia i WAV in public/audio con nomi ASCII sicuri e genera manifest.json (parola normalizzata -> file).
// Le chiavi sono sia le voci del dizionario abbinate sia il nome del file, così funziona anche con voci presenti solo nel database.
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = join(root, 'public', 'audio');
const normalize = (value) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('it');

const dataset = loadImportDataset(root);
const entryByKey = new Map(dataset.entries.map((entry) => [`${normalize(entry.dialect_word)}\u0000${entry.category}`, entry]));
mkdirSync(outDir, { recursive: true });

const manifest = {};
for (const match of dataset.audioMatches) {
  const stem = repairMojibake(basename(match.file, extname(match.file)));
  const fileName = basename(objectPathForAudio(match.file));
  copyFileSync(match.file, join(outDir, fileName));
  manifest[normalize(stem)] = fileName;
  for (const key of match.targets) {
    const entry = entryByKey.get(key);
    if (entry) manifest[normalize(entry.dialect_word)] = fileName;
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b, 'it')));
writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`${dataset.audioFiles.length} file copiati, ${Object.keys(sorted).length} voci nel manifest`);
