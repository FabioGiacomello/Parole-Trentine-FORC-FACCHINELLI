# Piano di Miglioramento — Parole Trentine

> **Per agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correggere tutti i bug visivi/funzionali, pulire il codice, migliorare UX e animazioni, rendere le parole più cercate globali.

**Architecture:** React 18 + Vite + Supabase + shadcn/ui + Tailwind CSS. I dati risiedono su Supabase (dictionary_entries, suggestions, user_roles). Le statistiche di ricerca sono attualmente in localStorage e devono migrare a Supabase.

**Tech Stack:** React, TypeScript, Supabase, Tailwind CSS, shadcn/ui, xlsx, react-dropzone, lucide-react

---

## Audit Completo — Bug e Problemi Trovati

### BUG FUNZIONALI

| # | Severità | File | Problema |
|---|----------|------|----------|
| B1 | **CRITICO** | `src/components/search/SearchResults.tsx:23` | Link rotto: `<a href="/contatti">` — la rotta `/contatti` NON ESISTE. Deve essere `/suggerisci` |
| B2 | **ALTO** | `src/hooks/useDictionary.ts:46` | Filtro per lettera usa `.includes()` — cercando "a" restituisce "balot", "abadàr", "tananài", ecc. Deve usare `.startsWith()` per il filtro per lettera |
| B3 | **ALTO** | `src/hooks/useWordViews.ts` | "Parole più cercate" basate su `localStorage` — ogni dispositivo ha le sue statistiche. Non sono globali |
| B4 | **ALTO** | `src/hooks/useSearchHistory.ts` | Anche `searchStats` in localStorage, non globale |
| B5 | **MEDIO** | `src/pages/Auth.tsx:126-133` | Nessun toggle visibilità password — campo `type="password"` senza icona occhio |
| B6 | **MEDIO** | `src/pages/Index.tsx:118-122` | Quando si cerca a vuoto (stringa vuota dopo aver cancellato), `hasSearched` è `true` ma `SearchResults` restituisce `null` perché `!query` → lo schermo resta completamente vuoto sotto la barra di ricerca |
| B7 | **BASSO** | `src/pages/Cronologia.tsx:72` | Link `/?q=${query}` non viene gestito da Index.tsx — il parametro `q` non viene letto dall'URL |
| B8 | **MEDIO** | `src/pages/Suggerisci.tsx` (form suggerimenti) | Nel form di suggerimento sono presenti campi non richiesti (`Pronuncia`, `Trascrizione fonetica`, `Audio`) — da rimuovere |

### BUG VISIVI

| # | Severità | File | Problema |
|---|----------|------|----------|
| V1 | **MEDIO** | `src/components/dictionary/WordDetail.tsx:36` | Il pannello dettaglio parola usa `animate-slide-up` (scorre dal basso) invece di scorrere dal lato destro — dovrebbe entrare con slide-in da destra |
| V2 | **MEDIO** | `src/index.css` + globale | Animazioni troppo semplici: solo `fadeIn`, `slideUp`, `float`. Mancano transizioni moderne per: apertura card, apparizione risultati, transizioni di pagina |
| V3 | **BASSO** | `src/App.css` | File CSS di default di Vite (logo, card, read-the-docs) — completamente inutilizzato e non importato da nessun file |
| V4 | **BASSO** | `src/components/dictionary/WordDetail.tsx:103-112` | Sezione immagine mostra placeholder generico senza mostrare l'immagine reale anche se `imageUrl` è presente |

### FILE INUTILIZZATI / RIDONDANTI

| # | File | Motivo |
|---|------|--------|
| F1 | `src/App.css` | Mai importato, contiene CSS di default Vite — ELIMINARE |
| F2 | `src/components/NavLink.tsx` | Componente mai importato/usato da nessun file — ELIMINARE |
| F3 | `src/data/sampleDictionary.ts` | Mai importato — i dati vengono da Supabase — ELIMINARE |
| F4 | `simulate_evolution.sh` | Script di simulazione nella root, non parte del progetto — ELIMINARE |
| F5 | `simulate_project_history.sh` | Script di simulazione nella root, non parte del progetto — ELIMINARE |
| F6 | `AA_01032026_cleaned.csv` | CSV sorgente nella root — dovrebbe stare in `data/` o essere rimosso se già importato |
| F7 | `BB_01032026_cleaned.csv` | CSV sorgente nella root — stesso discorso |

