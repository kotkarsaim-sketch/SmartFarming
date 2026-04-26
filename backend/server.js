// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const { getLatest, getHistory, getAlerts } = require('./db');
const { attachSocket } = require('./mqttClient');

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP + Socket.IO server
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: "*" }
});

// When frontend connects via socket
io.on('connection', (socket) => {
  console.log("socket connected:", socket.id);

  socket.on('join', ({ farmId }) => {
    if (farmId) {
      socket.join(`farm-${farmId}`);
      console.log(`socket joined room farm-${farmId}`);
    }
  });
});

// Connect MQTT → Socket.IO
attachSocket(io);

// ---------- API ROUTES ----------

// Latest reading for a farm
app.get('/api/farms/:id/latest', (req, res) => {
  const farmId = req.params.id;
  const row = getLatest.get(farmId);
  res.json(row || {});
});

// History of readings (default last 24h)
app.get('/api/farms/:id/history', (req, res) => {
  const farmId = req.params.id;
  const now = Math.floor(Date.now() / 1000);
  const from = parseInt(req.query.from) || now - 86400; // last 24 hours
  const to = parseInt(req.query.to) || now;

  const rows = getHistory.all(farmId, from, to);
  res.json(rows);
});

// Alerts list
app.get('/api/farms/:id/alerts', (req, res) => {
  const farmId = req.params.id;
  const rows = getAlerts.all(farmId);
  res.json(rows);
});

// ---------------------------------

// Start backend server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
