const { generateEnvironmentalData } = require('./dataGenerator');

// Simulate real-time data for WebSocket
function simulateRealTimeData(io) {
  console.log('🔄 Starting real-time data simulation...');
  
  setInterval(() => {
    try {
      // Generate current data
      const currentData = generateEnvironmentalData(0.001); // Very recent data
      
      if (currentData.length > 0) {
        const latestReading = currentData[Math.floor(Math.random() * currentData.length)];
        
        // Emit to all connected clients
        io.emit('environmental-update', {
          timestamp: new Date().toISOString(),
          location: latestReading.location_id,
          data: {
            aqi: latestReading.air_quality_index,
            pm25: latestReading.pm25,
            pm10: latestReading.pm10,
            temperature: latestReading.temperature,
            humidity: latestReading.humidity,
            noise_level: latestReading.noise_level,
            health_score: latestReading.environmental_health_score
          },
          alert: latestReading.air_quality_index > 150 ? 'HIGH_POLLUTION' : null
        });
        
        // Emit to location-specific rooms
        io.to(`location-${latestReading.location_id}`).emit('location-update', {
          location: latestReading.location_id,
          data: latestReading,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error in real-time data simulation:', error);
    }
  }, 5000); // Update every 5 seconds
  
  // Send system health updates
  setInterval(() => {
    io.emit('system-health', {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      activeConnections: io.engine.clientsCount
    });
  }, 30000); // Every 30 seconds
}

module.exports = {
  simulateRealTimeData
};