### COMPONENTI UI SHADCN NON UTILIZZATI (36 su 48)

Componenti in `src/components/ui/` mai importati fuori dalla directory ui/:

```
accordion.tsx    alert-dialog.tsx   alert.tsx          aspect-ratio.tsx
avatar.tsx       breadcrumb.tsx     calendar.tsx       card.tsx
carousel.tsx     chart.tsx          checkbox.tsx       collapsible.tsx
command.tsx      context-menu.tsx   dialog.tsx         drawer.tsx
dropdown-menu.tsx form.tsx          hover-card.tsx     input-otp.tsx
menubar.tsx      navigation-menu.tsx pagination.tsx    radio-group.tsx
resizable.tsx    scroll-area.tsx    separator.tsx      sheet.tsx
sidebar.tsx      skeleton.tsx       slider.tsx         switch.tsx
table.tsx        toggle.tsx         toggle-group.tsx
```

**Componenti effettivamente usati (12):**
`button`, `input`, `badge`, `textarea`, `label`, `select`, `tabs`, `progress`, `popover`, `tooltip`, `toaster`, `sonner`, `toast`

### DIPENDENZE NPM POTENZIALMENTE INUTILI

Pacchetti installati per componenti UI non usati:
- `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-hover-card`
- `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`, `@radix-ui/react-slider`
- `@radix-ui/react-switch`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`
- `cmdk` (per command.tsx), `embla-carousel-react` (per carousel.tsx)
- `input-otp` (per input-otp.tsx), `react-day-picker` (per calendar.tsx)
- `react-resizable-panels` (per resizable.tsx), `recharts` (per chart.tsx)
- `vaul` (per drawer.tsx), `next-themes` (non c'è theme switcher)

---

## PIANO DI IMPLEMENTAZIONE

---

### Task 1: Fix link rotto `/contatti` → `/suggerisci`

**Files:**
- Modify: `src/components/search/SearchResults.tsx:23`

- [ ] **Step 1: Correggere il link**

In `SearchResults.tsx` riga 23, cambiare:
```tsx
// DA:
<a href="/contatti" className="text-primary hover:underline">
  suggerisci una nuova parola
</a>

// A:
<Link to="/suggerisci" className="text-primary hover:underline">
  suggerisci una nuova parola
</Link>
```

Aggiungere l'import di `Link` da `react-router-dom` in cima al file.

- [ ] **Step 2: Verificare**

Avviare il dev server, cercare una parola inesistente, cliccare il link e verificare che porti a `/suggerisci`.

- [ ] **Step 3: Commit**

```bash
git add src/components/search/SearchResults.tsx
git commit -m "fix: correggi link rotto /contatti → /suggerisci in SearchResults"
```

---

### Task 2: Filtro per lettera con `startsWith` invece di `includes`

**Files:**
- Modify: `src/hooks/useDictionary.ts:39-60`
- Modify: `src/components/search/SearchBar.tsx:192-208`

- [ ] **Step 1: Aggiungere parametro `isLetterFilter` alla funzione search**

In `useDictionary.ts`, modificare la firma della funzione `search` per accettare un flag che indica se la ricerca è per lettera iniziale:

```typescript
const search = (query: string, filters: SearchFilters, isLetterFilter = false): DictionaryEntry[] => {
  if (!query.trim()) return [];
  const normalizedQuery = query.toLowerCase().trim();

  return entries.filter(entry => {
    if (filters.category && entry.category !== filters.category) return false;

    const matchFn = isLetterFilter
      ? (text: string) => text.toLowerCase().startsWith(normalizedQuery)
      : (text: string) => text.toLowerCase().includes(normalizedQuery);

    const matchesDialect = matchFn(entry.dialectWord);
    const matchesItalian = matchFn(entry.italianWord);
    const matchesExamples = isLetterFilter ? false : entry.examples?.some(ex => ex.toLowerCase().includes(normalizedQuery));
    const matchesDefinition = isLetterFilter ? false : entry.definition?.toLowerCase().includes(normalizedQuery);

    switch (filters.searchDirection) {
      case 'dialect-to-italian':
        return matchesDialect || matchesExamples;
      case 'italian-to-dialect':
        return matchesItalian || matchesDefinition;
      default:
        return matchesDialect || matchesItalian || matchesExamples || matchesDefinition;
    }
  });
};
```

- [ ] **Step 2: Aggiornare SearchBar per passare il flag**

In `SearchBar.tsx`, modificare l'interfaccia `SearchBarProps`:

```typescript
interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters, isLetterFilter?: boolean) => void;
  categories: GrammarCategory[];
  isLarge?: boolean;
}
```

Nella `onValueChange` del Select delle lettere (riga 194), passare `true`:

```tsx
onValueChange={(letter) => {
  setSelectedLetter(letter);
  setQuery(letter);
  onSearch(letter, filters, true);
}}
```

- [ ] **Step 3: Aggiornare Index.tsx per ricevere il flag**

In `Index.tsx`, aggiornare `handleSearch`:

```typescript
const handleSearch = (query: string, filters: SearchFilters, isLetterFilter = false) => {
  const searchResults = search(query, filters, isLetterFilter);
  setResults(searchResults);
  setCurrentQuery(query);
  setHasSearched(true);
  if (query.trim()) {
    addToHistory(query, searchResults.length);
  }
};
```

- [ ] **Step 4: Verificare**

Selezionare la lettera "A" dal dropdown → devono apparire solo parole che INIZIANO con "a", non quelle che contengono "a" nel mezzo.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDictionary.ts src/components/search/SearchBar.tsx src/pages/Index.tsx
git commit -m "fix: filtro per lettera usa startsWith, non includes"
```

