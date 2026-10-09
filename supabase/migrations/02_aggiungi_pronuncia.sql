-- Aggiunge il campo pronuncia alla tabella delle voci del dizionario
ALTER TABLE public.dictionary_entries
ADD COLUMN IF NOT EXISTS pronunciation TEXT;

-- Aggiunge il campo pronuncia anche alla tabella dei suggerimenti
ALTER TABLE public.suggestions
ADD COLUMN IF NOT EXISTS pronunciation TEXT;

-- Indice parziale per ricerca per pronuncia
CREATE INDEX IF NOT EXISTS idx_pronunciation
  ON public.dictionary_entries (pronunciation)
  WHERE pronunciation IS NOT NULL;
