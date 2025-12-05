# Quick Setup: ESP32 to Remote Server

## 🚀 Fastest Method: Deploy to Railway (5 minutes)

### Step 1: Deploy Backend

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Select your repository**
5. **Settings** → **Variables:**
   ```
   PORT=3001
   USE_MOCK_DATA=false
   ```
6. **Settings** → **Generate Domain** → Copy your URL
   - Example: `https://smart-water-grid-production.up.railway.app`

### Step 2: Update ESP32 Code

1. **Open:** `server/esp32-remote-server.ino`
2. **Update:**
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverURL = "https://your-app.railway.app/api/sensor/data";
   ```
3. **Upload to ESP32**

### Step 3: Test

ESP32 will send data every 4 seconds to your cloud server!

---

## 🧪 Quick Test: ngrok (2 minutes)

### Step 1: Install ngrok

```bash
# Mac
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start Backend

```bash
npm run server:dev
```

### Step 3: Create Tunnel

```bash
ngrok http 3001
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 4: Update ESP32

```cpp
const char* serverURL = "https://abc123.ngrok.io/api/sensor/data";
```

### Step 5: Upload and Test

**Note:** URL changes when you restart ngrok. Use Railway for permanent solution.

---

## 📋 What Changed?

### Old Method (Same WiFi):
- Backend **polls** ESP32 every 4 seconds
- ESP32 runs HTTP server
- Both must be on same network

### New Method (Remote):
- ESP32 **pushes** data to server every 4 seconds
- ESP32 makes HTTP POST requests
- Works from anywhere with internet

---

## ✅ Checklist

- [ ] Backend deployed (Railway/ngrok/etc.)
- [ ] POST endpoint working (`/api/sensor/data`)
- [ ] ESP32 code updated with server URL
- [ ] WiFi credentials set
- [ ] Code uploaded to ESP32
- [ ] Data flowing to server (check logs)

---

## 🔍 Verify It's Working

1. **Check server logs** - Should see:
   ```
   [10:30:15] Data received via POST: Flow=2.5 M³/hr, Pressure=1.8 Bar
   ```

2. **Test endpoint:**
   ```bash
   curl https://your-server.com/api/sensor/current
   ```

3. **Check frontend** - Should show real-time data

---

That's it! Your ESP32 can now send data to any server in the world! 🌍

