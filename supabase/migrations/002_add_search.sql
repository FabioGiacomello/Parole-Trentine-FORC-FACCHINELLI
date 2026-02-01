ALTER TABLE words ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('italian', word), 'A') ||
    setweight(to_tsvector('italian', definition), 'B')
  ) STORED;

CREATE INDEX idx_words_search ON words USING GIN(search_vector);
