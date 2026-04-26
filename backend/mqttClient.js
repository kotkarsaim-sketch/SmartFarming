// backend/mqttClient.js
const mqtt = require('mqtt');
const {
  insertReading,
  insertAlert
} = require('./db');

// Connect to public MQTT broker (no setup needed)
const MQTT_URL = process.env.MQTT_URL || 'mqtt://broker.hivemq.com:1883';
const client = mqtt.connect(MQTT_URL);

function attachSocket(io) {
  client.on('connect', () => {
    console.log('MQTT connected to', MQTT_URL);

    // Subscribe to topic like: farm/farm-1/sensors
    client.subscribe('farm/+/sensors', (err) => {
      if (err) console.error('MQTT subscribe error', err);
    });
  });

  // When a new sensor message arrives
  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());

      // ESP32 Integration Note:
      // Your ESP32 should publish a JSON object to 'farm/<farmId>/sensors'.
      // Required fields: moisture, temp, hum
      // Optional fields: rain, ts (timestamp), deviceId

      payload.ts = payload.ts || Math.floor(Date.now() / 1000);

      // Save in DB
      insertReading.run(payload);

      // Send live update to frontend
      if (io && payload.farmId) {
        io.to(`farm-${payload.farmId}`).emit('reading', payload);
      }

      // Trigger alert if moisture < 30
      if (payload.moisture !== undefined && payload.moisture < 30) {
        const alert = {
          farmId: payload.farmId,
          ts: payload.ts,
          type: 'irrigation',
          severity: 'high',
          message: `Low moisture: ${payload.moisture}`
        };

        insertAlert.run(alert);

        // Send alert to frontend too
        if (io) io.to(`farm-${payload.farmId}`).emit('alert', alert);
      }

      console.log("ingested:", payload);
    } catch (err) {
      console.error("Invalid MQTT message", err);
    }
  });
}

module.exports = { attachSocket };
