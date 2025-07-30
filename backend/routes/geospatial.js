const express = require('express');
const router = express.Router();
const { generateEnvironmentalData } = require('../utils/dataGenerator');

// Get heatmap data for pollution visualization
router.get('/heatmap', async (req, res) => {
  try {
    const data = generateEnvironmentalData(1);
    
    // Get latest reading for each location
    const locationData = {};
    data.forEach(d => {
      if (!locationData[d.location_id] || locationData[d.location_id].timestamp < d.timestamp) {
        locationData[d.location_id] = d;
      }
    });
    
    const heatmapData = Object.values(locationData).map(d => ({
      lat: d.latitude,
      lng: d.longitude,
      intensity: d.air_quality_index / 200, // Normalize to 0-1
      value: Math.round(d.air_quality_index),
      location: d.location_id,
      zone: d.zone
    }));
    
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate heatmap data' });
  }
});

// Get scatter plot data for environmental vs economic indicators
router.get('/scatter-analysis', async (req, res) => {
  try {
    const data = generateEnvironmentalData(7);
    
    // Simulate economic indicators based on zone
    const economicMultipliers = {
      'residential': 1.0,
      'commercial': 1.5,
      'industrial': 2.0,
      'green': 0.8
    };
    
    const scatterData = data.map(d => ({
      x: d.environmental_health_score,
      y: (economicMultipliers[d.zone] || 1.0) * 50000 + Math.random() * 30000, // GDP per capita simulation
      zone: d.zone,
      location: d.location_id,
      aqi: d.air_quality_index
    }));
    
    res.json(scatterData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate scatter analysis' });
  }
});

// Get radar chart data for location comparison
router.get('/radar-comparison', async (req, res) => {
  try {
    const locations = req.query.locations ? req.query.locations.split(',') : ['LOC_001', 'LOC_002', 'LOC_003'];
    const data = generateEnvironmentalData(7);
    
    const comparisonData = locations.map(locationId => {
      const locationReadings = data.filter(d => d.location_id === locationId);
      
      if (locationReadings.length === 0) {
        return null;
      }
      
      const avgData = {
        location: locationId,
        airQuality: 100 - (locationReadings.reduce((sum, r) => sum + r.pm25, 0) / locationReadings.length),
        noiseLevel: 100 - (locationReadings.reduce((sum, r) => sum + r.noise_level, 0) / locationReadings.length),
        greenSpace: locationReadings[0].green_space_ratio * 100,
        temperature: 100 - Math.abs(25 - (locationReadings.reduce((sum, r) => sum + r.temperature, 0) / locationReadings.length)) * 2,
        healthScore: locationReadings.reduce((sum, r) => sum + r.environmental_health_score, 0) / locationReadings.length
      };
      
      return avgData;
    }).filter(Boolean);
    
    res.json(comparisonData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate radar comparison' });
  }
});

// Get geographic boundaries and zones
router.get('/zones', async (req, res) => {
  try {
    // Simulate city zones with boundaries
    const zones = [
      {
        id: 'zone_residential',
        name: 'Residential Area',
        type: 'residential',
        boundary: [
          [12.9616, 77.5846],
          [12.9716, 77.5846],
          [12.9716, 77.5946],
          [12.9616, 77.5946],
          [12.9616, 77.5846]
        ],
        avgAQI: 45,
        population: 150000
      },
      {
        id: 'zone_commercial',
        name: 'Commercial District',
        type: 'commercial',
        boundary: [
          [12.9716, 77.5846],
          [12.9816, 77.5846],
          [12.9816, 77.5946],
          [12.9716, 77.5946],
          [12.9716, 77.5846]
        ],
        avgAQI: 78,
        population: 200000
      },
      {
        id: 'zone_industrial',
        name: 'Industrial Zone',
        type: 'industrial',
        boundary: [
          [12.9616, 77.5946],
          [12.9716, 77.5946],
          [12.9716, 77.6046],
          [12.9616, 77.6046],
          [12.9616, 77.5946]
        ],
        avgAQI: 125,
        population: 80000
      },
      {
        id: 'zone_green',
        name: 'Green Belt',
        type: 'green',
        boundary: [
          [12.9716, 77.5946],
          [12.9816, 77.5946],
          [12.9816, 77.6046],
          [12.9716, 77.6046],
          [12.9716, 77.5946]
        ],
        avgAQI: 28,
        population: 50000
      }
    ];
    
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch zone data' });
  }
});

module.exports = router;