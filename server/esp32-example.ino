/*
 * ESP32 Water Flow Sensor Example
 * 
 * This code reads data from a water flow sensor and serves it via HTTP
 * Connect your flow sensor to a digital pin (e.g., GPIO 4)
 * 
 * Required Libraries:
 * - WiFi (built-in)
 * - WebServer (built-in)
 * - ArduinoJson (install via Library Manager)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Flow sensor pin
const int FLOW_SENSOR_PIN = 4;

// Flow sensor variables
volatile int flowPulseCount = 0;
unsigned long lastTime = 0;
float flowRate = 0.0;        // Flow rate in L/min
float totalFlow = 0.0;        // Total flow in liters
float calibrationFactor = 4.5; // Adjust based on your sensor (pulses per liter)

// Water pressure sensor (if using analog pressure sensor)
const int PRESSURE_SENSOR_PIN = A0;
float pressure = 0.0; // Pressure in Bar

// Web server on port 80
WebServer server(80);

// Interrupt service routine for flow sensor
void IRAM_ATTR pulseCounter() {
  flowPulseCount++;
}

// Read flow rate
float readFlowRate() {
  unsigned long currentTime = millis();
  unsigned long timeDiff = currentTime - lastTime;
  
  if (timeDiff >= 1000) { // Calculate every second
    // Calculate flow rate: (pulses / calibration factor) / time in minutes
    flowRate = ((1000.0 / timeDiff) * flowPulseCount) / calibrationFactor;
    totalFlow += flowRate / 60.0; // Add to total (convert L/min to L/sec, then add)
    
    flowPulseCount = 0;
    lastTime = currentTime;
  }
  
  return flowRate;
}

// Read pressure from analog sensor
float readPressure() {
  int sensorValue = analogRead(PRESSURE_SENSOR_PIN);
  // Convert analog reading to pressure (Bar)
  // Adjust these values based on your sensor specifications
  // Example: 0-5V sensor, 0.5V = 0 Bar, 4.5V = 5 Bar
  pressure = (sensorValue / 4095.0) * 5.0; // ESP32 has 12-bit ADC (0-4095)
  return pressure;
}

// Calculate water loss (simplified - you may want more sophisticated logic)
int calculateWaterLoss() {
  // This is a simplified calculation
  // In a real system, you'd compare expected vs actual flow
  // For now, we'll use a simple threshold-based approach
  if (flowRate < 0.1 && pressure < 1.0) {
    // Potential leak detected
    return (int)(totalFlow * 0.1); // Estimate 10% loss
  }
  return 0;
}

// Handle sensor data request
void handleSensorData() {
  // Read current sensor values
  float currentFlowRate = readFlowRate();
  float currentPressure = readPressure();
  int waterLoss = calculateWaterLoss();
  
  // Convert flow rate from L/min to M³/hr
  float flowRateM3Hr = (currentFlowRate * 60.0) / 1000.0;
  
  // Create JSON response
  StaticJsonDocument<200> doc;
  doc["flowRate"] = flowRateM3Hr;
  doc["pressure"] = currentPressure;
  doc["waterLoss"] = waterLoss;
  
  String jsonResponse;
  serializeJson(doc, jsonResponse);
  
  server.send(200, "application/json", jsonResponse);
  
  // Debug output
  Serial.print("Flow Rate: ");
  Serial.print(flowRateM3Hr);
  Serial.print(" M³/hr, Pressure: ");
  Serial.print(currentPressure);
  Serial.print(" Bar, Water Loss: ");
  Serial.print(waterLoss);
  Serial.println(" L");
}

// Handle root
void handleRoot() {
  server.send(200, "text/plain", "ESP32 Water Flow Sensor - Use /sensor/data endpoint");
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
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Setup web server routes
  server.on("/", handleRoot);
  server.on("/sensor/data", handleSensorData);
  
  server.begin();
  Serial.println("HTTP server started");
  Serial.println("Access sensor data at: http://" + WiFi.localIP().toString() + "/sensor/data");
}

void loop() {
  server.handleClient();
  
  // Update sensor readings periodically
  readFlowRate();
  readPressure();
  
  delay(100);
}

