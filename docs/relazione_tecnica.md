# Relazione tecnica — e-Trentin

**Progetto**: Dizionario del dialetto trentino online  
**Istituto**: ITT Buonarroti, Trento  
**Classe**: IV *  
**Anno scolastico**: 2025/2026  
**Supervisore**: Prof. Murtas  

> La relazione tecnica completa è disponibile su Google Docs:  
> [Apri la relazione su Google Docs](https://docs.google.com/document/d/1UwrbHYbU9CWfF6wtS21rGHwb0z-wfi7FUpjAFH0owpM/edit?tab=t.0#heading=h.uv3ofiklxugx)

---

## 1. Introduzione

Il progetto **e-Trentin** nasce dall'idea di rendere il dialetto trentino accessibile a tutti tramite uno strumento digitale moderno. Il dialetto di Trento, come molte varietà regionali italiane, è a rischio di progressivo abbandono tra le generazioni più giovani. Un dizionario online consultabile, arricchito da audio e contributi della comunità, può contribuire a preservare e diffondere questo patrimonio linguistico.

Il lavoro è stato sviluppato nell'ambito del corso di Informatica dell'ITT Buonarroti di Trento, con la collaborazione di esperti linguistici esterni (prof.ssa Patrizia Cordin, Università di Trento) e il sostegno di istituzioni culturali del territorio.

---

## 2. Obiettivi

- Realizzare un dizionario online consultabile dal browser, senza installazioni
- Supportare la ricerca bidirezionale (dialetto → italiano e italiano → dialetto)
- Permettere la ricerca per lettera e per categoria grammaticale
- Fornire per ogni voce: pronuncia audio, definizione, esempi d'uso, parole correlate
- Consentire a chiunque di proporre nuovi vocaboli senza registrazione
- Dotare il progetto di un pannello admin per moderare i suggerimenti e gestire il dizionario
- Rendere il sito accessibile da dispositivi mobili

---

## 3. Tecnologie scelte

### 3.1 Frontend: React + TypeScript

Abbiamo scelto React per la sua diffusione nel mercato del lavoro, la ricca ecosistema di librerie e la possibilità di costruire interfacce reattive con componenti riutilizzabili. TypeScript aggiunge la tipizzazione statica, riducendo gli errori a runtime e migliorando la manutenibilità del codice.

Vite è stato preferito a Create React App per la sua velocità di avvio (HMR quasi istantaneo) e la configurazione più leggera.

### 3.2 Stili: Tailwind CSS + shadcn/ui

Tailwind CSS permette di costruire interfacce responsive senza uscire dall'HTML. shadcn/ui fornisce componenti accessibili basati su Radix UI, già integrati con Tailwind e completamente personalizzabili senza dipendere da un design system chiuso.

### 3.3 Backend: Supabase

Supabase è un Backend as a Service open source basato su PostgreSQL. La scelta è ricaduta su Supabase per:

- Accesso diretto al database PostgreSQL con query SQL complete
- Row Level Security nativa per la gestione degli accessi
- Autenticazione integrata (email/password, OAuth)
- Storage per i file audio
- API REST e Realtime auto-generate dallo schema del database
- Piano gratuito sufficiente per un progetto scolastico

### 3.4 Deployment: Netlify

Netlify offre deploy automatici da repository Git, CDN globale e supporto nativo per le SPA React. La configurazione è minima e il piano gratuito copre tutte le esigenze del progetto.

---

## 4. Architettura

Per i dettagli architetturali completi, vedere `docs/architettura.md`.

In sintesi: l'applicazione è una SPA che al primo caricamento recupera l'intero dizionario da Supabase e lo mantiene in memoria. La ricerca è eseguita interamente sul client, garantendo risposta istantanea. I suggerimenti degli utenti vengono inviati direttamente a Supabase tramite INSERT. L'area admin è protetta da autenticazione Supabase con verifica del ruolo `admin` via Row Level Security.

---

## 5. Database

Per lo schema dettagliato, vedere `docs/database.md`.

Il database PostgreSQL contiene tre tabelle:

- `dictionary_entries`: voci approvate e pubbliche
- `suggestions`: proposte in attesa di revisione
- `user_roles`: ruoli degli utenti admin

Le migrazioni SQL si trovano in `supabase/migrations/` con prefisso numerico per garantire l'ordine di applicazione.

---

## 6. Funzionalità principali

### 6.1 Ricerca avanzata

La barra di ricerca supporta tre modalità:

- **Dialetto → Italiano**: cerca solo nel campo `dialect_word`
- **Italiano → Dialetto**: cerca solo nel campo `italian_word`
- **Entrambe le direzioni**: cerca in entrambi i campi (modalità predefinita)

È possibile combinare la ricerca testuale con:
- Filtro per categoria grammaticale
- Ricerca per lettera iniziale

### 6.2 Parola del giorno

Viene selezionata deterministicamente in base al giorno dell'anno (`dayOfYear % entries.length`), così che tutti gli utenti vedano la stessa parola nello stesso giorno, senza dover salvare nulla sul server.

### 6.3 Cronologia ricerche

Le ultime ricerche sono salvate in `localStorage` con data e numero di risultati. L'utente può rieseguire una ricerca passata o eliminarla. I dati non vengono mai inviati al server.

### 6.4 Pannello admin

Accessibile solo dopo autenticazione con ruolo `admin`. Contiene tre sezioni:

- **Suggerimenti**: revisione delle proposte in attesa, con possibilità di approvare (→ inserimento automatico nel dizionario) o rifiutare
- **Dizionario**: gestione completa delle voci con ricerca, paginazione, modifica ed eliminazione
- **Importa Excel**: caricamento massivo di vocaboli da file `.xlsx`, `.xls` o `.csv`

### 6.5 Proposta vocaboli

Chiunque può proporre un nuovo vocabolo senza registrarsi. Il modulo raccoglie parola dialettale, traduzione, categoria, definizione, esempi e un file audio opzionale. Il suggerimento va in stato `pending` e viene esaminato dall'admin.

---

## 7. Sicurezza

- Row Level Security su tutte le tabelle: nessun client può leggere o scrivere dati non autorizzati, anche bypassando il frontend
- Le chiavi Supabase presenti nel frontend sono le chiavi **anonime** (solo lettura pubblica + insert controllato da policy), mai le chiavi di servizio
- La chiave di servizio non è mai esposta nel repository né nel frontend
- I form di input sono validati con Zod prima dell'invio
- Le policy RLS per le operazioni di scrittura richiedono sempre `has_role(auth.uid(), 'admin')`

---

## 8. Test e qualità

Il progetto non include test automatizzati (unittest, integration test) — una scelta pratica data la natura scolastica del lavoro e i tempi limitati. I test sono stati effettuati manualmente:

- Verifica di tutte le route su desktop e mobile
- Test della ricerca con termini dialettali e italiani
- Test del flusso completo suggerimento → approvazione → pubblicazione
- Test dell'importazione Excel con file validi e file con errori
- Verifica delle policy RLS tramite Supabase Studio

---

## 9. Difficoltà incontrate

### Autenticazione e RLS

La gestione dell'autenticazione con Supabase ha richiesto attenzione alla gestione degli stati asincroni. Il listener `onAuthStateChange` deve essere inizializzato prima di qualsiasi verifica della sessione esistente, altrimenti si crea una race condition in cui il componente si monta con utente `null` prima che la sessione venga recuperata.

La soluzione adottata usa `setTimeout` per differire la verifica del ruolo admin, garantendo che il listener sia già attivo quando la sessione viene controllata.

### Ricerca bidirezionale

Implementare la ricerca che funzioni correttamente in entrambe le direzioni (e nella modalità "entrambe") con filtri combinabili ha richiesto la progettazione di una funzione di filtro componibile in `useDictionary`.

### Mobile responsive

La barra di ricerca presentava problemi su schermi piccoli: l'input veniva compresso dai pulsanti adiacenti. Il fix ha richiesto di aggiungere `min-w-0` al contenitore flex dell'input (comportamento CSS non ovvio) e di usare altezze esplicite con classi responsive Tailwind invece di dipendere dalla prop `size` del componente Button.

### Importazione Excel

L'elaborazione di file Excel con centinaia di righe bloccava l'interfaccia. La soluzione è stata elaborare le voci in batch da 50 con `Promise.all`, aggiornando la barra di avanzamento tra un batch e l'altro.

---

## 10. Possibili sviluppi futuri

- Aggiungere la ricerca full-text lato server (PostgreSQL `tsvector`) per supportare dizionari molto grandi
- Implementare la registrazione audio direttamente dal browser nel form di suggerimento
- Aggiungere un sistema di valutazione delle voci (upvote/downvote) da parte degli utenti
- Internazionalizzare l'interfaccia per includere il ladino trentino
- Aggiungere test automatizzati con Vitest e Testing Library
- Integrare un motore di ricerca fuzzy (es. Fuse.js) per tollerare errori di battitura

---

## 11. Conclusioni

Il progetto ha raggiunto tutti gli obiettivi prefissati: il dizionario è consultabile online, supporta la ricerca bidirezionale, permette la proposta di nuovi vocaboli e dispone di un pannello admin funzionale. L'esperienza ha permesso al team di applicare concretamente tecnologie moderne (React, TypeScript, PostgreSQL, RLS) su un problema reale legato al territorio.

Il codice sorgente è disponibile nel repository Git del progetto. La documentazione tecnica estesa è disponibile al link riportato in cima a questo documento.
