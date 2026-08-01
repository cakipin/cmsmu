CREATE TABLE IF NOT EXISTS plugins (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    author TEXT,
    version TEXT,
    active INTEGER DEFAULT 0
);
