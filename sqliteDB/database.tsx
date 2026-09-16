import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("tanposh.db");
  }

  return db;
};

export const initDatabase = async () => {
  const database = await getDatabase();

  // =========================
  // CUSTOMER TABLE
  // =========================

  await database.execAsync(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    due_date TEXT,
    advance_amount REAL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL
  );
`);

  // =========================
  // USERS TABLE
  // =========================
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // =========================
  // SERVICES TABLE
  // =========================
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // =========================
  // ORDERS TABLE
  // =========================
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT NOT NULL UNIQUE,
      customer_id INTEGER,
      service_id INTEGER,
      status TEXT NOT NULL DEFAULT 'New',
      amount REAL NOT NULL DEFAULT 0,
      delivery_date TEXT,
      created_at TEXT NOT NULL
    );
  `);
  // =========================
  // Measurements data
  // =========================
  await database.execAsync(`
  CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    measurements TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'inch',
    notes TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

  // =========================
  // DEFAULT SERVICES
  // =========================
  const services = [
    { name: "Shirt", icon: "shirt-outline" },
    { name: "Pant", icon: "cut-outline" },
    { name: "Kurta", icon: "shirt-outline" },
    { name: "Shalwar Kameez", icon: "shirt-outline" },
    { name: "Trouser", icon: "cut-outline" },
    { name: "Waistcoat", icon: "shirt-outline" },
    { name: "Kapri", icon: "cut-outline" },
    { name: "Other", icon: "ellipsis-horizontal-outline" },
  ];

  for (const service of services) {
    await database.runAsync(
      `
      INSERT OR IGNORE INTO services
      (name,icon, created_at)
      VALUES (?, ?, ?)
      ON CONFLICT(name) DO UPDATE SET icon = excluded.icon  
      `,
      service.name,
      service.icon,
      new Date().toISOString(),
    );
  }

  console.log("SQLite database initialized");
};

// export const resetDatabase = async () => {
//   const database = await getDatabase();

//   await database.execAsync(`
//     DROP TABLE IF EXISTS orders;
//     DROP TABLE IF EXISTS services;
//     DROP TABLE IF EXISTS customers;
//     DROP TABLE IF EXISTS users;
//   `);

//   console.log("Database tables deleted");

//   await initDatabase();

//   console.log("Database recreated");
// };
