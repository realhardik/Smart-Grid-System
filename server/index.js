const express = require('express');
const cors = require('cors');
const http = require('http');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const ESP32_URL = process.env.ESP32_URL || 'http://192.168.1.100'; // Change to your ESP32 IP
const POLL_INTERVAL = process.env.POLL_INTERVAL || 4000; // 4 seconds (between 3-5)
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || false;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (in production, use a database)
let sensorData = {
  flowRate: 0, // M³/hr
  pressure: 0, // Bar
  waterLoss: 0, // Liters
  timestamp: new Date().toISOString(),
  history: [], // Store last 24 hours of data
};

// Function to generate mock data (for testing)
function generateMockData() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  // Generate realistic mock data with some variation
  const baseFlowRate = 1.5 + Math.sin(Date.now() / 10000) * 0.5;
  const basePressure = 1.8 + Math.cos(Date.now() / 15000) * 0.2;
  
  sensorData = {
    flowRate: parseFloat((baseFlowRate + (Math.random() - 0.5) * 0.3).toFixed(2)),
    pressure: parseFloat((basePressure + (Math.random() - 0.5) * 0.1).toFixed(2)),
    waterLoss: Math.floor(sensorData.waterLoss + (Math.random() * 5)),
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
  
  console.log(`[${timeString}] Mock data: Flow=${sensorData.flowRate} M³/hr, Pressure=${sensorData.pressure} Bar`);
}

// Function to fetch data from ESP32
async function fetchDataFromESP32() {
  if (USE_MOCK_DATA) {
    generateMockData();
    return;
  }
  
  try {
    const response = await axios.get(`${ESP32_URL}/sensor/data`, {
      timeout: 2000, // 2 second timeout
    });
    
    if (response.data) {
      // Update sensor data
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      sensorData = {
        flowRate: parseFloat((response.data.flowRate || response.data.flow_rate || 0).toFixed(2)),
        pressure: parseFloat((response.data.pressure || 0).toFixed(2)),
        waterLoss: parseInt(response.data.waterLoss || response.data.water_loss || 0),
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
      
      // Keep only last 1000 entries to prevent memory issues
      if (sensorData.history.length > 1000) {
        sensorData.history = sensorData.history.slice(-1000);
      }
      
      console.log(`[${timeString}] Data fetched: Flow=${sensorData.flowRate} M³/hr, Pressure=${sensorData.pressure} Bar`);
    }
  } catch (error) {
    console.error('Error fetching data from ESP32:', error.message);
    // If ESP32 is unreachable and we don't have mock data, generate mock data as fallback
    if (!USE_MOCK_DATA) {
      console.log('ESP32 unreachable, using mock data as fallback');
      generateMockData();
    }
  }
}

// Start polling ESP32
setInterval(fetchDataFromESP32, POLL_INTERVAL);

// Initial fetch
fetchDataFromESP32();

// API Routes

// Get current sensor data
app.get('/api/sensor/current', (req, res) => {
  res.json({
    success: true,
    data: {
      flowRate: sensorData.flowRate,
      pressure: sensorData.pressure,
      waterLoss: sensorData.waterLoss,
      timestamp: sensorData.timestamp,
    },
  });
});

// Get sensor data history (for charts)
app.get('/api/sensor/history', (req, res) => {
  const { hours = 24, metric = 'all' } = req.query;
  
  // Filter history by time (last N hours)
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  const filteredHistory = sensorData.history.filter(
    (entry) => new Date(entry.timestamp) >= cutoffTime
  );
  
  // Sample data for chart (reduce to reasonable number of points)
  const sampleSize = Math.min(filteredHistory.length, 100);
  const step = Math.max(1, Math.floor(filteredHistory.length / sampleSize));
  const sampled = filteredHistory.filter((_, index) => index % step === 0);
  
  if (metric === 'flowRate') {
    res.json({
      success: true,
      data: sampled.map((entry) => ({
        time: entry.time,
        value: entry.flowRate,
      })),
    });
  } else if (metric === 'pressure') {
    res.json({
      success: true,
      data: sampled.map((entry) => ({
        time: entry.time,
        value: entry.pressure,
      })),
    });
  } else if (metric === 'waterLoss') {
    res.json({
      success: true,
      data: sampled.map((entry) => ({
        time: entry.time,
        value: entry.waterLoss,
      })),
    });
  } else {
    res.json({
      success: true,
      data: sampled,
    });
  }
});

// Receive data from ESP32 (POST endpoint for remote servers)
app.post('/api/sensor/data', (req, res) => {
  try {
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
    
    console.log(`[${timeString}] Data received via POST: Flow=${sensorData.flowRate} M³/hr, Pressure=${sensorData.pressure} Bar`);
    
    res.json({ 
      success: true, 
      message: 'Data received',
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Error processing POST data:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Invalid data format' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    esp32Connected: sensorData.timestamp ? 
      (Date.now() - new Date(sensorData.timestamp).getTime() < 10000) : false,
  });
});

// Mock ESP32 endpoint for testing (remove in production)
app.get('/mock/esp32/sensor/data', (req, res) => {
  // Generate mock sensor data
  const mockData = {
    flowRate: (Math.random() * 3).toFixed(2), // 0-3 M³/hr
    pressure: (1.5 + Math.random() * 0.5).toFixed(2), // 1.5-2.0 Bar
    waterLoss: Math.floor(Math.random() * 1000), // 0-1000 Liters
  };
  res.json(mockData);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  if (USE_MOCK_DATA) {
    console.log(`🎭 Using MOCK DATA (set USE_MOCK_DATA=false to use real ESP32)`);
  } else {
    console.log(`📡 Polling ESP32 at ${ESP32_URL} every ${POLL_INTERVAL}ms`);
  }
  console.log(`💡 API endpoints:`);
  console.log(`   - GET /api/sensor/current - Current sensor readings`);
  console.log(`   - GET /api/sensor/history - Historical data`);
  console.log(`   - GET /api/health - Health check`);
});

