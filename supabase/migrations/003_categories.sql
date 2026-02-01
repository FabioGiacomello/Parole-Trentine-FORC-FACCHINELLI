CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO categories (name, description) VALUES
  ('sostantivo', 'Nomi'),
  ('verbo', 'Verbi'),
  ('aggettivo', 'Aggettivi');
