# Sending ESP32 Data to Remote Server (Different WiFi)

This guide shows you how to send sensor data from ESP32 to a server that's **not on the same WiFi network**.

## 🎯 Overview

Instead of the backend server polling ESP32, the ESP32 will **push data** to your remote server using HTTP POST requests.

```
ESP32 (Remote Location) 
  → HTTP POST 
  → Remote Server (Cloud/Your Server)
  → Backend API
  → Frontend Dashboard
```

---

## Option 1: Deploy Your Backend to Cloud (Recommended)

### Step 1: Deploy Backend Server

Choose a hosting platform:

#### A. Railway (Easiest - Free Tier Available)

1. **Sign up:** https://railway.app
2. **Create new project**
3. **Deploy from GitHub:**
   - Connect your GitHub repo
   - Railway auto-detects Node.js
   - Add environment variables:
     ```
     PORT=3001
     ESP32_URL= (leave empty, ESP32 will POST to this server)
     USE_MOCK_DATA=false
     ```
4. **Get your URL:** `https://your-app.railway.app`

#### B. Heroku (Free Tier Discontinued, but still works)

1. **Install Heroku CLI:** https://devcenter.heroku.com/articles/heroku-cli
2. **Login:** `heroku login`
3. **Create app:** `heroku create your-app-name`
4. **Set config vars:**
   ```bash
   heroku config:set PORT=3001
   heroku config:set USE_MOCK_DATA=false
   ```
5. **Deploy:** `git push heroku main`
6. **Get URL:** `https://your-app-name.herokuapp.com`

#### C. Render (Free Tier Available)

1. **Sign up:** https://render.com
2. **New Web Service**
3. **Connect GitHub repo**
4. **Settings:**
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
5. **Environment Variables:** Add same as Railway
6. **Get URL:** `https://your-app.onrender.com`

#### D. DigitalOcean App Platform

1. **Sign up:** https://www.digitalocean.com
2. **Create App → GitHub**
3. **Configure and deploy**
4. **Get URL:** `https://your-app.ondigitalocean.app`

### Step 2: Update Backend to Accept POST Requests

Update `server/index.js` to accept POST requests from ESP32:

```javascript
// Add this endpoint to receive data from ESP32
app.post('/api/sensor/data', (req, res) => {
  const { flowRate, pressure, waterLoss } = req.body;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  // Update sensor data
  sensorData = {
    flowRate: parseFloat((flowRate || 0).toFixed(2)),
    pressure: parseFloat((pressure || 0).toFixed(2)),
    waterLoss: parseInt(waterLoss || 0),
    timestamp: now.toISOString(),
    history: sensorData.history || [],
  };
  
  // Add to history
  sensorData.history.push({
    time: timeString,
    flowRate: sensorData.flowRate,
    pressure: sensorData.pressure,
    waterLoss: sensorData.waterLoss,
    timestamp: now.toISOString(),
  });
  
  // Keep only last 1000 entries
  if (sensorData.history.length > 1000) {
    sensorData.history = sensorData.history.slice(-1000);
  }
  
  console.log(`[${timeString}] Data received: Flow=${sensorData.flowRate} M³/hr, Pressure=${sensorData.pressure} Bar`);
  
  res.json({ success: true, message: 'Data received' });
});
```

### Step 3: Update ESP32 Code

1. **Open:** `server/esp32-remote-server.ino`
2. **Update WiFi credentials:**
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. **Update server URL:**
   ```cpp
   const char* serverURL = "https://your-app.railway.app/api/sensor/data";
   ```
4. **Upload to ESP32**

### Step 4: Test

1. **ESP32 will send data every 4 seconds**
2. **Check server logs** to see incoming data
3. **Frontend will automatically fetch** from the same server

---

## Option 2: Use ngrok for Testing (Quick Setup)

For quick testing without deploying:

### Step 1: Install ngrok

```bash
# Download from https://ngrok.com/download
# Or install via Homebrew (Mac)
brew install ngrok

# Or via npm
npm install -g ngrok
```

### Step 2: Start Your Local Backend

```bash
npm run server:dev
```

### Step 3: Create ngrok Tunnel

```bash
ngrok http 3001
```

You'll see:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

### Step 4: Update ESP32 Code

```cpp
const char* serverURL = "https://abc123.ngrok.io/api/sensor/data";
```

### Step 5: Upload and Test

**Note:** Free ngrok URLs change on restart. Use paid plan for static URLs.

---

## Option 3: Use Firebase Realtime Database

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Create new project
3. Enable **Realtime Database**
4. Copy database URL: `https://your-project.firebaseio.com/`

### Step 2: Update ESP32 Code

Install Firebase library:
- **Arduino IDE:** Tools → Manage Libraries → Search "Firebase ESP32 Client"

