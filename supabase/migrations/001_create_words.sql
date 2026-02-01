CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  category VARCHAR(50),
  example TEXT,
  etymology TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_words_word ON words(word);
