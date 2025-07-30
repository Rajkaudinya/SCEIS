const express = require('express');
const router = express.Router();
const { generateEnvironmentalData } = require('../utils/dataGenerator');
const { calculateCorrelation } = require('../utils/mathUtils');

// Get correlation analysis
router.get('/correlations', async (req, res) => {
  try {
    const data = generateEnvironmentalData(30);
    const variables = ['pm25', 'pm10', 'co2', 'no2', 'temperature', 'humidity', 'noise_level'];
    
    const correlationMatrix = [];
    const labels = [];
    
    variables.forEach((v1, i) => {
      correlationMatrix[i] = [];
      labels.push(v1.toUpperCase());
      
      variables.forEach((v2, j) => {
        const correlation = calculateCorrelation(
          data.map(d => d[v1]),
          data.map(d => d[v2])
        );
        correlationMatrix[i][j] = correlation;
      });
    });
    
    res.json({
      matrix: correlationMatrix,
      labels: labels
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate correlations' });
  }
});

// Get pollution hotspots
router.get('/hotspots', async (req, res) => {
  try {
    const data = generateEnvironmentalData(1);
    
    // Group by location and get latest reading
    const locationData = {};
    data.forEach(d => {
      if (!locationData[d.location_id] || locationData[d.location_id].timestamp < d.timestamp) {
        locationData[d.location_id] = d;
      }
    });
    
    const hotspots = Object.values(locationData)
      .map(d => ({
        location: d.location_id,
        aqi: Number(d.air_quality_index.toFixed(1)),
        status: d.air_quality_index <= 50 ? 'Good' : 
                d.air_quality_index <= 100 ? 'Moderate' : 
                d.air_quality_index <= 150 ? 'Unhealthy for Sensitive Groups' : 
                d.air_quality_index <= 200 ? 'Unhealthy' : 'Very Unhealthy',
        zone: d.zone,
        latitude: d.latitude,
        longitude: d.longitude
      }))
      .sort((a, b) => b.aqi - a.aqi);
    
    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotspots data' });
  }
});

// Get clustering analysis
router.get('/clusters', async (req, res) => {
  try {
    const data = generateEnvironmentalData(7);
    
    // Simple clustering based on AQI and zone
    const clusteredData = data.map(d => ({
      ...d,
      cluster: d.air_quality_index > 100 ? 'High Pollution' :
               d.air_quality_index > 50 ? 'Moderate Pollution' :
               d.green_space_ratio > 0.3 ? 'Green Zone' : 'Low Pollution'
    }));
    
    // Group by cluster
    const clusters = {};
    clusteredData.forEach(d => {
      if (!clusters[d.cluster]) {
        clusters[d.cluster] = [];
      }
      clusters[d.cluster].push({
        x: d.pm25,
        y: d.environmental_health_score,
        location: d.location_id,
        zone: d.zone
      });
    });
    
    res.json(clusters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform clustering analysis' });
  }
});

// Get zone-wise analysis
router.get('/zones', async (req, res) => {
  try {
    const data = generateEnvironmentalData(7);
    
    // Group by zone
    const zoneData = {};
    data.forEach(d => {
      if (!zoneData[d.zone]) {
        zoneData[d.zone] = [];
      }
      zoneData[d.zone].push(d);
    });
    
    const zoneAnalysis = Object.entries(zoneData).map(([zone, readings]) => ({
      zone,
      avgAQI: readings.reduce((sum, r) => sum + r.air_quality_index, 0) / readings.length,
      avgHealthScore: readings.reduce((sum, r) => sum + r.environmental_health_score, 0) / readings.length,
      avgPM25: readings.reduce((sum, r) => sum + r.pm25, 0) / readings.length,
      avgPM10: readings.reduce((sum, r) => sum + r.pm10, 0) / readings.length,
      avgNoise: readings.reduce((sum, r) => sum + r.noise_level, 0) / readings.length,
      dataPoints: readings.length
    }));
    
    res.json(zoneAnalysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform zone analysis' });
  }
});

module.exports = router;