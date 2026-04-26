// backend/db.js
const path = require('path');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'data.sqlite');
const db = new Database(dbPath);

// Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deviceId TEXT,
  farmId TEXT,
  ts INTEGER,
  moisture REAL,
  temp REAL,
  hum REAL,
  rain INTEGER
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmId TEXT,
  ts INTEGER,
  type TEXT,
  severity TEXT,
  message TEXT,
  acknowledged INTEGER DEFAULT 0
);
`);

const insertReading = db.prepare(`
INSERT INTO readings (deviceId,farmId,ts,moisture,temp,hum,rain)
VALUES (@deviceId,@farmId,@ts,@moisture,@temp,@hum,@rain)
`);

const getLatest = db.prepare(`
SELECT * FROM readings WHERE farmId = ? ORDER BY ts DESC LIMIT 1
`);

const getHistory = db.prepare(`
SELECT * FROM readings WHERE farmId = ? AND ts BETWEEN ? AND ? ORDER BY ts ASC
`);

const insertAlert = db.prepare(`
INSERT INTO alerts (farmId, ts, type, severity, message)
VALUES (@farmId, @ts, @type, @severity, @message)
`);

const getAlerts = db.prepare(`
SELECT * FROM alerts WHERE farmId = ? ORDER BY ts DESC LIMIT 50
`);

module.exports = {
  insertReading,
  getLatest,
  getHistory,
  insertAlert,
  getAlerts
};
