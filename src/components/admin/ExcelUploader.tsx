import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { Gender, GrammarCategory, Number } from '@/types/dictionary';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2
} from 'lucide-react';

// Formato standard interno
interface ExcelRow {
  parola_dialettale: string;
  parola_italiana: string;
  categoria: string;
  definizione?: string;
  esempi?: string;
  note?: string;
  plurale?: string;
  femminile?: string;
}

// Formato sorgente AA/BB (Lessico Trentino)
interface SourceRow {
  Num?: number | string;
  Tipo?: string;
  Voce?: string;
  Cat?: string;
  Italiano?: string;
  Et_Audio?: string;
}

const CATEGORY_MAP: Record<string, GrammarCategory> = {
  sostantivo: 'sostantivo', sost: 'sostantivo', nome: 'sostantivo', s: 'sostantivo',
  sm: 'sostantivo', ṡm: 'sostantivo', sf: 'sostantivo', np: 'sostantivo', sb: 'sostantivo',
  smpl: 'sostantivo', sfpl: 'sostantivo', sn: 'sostantivo', 'sm e agg': 'sostantivo',
  'sm/agg': 'sostantivo', 'sm e sf': 'sostantivo',
  verbo: 'verbo', v: 'verbo', vb: 'verbo', sv: 'verbo', vd: 'verbo', vo: 'verbo',
  aggettivo: 'aggettivo', agg: 'aggettivo', am: 'aggettivo', 'agg e pron': 'aggettivo',
  'agg/pron': 'aggettivo',
  avverbio: 'avverbio', avv: 'avverbio',
  preposizione: 'preposizione', prep: 'preposizione', pre: 'preposizione',
  congiunzione: 'congiunzione', cong: 'congiunzione',
  esclamazione: 'esclamazione', escl: 'esclamazione', es: 'esclamazione',
  pronome: 'pronome', pron: 'pronome',
  locuzione: 'locuzione', loc: 'locuzione', los: 'locuzione',
  art: 'articolo', articolo: 'articolo', num: 'numerale', numerale: 'numerale',
  inter: 'interiezione', int: 'interiezione',
  acc: 'altro', dim: 'altro', fig: 'altro',
};

