import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "data", "app.db")
    const dataDir = path.dirname(dbPath)

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")

    // Initialize schema
    initializeSchema()
  }
  return db
}

function initializeSchema() {
  const database = db!

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      user_type TEXT NOT NULL DEFAULT 'admin_limited',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      function TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER NOT NULL,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      user_id INTEGER NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `)

  // Insert default admin user if not exists
  const adminExists = database.prepare("SELECT id FROM users WHERE username = ?").get("admin")
  if (!adminExists) {
    database
      .prepare(`
      INSERT INTO users (username, password, user_type) 
      VALUES (?, ?, ?)
    `)
      .run("admin", "$2a$10$YOixf8XeoQr0iB8/LewKPuK3V.MI9vpMtEVplJV6G5ozVP8qK7jFa", "admin_master")
  }
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}
