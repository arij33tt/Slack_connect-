import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

let db: sqlite3.Database;

// Type definitions for promisified database functions
type DbRunResult = { lastID: number; changes: number };
type DbGetResult = any;
type DbAllResult = any[];

export const dbRun = (sql: string, params: any[] = []): Promise<DbRunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql: string, params: any[] = []): Promise<DbGetResult> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<DbAllResult> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/tmp/slack_connect.db' 
      : path.join(__dirname, '../../data/slack_connect.db');
    
    // Ensure data directory exists in development
    if (process.env.NODE_ENV !== 'production') {
      const fs = require('fs');
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
}

async function createTables(): Promise<void> {
  const runAsync = promisify(db.run.bind(db));

  // Users table for storing OAuth tokens
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slack_user_id TEXT UNIQUE NOT NULL,
      team_id TEXT NOT NULL,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      expires_at INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Scheduled messages table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS scheduled_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      channel_id TEXT NOT NULL,
      channel_name TEXT NOT NULL,
      message TEXT NOT NULL,
      scheduled_time INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_at DATETIME,
      error_message TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  console.log('Database tables created successfully');
}

export function getDatabase(): sqlite3.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}
