# Database — e-Trentin

## Panoramica

Il database è gestito da Supabase (PostgreSQL 15). Row Level Security (RLS) è abilitata su tutte le tabelle per garantire che ogni operazione rispetti le autorizzazioni definite a livello di riga, indipendentemente dall'utente che accede.

Le migrazioni si trovano in `supabase/migrations/` e vanno applicate nell'ordine indicato dal prefisso numerico.

---

## Migrazioni

| File | Descrizione |
|---|---|
| `01_struttura_dizionario.sql` | Struttura base: tabelle, tipi enum, policy RLS, trigger |
| `02_aggiungi_pronuncia.sql` | Aggiunta colonna `pronunciation` alle due tabelle principali |
| `03_storage_audio.sql` | Creazione bucket audio e policy di accesso allo storage |

---

## Tabella `dictionary_entries`

Contiene tutte le voci del dizionario approvate e visibili al pubblico.

| Colonna | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `id` | UUID | Sì | Chiave primaria, generata automaticamente |
| `dialect_word` | TEXT | Sì | Parola in dialetto trentino |
| `italian_word` | TEXT | Sì | Traduzione italiana |
| `category` | grammar_category | Sì | Categoria grammaticale (enum) |
| `definition` | TEXT | No | Definizione estesa |
| `examples` | TEXT[] | No | Array di esempi d'uso |
| `audio_url` | TEXT | No | URL al file audio nel bucket Supabase Storage |
| `image_url` | TEXT | No | URL a un'immagine illustrativa |
| `related_words` | TEXT[] | No | Parole dialettali correlate |
| `plural` | TEXT | No | Forma plurale |
| `feminine` | TEXT | No | Forma femminile (per sostantivi) |
| `conjugations` | JSONB | No | Coniugazioni del verbo (riservato ai verbi) |
| `pronunciation` | TEXT | No | Trascrizione fonetica della pronuncia |
| `notes` | TEXT | No | Note aggiuntive dell'editore |
| `created_at` | TIMESTAMPTZ | Sì | Data e ora di creazione (automatica) |
| `updated_at` | TIMESTAMPTZ | Sì | Data e ora di ultima modifica (gestita da trigger) |

### Tipo enum `grammar_category`

```sql
CREATE TYPE public.grammar_category AS ENUM (
  'sostantivo',
  'verbo',
  'aggettivo',
  'avverbio',
  'preposizione',
  'congiunzione',
  'esclamazione',
  'pronome',
  'locuzione'
);
```

### Trigger `update_updated_at_column`

Ad ogni `UPDATE` su `dictionary_entries`, il trigger imposta automaticamente `updated_at = now()`. Questo evita di dover gestire manualmente il timestamp lato applicazione.

### Policy RLS

| Policy | Operazione | Condizione |
|---|---|---|
| Chiunque può leggere le voci | SELECT | `true` (pubblica) |
| Gli admin possono inserire voci | INSERT | `has_role(auth.uid(), 'admin')` |
| Gli admin possono modificare le voci | UPDATE | `has_role(auth.uid(), 'admin')` |
| Gli admin possono eliminare le voci | DELETE | `has_role(auth.uid(), 'admin')` |

---

## Tabella `suggestions`

Raccoglie le proposte di nuovi vocaboli inviate dagli utenti. Rimangono in stato `pending` finché un admin le approva o le rifiuta.

| Colonna | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `id` | UUID | Sì | Chiave primaria |
| `dialect_word` | TEXT | Sì | Parola dialettale proposta |
| `italian_word` | TEXT | Sì | Traduzione italiana proposta |
| `category` | grammar_category | No | Categoria grammaticale |
| `definition` | TEXT | No | Definizione proposta |
| `examples` | TEXT[] | No | Esempi d'uso proposti |
| `pronunciation` | TEXT | No | Pronuncia proposta |
| `submitter_name` | TEXT | No | Nome del mittente (facoltativo) |
| `submitter_email` | TEXT | No | Email del mittente (facoltativa) |
| `status` | TEXT | Sì | `pending` / `approved` / `rejected` |
| `admin_notes` | TEXT | No | Note del revisore admin |
| `created_at` | TIMESTAMPTZ | Sì | Data di invio |
| `reviewed_at` | TIMESTAMPTZ | No | Data di revisione |

### Vincolo di stato

```sql
CHECK (status IN ('pending', 'approved', 'rejected'))
```

### Policy RLS

| Policy | Operazione | Condizione |
|---|---|---|
| Chiunque può inviare suggerimenti | INSERT | `true` |
| Gli admin vedono tutti i suggerimenti | SELECT | `has_role(auth.uid(), 'admin')` |
| Gli admin modificano i suggerimenti | UPDATE | `has_role(auth.uid(), 'admin')` |
| Gli admin eliminano i suggerimenti | DELETE | `has_role(auth.uid(), 'admin')` |

---

## Tabella `user_roles`

Mappa gli utenti autenticati ai loro ruoli applicativi. Un utente può avere più ruoli.

| Colonna | Tipo | Descrizione |
|---|---|---|
| `id` | UUID | Chiave primaria |
| `user_id` | UUID | Foreign key → `auth.users(id)` (CASCADE DELETE) |
| `role` | app_role | Enum: `admin` o `moderator` |

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');
```

Il vincolo `UNIQUE (user_id, role)` impedisce duplicati.

### Funzione `has_role`

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

`SECURITY DEFINER` fa sì che la funzione venga eseguita con i permessi del creatore (non dell'utente chiamante), evitando la ricorsione infinita nelle policy RLS che usano `has_role` per verificare se l'utente stesso è admin.

---

## Storage bucket `audio`

Il bucket `audio` è pubblico e contiene i file audio caricati dagli utenti.

```
audio/
└── suggestions/
    ├── <uuid-1>.mp3
    ├── <uuid-2>.ogg
    └── ...
```

### Policy Storage

| Policy | Operazione | Condizione |
|---|---|---|
| Chiunque può caricare audio | INSERT | `bucket_id = 'audio'` e cartella `suggestions/` |
| File audio accessibili pubblicamente | SELECT | `bucket_id = 'audio'` |
| Gli admin eliminano i file audio | DELETE | `bucket_id = 'audio'` + `has_role(..., 'admin')` |

---

## Come applicare le migrazioni

Su un nuovo progetto Supabase, applicare i file nell'ordine numerico tramite la CLI:

```bash
supabase db push
```

Oppure incollandoli manualmente nell'editor SQL della dashboard Supabase, nello stesso ordine.
