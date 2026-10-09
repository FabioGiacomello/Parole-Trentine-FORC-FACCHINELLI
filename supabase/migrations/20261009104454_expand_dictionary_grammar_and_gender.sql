ALTER TYPE public.grammar_category ADD VALUE IF NOT EXISTS 'articolo';
ALTER TYPE public.grammar_category ADD VALUE IF NOT EXISTS 'numerale';
ALTER TYPE public.grammar_category ADD VALUE IF NOT EXISTS 'interiezione';
ALTER TYPE public.grammar_category ADD VALUE IF NOT EXISTS 'altro';

ALTER TABLE public.dictionary_entries
  ADD COLUMN IF NOT EXISTS gender TEXT
    CHECK (gender IS NULL OR gender IN ('maschile', 'femminile', 'neutro')),
  ADD COLUMN IF NOT EXISTS number TEXT
    CHECK (number IS NULL OR number IN ('singolare', 'plurale')),
  ADD COLUMN IF NOT EXISTS source_category TEXT;