const express = require('express');
const router = express.Router();

// Calculate health score prediction
router.post('/health-score', async (req, res) => {
  try {
    const { pm25, pm10, co2, noise, greenSpace } = req.body;
    
    // Validate inputs
    if (!pm25 || !pm10 || !co2 || !noise || greenSpace === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Simplified ML model simulation
    const pollutionImpact = (pm25 * 0.3 + pm10 * 0.2 + co2 * 0.0001 + noise * 0.2);
    const greenBenefit = greenSpace * 0.5;
    const randomFactor = (Math.random() - 0.5) * 10; // Add some randomness
    
    const healthScore = Math.max(0, Math.min(100, 100 - pollutionImpact + greenBenefit + randomFactor));
    
    const status = healthScore > 80 ? 'Excellent' : 
                   healthScore > 60 ? 'Good' : 
                   healthScore > 40 ? 'Moderate' : 'Poor';
    
    const recommendations = healthScore < 60 ? [
      'Increase green space coverage in the area',
      'Implement traffic reduction measures',
      'Monitor air quality more frequently',
      'Consider air purification systems',
      'Promote public transportation usage'
    ] : [
      'Maintain current environmental standards',
      'Continue monitoring environmental trends',
      'Promote sustainable transportation',
      'Engage community in environmental initiatives'
    ];
    
    res.json({
      healthScore: Number(healthScore.toFixed(1)),
      status,
      confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
      recommendations,
      factors: {
        pm25Impact: pm25 * 0.3,
        pm10Impact: pm10 * 0.2,
        co2Impact: co2 * 0.0001,
        noiseImpact: noise * 0.2,
        greenBenefit: greenBenefit
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate health score prediction' });
  }
});

// Get feature importance for ML model
router.get('/feature-importance', async (req, res) => {
  try {
    const featureImportance = [
      { feature: 'PM2.5', importance: 0.35, impact: 'High negative impact on health' },
      { feature: 'PM10', importance: 0.25, impact: 'Moderate negative impact on health' },
      { feature: 'Noise Level', importance: 0.20, impact: 'Stress and sleep disruption' },
      { feature: 'Green Space', importance: 0.15, impact: 'Positive impact on air quality' },
      { feature: 'CO2', importance: 0.05, impact: 'Long-term climate impact' }
    ];
    
    res.json(featureImportance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feature importance' });
  }
});

// Get 7-day pollution forecast
router.get('/forecast', async (req, res) => {
  try {
    const locationId = req.query.locationId || 'LOC_001';
    const forecast = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simulate forecast with some trend
      const baseAQI = 60 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 15;
      const trend = i <= 3 ? 'improving' : i <= 5 ? 'stable' : 'worsening';
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predictedAQI: Math.max(0, Math.round(baseAQI)),
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        trend,
        weatherFactor: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)]
      });
    }
    
    res.json({
      locationId,
      forecast,
      modelAccuracy: 0.872,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

module.exports = router;
