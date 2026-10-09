# Architettura del sistema — e-Trentin

## Panoramica

e-Trentin è una Single Page Application (SPA) costruita con React e collegata a un backend gestito interamente da Supabase. Non esiste un server applicativo personalizzato: tutta la logica di accesso ai dati passa attraverso le API REST e Realtime di Supabase, mentre il frontend viene servito come bundle statico da Netlify.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser utente                        │
│                                                             │
│  React SPA (Vite + TypeScript + Tailwind + shadcn/ui)       │
│  ├── React Router v6  (navigazione lato client)             │
│  ├── React Query v5   (cache e sincronizzazione dati)       │
│  └── Zod              (validazione form)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / REST / Realtime
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                          Supabase                           │
│  ├── PostgreSQL     (database relazionale)                  │
│  ├── Row Level Security  (controllo accessi per riga)       │
│  ├── Auth           (autenticazione email/password)         │
│  └── Storage        (bucket audio per i file .mp3/.ogg)    │
└─────────────────────────────────────────────────────────────┘
                            │ deploy
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                          Netlify                            │
│  Build: npm run build → dist/                               │
│  Routing SPA: _redirects /* /index.html 200                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend

### Stack tecnologico

| Libreria | Versione | Ruolo |
|---|---|---|
| React | 18 | Framework UI basato su componenti |
| TypeScript | 5 | Tipizzazione statica |
| Vite | 5 | Bundler + dev server con HMR |
| Tailwind CSS | 3 | Stili utility-first |
| shadcn/ui | — | Componenti accessibili (Radix UI) |
| React Router | 6 | Navigazione SPA con history API |
| React Query | 5 | Gestione stato server + cache |
| Zod | 3 | Schema di validazione form |
| xlsx | — | Import/export file Excel |
| react-dropzone | — | Upload file con drag and drop |

### Struttura delle cartelle

```
src/
├── components/      componenti riutilizzabili per UI e business logic
│   ├── admin/       pannello di amministrazione
│   ├── dictionary/  visualizzazione voci
│   ├── layout/      header, footer, layout base
│   ├── search/      barra di ricerca e risultati
│   └── ui/          componenti shadcn/ui (auto-generati)
├── contexts/        React context per stato globale (auth)
├── data/            dati di esempio e fixture locali
├── hooks/           custom hook per logica riutilizzabile
├── integrations/    client Supabase e tipi auto-generati
├── lib/             utility generiche (cn, formatters)
├── pages/           pagine dell'applicazione (one per route)
└── types/           tipi TypeScript del dominio applicativo
```

### Flusso di dati

1. Al mount dell'applicazione `useDictionary` esegue una query Supabase per caricare tutti i vocaboli in memoria.
2. La ricerca avviene completamente in memoria sul client, filtrando l'array di voci già caricate — nessuna query aggiuntiva al database per ogni ricerca.
3. I suggerimenti degli utenti vengono inviati tramite `insert` Supabase direttamente dalla pagina `/suggerisci`.
4. Il pannello admin usa `update` e `delete` per gestire suggerimenti e voci.
5. Lo stato di autenticazione è condiviso globalmente tramite `AuthContext` e il listener `onAuthStateChange` di Supabase.

---

## Backend (Supabase)

### PostgreSQL

Il database contiene tre tabelle principali:

- **`dictionary_entries`** — voci del dizionario approvate e pubblicate
- **`suggestions`** — proposte degli utenti in attesa di revisione
- **`user_roles`** — mapping utente ↔ ruolo (admin, moderator)

Dettagli completi in `docs/database.md`.

### Row Level Security (RLS)

RLS è attiva su tutte le tabelle. Le policy definiscono:

- Lettura pubblica per `dictionary_entries` (nessuna autenticazione richiesta)
- Scrittura su `dictionary_entries` riservata agli admin
- Lettura di `suggestions` riservata agli admin
- Insert su `suggestions` aperto a chiunque (proposte anonime)

La funzione `has_role(user_id, role)` è definita come `SECURITY DEFINER` per evitare chiamate ricorsive alle RLS.

### Storage

Un bucket pubblico chiamato `audio` ospita i file audio caricati dagli utenti tramite il modulo di suggerimento. I file risiedono nella sottocartella `suggestions/` e sono accessibili pubblicamente in lettura.

---

## Deployment

### Netlify

Il progetto viene distribuito su Netlify con la seguente configurazione (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Il redirect `/*` → `/index.html` è necessario per il routing SPA: senza di esso, un refresh diretto su `/chi-siamo` restituirebbe un 404.

### Variabili d'ambiente

Le credenziali Supabase non vengono incluse nel repository. Su Netlify vengono configurate come variabili d'ambiente del sito:

- `VITE_SUPABASE_URL` — endpoint del progetto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` — chiave anonima pubblica

---

## Scelte progettuali

### Ricerca in-memory

Caricare l'intero dizionario al primo accesso e filtrare localmente garantisce ricerche istantanee senza latenza di rete. Con un dizionario di qualche migliaio di voci questo approccio è pratico e performante sul browser moderno.

### Nessun server custom

Usare Supabase come BaaS (Backend as a Service) ha eliminato la necessità di sviluppare e mantenere un server Express/Fastify separato, riducendo la complessità operativa a quella di una sola piattaforma.

### localStorage per cronologia e visualizzazioni

La cronologia delle ricerche e il contatore delle parole più viste sono salvati in `localStorage`. Questa scelta evita qualsiasi registrazione obbligatoria e mantiene i dati privati sul dispositivo dell'utente.
