# Guida all'area amministrativa — e-Trentin

Questa guida descrive come accedere e usare il pannello admin del dizionario e-Trentin.

---

## Accesso

1. Aprire il sito e navigare a `/auth` (o cliccare "Admin" nella pagina Il Progetto)
2. Inserire email e password dell'account admin
3. Dopo il login si viene reindirizzati automaticamente a `/admin`

Le credenziali admin vengono create direttamente da Supabase Studio (Dashboard → Authentication → Users). Non è possibile registrarsi come admin dall'interfaccia pubblica.

---

## Struttura del pannello

Il pannello è diviso in tre tab:

- **Suggerimenti** — revisione delle proposte inviate dagli utenti
- **Dizionario** — gestione completa delle voci pubblicate
- **Importa Excel** — importazione massiva di vocaboli da file

---

## Tab Suggerimenti

Mostra tutti i suggerimenti in stato `pending` (in attesa di revisione).

Per ogni suggerimento sono visibili:
- Parola dialettale e traduzione italiana proposta
- Categoria grammaticale
- Definizione ed esempi forniti dall'utente
- Pronuncia (se inserita)
- Nome e email del mittente (se forniti)
- Data di invio
- File audio allegato (se presente, con player integrato)

### Approvare un suggerimento

1. Leggere il suggerimento e verificarne la correttezza linguistica
2. Aggiungere eventuali note nel campo "Note admin"
3. Cliccare **Approva**

Il sistema inserisce automaticamente la voce in `dictionary_entries` e segna il suggerimento come `approved`. La voce diventa subito visibile agli utenti.

### Rifiutare un suggerimento

1. Aggiungere una motivazione nel campo "Note admin" (facoltativo ma consigliato)
2. Cliccare **Rifiuta**

Il suggerimento viene segnato come `rejected` e non viene pubblicato. Non viene eliminato dal database — rimane visibile nella sezione "Revisionati" in fondo alla pagina.

---

## Tab Dizionario

Permette di cercare, modificare ed eliminare le voci già pubblicate.

### Ricerca

Usare il campo di testo in cima per filtrare le voci per parola dialettale o italiana. La ricerca è in tempo reale.

### Modifica

Cliccare l'icona matita su una voce per aprire l'editor. I campi modificabili sono:

- Parola dialettale
- Traduzione italiana
- Categoria grammaticale
- Definizione
- Esempi d'uso (uno per riga)

Cliccare **Salva** per confermare le modifiche. Il campo `updated_at` viene aggiornato automaticamente dal trigger del database.

### Eliminazione

Cliccare l'icona cestino e confermare nel dialogo di conferma. L'operazione è irreversibile.

### Nuova voce

Cliccare **+ Nuovo vocabolo** per aprire l'editor su una voce vuota. Compilare i campi e cliccare **Salva** per pubblicare.

---

## Tab Importa Excel

Permette di caricare più voci contemporaneamente da un file Excel o CSV.

### Formato del file

Scaricare il template cliccando **Scarica template** per ottenere un file con le colonne corrette. Le colonne supportate sono:

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

La colonna `esempi` accetta più esempi separati da punto e virgola (`;`).

I valori validi per `categoria` sono: `sostantivo`, `verbo`, `aggettivo`, `avverbio`, `preposizione`, `congiunzione`, `esclamazione`, `pronome`, `locuzione`.

### Importazione

1. Trascinare il file nell'area di drop oppure cliccare per selezionarlo
2. Il sistema mostra una barra di avanzamento durante l'elaborazione
3. Al termine viene mostrato un report con il numero di voci importate e gli eventuali errori riga per riga

Le voci vengono elaborate in gruppi da 50 per non sovraccaricare il database. In caso di errore su una singola voce, le altre del batch vengono comunque importate.

---

## Logout

Cliccare **Esci** nel pannello admin o navigare su `/auth` per effettuare il logout.
