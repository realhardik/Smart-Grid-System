# ESP32 to Server Communication - Step-by-Step Guide

This guide will walk you through the complete process of sending sensor data from your ESP32 to the backend server.

## 📋 Prerequisites

- ESP32 development board
- Water flow sensor (or any sensor you want to use)
- Arduino IDE installed
- USB cable to connect ESP32 to computer
- WiFi network credentials

---

## Step 1: Install Arduino IDE and ESP32 Support

### 1.1 Download Arduino IDE
- Go to https://www.arduino.cc/en/software
- Download and install Arduino IDE

### 1.2 Add ESP32 Board Support
1. Open Arduino IDE
2. Go to **File → Preferences**
3. In "Additional Board Manager URLs", add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Click **OK**
5. Go to **Tools → Board → Boards Manager**
6. Search for "ESP32"
7. Install "esp32" by Espressif Systems
8. Wait for installation to complete

### 1.3 Install Required Library
1. Go to **Tools → Manage Libraries**
2. Search for "ArduinoJson"
3. Install "ArduinoJson" by Benoit Blanchon (version 6.x or 7.x)

---

## Step 2: Prepare Your ESP32 Code

### 2.1 Open the Example Code
1. Open Arduino IDE
2. Go to **File → Open**
3. Navigate to your project folder
4. Open `server/esp32-example.ino`

### 2.2 Update WiFi Credentials
Find these lines in the code (around line 15-16):
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

Replace with your actual WiFi credentials:
```cpp
const char* ssid = "MyWiFiNetwork";
const char* password = "MyPassword123";
```

### 2.3 Configure Sensor Pins
If your sensors are connected to different pins, update these lines:
```cpp
const int FLOW_SENSOR_PIN = 4;      // Change if needed
const int PRESSURE_SENSOR_PIN = A0;  // Change if needed
```

### 2.4 Adjust Calibration Factor
If you're using a different flow sensor, adjust the calibration factor:
```cpp
float calibrationFactor = 4.5; // Pulses per liter - adjust for your sensor
```

**How to find calibration factor:**
- Check your sensor's datasheet
- Or measure: count pulses for 1 liter of water, use that number

---

## Step 3: Connect Your Hardware

### 3.1 Connect Flow Sensor
- **VCC** → ESP32 **3.3V** or **5V** (check sensor specs)
- **GND** → ESP32 **GND**
- **Signal** → ESP32 **GPIO 4** (or your chosen pin)

### 3.2 Connect Pressure Sensor (Optional)
- **VCC** → ESP32 **3.3V**
- **GND** → ESP32 **GND**
- **Signal** → ESP32 **A0** (analog pin)

### 3.3 Connect ESP32 to Computer
- Connect ESP32 to computer via USB cable

---

## Step 4: Upload Code to ESP32

### 4.1 Select Board and Port
1. In Arduino IDE, go to **Tools → Board**
2. Select **ESP32 Dev Module** (or your specific ESP32 board)
3. Go to **Tools → Port**
4. Select the COM port where ESP32 is connected
   - On Mac: Usually `/dev/cu.usbserial-*` or `/dev/cu.SLAB_USBtoUART`
   - On Windows: Usually `COM3`, `COM4`, etc.

