-- Add pronunciation fields to dictionary_entries
ALTER TABLE public.dictionary_entries
ADD COLUMN IF NOT EXISTS pronunciation TEXT;

-- Add pronunciation field to suggestions
ALTER TABLE public.suggestions
ADD COLUMN IF NOT EXISTS pronunciation TEXT;