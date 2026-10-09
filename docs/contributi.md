# Contributi del team — e-Trentin

Questo documento descrive la suddivisione del lavoro tra i membri del team durante lo sviluppo del progetto scolastico **e-Trentin**, realizzato nell'ambito del corso di Informatica dell'ITT Buonarroti di Trento.

---

## Team

| Nome | Area principale |
|---|---|
| Giacomello Fabio | Database, backend Supabase, migrazioni SQL |
| Emanuele Biasi | Routing, pagine frontend, navigazione |
| Cristopher Facchinelli | Pannello amministrativo, gestione suggerimenti |
| Prosser Davide | Componenti UI, configurazione progetto, stili |

**Supervisore**: Prof. Murtas

---

## Giacomello Fabio

**Area: Database e backend**

Giacomello ha progettato e implementato tutta la parte di backend basata su Supabase.

### File principali

- `supabase/migrations/01_struttura_dizionario.sql` — struttura del database, tipi enum, policy RLS, funzione `has_role`, trigger `updated_at`
- `supabase/migrations/02_aggiungi_pronuncia.sql` — migrazione per aggiungere il campo pronuncia
- `supabase/migrations/03_storage_audio.sql` — configurazione bucket audio e policy Storage
- `src/integrations/supabase/client.ts` — istanza del client Supabase con variabili d'ambiente
- `src/integrations/supabase/types.ts` — tipi TypeScript auto-generati dal database
- `src/hooks/useDictionary.ts` — hook per caricare, cercare e filtrare le voci del dizionario
- `docs/database.md` — documentazione del database

### Decisioni prese

- Ha scelto di usare RLS invece di un middleware server-side per garantire la sicurezza a livello di database.
- Ha definito `has_role` come `SECURITY DEFINER` per evitare ricorsioni nelle policy.
- Ha optato per il caricamento completo del dizionario in memoria al mount dell'app, rendendo la ricerca istantanea senza round-trip aggiuntivi al database.

---

## Emanuele Biasi

**Area: Pagine e navigazione**

Emanuele ha sviluppato le pagine principali dell'applicazione e configurato il sistema di routing.

### File principali

- `src/App.tsx` — configurazione React Router con tutte le route
- `src/main.tsx` — entry point, provider React Query e AuthContext
- `src/index.css` — variabili CSS globali e stili di base
- `src/pages/Index.tsx` — pagina home con hero, ricerca e statistiche
- `src/pages/ChiSiamo.tsx` — pagina del team con card per ogni membro
- `src/pages/Progetto.tsx` — descrizione del progetto, fonti e CTA
- `src/pages/Cronologia.tsx` — cronologia ricerche salvata in localStorage
- `src/pages/NotFound.tsx` — pagina 404
- `src/hooks/useSearchHistory.ts` — hook per gestire la cronologia
- `src/hooks/useWordViews.ts` — hook per tracciare le parole più viste
- `docs/contributi.md` — questo documento

### Decisioni prese

- Ha implementato la ricerca bidirezionale (dialetto ↔ italiano) con filtri combinabili.
- Ha scelto `localStorage` per la cronologia e le visualizzazioni, evitando la necessità di account utente per queste funzionalità.
- Ha strutturato il routing in modo che ogni pagina corrisponda a un componente autonomo.

---

## Cristopher Facchinelli

**Area: Pannello amministrativo**

Cristopher ha realizzato l'intera area admin, inclusa l'autenticazione e la gestione dei contenuti.

### File principali

- `src/pages/Auth.tsx` — pagina di login con validazione form
- `src/pages/Admin.tsx` — container del pannello admin con tab
- `src/contexts/AuthContext.tsx` — contesto React per l'autenticazione Supabase
- `src/components/admin/AdminDashboard.tsx` — dashboard con le tre sezioni principali
- `src/components/admin/SuggestionsManager.tsx` — revisione suggerimenti (approva/rifiuta)
- `src/components/admin/DictionaryManager.tsx` — gestione voci con ricerca e paginazione
- `src/components/admin/WordEditor.tsx` — editor form per inserimento e modifica vocaboli
- `src/components/admin/ExcelUploader.tsx` — importazione massiva da file Excel/CSV
- `docs/relazione_tecnica.md` — relazione tecnica del progetto

### Decisioni prese

- Ha integrato il flusso di approvazione suggerimenti direttamente nell'interfaccia admin: un click su "Approva" copia automaticamente il suggerimento in `dictionary_entries`.
- Ha implementato l'importazione Excel con elaborazione a gruppi (batch da 50 voci) per non sovraccaricare il database.
- Ha aggiunto la paginazione nel gestore del dizionario (20 voci per pagina) per rendere l'interfaccia usabile anche con centinaia di vocaboli.

---

## Prosser Davide

**Area: Componenti UI e configurazione**

Prosser ha curato l'aspetto visivo dell'applicazione, i componenti condivisi e la configurazione del progetto.

### File principali

- `package.json` — dipendenze e script npm
- `vite.config.ts` — configurazione Vite con alias `@/`
- `tailwind.config.ts` — temi, colori e animazioni personalizzate
- `netlify.toml` — configurazione deploy Netlify
- `src/components/layout/Header.tsx` — header con navigazione responsive
- `src/components/layout/Footer.tsx` — footer con link e crediti
- `src/components/layout/Layout.tsx` — wrapper generale con header e footer
- `src/components/search/SearchBar.tsx` — barra di ricerca con filtri avanzati
- `src/components/search/SearchResults.tsx` — griglia risultati di ricerca
- `src/components/dictionary/WordCard.tsx` — card del vocabolo nella lista risultati
- `src/components/dictionary/WordDetail.tsx` — pannello laterale di dettaglio
- `src/components/NavLink.tsx` — link di navigazione con stato attivo
- `src/lib/utils.ts` — funzione `cn()` per classi Tailwind
- `src/types/dictionary.ts` — tipi TypeScript del dominio
- `src/data/sampleDictionary.ts` — dati di esempio per sviluppo locale
- `public/logos/` — loghi delle fonti bibliografiche
- `docs/architettura.md` — documentazione architetturale

### Decisioni prese

- Ha scelto shadcn/ui come sistema di componenti per garantire accessibilità (Radix UI) con stili completamente controllabili via Tailwind.
- Ha configurato l'alias `@/` in Vite per importazioni pulite senza path relativi profondi.
- Ha ottimizzato la barra di ricerca per mobile: input con `min-w-0`, pulsanti responsive con altezze esplicite.

---

## Contributi condivisi

Alcuni aspetti del progetto sono stati discussi e sviluppati in modo collaborativo:

- **Struttura delle cartelle**: decisa insieme nelle prime sessioni di lavoro
- **Naming delle variabili e dei componenti**: convenzioni concordate in italiano dove possibile
- **README.md**: redatto da Prosser con contributi di tutti i membri
- **Test manuali**: effettuati da tutti i membri prima della consegna
- **Revisione dei commit**: ciascun membro ha revisionato il lavoro degli altri prima del merge
