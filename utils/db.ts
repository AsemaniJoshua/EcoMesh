import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('ecomesh.db');

export interface DbPickup {
  id: string;
  date: string;
  weight: string;
  type: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  location: string;
}

export interface DbTransaction {
  id: string;
  type: 'Earned' | 'Redeemed';
  points: string;
  amount: string;
  date: string;
  description: string;
}

export function initDb() {
  // Create tables if they do not exist
  db.execSync(`
    CREATE TABLE IF NOT EXISTS stats (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    
    CREATE TABLE IF NOT EXISTS pickups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      weight TEXT,
      type TEXT,
      status TEXT,
      location TEXT
    );
    
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      points TEXT,
      amount TEXT,
      date TEXT,
      description TEXT
    );
    
    CREATE TABLE IF NOT EXISTS profiles (
      role TEXT PRIMARY KEY,
      name TEXT,
      phone TEXT,
      momoNumber TEXT,
      location TEXT
    );
  `);

  // Initialize stats if not present
  const points = db.getFirstSync<{ value: string }>('SELECT value FROM stats WHERE key = ?', 'pointsBalance');
  if (!points) {
    db.runSync('INSERT INTO stats (key, value) VALUES (?, ?)', 'pointsBalance', '250');
    db.runSync('INSERT INTO stats (key, value) VALUES (?, ?)', 'totalRecycledKg', '34.8');
    db.runSync('INSERT INTO stats (key, value) VALUES (?, ?)', 'dailyEarnings', '42.50');
    db.runSync('INSERT INTO stats (key, value) VALUES (?, ?)', 'jobsDone', '4');
    
    // Seed default profiles
    db.runSync(
      'INSERT INTO profiles (role, name, phone, momoNumber, location) VALUES (?, ?, ?, ?, ?)',
      'household', 'Akosua Mensah', '0551234567', '0551234567', 'Nima Lane 4, Accra'
    );
    db.runSync(
      'INSERT INTO profiles (role, name, phone, momoNumber, location) VALUES (?, ?, ?, ?, ?)',
      'collector', 'Kofi Mensah', '0249876543', '0249876543', 'Accra Central'
    );
    db.runSync(
      'INSERT INTO profiles (role, name, phone, momoNumber, location) VALUES (?, ?, ?, ?, ?)',
      'corporate', 'Coca-Cola Ghana Ltd', '0302123456', 'N/A', 'Tema Industrial Area, Accra'
    );

    // Seed initial mock pickups
    db.runSync(
      'INSERT INTO pickups (date, weight, type, status, location) VALUES (?, ?, ?, ?, ?)',
      'June 28, 2026', '8.4 kg', 'PET Plastics', 'Completed', 'Nima, Accra'
    );
    db.runSync(
      'INSERT INTO pickups (date, weight, type, status, location) VALUES (?, ?, ?, ?, ?)',
      'June 20, 2026', '12.0 kg', 'HDPE & PET Mixed', 'Completed', 'Nima, Accra'
    );

    // Seed initial mock transactions
    db.runSync(
      'INSERT INTO transactions (type, points, amount, date, description) VALUES (?, ?, ?, ?, ?)',
      'Earned', '+84 pts', 'GHS 8.40', 'June 28, 2026', 'Plastic Collection (8.4 kg)'
    );
    db.runSync(
      'INSERT INTO transactions (type, points, amount, date, description) VALUES (?, ?, ?, ?, ?)',
      'Earned', '+120 pts', 'GHS 12.00', 'June 20, 2026', 'Plastic Collection (12.0 kg)'
    );
    db.runSync(
      'INSERT INTO transactions (type, points, amount, date, description) VALUES (?, ?, ?, ?, ?)',
      'Redeemed', '-100 pts', 'GHS 10.00', 'June 15, 2026', 'MTN Mobile Money Cashout'
    );
  }
}