---

### Task 3: Stato vuoto quando la ricerca non ha query

**Files:**
- Modify: `src/components/search/SearchResults.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Gestire ricerca vuota in Index.tsx**

In `Index.tsx`, modificare `handleSearch` — se la query è vuota, resettare lo stato di ricerca:

```typescript
const handleSearch = (query: string, filters: SearchFilters, isLetterFilter = false) => {
  if (!query.trim()) {
    setResults([]);
    setCurrentQuery('');
    setHasSearched(false);
    return;
  }
  const searchResults = search(query, filters, isLetterFilter);
  setResults(searchResults);
  setCurrentQuery(query);
  setHasSearched(true);
  if (query.trim()) {
    addToHistory(query, searchResults.length);
  }
};
```

- [ ] **Step 2: Migliorare stato "nessun risultato" in SearchResults.tsx**

Aggiungere icona e messaggio più chiaro quando non ci sono risultati:

```tsx
if (results.length === 0) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
      <p className="text-lg font-medium text-foreground mb-1">
        Nessun risultato per "{query}"
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Prova con un altro termine oppure
      </p>
      <Link to="/suggerisci" className="text-primary hover:underline text-sm">
        suggerisci questa parola al dizionario
      </Link>
    </div>
  );
}
```

Aggiungere import di `Search` da lucide-react e `Link` da react-router-dom.

- [ ] **Step 3: Verificare**

1. Cercare qualcosa → cancellare il campo → verificare che tornino le feature card
2. Cercare una parola inesistente → verificare che appaia il messaggio con icona

- [ ] **Step 4: Commit**

```bash
git add src/components/search/SearchResults.tsx src/pages/Index.tsx
git commit -m "fix: gestisci correttamente ricerca vuota e stato nessun risultato"
```

---

### Task 4: Toggle visibilità password nella pagina Auth

**Files:**
- Modify: `src/pages/Auth.tsx:120-135`

- [ ] **Step 1: Aggiungere stato e toggle**

Aggiungere stato `showPassword` e import icona `Eye`/`EyeOff` da lucide-react:

```tsx
import { Lock, Mail, Shield, Eye, EyeOff } from 'lucide-react';
// ...
const [showPassword, setShowPassword] = useState(false);
```

- [ ] **Step 2: Modificare il campo password**

Sostituire il blocco del campo password con:

```tsx
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      id="password"
      type={showPassword ? 'text' : 'password'}
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="pl-10 pr-10"
      disabled={loading}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
  {errors.password && (
    <p className="text-sm text-destructive">{errors.password}</p>
  )}
</div>
```

- [ ] **Step 3: Verificare**

Andare su `/auth`, digitare una password, cliccare l'icona occhio — la password deve diventare visibile/nascosta.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Auth.tsx
git commit -m "feat: aggiungi toggle visibilità password nella pagina login"
```

---

### Task 5: Parole più cercate globali (migrazione da localStorage a Supabase)

**Files:**
- Create: `supabase/migrations/04_word_views.sql`
- Modify: `src/hooks/useWordViews.ts`
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Creare la migrazione SQL**

Creare `supabase/migrations/04_word_views.sql`:

