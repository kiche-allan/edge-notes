-- Edge Notes: initial schema
CREATE EXTENSION IF NOT EXISTS vector;  -- pgvector, ready for semantic "Ask the Notes" later

CREATE TABLE IF NOT EXISTS subscribers (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT UNIQUE,
  phone       TEXT UNIQUE,
  channel     TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms')),
  CHECK (email IS NOT NULL OR phone IS NOT NULL),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS margin_notes (
  id          BIGSERIAL PRIMARY KEY,
  post_slug   TEXT NOT NULL,
  quote       TEXT,
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  author_name TEXT NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 60),
  is_author   BOOLEAN NOT NULL DEFAULT false,
  approved    BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS margin_notes_post_idx ON margin_notes (post_slug, created_at);

CREATE TABLE IF NOT EXISTS questions (
  id          BIGSERIAL PRIMARY KEY,
  question    TEXT NOT NULL CHECK (char_length(question) BETWEEN 1 AND 500),
  answered    BOOLEAN NOT NULL,
  sources     TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lab_scores (
  id          BIGSERIAL PRIMARY KEY,
  experiment  TEXT NOT NULL DEFAULT 'place-the-task',
  round_id    TEXT NOT NULL,
  handle      TEXT NOT NULL CHECK (char_length(handle) BETWEEN 1 AND 30),
  total_ms    INTEGER NOT NULL CHECK (total_ms > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lab_scores_round_idx ON lab_scores (experiment, round_id, total_ms);

-- One row per post chunk; embeddings are filled in later when an embedding model is wired up.
CREATE TABLE IF NOT EXISTS note_chunks (
  id          BIGSERIAL PRIMARY KEY,
  post_slug   TEXT NOT NULL,
  heading     TEXT,
  content     TEXT NOT NULL,
  embedding   vector(384)
);
