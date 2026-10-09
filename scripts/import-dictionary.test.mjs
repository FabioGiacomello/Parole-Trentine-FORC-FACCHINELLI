import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  loadImportDataset,
  matchAudioFiles,
  mergeEntries,
  parseCategory,
  sourcePriority,
} from './import-dictionary.mjs';

describe('importazione del dizionario', () => {
  it('conserva il genere e il numero grammaticale delle sigle dei sostantivi', () => {
    assert.deepEqual(parseCategory('sm'), {
      category: 'sostantivo',
      gender: 'maschile',
      number: null,
      sourceCategory: 'sm',
    });
    assert.deepEqual(parseCategory('sfpl'), {
      category: 'sostantivo',
      gender: 'femminile',
      number: 'plurale',
      sourceCategory: 'sfpl',
    });
  });

  it('assegna priorità alle versioni modificate del foglio e dei file esportati', () => {
    assert.equal(sourcePriority('TRENTIN_BASE_02 da Web.xlsx', 'EE mod'), 40);
    assert.equal(sourcePriority('EE modificato.txt'), 40);
    assert.equal(sourcePriority('EE normale.txt'), 5);
  });

  it('accorpa per lemma e categoria e privilegia una fonte modificata', () => {
    const entries = mergeEntries([
      {
        dialect_word: 'cafè',
        italian_word: 'caffè',
        category: 'sostantivo',
        gender: 'maschile',
        number: null,
        source_category: 'sm',
        definition: null,
        examples: [],
        notes: null,
        audio_ref: null,
        source: 'master.xlsx',
        source_row: 2,
        priority: 10,
      },
      {
        dialect_word: 'cafe\u0300',
        italian_word: 'caffè espresso',
        category: 'sostantivo',
        gender: 'maschile',
        number: null,
        source_category: 'sm',
        definition: 'Bevanda',
        examples: [],
        notes: 'Versione aggiornata',
        audio_ref: 'cafe',
        source: 'EE modificato.txt',
        source_row: 3,
        priority: 40,
      },
    ]);

    assert.equal(entries.length, 1);
    assert.equal(entries[0].dialect_word, 'cafe\u0300'.normalize('NFC'));
    assert.equal(entries[0].italian_word, 'caffè espresso');
    assert.equal(entries[0].definition, 'Bevanda');
    assert.equal(entries[0].notes, 'Versione aggiornata');
  });

  it('mantiene la definizione più completa quando nessuna fonte è una versione modificata', () => {
    const entries = mergeEntries([
      {
        dialect_word: 'bèn',
        italian_word: 'bene',
        category: 'avverbio',
        gender: null,
        number: null,
        source_category: 'avv',
        definition: null,
        examples: [],
        notes: null,
        audio_ref: null,
        source: 'master.xlsx',
        source_row: 2,
        priority: 10,
      },
      {
        dialect_word: 'bèn',
        italian_word: 'bene, in modo buono e corretto',
        category: 'avverbio',
        gender: null,
        number: null,
        source_category: 'avv',
        definition: null,
        examples: [],
        notes: null,
        audio_ref: null,
        source: 'normal.txt',
        source_row: 3,
        priority: 5,
      },
    ]);

    assert.equal(entries[0].italian_word, 'bene, in modo buono e corretto');
  });

  it('associa i nomi audio con underscore alla grafia con apostrofo', () => {
    const matches = matchAudioFiles([
      { dialect_word: "l'è a gratis", category: 'locuzione', audio_ref: null },
    ], ['/audio/l_è a gratis.wav']);

    assert.equal(matches[0].targets.length, 1);
  });

  it('legge i dataset forniti, conserva i caratteri speciali e collega gli audio disponibili', () => {
    const { entries, report } = loadImportDataset();
    const entriesByWord = new Map(entries.map((entry) => [entry.dialect_word.toLocaleLowerCase('it'), entry]));

    assert.ok(report.sourceFileCount >= 8);
    assert.ok(report.rawRecordCount > 10000);
    assert.ok(report.mergedEntryCount > 10000);
    assert.equal(report.audioFileCount, 49);
    assert.ok(report.invalidCategoryRowCount > 0);
    assert.ok(entriesByWord.has('babà'));
    assert.equal(entriesByWord.get('babà')?.gender, 'femminile');
    assert.ok(entriesByWord.has('abadàr'));
    assert.equal(entriesByWord.get('abadàr')?.category, 'verbo');
    assert.ok(entries.every((entry) => entry.dialect_word === entry.dialect_word.normalize('NFC')));
    assert.ok(entries.some((entry) => entry.dialect_word.startsWith('sorelòta (to –')));
    assert.equal(entries.find((entry) => entry.dialect_word === 'ṡlavàz')?.source_category, 'sm');
    assert.ok(entries.some((entry) => entry.dialect_word === 'spazéti de palù'));
    assert.ok(entries.some((entry) => entry.dialect_word === 'spés (de –)'));
  });
});
