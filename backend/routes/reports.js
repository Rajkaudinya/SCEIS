const express = require('express');
const router = express.Router();
const { generateEnvironmentalData } = require('../utils/dataGenerator');

// Get executive summary
router.get('/summary', async (req, res) => {
  try {
    const data = generateEnvironmentalData(30);
    
    // Calculate summary statistics
    const totalReadings = data.length;
    const avgAQI = data.reduce((sum, d) => sum + d.air_quality_index, 0) / totalReadings;
    const avgHealthScore = data.reduce((sum, d) => sum + d.environmental_health_score, 0) / totalReadings;
    
    // Zone analysis
    const zoneStats = {};
    data.forEach(d => {
      if (!zoneStats[d.zone]) {
        zoneStats[d.zone] = { count: 0, totalAQI: 0, totalHealth: 0 };
      }
      zoneStats[d.zone].count++;
      zoneStats[d.zone].totalAQI += d.air_quality_index;
      zoneStats[d.zone].totalHealth += d.environmental_health_score;
    });
    
    const zoneAnalysis = Object.entries(zoneStats).map(([zone, stats]) => ({
      zone,
      avgAQI: stats.totalAQI / stats.count,
      avgHealthScore: stats.totalHealth / stats.count,
      dataPoints: stats.count
    }));
    
    // Alerts and recommendations
    const criticalLocations = data
      .filter(d => d.air_quality_index > 150)
      .map(d => d.location_id)
      .filter((value, index, self) => self.indexOf(value) === index)
      .length;
    
    const summary = {
      overview: {
        totalDataPoints: totalReadings,
        avgAQI: Number(avgAQI.toFixed(1)),
        avgHealthScore: Number(avgHealthScore.toFixed(1)),
        monitoringPeriod: '30 days',
        uniqueLocations: [...new Set(data.map(d => d.location_id))].length
      },
      alerts: {
        critical: criticalLocations,
        moderate: data.filter(d => d.air_quality_index > 100 && d.air_quality_index <= 150).length,
        total: data.filter(d => d.air_quality_index > 100).length
      },
      zoneAnalysis: zoneAnalysis.sort((a, b) => b.avgAQI - a.avgAQI),
      trends: {
        improving: Math.random() > 0.5,
        trendPercentage: (Math.random() * 20 - 10).toFixed(1), // -10% to +10%
        primaryConcern: 'PM2.5 levels in industrial zones'
      },
      recommendations: [
        {
          priority: 'High',
          action: 'Deploy additional sensors in industrial zones',
          impact: 'Improved monitoring coverage',
          timeline: '2-4 weeks'
        },
        {
          priority: 'High',
          action: 'Implement traffic management systems',
          impact: 'Reduce vehicle emissions by 15-20%',
          timeline: '3-6 months'
        },
        {
          priority: 'Medium',
          action: 'Increase green space coverage by 15%',
          impact: 'Improve air quality and citizen well-being',
          timeline: '6-12 months'
        },
        {
          priority: 'Medium',
          action: 'Launch public awareness campaigns',
          impact: 'Increase citizen engagement',
          timeline: '1-2 months'
        }
      ],
      systemPerformance: {
        dataProcessingSpeed: '2.3 sec',
        modelAccuracy: '87.2%',
        systemUptime: '99.8%',
        sensorCoverage: '95.4%',
        lastUpdated: new Date().toISOString()
      }
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate executive summary' });
  }
});

// Get detailed report for specific time period
router.get('/detailed', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const zone = req.query.zone || null;
    
    let data = generateEnvironmentalData(days);
    
    if (zone) {
      data = data.filter(d => d.zone === zone);
    }
    
    // Daily aggregations
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
    
    const detailedReport = {
      period: `${days} days`,
      zone: zone || 'All zones',
      dailyAverages: Object.values(dailyData).map(day => ({
        date: day.date.toISOString().split('T')[0],
        avgAQI: day.readings.reduce((sum, r) => sum + r.air_quality_index, 0) / day.readings.length,
        avgPM25: day.readings.reduce((sum, r) => sum + r.pm25, 0) / day.readings.length,
        avgPM10: day.readings.reduce((sum, r) => sum + r.pm10, 0) / day.readings.length,
        avgHealthScore: day.readings.reduce((sum, r) => sum + r.environmental_health_score, 0) / day.readings.length,
        maxAQI: Math.max(...day.readings.map(r => r.air_quality_index)),
        minAQI: Math.min(...day.readings.map(r => r.air_quality_index))
      })).sort((a, b) => new Date(a.date) - new Date(b.date)),
      generatedAt: new Date().toISOString()
    };
    
    res.json(detailedReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate detailed report' });
  }
});

// Export data in different formats
router.get('/export', async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const days = parseInt(req.query.days) || 7;
    
    const data = generateEnvironmentalData(days);
    
    switch (format.toLowerCase()) {
      case 'csv':
        const csvHeader = 'timestamp,location_id,zone,pm25,pm10,co2,no2,temperature,humidity,noise_level,air_quality_index,environmental_health_score\n';
        const csvData = data.map(d => 
          `${d.timestamp.toISOString()},${d.location_id},${d.zone},${d.pm25},${d.pm10},${d.co2},${d.no2},${d.temperature},${d.humidity},${d.noise_level},${d.air_quality_index},${d.environmental_health_score}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=environmental_data.csv');
        res.send(csvHeader + csvData);
        break;
        
      default:
        res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

module.exports = router;