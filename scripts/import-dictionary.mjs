import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 1000;
const BATCH_SIZE = 100;
const CONCURRENCY = 8;

const normalizeWord = (value) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('it');
const normalizeAudioKey = (value) => normalizeWord(value).replaceAll('_', "'").replace(/[’‘`]/g, "'");

export function parseCategory(rawCategory) {
  const sourceCategory = String(rawCategory ?? '').normalize('NFC').trim();
  const code = sourceCategory.toLocaleLowerCase('it').replaceAll('.', '').replace(/\s+/g, ' ');
  const nounGender = new Map([
    ['sm', 'maschile'],
    ['ṡm', 'maschile'],
    ['sf', 'femminile'],
    ['smpl', 'maschile'],
    ['sfpl', 'femminile'],
    ['sn', 'neutro'],
  ]);

  if (nounGender.has(code)) {
    return {
      category: 'sostantivo',
      gender: nounGender.get(code),
      number: code.endsWith('pl') ? 'plurale' : null,
      sourceCategory,
    };
  }

  if (['np', 'sb', 'sm e agg', 'sm/agg', 'sm e sf'].includes(code)) {
    return {
      category: 'sostantivo',
      gender: code === 'sm e agg' || code === 'sm/agg' ? 'maschile' : null,
      number: null,
      sourceCategory,
    };
  }

  const categories = new Map([
    ['sostantivo', 'sostantivo'],
    ['s', 'sostantivo'],
    ['verbo', 'verbo'],
    ['v', 'verbo'],
    ['vb', 'verbo'],
    ['sv', 'verbo'],
    ['vd', 'verbo'],
    ['vo', 'verbo'],
    ['aggettivo', 'aggettivo'],
    ['agg', 'aggettivo'],
    ['am', 'aggettivo'],
    ['agg e pron', 'aggettivo'],
    ['agg/pron', 'aggettivo'],
    ['avverbio', 'avverbio'],
    ['avv', 'avverbio'],
    ['pronome', 'pronome'],
    ['pron', 'pronome'],
    ['preposizione', 'preposizione'],
    ['prep', 'preposizione'],
    ['pre', 'preposizione'],
    ['congiunzione', 'congiunzione'],
    ['cong', 'congiunzione'],
    ['esclamazione', 'esclamazione'],
    ['escl', 'esclamazione'],
    ['es', 'esclamazione'],
    ['inter', 'interiezione'],
    ['int', 'interiezione'],
    ['locuzione', 'locuzione'],
    ['loc', 'locuzione'],
    ['los', 'locuzione'],
    ['art', 'articolo'],
    ['articolo', 'articolo'],
    ['num', 'numerale'],
    ['numerale', 'numerale'],
  ]);

  return {
    category: categories.get(code) ?? 'altro',
    gender: null,
    number: null,
    sourceCategory,
  };
}

function parseCsvRecord(line) {
  const cells = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      cells.push(value);
      value = '';
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error(`Riga CSV con virgolette non chiuse: ${line.slice(0, 100)}`);
  cells.push(value);
  return cells;
}

function parseCsv(text, wrappedRows = false) {
  return text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const normalizedLine = wrappedRows && line.startsWith('"') && line.endsWith('"')
        ? line.slice(1, -1).replaceAll('""', '"')
        : line;
      return parseCsvRecord(normalizedLine);
    });
}

function decodeText(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.toString('utf16le').replace(/^\uFEFF/, '');
  }
  return buffer.toString('utf8').replace(/^\uFEFF/, '');
}

function normalizedHeader(value) {
  return String(value ?? '').normalize('NFC').trim().toLocaleLowerCase('it').replace(/[._]/g, ' ');
}

function parseRows(rows, { source, priority, diagnostics }) {
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => /^(cat|sigla|categoria)(?:\s|$)/.test(normalizedHeader(cell)))
  );
  if (headerIndex < 0) return [];

  const headers = rows[headerIndex].map(normalizedHeader);
  const categoryIndex = headers.findIndex((header) => /^(cat|sigla|categoria)(?:\s|$)/.test(header));
  const wordIndex = headers.findIndex((header) => header === 'voce' || /^lemmi(?:\s|$)/.test(header));
  const expressionIndex = headers.findIndex((header) => /^es loc(?:\s|$)/.test(header));
  const italianIndex = headers.findIndex((header) => /^ita(?:liano)?(?:\s|$)/.test(header));
  const audioIndex = headers.findIndex((header) => header.includes('audio'));
  const noteIndex = headers.findIndex((header) => header.startsWith('note') || header.startsWith('non si sa mai'));
  const definitionIndex = headers.findIndex((header) => header.startsWith('definizione'));
  const examplesIndex = headers.findIndex((header) => header.startsWith('esempi'));
  const dialectIndex = headers.findIndex((header) => header === 'parola dialettale');
  const italianInternalIndex = headers.findIndex((header) => header === 'parola italiana');
  const internalFormat = dialectIndex >= 0 && italianInternalIndex >= 0;
  const primaryWordIndex = internalFormat ? dialectIndex : wordIndex >= 0 ? wordIndex : 0;
  const meaningIndex = internalFormat ? italianInternalIndex : italianIndex >= 0 ? italianIndex : categoryIndex + 1;

  return rows.slice(headerIndex + 1).flatMap((row, index) => {
    const getCell = (cellIndex) => cellIndex >= 0 ? String(row[cellIndex] ?? '').normalize('NFC').trim() : '';
    const rawCategory = getCell(categoryIndex);
    if (rawCategory.length > 24 || /[,;()]/.test(rawCategory)) {
      diagnostics.invalidCategoryRows.push({ source, row: index + headerIndex + 2, category: rawCategory });
      return [];
    }
    const category = parseCategory(rawCategory);
    const primaryWord = getCell(primaryWordIndex);
    const expression = getCell(expressionIndex);
    const audioRef = getCell(audioIndex);
    const dialectWord = category.category === 'locuzione' && expression
      ? expression
      : primaryWord || expression || audioRef;
    const italianWord = getCell(meaningIndex);

    if (!rawCategory) return [];
    if (!dialectWord || !italianWord) {
      diagnostics.incompleteRows.push({
        source,
        row: index + headerIndex + 2,
        dialectWord: dialectWord || null,
        sourceCategory: rawCategory,
      });
      return [];
    }

    const noteParts = [getCell(noteIndex)];
    if (primaryWord && expression && primaryWord !== expression && category.category === 'locuzione') {
      noteParts.push(`Lemma di riferimento: ${primaryWord}`);
    }

    return [{
      dialect_word: dialectWord,
      italian_word: italianWord,
      category: category.category,
      gender: category.gender,
      number: category.number,
      source_category: category.sourceCategory,
      definition: getCell(definitionIndex) || null,
      examples: [],
      notes: noteParts.filter(Boolean).join('\n') || null,
      audio_ref: audioRef || null,
      source,
      source_row: index + headerIndex + 2,
      priority,
    }];
  });
}

export function sourcePriority(filePath, sheetName = '') {
  const identity = `${filePath} ${sheetName}`.toLocaleLowerCase('it');
  if (/\bmod(?:ificato)?\b/.test(identity)) return 40;
  if (filePath.includes(`${join('data', '')}`) || basename(filePath).includes('cleaned')) return 30;
  if (filePath.endsWith('.txt')) return 5;
  return 10;
}

function parseSourceFile(filePath, diagnostics) {
  const buffer = readFileSync(filePath);
  const filePriority = sourcePriority(filePath);

  if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    return workbook.SheetNames.flatMap((sheetName) => {
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
        defval: '',
        raw: false,
      });
      return parseRows(rows, {
        source: `${basename(filePath)}:${sheetName}`,
        priority: sourcePriority(filePath, sheetName),
        diagnostics,
      });
    });
  }

  const text = decodeText(buffer);
  const rows = parseCsv(text, extname(filePath).toLocaleLowerCase('it') === '.txt');
  return parseRows(rows, { source: basename(filePath), priority: filePriority, diagnostics });
}

function appendUnique(existing, incoming) {
  const values = [...new Set([...(existing ? existing.split('\n') : []), incoming].filter(Boolean))];
  return values.join('\n') || null;
}

export function mergeEntries(records) {
  const merged = new Map();

  for (const record of records) {
    const key = `${normalizeWord(record.dialect_word)}\u0000${record.category}`;
    const current = merged.get(key);

    if (!current) {
      merged.set(key, {
        ...record,
        dialect_word: record.dialect_word.normalize('NFC').trim().replace(/\s+/g, ' '),
        italian_word: record.italian_word.normalize('NFC').trim(),
        _fieldPriorities: Object.fromEntries(
          ['italian_word', 'gender', 'number', 'source_category', 'definition', 'audio_ref']
            .map((field) => [field, record[field] ? record.priority : -1])
        ),
        _italianVariants: [record.italian_word],
      });
      continue;
    }

    current.notes = appendUnique(current.notes, record.notes);
    current.examples = [...new Set([...current.examples, ...record.examples])];

    for (const field of ['italian_word', 'gender', 'number', 'source_category', 'definition', 'audio_ref']) {
      if (!record[field]) continue;

      const previousPriority = current._fieldPriorities[field];
      const isModifiedSource = record.priority >= 40;
      const previousIsModified = previousPriority >= 40;
      const textField = field === 'italian_word' || field === 'definition';

      if (record.priority === previousPriority && textField) {
        if (field === 'italian_word') {
          current._italianVariants.push(record.italian_word);
          current.italian_word = [...new Set(current._italianVariants)].join('; ');
        } else {
          current.definition = appendUnique(current.definition, record.definition);
        }
      } else if (
        (isModifiedSource && !previousIsModified) ||
        (!previousIsModified && !isModifiedSource && textField &&
          record[field].length > String(current[field] ?? '').length) ||
        (!textField && record.priority > previousPriority) ||
        (textField && record[field].length === String(current[field] ?? '').length &&
          record.priority > previousPriority && !previousIsModified)
      ) {
        current[field] = record[field];
        current._fieldPriorities[field] = record.priority;
        if (field === 'italian_word') current._italianVariants = [record.italian_word];
      }
    }

    if (record.priority > current.priority) {
      current.dialect_word = record.dialect_word.normalize('NFC').trim().replace(/\s+/g, ' ');
      current.priority = record.priority;
      current.source = record.source;
      current.source_row = record.source_row;
    }
  }

  return [...merged.values()].map(({ _fieldPriorities, _italianVariants, ...entry }) => entry);
}

function accentless(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').normalize('NFC');
}

export function matchAudioFiles(entries, audioFiles) {
  const exactTargets = new Map();
  const looseTargets = new Map();
  const addTarget = (map, value, key) => {
    if (!value) return;
    const normalized = normalizeAudioKey(value);
    if (!map.has(normalized)) map.set(normalized, new Set());
    map.get(normalized).add(key);
  };

  for (const entry of entries) {
    const key = `${normalizeWord(entry.dialect_word)}\u0000${entry.category}`;
    addTarget(exactTargets, entry.audio_ref, key);
    addTarget(exactTargets, entry.dialect_word, key);
    addTarget(looseTargets, accentless(entry.audio_ref ?? ''), key);
    addTarget(looseTargets, accentless(entry.dialect_word), key);
  }

  return audioFiles.map((file) => {
    const stem = basename(file, extname(file)).normalize('NFC');
    const exact = exactTargets.get(normalizeAudioKey(stem));
    const loose = looseTargets.get(normalizeAudioKey(accentless(stem)));
    const targets = exact ?? (loose?.size === 1 ? loose : undefined);
    return { file, targets: [...(targets ?? [])], ambiguous: !exact && Boolean(loose && loose.size > 1) };
  });
}

function collectFiles(root) {
  const files = [];
  const addDirectoryFiles = (directory, predicate) => {
    const absoluteDirectory = join(root, directory);
    if (!statSync(absoluteDirectory, { throwIfNoEntry: false })?.isDirectory()) return;
    for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
      if (entry.isFile() && predicate(entry.name)) files.push(join(absoluteDirectory, entry.name));
    }
  };

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.toLocaleLowerCase('it').endsWith('.csv')) {
      files.push(join(root, entry.name));
    }
  }
  addDirectoryFiles('data', (name) => name.toLocaleLowerCase('it').endsWith('.csv'));
  const driveDirectory = readdirSync(root, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith('drive-download-'));
  if (driveDirectory) {
    addDirectoryFiles(driveDirectory.name, (name) => /\.(csv|txt)$/i.test(name));
  }

  const audioDirectory = readdirSync(root, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith('A. '));
  const audioFiles = audioDirectory
    ? readdirSync(join(root, audioDirectory.name), { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.wav$/i.test(entry.name))
      .map((entry) => join(root, audioDirectory.name, entry.name))
    : [];

  return { sourceFiles: [...new Set(files)].sort(), audioFiles: audioFiles.sort(), audioDirectoryName: audioDirectory?.name };
}

export function loadImportDataset(root = process.cwd()) {
  const { sourceFiles, audioFiles, audioDirectoryName } = collectFiles(root);
  const diagnostics = { invalidCategoryRows: [], incompleteRows: [] };
  const records = sourceFiles.flatMap((file) => parseSourceFile(file, diagnostics));
  const entries = mergeEntries(records);
  const audioMatches = matchAudioFiles(entries, audioFiles);
  const categories = Object.fromEntries(
    [...entries.reduce((counts, entry) => counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1), new Map())]
      .sort(([left], [right]) => left.localeCompare(right))
  );
  const unmatchedCategories = [...new Set(
    records
      .filter((record) => record.category === 'altro')
      .map((record) => record.source_category)
      .filter(Boolean)
  )].sort();

  return {
    entries,
    audioFiles,
    audioMatches,
    report: {
      sourceFileCount: sourceFiles.length,
      rawRecordCount: records.length,
      mergedEntryCount: entries.length,
      categories,
      audioFileCount: audioFiles.length,
      audioMatchedCount: audioMatches.filter((match) => match.targets.length > 0).length,
      audioUnmatched: audioMatches.filter((match) => !match.targets.length).map((match) => basename(match.file)),
      audioAmbiguous: audioMatches.filter((match) => match.ambiguous).map((match) => basename(match.file)),
      unsupportedSourceCategories: unmatchedCategories,
      invalidCategoryRowCount: diagnostics.invalidCategoryRows.length,
      invalidCategorySamples: diagnostics.invalidCategoryRows.slice(0, 5),
      incompleteRowCount: diagnostics.incompleteRows.length,
      incompleteRowSamples: diagnostics.incompleteRows.slice(0, 5),
      audioDirectoryName,
    },
  };
}

function objectPathForAudio(filePath) {
  const stem = basename(filePath, extname(filePath)).normalize('NFC');
  const slug = stem.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('it').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'audio';
  const hash = createHash('sha256').update(stem).digest('hex').slice(0, 8);
  return `dictionary/${slug}-${hash}.wav`;
}

async function mapInBatches(items, callback) {
  const results = [];
  for (let index = 0; index < items.length; index += CONCURRENCY) {
    results.push(...await Promise.all(items.slice(index, index + CONCURRENCY).map(callback)));
  }
  return results;
}

async function uploadAudio(client, audioFiles) {
  const publicUrls = new Map();
  await mapInBatches(audioFiles, async (file) => {
    const objectPath = objectPathForAudio(file);
    const { error } = await client.storage.from('audio').upload(objectPath, readFileSync(file), {
      contentType: 'audio/wav',
      upsert: true,
    });
    if (error) throw new Error(`Upload audio fallito (${basename(file)}): ${error.message}`);
    const { data } = client.storage.from('audio').getPublicUrl(objectPath);
    publicUrls.set(file, data.publicUrl);
  });
  return publicUrls;
}

async function readExistingEntries(client) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await client
      .from('dictionary_entries')
      .select('id,dialect_word,category,italian_word,definition,examples,notes,audio_url,gender,number,source_category')
      .order('id')
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(`Lettura del dizionario fallita: ${error.message}`);
    rows.push(...(data ?? []));
    if ((data ?? []).length < PAGE_SIZE) return rows;
  }
}

function mergeWithExisting(entry, current, audioUrl) {
  const payload = {};
  for (const field of ['italian_word', 'category', 'gender', 'number', 'source_category', 'definition', 'audio_ref']) {
    const column = field === 'audio_ref' ? 'audio_url' : field;
    const value = field === 'audio_ref' ? audioUrl : entry[field];
    if (value && value !== current[column]) payload[column] = value;
  }
  const notes = appendUnique(current.notes, entry.notes);
  if (notes !== current.notes) payload.notes = notes;
  if (entry.examples.length && JSON.stringify(entry.examples) !== JSON.stringify(current.examples ?? [])) {
    payload.examples = entry.examples;
  }
  return payload;
}

async function writeEntries(client, entries, audioUrls) {
  const existingRows = await readExistingEntries(client);
  const existingByKey = new Map();
  const existingCounts = new Map();
  for (const row of existingRows) {
    const key = `${normalizeWord(row.dialect_word)}\u0000${row.category}`;
    existingCounts.set(key, (existingCounts.get(key) ?? 0) + 1);
    if (!existingByKey.has(key)) existingByKey.set(key, row);
  }
  const duplicateExistingRows = [...existingCounts.values()]
    .reduce((total, count) => total + Math.max(count - 1, 0), 0);

  const inserts = [];
  const updates = [];
  let unchanged = 0;

  for (const entry of entries) {
    const key = `${normalizeWord(entry.dialect_word)}\u0000${entry.category}`;
    const audioUrl = audioUrls.get(key);
    const current = existingByKey.get(key);
    if (!current) {
      const { audio_ref, source, source_row, priority, ...payload } = entry;
      inserts.push({ ...payload, audio_url: audioUrl ?? null });
      continue;
    }

    const payload = mergeWithExisting(entry, current, audioUrl);
    if (Object.keys(payload).length) updates.push({ id: current.id, key: entry.dialect_word, payload });
    else unchanged += 1;
  }

  for (let index = 0; index < inserts.length; index += BATCH_SIZE) {
    const { error } = await client.from('dictionary_entries').insert(inserts.slice(index, index + BATCH_SIZE));
    if (error) throw new Error(`Inserimento batch ${Math.floor(index / BATCH_SIZE) + 1} fallito: ${error.message}`);
  }

  await mapInBatches(updates, async ({ id, key, payload }) => {
    const { error } = await client.from('dictionary_entries').update(payload).eq('id', id);
    if (error) throw new Error(`Aggiornamento di "${key}" fallito: ${error.message}`);
  });

  return { inserted: inserts.length, updated: updates.length, unchanged, duplicateExistingRows };
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has('--apply');
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const dataset = loadImportDataset(root);

  console.log(JSON.stringify(dataset.report, null, 2));
  if (!apply) {
    console.log('Anteprima: nessun dato o file è stato caricato. Usa --apply dopo aver applicato le migrazioni.');
    return;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Per --apply imposta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nell’ambiente locale.');
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: schemaError } = await client
    .from('dictionary_entries')
    .select('id,gender,number,source_category')
    .limit(1);
  if (schemaError) {
    throw new Error(`Verifica dello schema fallita: applica le migrazioni prima dell'importazione (${schemaError.message})`);
  }

  const urls = await uploadAudio(client, dataset.audioFiles);
  const audioUrlByEntry = new Map();

  for (const match of dataset.audioMatches) {
    const publicUrl = urls.get(match.file);
    if (!publicUrl) continue;
    for (const key of match.targets) {
      if (!audioUrlByEntry.has(key)) audioUrlByEntry.set(key, publicUrl);
    }
  }

  const result = await writeEntries(client, dataset.entries, audioUrlByEntry);
  console.log(JSON.stringify({ ...result, uploadedAudioFiles: urls.size }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Importazione non completata: ${error.message}`);
    process.exitCode = 1;
  });
}