```cpp
#include <FirebaseESP32.h>

#define FIREBASE_HOST "your-project.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret"

FirebaseData firebaseData;

void setup() {
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop() {
  float flowRateM3Hr = (flowRate * 60.0) / 1000.0;
  
  Firebase.setFloat(firebaseData, "/sensor/flowRate", flowRateM3Hr);
  Firebase.setFloat(firebaseData, "/sensor/pressure", pressure);
  Firebase.setInt(firebaseData, "/sensor/waterLoss", waterLoss);
  Firebase.setString(firebaseData, "/sensor/timestamp", String(millis()));
  
  delay(4000);
}
```

### Step 3: Update Backend to Read from Firebase

Install Firebase Admin SDK:
```bash
npm install firebase-admin
```

Update backend to read from Firebase instead of polling ESP32.

---

## Option 4: Use MQTT Broker

### Step 1: Set Up MQTT Broker

**Option A: HiveMQ Cloud (Free)**
1. Sign up: https://www.hivemq.com/cloud/
2. Create cluster
3. Get broker URL: `your-cluster.hivemq.cloud`

**Option B: Self-hosted Mosquitto**
- Install on your server
- Configure authentication

### Step 2: Update ESP32 Code

```cpp
#include <PubSubClient.h>
#include <WiFi.h>

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  client.setServer("your-cluster.hivemq.cloud", 1883);
  client.connect("ESP32Client", "username", "password");
}

void loop() {
  if (!client.connected()) {
    client.connect("ESP32Client", "username", "password");
  }
  
  String payload = "{\"flowRate\":" + String(flowRateM3Hr) + 
                   ",\"pressure\":" + String(pressure) + 
                   ",\"waterLoss\":" + String(waterLoss) + "}";
  
  client.publish("sensor/data", payload.c_str());
  delay(4000);
}
```

### Step 3: Update Backend to Subscribe to MQTT

```bash
npm install mqtt
```

```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://your-cluster.hivemq.cloud');

client.on('connect', () => {
  client.subscribe('sensor/data');
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  // Update sensorData with received data
});
```

---

## 🔒 Security Considerations

### Add Authentication

Protect your endpoint with API keys:

**Backend:**
```javascript
app.post('/api/sensor/data', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Process data...
});
```

**ESP32:**
```cpp
http.addHeader("X-API-Key", "your-secret-api-key");
```

### Use HTTPS

- Always use HTTPS for production
- ESP32 supports HTTPS (use `https://` in URL)
- For self-signed certificates, you may need to add certificate validation

---

## 📋 Quick Comparison

| Method | Setup Difficulty | Cost | Best For |
|--------|-----------------|------|----------|
| **Cloud Deployment** | Medium | Free-$5/mo | Production |
| **ngrok** | Easy | Free/Paid | Testing |
| **Firebase** | Medium | Free tier | Real-time apps |
| **MQTT** | Medium | Free tier | IoT projects |

---

## 🚀 Recommended Setup for Production

1. **Deploy backend to Railway/Render** (easiest)
2. **Update ESP32 to POST to your deployed URL**
3. **Add API key authentication**
4. **Use HTTPS**
5. **Monitor server logs**

---

## 📝 Step-by-Step: Railway Deployment

### 1. Prepare Your Code

Make sure `server/index.js` has the POST endpoint (see Option 1, Step 2).

### 2. Create railway.json (Optional)

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. Deploy to Railway

1. Go to https://railway.app
2. **New Project** → **Deploy from GitHub**
3. Select your repo
4. Railway auto-detects and deploys
5. **Settings** → **Variables:**
   - `PORT=3001`
   - `USE_MOCK_DATA=false`
6. **Settings** → **Generate Domain** (get your URL)

### 4. Update ESP32

```cpp
const char* serverURL = "https://your-app.railway.app/api/sensor/data";
```

### 5. Test

ESP32 will now send data directly to your cloud server!

---

## 🐛 Troubleshooting

### ESP32 Can't Connect to Server

- **Check URL:** Ensure it's correct and uses `https://`
- **Check WiFi:** ESP32 must be connected to internet
- **Check server:** Verify server is running and accessible
- **Check firewall:** Server must accept incoming connections

### Server Not Receiving Data

- **Check logs:** Look at server console/logs
- **Check endpoint:** Verify POST endpoint exists
- **Check CORS:** Server should allow requests from ESP32
- **Test manually:** Use Postman/curl to test endpoint

### SSL Certificate Errors

If using self-signed certificates, you may need to:
```cpp
// In ESP32 code, skip certificate validation (not recommended for production)
WiFiClientSecure client;
client.setInsecure(); // Only for testing!
```

---

## ✅ Checklist

- [ ] Backend deployed to cloud (or ngrok running)
- [ ] POST endpoint added to backend
- [ ] ESP32 code updated with server URL
- [ ] WiFi credentials set in ESP32 code
- [ ] ESP32 uploaded and running
- [ ] Server receiving data (check logs)
- [ ] Frontend fetching from same server
- [ ] Authentication added (optional but recommended)

---

That's it! Your ESP32 can now send data to a server anywhere in the world! 🌍

