-- 1. Users: Pengelola CMS
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'editor', -- admin, editor, author
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contents: Tabel 'Sakti' untuk segala jenis data
-- Kita ganti nama 'posts' jadi 'contents' biar mindsetnya lebih luas
DROP TABLE IF EXISTS contents;
CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT,                  -- Isi utama (HTML/Markdown)
    type TEXT DEFAULT 'post',   -- KUNCI FLEKSIBILITAS: post, page, product, portfolio, event
    status TEXT DEFAULT 'draft',-- draft, published, archived
    author_id INTEGER,
    
    -- KUNCI KEDUA: Data dinamis disimpan sebagai JSON
    -- Contoh Product: {"price": 50000, "stock": 10, "sku": "ABC-1"}
    -- Contoh Event: {"event_date": "2024-12-01", "location": "Jakarta"}
    attributes JSON DEFAULT '{}', 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 3. Taxonomies: Untuk Kategori & Tag (Satu tabel untuk semua)
DROP TABLE IF EXISTS taxonomies;
CREATE TABLE IF NOT EXISTS taxonomies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'category', -- category, tag, brand, genre
    description TEXT
);

-- 4. Relations: Hubungan Content <-> Taxonomy (Many-to-Many)
DROP TABLE IF EXISTS content_taxonomies;
CREATE TABLE IF NOT EXISTS content_taxonomies (
    content_id INTEGER,
    taxonomy_id INTEGER,
    PRIMARY KEY (content_id, taxonomy_id),
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE CASCADE
);

-- Indexing biar ngebut saat query
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_status ON contents(status);