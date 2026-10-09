# Guida per sviluppatori — e-Trentin

Questa guida è rivolta a chi vuole contribuire al progetto o impostare l'ambiente di sviluppo locale.

---

## Requisiti

- Node.js 18 o superiore
- npm 9 o superiore
- Un progetto Supabase (gratuito su supabase.com)
- Git

---

## Setup locale

### 1. Clonare il repository

```bash
git clone <url-repository>
cd Parole-Trentine
```

### 2. Installare le dipendenze

```bash
npm install
```

### 3. Configurare le variabili d'ambiente

Creare un file `.env` nella root del progetto:

```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tua-chiave-anon-pubblica
```

Le chiavi si trovano nella dashboard Supabase sotto **Project Settings → API**.

> Non usare mai la `service_role` key nel frontend. Usare sempre la chiave `anon` (publishable key).

### 4. Applicare le migrazioni database

Dalla dashboard Supabase, aprire l'**SQL Editor** e incollare il contenuto dei file in ordine:

1. `supabase/migrations/01_struttura_dizionario.sql`
2. `supabase/migrations/02_aggiungi_pronuncia.sql`
3. `supabase/migrations/03_storage_audio.sql`
4. `supabase/migrations/04_word_views.sql`
5. `supabase/migrations/20261009104454_expand_dictionary_grammar_and_gender.sql`

In alternativa, se si ha la Supabase CLI installata:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

### Importare il dizionario e gli audio forniti

Applicare prima tutte le migrazioni. Poi configurare `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` solo nell'ambiente locale del terminale: la chiave
service role non deve essere inserita in `.env` usato dal frontend, nel codice o
nel repository.

L'anteprima non scrive sul database né nello Storage:

```bash
npm run import:dictionary
```

Per eseguire l'importazione dopo aver controllato il riepilogo:

```bash
npm run import:dictionary -- --apply
```

Lo script legge i CSV, i TXT esportati e il foglio Excel nella cartella
`drive-download-*`, normalizza i testi in Unicode NFC, accorpa le voci per lemma
e categoria e privilegia le fonti modificate. Le sigle `sm`/`sf` diventano
sostantivi con genere; le sigle plurali mantengono anche il numero. I file WAV
vengono caricati nel bucket pubblico `audio` e collegati solo quando il nome
corrisponde senza ambiguità a una voce.

L'importazione è ripetibile: aggiorna le voci corrispondenti e inserisce quelle
mancanti. Prima di ogni esecuzione `--apply`, verificare il riepilogo; in
particolare i file WAV non associati e le categorie sorgente riportate come
`altro`. Il nome della cartella audio indica 152 file, ma nel pacchetto fornito
ne sono presenti 49; lo script importa solo quelli effettivamente disponibili.

### 5. Avviare il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`.

---

## Struttura del progetto

```
Parole-Trentine/
├── docs/                   documentazione del progetto
├── public/
│   └── logos/              loghi delle fonti bibliografiche
├── src/
│   ├── components/         componenti React riutilizzabili
│   │   ├── admin/          pannello amministrativo
│   │   ├── dictionary/     visualizzazione voci
│   │   ├── layout/         struttura pagina
│   │   ├── search/         ricerca e risultati
│   │   └── ui/             componenti shadcn/ui
│   ├── contexts/           AuthContext
│   ├── data/               dati di esempio
│   ├── hooks/              custom hook
│   ├── integrations/       client Supabase
│   ├── lib/                utility
│   ├── pages/              pagine dell'applicazione
│   └── types/              tipi TypeScript
├── supabase/
│   └── migrations/         file SQL ordinati
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── netlify.toml
```

---

## Comandi utili

```bash
# Avvia dev server
npm run dev

# Build produzione
npm run build

# Anteprima build produzione
npm run preview

# Controllo tipi TypeScript
npm run typecheck

# Linting
npm run lint

# Test del parser e dell'accorpamento dati
npm run test:import
```

---

## Aggiungere una nuova pagina

1. Creare il componente in `src/pages/NuovaPagina.tsx`
2. Aggiungere la route in `src/App.tsx`:

```tsx
<Route path="/nuova-pagina" element={<NuovaPagina />} />
```

3. Aggiungere il link nella navigazione in `src/components/layout/Header.tsx`

---

## Aggiungere un nuovo campo al database

1. Creare un nuovo file di migrazione in `supabase/migrations/`:
   - Generare il nome con `supabase migration new nome_migrazione`
   
2. Scrivere la migrazione nel file generato:

```sql
ALTER TABLE public.dictionary_entries
ADD COLUMN IF NOT EXISTS nuovo_campo TEXT;
```

3. Applicare la migrazione via Supabase Studio o CLI

4. Aggiornare il tipo `DictionaryEntry` in `src/types/dictionary.ts`

5. Aggiornare `useDictionary.ts` se il campo deve essere incluso nelle query

---

## Componenti UI disponibili

Il progetto usa shadcn/ui. I componenti disponibili si trovano in `src/components/ui/`. Per aggiungere un nuovo componente shadcn:

```bash
npx shadcn@latest add <nome-componente>
```

I componenti vengono copiati nel progetto e possono essere modificati liberamente.

---

## Convenzioni di codice

- Nomi file: PascalCase per componenti (`WordCard.tsx`), camelCase per hook e utility (`useDictionary.ts`)
- Nomi variabili e funzioni: camelCase
- Tipi TypeScript: PascalCase (`DictionaryEntry`, `SearchFilters`)
- Commenti: in italiano, solo dove il "perché" non è ovvio
- Non aggiungere commenti che descrivono il "cosa" (il codice già lo dice)

---

## Deploy su Netlify

1. Creare un nuovo sito su Netlify collegato al repository Git
2. Impostare le variabili d'ambiente in **Site settings → Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Build command: `npm run build`
4. Publish directory: `dist`

Il file `netlify.toml` già presente nella root gestisce automaticamente build e redirect SPA.