```sql
-- Tabella per tracciare le visualizzazioni globali delle parole
CREATE TABLE IF NOT EXISTS public.word_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dialect_word text NOT NULL,
  italian_word text NOT NULL,
  view_count bigint DEFAULT 1 NOT NULL,
  last_viewed_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(dialect_word)
);

-- Abilita RLS
ALTER TABLE public.word_views ENABLE ROW LEVEL SECURITY;

-- Tutti possono leggere le statistiche
CREATE POLICY "word_views_select" ON public.word_views
  FOR SELECT USING (true);

-- Tutti possono inserire/aggiornare le visualizzazioni (anonimi inclusi)
CREATE POLICY "word_views_insert" ON public.word_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "word_views_update" ON public.word_views
  FOR UPDATE USING (true);

-- Funzione upsert atomica per incrementare il contatore
CREATE OR REPLACE FUNCTION public.increment_word_view(
  p_dialect_word text,
  p_italian_word text
) RETURNS void AS $$
BEGIN
  INSERT INTO public.word_views (dialect_word, italian_word, view_count, last_viewed_at)
  VALUES (p_dialect_word, p_italian_word, 1, now())
  ON CONFLICT (dialect_word) DO UPDATE
  SET view_count = word_views.view_count + 1,
      last_viewed_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 2: Aggiornare i tipi Supabase**

In `src/integrations/supabase/types.ts`, aggiungere la tabella `word_views` dentro `Tables`:

```typescript
word_views: {
  Row: {
    id: string
    dialect_word: string
    italian_word: string
    view_count: number
    last_viewed_at: string
  }
  Insert: {
    id?: string
    dialect_word: string
    italian_word: string
    view_count?: number
    last_viewed_at?: string
  }
  Update: {
    id?: string
    dialect_word?: string
    italian_word?: string
    view_count?: number
    last_viewed_at?: string
  }
  Relationships: []
}
```

Aggiungere anche la funzione in `Functions`:

```typescript
increment_word_view: {
  Args: {
    p_dialect_word: string
    p_italian_word: string
  }
  Returns: undefined
}
```

- [ ] **Step 3: Riscrivere useWordViews.ts**

Sostituire completamente `src/hooks/useWordViews.ts`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WordViewStat {
  dialectWord: string;
  italianWord: string;
  viewCount: number;
}

export function useWordViews() {
  const [mostViewed, setMostViewed] = useState<WordViewStat[]>([]);

  const fetchMostViewed = async (limit = 5) => {
    const { data, error } = await supabase
      .from('word_views')
      .select('dialect_word, italian_word, view_count')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (!error && data) {
      setMostViewed(data.map(d => ({
        dialectWord: d.dialect_word,
        italianWord: d.italian_word,
        viewCount: d.view_count,
      })));
    }
  };

  useEffect(() => {
    fetchMostViewed();
  }, []);

  const incrementWordView = async (dialectWord: string, italianWord: string) => {
    await supabase.rpc('increment_word_view', {
      p_dialect_word: dialectWord.toLowerCase(),
      p_italian_word: italianWord,
    });
    fetchMostViewed();
  };

  const getMostViewedWords = (limit = 5): WordViewStat[] => {
    return mostViewed.slice(0, limit);
  };

  return {
    incrementWordView,
    getMostViewedWords,
  };
}
```

- [ ] **Step 4: Aggiornare Index.tsx**

`incrementWordView` è ora async — in `handleSelectWord`:

```typescript
const handleSelectWord = (entry: DictionaryEntry) => {
  addToHistory(entry.dialectWord, 1);
  incrementWordView(entry.dialectWord, entry.italianWord);
  setSelectedWord(entry);
};
```

Non serve await, fire-and-forget va bene.

- [ ] **Step 5: Eseguire la migrazione su Supabase**

Eseguire lo SQL in Supabase Dashboard → SQL Editor.

- [ ] **Step 6: Verificare**

