# e-Trentin — Dizionario del Dialetto Trentino

Applicazione web per la consultazione e la valorizzazione del dialetto di Trento. Permette di cercare vocaboli trentini, ascoltarne la pronuncia, leggere definizioni ed esempi d'uso. Gli utenti possono anche proporre nuove parole, che vengono esaminate dagli amministratori prima di essere pubblicate.

Sviluppata con React, TypeScript e Supabase nell'ambito di un progetto scolastico dell'ITT Buonarroti di Trento.

---

## Indice

- [Documentazione tecnica](#documentazione-tecnica)
- [Pagine dell'applicazione](#pagine-dellapplicazione)
- [Struttura del database](#struttura-del-database)
- [Struttura del progetto](#struttura-del-progetto)
- [Tecnologie utilizzate](#tecnologie-utilizzate)
- [Installazione locale](#installazione-locale)
- [Deployment](#deployment)
- [Team di sviluppo](#team-di-sviluppo)

---

## Documentazione tecnica

La documentazione dettagliata del progetto è disponibile nei seguenti file e su Google Docs.

### Relazione tecnica (Google Docs)

> [Apri la relazione tecnica completa su Google Docs](https://docs.google.com/document/d/1UwrbHYbU9CWfF6wtS21rGHwb0z-wfi7FUpjAFH0owpM/edit?tab=t.0#heading=h.uv3ofiklxugx)

### Documentazione locale (`docs/`)

| File | Contenuto |
|---|---|
| [`docs/architettura.md`](docs/architettura.md) | Architettura del sistema: frontend, backend, deployment, flusso di dati |
| [`docs/database.md`](docs/database.md) | Schema del database: tabelle, colonne, policy RLS, bucket Storage |
| [`docs/contributi.md`](docs/contributi.md) | Contributi del team: chi ha fatto cosa, file per membro, decisioni progettuali |
| [`docs/relazione_tecnica.md`](docs/relazione_tecnica.md) | Relazione tecnica: obiettivi, tecnologie, difficoltà, sviluppi futuri |
| [`docs/guida_admin.md`](docs/guida_admin.md) | Guida all'area amministrativa: accesso, suggerimenti, importazione Excel |
| [`docs/guida_sviluppatore.md`](docs/guida_sviluppatore.md) | Guida per sviluppatori: setup locale, convenzioni, aggiungere pagine e campi |

---

## Pagine dell'applicazione

### Home (`/`)

È la pagina principale dell'applicazione. Contiene:

- **Hero section** con titolo, sottotitolo e barra di ricerca centrale
- **Barra di ricerca avanzata** con:
  - Campo di testo per cercare una parola (in dialetto o in italiano)
  - Selettore della direzione di ricerca (dialetto → italiano, italiano → dialetto, entrambe)
  - Filtro per categoria grammaticale (sostantivo, verbo, aggettivo, ecc.)
  - Ricerca per lettera iniziale tramite dropdown
  - Pulsante per aprire la cronologia
- **Schede funzionalità** visibili prima della prima ricerca (dizionario completo, pronuncia audio, contributi della comunità)
- **Risultati di ricerca** mostrati come griglia di card con la parola dialettale, la traduzione, la categoria grammaticale e la definizione
- **Parola del giorno** selezionata automaticamente in base alla data
- **I numeri del dizionario** con conteggio delle voci per categoria
- **Parole più cercate** basate sulle visualizzazioni salvate in locale

Cliccando su una card si apre il pannello laterale di dettaglio.

---

### Dettaglio parola (pannello laterale)

Aperto cliccando su qualsiasi card della home. Mostra:

- Parola dialettale in grande, con eventuale pulsante di riproduzione audio
- Traduzione italiana, categoria grammaticale, genere e numero
- **Definizione** estesa
- **Esempi d'uso** numerati
- **Immagine** (se disponibile)
- **Parole correlate** come badge cliccabili
- **Parole simili** suggerite (stessa categoria o collegate)

Il pannello si chiude con il pulsante X o cliccando fuori.

---

### Il Progetto (`/progetto`)

Pagina descrittiva che spiega la genesi e gli obiettivi del dizionario. Contiene:

- Sezione introduttiva con la storia del progetto e il perché della sua nascita
- Sezione sulle fonti consultate (Dialet Dictionary, Diaolin, Lessico Trentino, Museo San Michele) con loghi e link ai siti originali
- Sezione sulla metodologia di raccolta dei vocaboli
- CTA per proporre nuovi vocaboli e accedere all'area admin

---

### Chi Siamo (`/chi-siamo`)

Presenta il team che ha realizzato il dizionario, diviso per ruolo:

- Ideazione
- Consulenza linguistica
- Lettura degli audio
- Collaborazione alla raccolta lessicale
- Supporto informatico

Ogni membro è mostrato in una card con icona e ruolo. In fondo alla pagina si trova una sezione di ringraziamenti.

---

### Suggerisci una parola (`/suggerisci`)

Permette a qualsiasi utente (senza registrazione) di proporre un nuovo vocabolo. Il modulo raccoglie:

- Parola dialettale (obbligatoria)
- Traduzione italiana (obbligatoria)
- Categoria grammaticale
- Definizione
- Esempi d'uso
- Pronuncia testuale
- File audio registrato o caricato
- Nome e email del proponente (facoltativi)

Dopo l'invio il suggerimento finisce in stato "in attesa" e viene esaminato da un amministratore.

---

### Cronologia (`/cronologia`)

Mostra le ultime ricerche effettuate dall'utente corrente, salvate in `localStorage`. Funzionalità:

- Lista delle ricerche con data e numero di risultati trovati
- Pulsante per rieseguire la ricerca
- Pulsante per rimuovere una singola voce dalla cronologia
- Pulsante per cancellare tutta la cronologia

---

### Accesso amministrativo (`/auth`)

Pagina di login riservata agli amministratori. Contiene:

- Campo email con validazione formato
- Campo password con validazione lunghezza minima (6 caratteri)
- Gestione degli errori di credenziali errate
- Redirect automatico all'area admin dopo il login riuscito

Se l'utente è già autenticato e ha il ruolo admin, viene reindirizzato direttamente a `/admin`.

---

### Pannello Admin (`/admin`)

Accessibile solo agli utenti autenticati con ruolo `admin`. Contiene tre sezioni principali gestite tramite tab:

#### Tab Suggerimenti
- Elenco dei suggerimenti in attesa di revisione
- Per ogni suggerimento: parola, traduzione, categoria, definizione, pronuncia, esempi, dati del mittente e data
- Campo note admin e pulsanti Approva / Rifiuta
- Approvando una parola: viene inserita automaticamente nel dizionario e il suggerimento segnato come "approvato"
- Sezione pieghevole con i suggerimenti già revisionati

#### Tab Dizionario
- Ricerca e navigazione di tutte le voci del dizionario con paginazione (20 per pagina)
- Pulsante di modifica per aprire l'editor inline
- Pulsante di eliminazione con conferma
- Pulsante "Nuovo vocabolo" per creare una nuova voce

**Editor vocabolo**: form con parola dialettale, traduzione italiana, categoria grammaticale, definizione ed esempi d'uso (uno per riga).

#### Tab Importa Excel
- Area drag-and-drop per caricare file `.xlsx`, `.xls` o `.csv`
- Barra di avanzamento durante l'importazione
- Report finale con numero di voci importate e errori
- Download del template Excel con la struttura corretta delle colonne

**Colonne supportate nel file Excel:**

| Colonna | Obbligatorio |
|---|---|
| `parola_dialettale` | Sì |
| `parola_italiana` | Sì |
| `categoria` | Sì |
| `definizione` | No |
| `esempi` | No |
| `note` | No |
| `plurale` | No |
| `femminile` | No |

---

## Struttura del database

Il database è gestito da Supabase (PostgreSQL) con Row Level Security abilitata su tutte le tabelle. Per la documentazione completa vedere [`docs/database.md`](docs/database.md).

### Tabella `dictionary_entries`
Contiene tutte le voci del dizionario pubblicate.

| Campo | Tipo | Note |
|---|---|---|
| `id` | UUID | Chiave primaria |
| `dialect_word` | TEXT | Parola in dialetto |
| `italian_word` | TEXT | Traduzione italiana |
| `category` | ENUM | Categoria grammaticale |
| `definition` | TEXT | Definizione opzionale |
| `examples` | TEXT[] | Array di esempi |
| `audio_url` | TEXT | URL file audio |
| `image_url` | TEXT | URL immagine |
| `related_words` | TEXT[] | Parole correlate |
| `plural` | TEXT | Forma plurale |
| `feminine` | TEXT | Forma femminile |
| `pronunciation` | TEXT | Trascrizione fonetica |
| `notes` | TEXT | Note aggiuntive |
| `created_at` | TIMESTAMPTZ | Data creazione |
| `updated_at` | TIMESTAMPTZ | Data ultima modifica |

### Tabella `suggestions`
Contiene i suggerimenti inviati dagli utenti non ancora approvati.

| Campo | Tipo | Note |
|---|---|---|
| `id` | UUID | Chiave primaria |
| `dialect_word` | TEXT | Parola proposta |
| `italian_word` | TEXT | Traduzione proposta |
| `category` | ENUM | Categoria grammaticale |
| `definition` | TEXT | Definizione proposta |
| `examples` | TEXT[] | Esempi proposti |
| `submitter_name` | TEXT | Nome del mittente |
| `submitter_email` | TEXT | Email del mittente |
| `status` | TEXT | `pending`, `approved`, `rejected` |
| `admin_notes` | TEXT | Note dell'amministratore |
| `pronunciation` | TEXT | Pronuncia proposta |
| `created_at` | TIMESTAMPTZ | Data invio |
| `reviewed_at` | TIMESTAMPTZ | Data revisione |

### Tabella `user_roles`
Gestisce i ruoli degli utenti autenticati (admin, moderator).

### Storage bucket `audio`
Contiene i file audio caricati dagli utenti nella cartella `suggestions/`.

---

## Struttura del progetto

```
Parole-Trentine/
├── docs/
│   ├── architettura.md         # Architettura del sistema
│   ├── database.md             # Schema del database
│   ├── contributi.md           # Contributi del team
│   ├── relazione_tecnica.md    # Relazione tecnica completa
│   ├── guida_admin.md          # Guida per gli amministratori
│   └── guida_sviluppatore.md   # Guida per gli sviluppatori
├── public/
│   ├── logos/                  # Loghi dei partner
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── admin/              # Pannello di amministrazione
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── DictionaryManager.tsx
│   │   │   ├── ExcelUploader.tsx
│   │   │   ├── SuggestionsManager.tsx
│   │   │   └── WordEditor.tsx
│   │   ├── dictionary/         # Visualizzazione voci
│   │   │   ├── WordCard.tsx    # Card nella lista risultati
│   │   │   └── WordDetail.tsx  # Pannello laterale dettaglio
│   │   ├── layout/             # Struttura della pagina
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── search/             # Ricerca
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── ui/                 # Componenti shadcn/ui (auto-generati)
│   │   └── NavLink.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Gestione autenticazione
│   ├── data/
│   │   └── sampleDictionary.ts # Dati di esempio
│   ├── hooks/
│   │   ├── useDictionary.ts    # Caricamento e ricerca nel dizionario
│   │   ├── useSearchHistory.ts # Cronologia delle ricerche
│   │   └── useWordViews.ts     # Tracciamento parole visualizzate
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts       # Istanza del client Supabase
│   │       └── types.ts        # Tipi auto-generati da Supabase
│   ├── lib/
│   │   └── utils.ts            # Funzione cn() per classi Tailwind
│   ├── pages/
│   │   ├── Index.tsx           # Home
│   │   ├── Progetto.tsx        # Il Progetto
│   │   ├── ChiSiamo.tsx        # Chi Siamo
│   │   ├── Cronologia.tsx      # Cronologia ricerche
│   │   ├── Suggerisci.tsx      # Proponi una parola
│   │   ├── Auth.tsx            # Login admin
│   │   ├── Admin.tsx           # Pannello admin
│   │   └── NotFound.tsx        # Pagina 404
│   ├── types/
│   │   └── dictionary.ts       # Tipi TypeScript del dominio
│   ├── App.tsx                 # Routing principale
│   ├── main.tsx                # Entry point
│   └── index.css               # Stili globali e variabili CSS
├── supabase/
│   └── migrations/
│       ├── 01_struttura_dizionario.sql   # Struttura base del database
│       ├── 02_aggiungi_pronuncia.sql     # Campo pronuncia
│       └── 03_storage_audio.sql         # Bucket audio
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── netlify.toml
```

---

## Tecnologie utilizzate

| Tecnologia | Versione | Utilizzo |
|---|---|---|
| React | 18 | Framework UI |
| TypeScript | 5 | Tipizzazione statica |
| Vite | 5 | Bundler e dev server |
| Tailwind CSS | 3 | Stili utility-first |
| shadcn/ui | — | Componenti UI |
| Supabase | — | Database, auth, storage |
| React Router | 6 | Navigazione SPA |
| React Query | 5 | Gestione stato server |
| Zod | 3 | Validazione form |
| xlsx | — | Lettura/scrittura file Excel |
| react-dropzone | — | Caricamento file drag-and-drop |

---

## Installazione locale

**Requisiti**: Node.js 18 o superiore, npm.

```bash
# Clona il repository
git clone <url-repository>
cd Parole-Trentine

# Installa le dipendenze
npm install

# Crea il file delle variabili d'ambiente
cp .env.example .env
# Poi modifica .env con le tue credenziali Supabase

# Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`.

### Variabili d'ambiente

```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tua-chiave-anon-pubblica
```

### Migrazioni database

Le migrazioni SQL nella cartella `supabase/migrations/` vanno applicate al proprio progetto Supabase nell'ordine numerico indicato dal prefisso del nome file:

1. `01_struttura_dizionario.sql` — struttura base del database (tabelle, tipi, RLS, trigger)
2. `02_aggiungi_pronuncia.sql` — aggiunge il campo pronuncia
3. `03_storage_audio.sql` — configura lo storage per gli audio

---

## Deployment

Il progetto è configurato per il deploy su **Netlify**:

- Build command: `npm run build`
- Publish directory: `dist`
- Il file `netlify.toml` gestisce il routing SPA con redirect `/* → /index.html`

Le variabili d'ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` devono essere configurate nelle impostazioni del sito Netlify.

---

## Team di sviluppo

| Ruolo | Nome |
|---|---|
| Database e backend | Giacomello Fabio |
| Pagine e routing | Emanuele Biasi |
| Pannello amministrativo | Cristopher Facchinelli |
| Componenti UI e configurazione | Prosser Davide |

**Supervisore**: Prof. Murtas, ITT Buonarroti di Trento.

---

## Utilizzo dell'intelligenza artificiale

Durante lo sviluppo del progetto è stata utilizzata l'intelligenza artificiale (Claude di Anthropic) come strumento di supporto. L'IA ha contribuito in alcune fasi del lavoro: generazione di parti del codice boilerplate, suggerimenti su struttura e architettura, revisione di errori logici e supporto nella stesura della documentazione.

Tuttavia, tutte le decisioni progettuali, la scelta delle tecnologie, la progettazione del database, la revisione del codice e il testing sono stati effettuati dagli studenti. L'IA è stata usata come assistente, non come sostituto del lavoro umano: ogni output generato è stato valutato, adattato e integrato consapevolmente nel progetto dal team.

Il contenuto linguistico (vocaboli, traduzioni, esempi d'uso) proviene interamente dalle fonti bibliografiche citate nella sezione Fonti della pagina Il Progetto, ed è stato curato con la supervisione della prof.ssa Patrizia Cordin.

---
> Versione documentazione: 1.0 — revisione finale maggio 2026
