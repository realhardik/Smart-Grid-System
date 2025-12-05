# Quick Start Guide - Backend Integration

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

This will install:
- Express.js (backend server)
- Axios (HTTP client for ESP32 communication)
- CORS (cross-origin support)

### 2. Start the Backend Server

**Option A: Backend only**
```bash
npm run server:dev
```

**Option B: Backend + Frontend together**
```bash
npm run dev:full
```

The backend will start on `http://localhost:3001`

### 3. Test with Mock Data

By default, the server uses mock data if it can't reach ESP32. You should see:
- Console logs showing data being fetched
- Frontend dashboard updating every 4 seconds

### 4. Connect Real ESP32

1. **Upload ESP32 code:**
   - Open `server/esp32-example.ino` in Arduino IDE
   - Update WiFi credentials
   - Upload to ESP32

2. **Find ESP32 IP:**
   - Check Serial Monitor after upload
   - Note the IP address (e.g., `192.168.1.100`)

3. **Configure backend:**
   - Create `server/.env` file:
   ```env
   ESP32_URL=http://192.168.1.100
   POLL_INTERVAL=4000
   USE_MOCK_DATA=false
   ```

4. **Restart backend:**
   - Stop the server (Ctrl+C)
   - Run `npm run server:dev` again

## 📊 How It Works

1. **Backend polls ESP32** every 3-5 seconds (configurable)
2. **ESP32 responds** with sensor data (flow rate, pressure, water loss)
3. **Backend stores** the data and serves it via API
4. **Frontend fetches** data every 4 seconds and displays it

## 🔌 ESP32 Requirements

Your ESP32 should expose a GET endpoint at `/sensor/data` returning:

```json
{
  "flowRate": 2.5,
  "pressure": 1.8,
  "waterLoss": 450
}
```

See `server/esp32-example.ino` for complete example code.

## 🎯 API Endpoints

- `GET /api/sensor/current` - Current readings
- `GET /api/sensor/history` - Historical data for charts
- `GET /api/health` - Health check

## 🐛 Troubleshooting

**Backend not starting?**
- Check if port 3001 is available
- Verify all dependencies installed: `npm install`

**No data showing?**
- Check backend console for errors
- Verify ESP32 is on same network
- Test ESP32 endpoint: `http://ESP32_IP/sensor/data`

**Frontend not updating?**
- Check browser console for errors
- Verify backend is running on port 3001
- Check Network tab for API calls

## 📝 Next Steps

1. Customize ESP32 code for your specific sensors
2. Adjust polling interval in `.env`
3. Add more sensors (temperature, pH, etc.)
4. Set up database for long-term storage
5. Add alerting for critical values

For detailed setup, see `BACKEND_SETUP.md`

