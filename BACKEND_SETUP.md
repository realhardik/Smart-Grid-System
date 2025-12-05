# Backend Setup Guide

This guide will help you set up the backend server to communicate with your ESP32 water flow sensor.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start the backend server:**
```bash
npm run server:dev
```

The server will start on `http://localhost:3001` and begin polling for sensor data.

## Configuration

### Environment Variables

Create a `.env` file in the `server/` directory (or use the example):

```env
PORT=3001
ESP32_URL=http://192.168.1.100
POLL_INTERVAL=4000
USE_MOCK_DATA=false
```

- **PORT**: Backend server port (default: 3001)
- **ESP32_URL**: IP address of your ESP32 device
- **POLL_INTERVAL**: How often to poll ESP32 in milliseconds (3000-5000 recommended)
- **USE_MOCK_DATA**: Set to `true` to use mock data instead of real ESP32

### Testing Without ESP32

To test without a physical ESP32:

1. Set `USE_MOCK_DATA=true` in your `.env` file, OR
2. The server includes a mock endpoint at `/mock/esp32/sensor/data`

## ESP32 Setup

### Hardware Connections

- **Flow Sensor**: Connect to a digital pin (e.g., GPIO 4)
- **Pressure Sensor** (optional): Connect to an analog pin (e.g., A0)

### Software Setup

1. **Install Arduino IDE** and ESP32 board support
2. **Install required libraries:**
   - ArduinoJson (via Library Manager)

3. **Upload the code:**
   - Open `server/esp32-example.ino` in Arduino IDE
   - Update WiFi credentials
   - Adjust sensor pins and calibration factors
   - Upload to ESP32

4. **Find ESP32 IP address:**
   - Check Serial Monitor after upload
   - Or check your router's connected devices

5. **Update backend config:**
   - Set `ESP32_URL` in `.env` to your ESP32's IP address

### ESP32 API Endpoint

Your ESP32 should expose a GET endpoint at `/sensor/data` that returns:

```json
{
  "flowRate": 2.5,
  "pressure": 1.8,
  "waterLoss": 450
}
```

Where:
- `flowRate`: Flow rate in M³/hr
- `pressure`: Pressure in Bar
- `waterLoss`: Water loss in Liters

## API Endpoints

### GET /api/sensor/current

Get current sensor readings.

**Response:**
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

### GET /api/sensor/history

Get historical sensor data for charts.

**Query Parameters:**
- `hours` (optional): Number of hours of history (default: 24)
- `metric` (optional): `flowRate`, `pressure`, `waterLoss`, or `all` (default: `all`)

**Example:**
```
GET /api/sensor/history?metric=flowRate&hours=24
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "10:30",
      "value": 2.5
    }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "running",
  "esp32Connected": true
}
```

## Frontend Integration

The frontend automatically connects to the backend at `http://localhost:3001`.

To change the API URL, set the environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Or update it in `components/metrics-panel.tsx`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
```

## Running Everything Together

### Development Mode

Run both frontend and backend:

```bash
npm run dev:full
```

This starts:
- Backend server on port 3001
- Next.js dev server on port 3000

### Production Mode

1. **Start backend:**
```bash
npm run server:start
```

2. **Start frontend:**
```bash
npm run build
npm run start
```

## Troubleshooting

### ESP32 Not Connecting

1. **Check IP address:** Verify ESP32 is on the same network
2. **Check Serial Monitor:** Look for connection errors
3. **Test endpoint:** Open `http://ESP32_IP/sensor/data` in browser
4. **Check firewall:** Ensure port 80 is accessible

### Backend Can't Reach ESP32

1. **Verify ESP32_URL:** Check it's correct in `.env`
2. **Test connectivity:** `ping ESP32_IP` from terminal
3. **Check ESP32 code:** Ensure `/sensor/data` endpoint exists
4. **Use mock data:** Set `USE_MOCK_DATA=true` to test without ESP32

### Frontend Not Showing Data

1. **Check backend:** Verify backend is running on port 3001
2. **Check API URL:** Verify `NEXT_PUBLIC_API_URL` is set correctly
3. **Check browser console:** Look for CORS or fetch errors
4. **Check network tab:** Verify API calls are being made

## Next Steps

- Add database storage (MongoDB, PostgreSQL, etc.)
- Add authentication
- Add WebSocket support for real-time updates
- Add data export functionality
- Add alerting system