export function ExcelUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: number; total: number } | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const { toast } = useToast();

  const parseCategory = (cat: string | undefined) => {
    const sourceCategory = cat?.normalize('NFC').trim() || null;
    const normalized = sourceCategory?.toLocaleLowerCase('it').replace(/\./g, '').replace(/\s+/g, ' ') || '';
    const gender: Gender | null = ['sm', 'ṡm', 'smpl', 'sm e agg', 'sm/agg'].includes(normalized)
      ? 'maschile'
      : ['sf', 'sfpl'].includes(normalized)
        ? 'femminile'
        : normalized === 'sn' ? 'neutro' : null;
    const number: Number | null = ['smpl', 'sfpl'].includes(normalized) ? 'plurale' : null;

    return {
      category: sourceCategory ? CATEGORY_MAP[normalized] ?? 'altro' : 'sostantivo',
      gender,
      number,
      sourceCategory,
    };
  };

  const parseExamples = (examples: string | undefined): string[] => {
    if (!examples) return [];
    // Divide per newline, punto e virgola o pipe
    return examples.split(/[\n;|]/).map(e => e.trim()).filter(Boolean);
  };

  // Normalizza una riga indipendentemente dal formato sorgente
  const normalizeRow = (row: ExcelRow | SourceRow): ExcelRow | null => {
    const raw = row as Record<string, unknown>;
    const keys = Object.keys(raw);

    // Formato semplice 2 colonne: dialetto, italiano
    if (keys.length === 2) {
      return {
        parola_dialettale: String(raw[keys[0]] ?? '').trim(),
        parola_italiana: String(raw[keys[1]] ?? '').trim(),
        categoria: 'sostantivo',
      };
    }

    // Formato sorgente AA/BB (colonne: Voce, Cat, Italiano)
    if ('Voce' in row && row.Voce) {
      return {
        parola_dialettale: String(row.Voce).trim(),
        parola_italiana: String(row.Italiano || '').trim(),
        categoria: String(row.Cat || '').trim(),
      };
    }
    // Formato standard interno
    const std = row as ExcelRow;
    if (std.parola_dialettale) return std;
    return null;
  };

  const isAaBbFormat = (keys: string[]): boolean => {
    const normalized = keys.map((k) => k.replace(/^\uFEFF/, '').trim().toLowerCase());
    return normalized.includes('voce') && normalized.includes('cat') && normalized.includes('italiano');
  };

  const isInternalFormat = (keys: string[]): boolean => {
    const normalized = keys.map((k) => k.replace(/^\uFEFF/, '').trim().toLowerCase());
    return normalized.includes('parola_dialettale') && normalized.includes('parola_italiana');
  };

  const processExcelFile = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setResults(null);
    setErrorDetails([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<ExcelRow | SourceRow>(worksheet);
      const cleanedData = jsonData.map(row => {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
          cleaned[key.replace(/^\uFEFF/, '')] = value;
        }
        return cleaned as ExcelRow | SourceRow;
      });

      const total = cleanedData.length;
      const firstRowKeys = Object.keys((cleanedData[0] ?? {}) as Record<string, unknown>);
      if (!total || (!isAaBbFormat(firstRowKeys) && !isInternalFormat(firstRowKeys) && firstRowKeys.length !== 2)) {
        toast({
          variant: 'destructive',
          title: 'Formato CSV non supportato',
          description: 'Usa il formato AA/BB con colonne Num, Tipo, Voce, Cat, Italiano, Et_Audio oppure il formato interno parola_dialettale/parola_italiana.'
        });
        return;
      }

      let success = 0;
      let errors = 0;
      const skippedRows: string[] = [];

      // Elabora in gruppi da 50 voci per non sovraccaricare il database
      const batchSize = 50;
      for (let i = 0; i < cleanedData.length; i += batchSize) {
        const batch = cleanedData.slice(i, i + batchSize);

        const entries = batch
          .map((row, index) => {
            const normalized = normalizeRow(row);
            if (!normalized || !normalized.parola_dialettale?.trim() || !normalized.parola_italiana?.trim()) {
              skippedRows.push(`Riga ${i + index + 2}: dati mancanti o formato non valido`);
              return null;
            }
            return normalized;
          })
          .filter((r): r is ExcelRow => r !== null)
          .map(row => {
            const grammar = parseCategory(row.categoria);
            return {
              dialect_word: row.parola_dialettale.trim().normalize('NFC'),
              italian_word: row.parola_italiana.trim().normalize('NFC'),
              category: grammar.category,
              gender: grammar.gender,
              number: grammar.number,
              source_category: grammar.sourceCategory,
              definition: row.definizione?.trim() || null,
              examples: parseExamples(row.esempi),
              notes: row.note?.trim() || null,
              plural: row.plurale?.trim() || null,
              feminine: row.femminile?.trim() || null,
            };
          });

        const { error } = await supabase
          .from('dictionary_entries')
          .insert(entries);

        if (error) {
          console.error('Errore nel batch di importazione:', error);
          errors += entries.length;
          if (error.message.includes('no unique or exclusion constraint matching the ON CONFLICT specification')) {
            skippedRows.push('Configurazione DB: manca un vincolo UNIQUE su dialect_word. Import eseguito in modalita inserimento puro.');
          } else {
            skippedRows.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
          }
        } else {
          success += entries.length;
        }

        setProgress(Math.round(((i + batch.length) / total) * 100));
      }

      setErrorDetails(skippedRows);
      setResults({ success, errors: Math.max(total - success, 0), total });

      if (errors === 0) {
        toast({ title: 'Importazione completata', description: `${success} vocaboli importati con successo.` });
      } else {
        toast({ variant: 'destructive', title: 'Importazione parziale', description: `${success} importati, ${errors} errori.` });
      }
    } catch (error) {
      console.error('Errore nella lettura del file:', error);
      toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile leggere il file.' });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) processExcelFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    disabled: uploading,
  });

  const downloadTemplate = () => {
    // Template nel formato sorgente AA/BB usato dal Lessico Trentino
    const template = [
      { Num: 1, Tipo: 'lemma', Voce: 'cagnina', Cat: 'sf', Italiano: 'cagnolina', Et_Audio: 'cagnina' },
      { Num: 2, Tipo: 'lemma', Voce: 'córer', Cat: 'vb', Italiano: 'correre', Et_Audio: 'corer' },
      { Num: 3, Tipo: 'locuzione', Voce: 'bon dì', Cat: 'escl', Italiano: 'buongiorno', Et_Audio: 'bon di' },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dizionario');
    XLSX.writeFile(wb, 'template_lessico_trentino.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6 rounded-xl border border-border">
        <h2 className="font-display text-xl font-semibold mb-4">Importa da Excel o CSV</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Sono supportati due formati: il formato sorgente del Lessico Trentino (colonne{' '}
          <code className="bg-muted px-1 rounded">Voce</code>,{' '}
          <code className="bg-muted px-1 rounded">Cat</code>,{' '}
          <code className="bg-muted px-1 rounded">Italiano</code>) e il formato standard interno.
          Il formato viene rilevato automaticamente.
        </p>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
            )}

            {isDragActive ? (
              <p className="text-primary font-medium">Rilascia il file qui...</p>
            ) : uploading ? (
              <div className="w-full max-w-xs space-y-2">
                <p className="text-sm text-muted-foreground">Importazione in corso...</p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-foreground font-medium mb-1">Trascina il file qui</p>
                  <p className="text-sm text-muted-foreground">
                    oppure clicca per selezionare (.xlsx, .xls, .csv)
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Seleziona file
                </Button>
              </>
            )}
          </div>
        </div>

        {results && (
          <div className={`mt-4 p-4 rounded-lg ${results.errors > 0 ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
            <div className="flex items-center gap-2">
              {results.errors > 0 ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium">
                Risultato: {results.success}/{results.total} vocaboli importati
              </span>
            </div>
            {results.errors > 0 && (
              <>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.errors} righe non importate (dati mancanti o errori di inserimento).
                </p>
                {errorDetails.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">Dettagli errori</summary>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {errorDetails.slice(0, 15).map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="card-elevated p-6 rounded-xl border border-border">
        <h3 className="font-display text-lg font-semibold mb-3">Template Excel</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Scarica il template nel formato usato dal Lessico Trentino (Voce / Cat / Italiano).
        </p>
        <Button variant="outline" onClick={downloadTemplate} className="gap-2">
          <Download className="h-4 w-4" />
          Scarica Template
        </Button>
      </div>

      <div className="card-elevated p-6 rounded-xl border border-border">
        <h3 className="font-display text-lg font-semibold mb-3">Colonne supportate</h3>
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="font-medium mb-2 text-muted-foreground uppercase text-xs tracking-wide">
              Formato sorgente (AA/BB)
            </p>
            <div className="space-y-1.5">
              {[
                ['Voce', 'Obbligatorio — parola dialettale'],
                ['Italiano', 'Obbligatorio — traduzione'],
                ['Cat', 'Obbligatorio — categoria abbreviata (sm, vb, agg…)'],
                ['Tipo', 'Opzionale — lemma / locuzione'],
                ['Et_Audio', 'Opzionale — riferimento audio'],
              ].map(([col, desc]) => (
                <div key={col} className="flex gap-2 items-start">
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs shrink-0">{col}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium mb-2 text-muted-foreground uppercase text-xs tracking-wide">
              Formato standard interno
            </p>
            <div className="space-y-1.5">
              {[
                ['parola_dialettale', 'Obbligatorio'],
                ['parola_italiana', 'Obbligatorio'],
                ['categoria', 'Obbligatorio (nome esteso)'],
                ['definizione', 'Opzionale'],
                ['esempi', 'Opzionale (separati da | o ;)'],
                ['note / plurale / femminile', 'Opzionale'],
              ].map(([col, desc]) => (
                <div key={col} className="flex gap-2 items-start">
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs shrink-0">{col}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