Aprire il sito da due browser/dispositivi diversi, cercare e cliccare parole diverse, verificare che la sezione "Parole più cercate" mostri dati globali aggiornati.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/04_word_views.sql src/hooks/useWordViews.ts src/integrations/supabase/types.ts src/pages/Index.tsx
git commit -m "feat: parole più cercate globali via Supabase invece di localStorage"
```

---

### Task 6: Pulizia file inutilizzati

**Files:**
- Delete: `src/App.css`
- Delete: `src/components/NavLink.tsx`
- Delete: `src/data/sampleDictionary.ts`
- Delete: `simulate_evolution.sh`
- Delete: `simulate_project_history.sh`
- Move: `AA_01032026_cleaned.csv` → `data/AA_01032026_cleaned.csv`
- Move: `BB_01032026_cleaned.csv` → `data/BB_01032026_cleaned.csv`

- [ ] **Step 1: Eliminare file non utilizzati**

```bash
rm src/App.css
rm src/components/NavLink.tsx
rm src/data/sampleDictionary.ts
rm simulate_evolution.sh
rm simulate_project_history.sh
```

- [ ] **Step 2: Spostare CSV in directory dedicata**

```bash
mkdir -p data
mv AA_01032026_cleaned.csv data/
mv BB_01032026_cleaned.csv data/
```

- [ ] **Step 3: Verificare che nulla si rompa**

```bash
npm run build
```

Il build deve passare senza errori — nessuno di questi file è importato.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: rimuovi file inutilizzati e sposta CSV in data/"
```

---

### Task 7: Rimozione componenti UI shadcn non utilizzati

**Files:**
- Delete: 35 file in `src/components/ui/`

- [ ] **Step 1: Eliminare componenti non usati**

```bash
cd src/components/ui
rm accordion.tsx alert-dialog.tsx alert.tsx aspect-ratio.tsx
rm avatar.tsx breadcrumb.tsx calendar.tsx card.tsx
rm carousel.tsx chart.tsx checkbox.tsx collapsible.tsx
rm command.tsx context-menu.tsx dialog.tsx drawer.tsx
rm dropdown-menu.tsx form.tsx hover-card.tsx input-otp.tsx
rm menubar.tsx navigation-menu.tsx pagination.tsx
rm radio-group.tsx resizable.tsx scroll-area.tsx
rm separator.tsx sheet.tsx sidebar.tsx skeleton.tsx
rm slider.tsx switch.tsx table.tsx toggle.tsx toggle-group.tsx
```

- [ ] **Step 2: Rimuovere dipendenze npm inutili**

```bash
npm uninstall \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog \
  @radix-ui/react-hover-card @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area @radix-ui/react-separator \
  @radix-ui/react-slider @radix-ui/react-switch \
  @radix-ui/react-toggle @radix-ui/react-toggle-group \
  cmdk embla-carousel-react input-otp react-day-picker \
  react-resizable-panels recharts vaul next-themes
```

- [ ] **Step 3: Verificare il build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: rimuovi 35 componenti UI e 25 dipendenze npm non utilizzati"
```

---

### Task 8: Import CSV migliorato

**Files:**
- Modify: `src/components/admin/ExcelUploader.tsx`

- [ ] **Step 1: Gestire BOM nei CSV**

Il file CSV inizia con BOM (`﻿`). In `processExcelFile`, dopo la lettura del workbook, aggiungere rimozione BOM dalle chiavi:

```typescript
const jsonData = XLSX.utils.sheet_to_json<ExcelRow | SourceRow>(worksheet);

// Rimuovi BOM dalle chiavi degli oggetti
const cleanedData = jsonData.map(row => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    cleaned[key.replace(/^﻿/, '')] = value;
  }
  return cleaned as ExcelRow | SourceRow;
});
```

Usare `cleanedData` al posto di `jsonData` nel resto della funzione.

- [ ] **Step 2: Aggiungere validazione e report errori dettagliato**

Dopo il batch processing, mostrare un summary più dettagliato con le righe che hanno fallito:

```typescript
const [errorDetails, setErrorDetails] = useState<string[]>([]);

// Dentro il loop di processamento, tracciare errori per riga:
const skipped: string[] = [];
// ...per ogni riga filtrata via dal .filter():
// aggiungere a skipped il motivo

// Mostrare in un collapsible sotto i risultati
```

- [ ] **Step 3: Aggiungere anteprima dati prima dell'importazione**

Prima di processare, mostrare le prime 5 righe in una tabella di anteprima con un pulsante "Conferma importazione":

```typescript
const [previewData, setPreviewData] = useState<(ExcelRow | SourceRow)[] | null>(null);

