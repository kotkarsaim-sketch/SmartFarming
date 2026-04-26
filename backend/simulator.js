// backend/simulator.js
const mqtt = require('mqtt');

// Public broker (no setup needed)
const MQTT_URL = process.env.MQTT_URL || 'mqtt://broker.hivemq.com:1883';

const client = mqtt.connect(MQTT_URL);

client.on('connect', () => {
  console.log("Simulator connected to", MQTT_URL);

  setInterval(() => {
    const payload = {
      deviceId: "dev-001",
      farmId: "farm-1",
      ts: Math.floor(Date.now() / 1000),
      moisture: Math.round(20 + Math.random() * 60), // 20-80%
      temp: parseFloat((20 + Math.random() * 10).toFixed(1)), // 20-30°C
      hum: Math.round(40 + Math.random() * 40), // 40-80%
      rain: Math.random() > 0.95 ? 1 : 0
    };

    client.publish("farm/farm-1/sensors", JSON.stringify(payload));

    console.log("Published:", payload);
  }, 5000); // every 5 seconds
});
