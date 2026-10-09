-- Crea l'enumerazione per le categorie grammaticali
CREATE TYPE public.grammar_category AS ENUM ('sostantivo', 'verbo', 'aggettivo', 'avverbio', 'preposizione', 'congiunzione', 'esclamazione', 'pronome', 'locuzione');

-- Crea la tabella principale delle voci del dizionario
CREATE TABLE public.dictionary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dialect_word TEXT NOT NULL,
  italian_word TEXT NOT NULL,
  category grammar_category NOT NULL,
  definition TEXT,
  examples TEXT[],
  audio_url TEXT,
  image_url TEXT,
  related_words TEXT[],
  plural TEXT,
  feminine TEXT,
  conjugations JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crea la tabella per i suggerimenti degli utenti
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dialect_word TEXT NOT NULL,
  italian_word TEXT NOT NULL,
  category grammar_category,
  definition TEXT,
  examples TEXT[],
  submitter_name TEXT,
  submitter_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Crea l'enumerazione per i ruoli applicativi
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');

-- Crea la tabella dei ruoli utente
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Attiva la sicurezza a livello di riga (RLS) su tutte le tabelle
ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Voci del dizionario: tutti possono leggere, solo gli admin possono modificare
CREATE POLICY "Chiunque può leggere le voci del dizionario"
ON public.dictionary_entries
FOR SELECT
USING (true);

-- Funzione sicura per verificare il ruolo di un utente
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Gli admin possono inserire voci nel dizionario"
ON public.dictionary_entries
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Gli admin possono modificare le voci del dizionario"
ON public.dictionary_entries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Gli admin possono eliminare le voci del dizionario"
ON public.dictionary_entries
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Suggerimenti: chiunque può inviare, solo gli admin vedono tutto
CREATE POLICY "Chiunque può inviare suggerimenti"
ON public.suggestions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Gli admin possono vedere tutti i suggerimenti"
ON public.suggestions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Gli admin possono modificare i suggerimenti"
ON public.suggestions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Gli admin possono eliminare i suggerimenti"
ON public.suggestions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Ruoli utente: solo gli admin possono gestirli
CREATE POLICY "Gli admin e gli utenti stessi vedono i ruoli"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Solo gli admin gestiscono i ruoli utente"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Funzione per aggiornare automaticamente il campo updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger che aggiorna updated_at ad ogni modifica di una voce
CREATE TRIGGER update_dictionary_entries_updated_at
BEFORE UPDATE ON public.dictionary_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