// In processExcelFile, fermarsi dopo il parsing:
setPreviewData(cleanedData.slice(0, 5));
// L'utente clicca "Conferma" per procedere con l'importazione effettiva
```

- [ ] **Step 4: Aggiungere supporto formato semplice CSV a due colonne**

Molti CSV hanno solo due colonne (dialetto, italiano). Aggiungere detection:

```typescript
// Nel normalizeRow, aggiungere terzo formato:
if (Object.keys(row).length === 2) {
  const keys = Object.keys(row);
  return {
    parola_dialettale: String((row as Record<string, unknown>)[keys[0]]).trim(),
    parola_italiana: String((row as Record<string, unknown>)[keys[1]]).trim(),
    categoria: 'sostantivo',
  };
}
```

- [ ] **Step 5: Verificare**

1. Importare `AA_01032026_cleaned.csv` — deve funzionare senza errori BOM
2. Verificare che l'anteprima mostri i dati corretti
3. Verificare che il report finale sia accurato

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/ExcelUploader.tsx
git commit -m "fix: migliora import CSV con gestione BOM, anteprima e validazione"
```

---

### Task 9: Animazioni moderne

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/dictionary/WordDetail.tsx`
- Modify: `src/components/dictionary/WordCard.tsx`
- Modify: `src/components/search/SearchResults.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Aggiungere nuove animazioni in index.css**

Aggiungere le seguenti animazioni in `@layer utilities`:

```css
.animate-slide-in-right {
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-in-up {
  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-blur-in {
  animation: blurIn 0.4s ease-out forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes blurIn {
  from {
    opacity: 0;
    filter: blur(4px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}
```

- [ ] **Step 2: Fix pannello dettaglio parola — slide da destra**

In `WordDetail.tsx`, sostituire `animate-slide-up` con `animate-slide-in-right` nel pannello:

```tsx
<div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-medium overflow-y-auto animate-slide-in-right">
```

- [ ] **Step 3: Migliorare animazioni card risultati**

In `SearchResults.tsx`, aggiungere stagger animation ai risultati:

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {results.map((entry, index) => (
    <div
      key={entry.id}
      className="animate-slide-in-up"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <WordCard entry={entry} onClick={() => onSelectWord(entry)} />
    </div>
  ))}
