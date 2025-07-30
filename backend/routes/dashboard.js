const express = require('express');
const router = express.Router();
const { generateEnvironmentalData, calculateMetrics } = require('../utils/dataGenerator');

// Get current dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const data = generateEnvironmentalData(1); // Last 1 day
    const metrics = calculateMetrics(data);
    
    const avgAQI = data.reduce((sum, d) => sum + d.air_quality_index, 0) / data.length;
    const uniqueLocations = [...new Set(data.map(d => d.location_id))].length;
    const avgHealthScore = data.reduce((sum, d) => sum + d.environmental_health_score, 0) / data.length;
    const hotspots = data.filter(d => d.air_quality_index > 100).length;
    
    res.json({
      avgAQI: Number(avgAQI.toFixed(1)),
      locationsMonitored: uniqueLocations,
      healthScore: Number(avgHealthScore.toFixed(1)),
      pollutionHotspots: hotspots,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Get locations list
router.get('/locations', async (req, res) => {
  try {
    const locations = [];
    
    // Generate 50 sample locations
    for (let i = 0; i < 50; i++) {
      locations.push({
        id: `LOC_${i.toString().padStart(3, '0')}`,
        name: `Station ${i + 1}`,
        latitude: 12.9716 + (Math.random() - 0.5) * 0.2,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.2,
        zone: ['residential', 'commercial', 'industrial', 'green'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.1 ? 'active' : 'inactive'
      });
    }
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get historical data for trends
router.get('/trends', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = generateEnvironmentalData(days);
    
    // Group data by day and calculate daily averages
    const dailyData = {};
    
    data.forEach(d => {
      const date = d.timestamp.toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date: d.timestamp,
          readings: []
        };
      }
      dailyData[date].readings.push(d);
    });
    
    const trends = Object.values(dailyData).map(day => ({
      date: day.date,
      avgAQI: day.readings.reduce((sum, r) => sum + r.air_quality_index, 0) / day.readings.length,
      avgPM25: day.readings.reduce((sum, r) => sum + r.pm25, 0) / day.readings.length,
      avgPM10: day.readings.reduce((sum, r) => sum + r.pm10, 0) / day.readings.length,
      avgHealthScore: day.readings.reduce((sum, r) => sum + r.environmental_health_score, 0) / day.readings.length
    }));
    
    res.json(trends.sort((a, b) => new Date(a.date) - new Date(b.date)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends data' });
  }
});

module.exports = router;