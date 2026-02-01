-- Create enum for grammar categories
CREATE TYPE public.grammar_category AS ENUM ('sostantivo', 'verbo', 'aggettivo', 'avverbio', 'preposizione', 'congiunzione', 'esclamazione', 'pronome', 'locuzione');

-- Create dictionary entries table
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

-- Create user suggestions table
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

-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Dictionary entries: everyone can read, only admins can modify
CREATE POLICY "Anyone can view dictionary entries"
ON public.dictionary_entries
FOR SELECT
USING (true);

-- Create security definer function to check roles
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

CREATE POLICY "Admins can insert dictionary entries"
ON public.dictionary_entries
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update dictionary entries"
ON public.dictionary_entries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dictionary entries"
ON public.dictionary_entries
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Suggestions: anyone can submit, admins can view all
CREATE POLICY "Anyone can submit suggestions"
ON public.suggestions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all suggestions"
ON public.suggestions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update suggestions"
ON public.suggestions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete suggestions"
ON public.suggestions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can manage
CREATE POLICY "Admins can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dictionary_entries_updated_at
BEFORE UPDATE ON public.dictionary_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();