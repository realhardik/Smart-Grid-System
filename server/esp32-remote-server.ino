/*
 * ESP32 Water Flow Sensor - Remote Server Example
 * 
 * This code sends sensor data to a remote server (not on same WiFi)
 * The ESP32 makes HTTP POST requests to your backend server
 * 
 * Required Libraries:
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 * - ArduinoJson (install via Library Manager)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials (ESP32's local network)
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Remote server configuration
// Option 1: Your deployed backend server URL
const char* serverURL = "https://your-backend-server.com/api/sensor/data";
// Option 2: ngrok tunnel URL (for testing)
// const char* serverURL = "https://abc123.ngrok.io/api/sensor/data";
// Option 3: Cloud service endpoint
// const char* serverURL = "https://your-firebase-project.firebaseio.com/sensor.json";

// Flow sensor pin
const int FLOW_SENSOR_PIN = 4;

// Flow sensor variables
volatile int flowPulseCount = 0;
unsigned long lastTime = 0;
float flowRate = 0.0;        // Flow rate in L/min
float totalFlow = 0.0;        // Total flow in liters
float calibrationFactor = 4.5; // Adjust based on your sensor

// Water pressure sensor (if using analog pressure sensor)
const int PRESSURE_SENSOR_PIN = A0;
float pressure = 0.0; // Pressure in Bar

// Data sending interval (milliseconds)
const unsigned long SEND_INTERVAL = 4000; // 4 seconds
unsigned long lastSendTime = 0;

// Interrupt service routine for flow sensor
void IRAM_ATTR pulseCounter() {
  flowPulseCount++;
}

// Read flow rate
float readFlowRate() {
  unsigned long currentTime = millis();
  unsigned long timeDiff = currentTime - lastTime;
  
  if (timeDiff >= 1000) { // Calculate every second
    flowRate = ((1000.0 / timeDiff) * flowPulseCount) / calibrationFactor;
    totalFlow += flowRate / 60.0;
    
    flowPulseCount = 0;
    lastTime = currentTime;
  }
  
  return flowRate;
}

// Read pressure from analog sensor
float readPressure() {
  int sensorValue = analogRead(PRESSURE_SENSOR_PIN);
  pressure = (sensorValue / 4095.0) * 5.0; // ESP32 has 12-bit ADC
  return pressure;
}

// Calculate water loss (simplified)
int calculateWaterLoss() {
  if (flowRate < 0.1 && pressure < 1.0) {
    return (int)(totalFlow * 0.1);
  }
  return 0;
}

// Send data to remote server
void sendDataToServer(float flowRate, float pressure, int waterLoss) {
  // Convert flow rate from L/min to M³/hr
  float flowRateM3Hr = (flowRate * 60.0) / 1000.0;
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["flowRate"] = flowRateM3Hr;
  doc["pressure"] = pressure;
  doc["waterLoss"] = waterLoss;
  doc["timestamp"] = millis(); // Or use actual timestamp if you have RTC
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  // Create HTTP client
  HTTPClient http;
  
  // Configure target URL
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  
  // Optional: Add authentication header if your server requires it
  // http.addHeader("Authorization", "Bearer YOUR_API_KEY");
  
  // Send POST request
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.print("Response: ");
    Serial.println(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Failed to send data to server");
  }
  
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize flow sensor pin
  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
  
  // Initialize pressure sensor pin
  pinMode(PRESSURE_SENSOR_PIN, INPUT);
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Sending data to: ");
    Serial.println(serverURL);
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed!");
    Serial.println("Please check your credentials and try again.");
  }
  
  lastTime = millis();
  lastSendTime = millis();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.begin(ssid, password);
    delay(5000);
    return;
  }
  
  // Read sensor values
  float currentFlowRate = readFlowRate();
  float currentPressure = readPressure();
  int waterLoss = calculateWaterLoss();
  
  // Send data to server at specified interval
  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    Serial.print("Sending data - Flow: ");
    Serial.print((currentFlowRate * 60.0) / 1000.0);
    Serial.print(" M³/hr, Pressure: ");
    Serial.print(currentPressure);
    Serial.print(" Bar, Water Loss: ");
    Serial.print(waterLoss);
    Serial.println(" L");
    
    sendDataToServer(currentFlowRate, currentPressure, waterLoss);
    
    lastSendTime = currentTime;
  }
  
  delay(100);
}

