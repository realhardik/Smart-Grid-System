# Backend Server

This backend server communicates with ESP32 sensors and provides API endpoints for the dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `ESP32_URL`: IP address of your ESP32 (e.g., `http://192.168.1.100`)
- `POLL_INTERVAL`: How often to poll ESP32 in milliseconds (3000-5000 recommended)
- `PORT`: Backend server port (default: 3001)

3. Start the server:
```bash
npm run server:dev
```

## ESP32 Setup

Your ESP32 should expose a GET endpoint at `/sensor/data` that returns JSON:

```json
{
  "flowRate": 2.5,
  "pressure": 1.8,
  "waterLoss": 450
}
```

### Example ESP32 Code (Arduino)

```cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);

// Your sensor reading functions here
float readFlowRate() {
  // Read from flow sensor
  return 2.5; // Example value
}

float readPressure() {
  // Read from pressure sensor
  return 1.8; // Example value
}

int readWaterLoss() {
  // Calculate water loss
  return 450; // Example value
}

void handleSensorData() {
  String json = "{";
  json += "\"flowRate\":" + String(readFlowRate()) + ",";
  json += "\"pressure\":" + String(readPressure()) + ",";
  json += "\"waterLoss\":" + String(readWaterLoss());
  json += "}";
  
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/sensor/data", handleSensorData);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

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
- `metric` (optional): Specific metric - `flowRate`, `pressure`, `waterLoss`, or `all` (default: `all`)

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

## Testing Without ESP32

For testing, you can use the mock endpoint:
- Set `ESP32_URL=http://localhost:3001` in `.env`
- The server includes a mock endpoint at `/mock/esp32/sensor/data`

Or set `USE_MOCK_DATA=true` in `.env` to use internal mock data.