### 4.2 Configure Board Settings
Go to **Tools** and set:
- **Upload Speed**: 115200
- **CPU Frequency**: 240MHz (or 80MHz)
- **Flash Frequency**: 80MHz
- **Flash Size**: 4MB (or your board's size)
- **Partition Scheme**: Default

### 4.3 Upload Code
1. Click the **Upload** button (→ arrow icon) or press **Ctrl+U** (Windows) / **Cmd+U** (Mac)
2. Wait for compilation and upload
3. You should see "Done uploading" message

---

## Step 5: Find Your ESP32's IP Address

### 5.1 Open Serial Monitor
1. In Arduino IDE, click **Tools → Serial Monitor**
2. Set baud rate to **115200** (bottom right)
3. Press the **Reset** button on your ESP32

### 5.2 Read the Output
You should see something like:
```
Connecting to WiFi: MyWiFiNetwork
........
WiFi connected!
IP address: 
192.168.1.100
HTTP server started
Access sensor data at: http://192.168.1.100/sensor/data
```

**Write down the IP address** (e.g., `192.168.1.100`)

### 5.3 Test the ESP32 Endpoint
1. Open a web browser
2. Go to: `http://YOUR_ESP32_IP/sensor/data`
   - Example: `http://192.168.1.100/sensor/data`
3. You should see JSON data like:
   ```json
   {"flowRate":2.5,"pressure":1.8,"waterLoss":450}
   ```

If you see this, your ESP32 is working correctly! ✅

---

## Step 6: Configure the Backend Server

### 6.1 Create Environment File
1. Navigate to your project folder
2. Go to the `server` folder
3. Create a file named `.env`

### 6.2 Add Configuration
Open `.env` and add:
```env
PORT=3001
ESP32_URL=http://192.168.1.100
POLL_INTERVAL=4000
USE_MOCK_DATA=false
```

**Important:** Replace `192.168.1.100` with your ESP32's actual IP address!

### 6.3 Save the File
Save the `.env` file in the `server` folder

---

## Step 7: Start the Backend Server

### 7.1 Install Dependencies (if not done)
Open terminal in your project folder and run:
```bash
npm install
```

### 7.2 Start the Server
Run:
```bash
npm run server:dev
```

### 7.3 Verify Connection
You should see in the console:
```
🚀 Backend server running on http://localhost:3001
📡 Polling ESP32 at http://192.168.1.100 every 4000ms
💡 API endpoints:
   - GET /api/sensor/current - Current sensor readings
   - GET /api/sensor/history - Historical data
   - GET /api/health - Health check
```

And then every 4 seconds:
```
[10:30:15] Data fetched: Flow=2.5 M³/hr, Pressure=1.8 Bar
```

---

## Step 8: Test the Complete System

### 8.1 Test Backend API
Open a browser and go to:
- `http://localhost:3001/api/sensor/current`

You should see:
```json
{
  "success": true,
  "data": {
    "flowRate": 2.5,
    "pressure": 1.8,
    "waterLoss": 450,
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

### 8.2 Start Frontend
In a new terminal, run:
```bash
npm run dev
```

### 8.3 View Dashboard
1. Open browser to `http://localhost:3000`
2. You should see the dashboard with **real-time data** updating every 4 seconds!

---

## 🔧 Troubleshooting

### Problem: ESP32 won't connect to WiFi

**Solutions:**
- Check WiFi credentials are correct
- Ensure ESP32 is within WiFi range
- Check if WiFi uses 2.4GHz (ESP32 doesn't support 5GHz)
- Try restarting ESP32

### Problem: Can't find ESP32 IP address

**Solutions:**
- Check Serial Monitor output
- Make sure Serial Monitor baud rate is 115200
- Press Reset button on ESP32
- Check router's connected devices list

### Problem: Backend can't reach ESP32

**Solutions:**
1. **Test ESP32 directly:**
   - Open browser: `http://ESP32_IP/sensor/data`
   - If this works, ESP32 is fine

2. **Check network:**
   - Ensure ESP32 and computer are on same WiFi network
   - Ping ESP32: `ping 192.168.1.100` (use your IP)

3. **Check firewall:**
   - Temporarily disable firewall to test
   - Allow Node.js through firewall

4. **Check ESP32_URL:**
   - Verify IP address in `.env` is correct
   - No trailing slash: `http://192.168.1.100` (not `http://192.168.1.100/`)

### Problem: No data showing on dashboard

**Solutions:**
1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify backend is running on port 3001
4. Test API directly: `http://localhost:3001/api/sensor/current`
5. Check Network tab in browser DevTools

### Problem: ESP32 resets or crashes

**Solutions:**
- Check power supply (use good USB cable)
- Add delay in code if reading sensors too fast
- Check for short circuits
- Reduce WiFi transmit power in code

---

## 📊 Data Flow Diagram

```
ESP32                    Backend Server              Frontend
  │                           │                         │
  │  (reads sensors)          │                         │
  │                           │                         │
  │  ────────────────────────>│  (HTTP GET request)     │
  │  /sensor/data             │                         │
  │                           │                         │
  │  <────────────────────────│  (JSON response)        │
  │  {"flowRate": 2.5, ...}   │                         │
  │                           │                         │
  │                           │  ─────────────────────>│  (fetch every 4s)
  │                           │  /api/sensor/current    │
  │                           │                         │
  │                           │  <───────────────────── │  (JSON response)
  │                           │  {success: true, ...}   │
  │                           │                         │
  │                           │                         │  (displays data)
```

---

## 🎯 Quick Checklist

- [ ] Arduino IDE installed
- [ ] ESP32 board support added
- [ ] ArduinoJson library installed
- [ ] WiFi credentials updated in code
- [ ] Sensors connected to ESP32
- [ ] Code uploaded to ESP32
- [ ] ESP32 IP address noted
- [ ] ESP32 endpoint tested in browser
- [ ] Backend `.env` file created with ESP32 IP
- [ ] Backend server started
- [ ] Backend can fetch data from ESP32
- [ ] Frontend showing real-time data

---

## 🚀 Next Steps

Once everything is working:

1. **Add more sensors** - Temperature, pH, etc.
2. **Improve data accuracy** - Calibrate sensors properly
3. **Add data logging** - Store data in database
4. **Add alerts** - Notify when values exceed thresholds
5. **Optimize power** - Use deep sleep for battery operation

---

## 📝 Example ESP32 Response Format

Your ESP32 should return JSON in this format:

```json
{
  "flowRate": 2.5,
  "pressure": 1.8,
  "waterLoss": 450
}
```

Where:
- `flowRate`: Flow rate in **M³/hr** (cubic meters per hour)
- `pressure`: Pressure in **Bar**
- `waterLoss`: Water loss in **Liters**

The backend automatically converts and stores this data for the frontend to display.

---

## 💡 Tips

1. **Static IP for ESP32:** Consider setting a static IP in your router so the IP doesn't change
2. **Watch Serial Monitor:** Keep it open to see what's happening
3. **Test incrementally:** Test ESP32 first, then backend, then frontend
4. **Use mock data:** Set `USE_MOCK_DATA=true` to test without ESP32
5. **Check logs:** Backend console shows every data fetch

---

That's it! Your ESP32 should now be sending data to your server every 3-5 seconds! 🎉