</div>
```

- [ ] **Step 4: Hover scale sulle WordCard**

In `WordCard.tsx`, aggiungere `hover:scale-[1.02]` e migliorare la transizione:

```tsx
className="card-elevated w-full text-left p-5 rounded-xl border border-border hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 ease-out group"
```

- [ ] **Step 5: Animazione overlay dettaglio**

In `WordDetail.tsx`, migliorare l'overlay con blur animato:

```tsx
<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-blur-in">
```

- [ ] **Step 6: Verificare**

1. Cercare una parola → i risultati devono apparire con stagger animation
2. Cliccare una card → il pannello dettaglio deve scorrere da destra
3. Hover su una card → leggero scale-up fluido

- [ ] **Step 7: Commit**

```bash
git add src/index.css src/components/dictionary/WordDetail.tsx src/components/dictionary/WordCard.tsx src/components/search/SearchResults.tsx
git commit -m "feat: animazioni moderne con slide-in, scale e stagger"
```

---

### Task 10: Fix pannello dettaglio — mostrare immagine reale

**Files:**
- Modify: `src/components/dictionary/WordDetail.tsx:102-112`

- [ ] **Step 1: Sostituire placeholder con immagine reale**

```tsx
{entry.imageUrl && (
  <section>
    <h3 className="font-display text-lg font-semibold mb-3">Immagine</h3>
    <img
      src={entry.imageUrl}
      alt={entry.dialectWord}
      className="w-full rounded-xl border border-border object-cover max-h-80"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  </section>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dictionary/WordDetail.tsx
git commit -m "fix: mostra immagine reale nella scheda dettaglio parola"
```

---

### Task 11: Fix link cronologia `/?q=` non gestito

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Leggere parametro `q` dall'URL**

Aggiungere `useSearchParams` da react-router-dom:

```typescript
import { useSearchParams } from 'react-router-dom';

// Dentro il componente:
const [searchParams] = useSearchParams();

useEffect(() => {
  const urlQuery = searchParams.get('q');
  if (urlQuery) {
    const searchResults = search(urlQuery, { searchDirection: 'both' });
    setResults(searchResults);
    setCurrentQuery(urlQuery);
    setHasSearched(true);
  }
}, [searchParams, entries]);
```

NOTA: `entries` come dipendenza perché la prima volta i dati potrebbero non essere ancora caricati.

- [ ] **Step 2: Verificare**

Dalla cronologia, cliccare su una ricerca passata → deve caricare la pagina Index con i risultati di quella ricerca.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "fix: gestisci parametro ?q= dall'URL per link dalla cronologia"
```

---

### Task 12: Doppio toast provider — rimuovere Sonner

**Files:**
- Modify: `src/App.tsx`

L'app importa sia `Toaster` (da `@/components/ui/toaster`) che `Sonner` (da `@/components/ui/sonner`). In tutto il codice si usa solo `useToast` (che usa `Toaster`). `Sonner` non è mai usato direttamente.

- [ ] **Step 1: Rimuovere Sonner da App.tsx**

```tsx
// Rimuovere:
import { Toaster as Sonner } from "@/components/ui/sonner";

// Rimuovere dal JSX:
<Sonner />
```

- [ ] **Step 2: Eliminare il file sonner.tsx**

```bash
rm src/components/ui/sonner.tsx
```

- [ ] **Step 3: Rimuovere la dipendenza**

```bash
npm uninstall sonner
```

- [ ] **Step 4: Verificare il build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: rimuovi Sonner toast provider duplicato, resta solo Toaster"
```

---

### Task 13: Form `suggerisci` semplificato (rimuovere Pronuncia/Trascrizione/Audio)

**Files:**
- Modify: `src/pages/Suggerisci.tsx`
- Modify: `src/integrations/supabase/types.ts` (solo se i campi sono tipizzati nel payload)

- [ ] **Step 1: Rimuovere i campi dal form UI**

Nel componente della pagina `suggerisci`, eliminare dal form:
- input `Pronuncia`
- input `Trascrizione fonetica`
- input/file `Audio`

Aggiornare anche eventuali label, helper text e validazioni collegate.

- [ ] **Step 2: Pulire stato e payload di submit**

Rimuovere:
- state React relativo a pronuncia/trascrizione/audio
- campi dal payload inviato a Supabase (`insert` su `suggestions`)
- eventuali normalizzazioni/preparazioni dati specifiche di questi campi

Se presenti tipi TS dedicati, aggiornarli di conseguenza.

- [ ] **Step 3: Verificare**

1. Aprire `/suggerisci` e verificare che i 3 campi non siano più visibili
2. Inviare un suggerimento completo con i campi rimanenti
3. Verificare in Supabase che il record venga salvato correttamente

- [ ] **Step 4: Commit**

```bash
git add src/pages/Suggerisci.tsx src/integrations/supabase/types.ts
git commit -m "refactor: semplifica form suggerisci rimuovendo pronuncia, trascrizione e audio"
```

---

## Riepilogo Priorità

| Priorità | Task | Tempo stimato |
|----------|------|---------------|
| 1 | Task 1: Fix link rotto `/contatti` | 2 min |
| 2 | Task 2: Filtro lettera `startsWith` | 10 min |
| 3 | Task 3: Stato vuoto ricerca | 5 min |
| 4 | Task 4: Toggle password | 5 min |
| 5 | Task 5: Parole più cercate globali | 30 min |
| 6 | Task 6: Pulizia file | 5 min |
| 7 | Task 7: Rimozione UI components | 10 min |
| 8 | Task 8: CSV import migliorato | 20 min |
| 9 | Task 9: Animazioni moderne | 15 min |
| 10 | Task 10: Immagine reale WordDetail | 2 min |
| 11 | Task 11: Parametro `?q=` da URL | 10 min |
| 12 | Task 12: Rimuovere Sonner duplicato | 5 min |
| 13 | Task 13: Semplificare form `suggerisci` | 8 min |

**Tempo totale stimato: ~2 ore e 10 min**

---

## Dipendenze tra Task

```
Task 1 (link rotto) → indipendente
Task 2 (startsWith) → indipendente
Task 3 (stato vuoto) → dipende parzialmente da Task 2 (stessa area di codice)
Task 4 (password) → indipendente
Task 5 (globale) → indipendente, richiede migrazione DB
Task 6 (pulizia) → indipendente
Task 7 (UI comp) → dopo Task 6 e Task 12
Task 8 (CSV) → indipendente
Task 9 (animazioni) → indipendente
Task 10 (immagine) → indipendente
Task 11 (?q= URL) → dopo Task 3
Task 12 (Sonner) → prima di Task 7
Task 13 (suggerisci semplificato) → indipendente
```

Task paralleli sicuri: 1, 2, 4, 5, 6, 8, 9, 10, 13
