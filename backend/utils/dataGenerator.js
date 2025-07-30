const moment = require('moment');

// Generate synthetic environmental data
function generateEnvironmentalData(days = 30) {
  const data = [];
  const locations = [];

  // Generate locations
  for (let i = 0; i < 50; i++) {
    locations.push({
      id: `LOC_${i.toString().padStart(3, '0')}`,
      lat: 12.9716 + (Math.random() - 0.5) * 0.2,
      lon: 77.5946 + (Math.random() - 0.5) * 0.2,
      zone: ['residential', 'commercial', 'industrial', 'green'][Math.floor(Math.random() * 4)]
    });
  }

  // Generate time series data
  const startDate = moment().subtract(days, 'days');

  for (let day = 0; day < days; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = moment(startDate).add(day, 'days').add(hour, 'hours').toDate();

      locations.forEach(loc => {
        const zoneMultiplier = {
          'residential': 1.0,
          'commercial': 1.3,
          'industrial': 2.0,
          'green': 0.5
        }[loc.zone];

        const rushHour = [8, 9, 18, 19].includes(hour) ? 1.5 : 1.0;
        const nightReduction = (hour >= 22 || hour <= 6) ? 0.7 : 1.0;
        const basePollution = zoneMultiplier * rushHour * nightReduction;

        data.push({
          timestamp: timestamp,
          location_id: loc.id,
          latitude: loc.lat,
          longitude: loc.lon,
          zone: loc.zone,
          pm25: Math.max(0, 50 * basePollution + (Math.random() - 0.5) * 30),
          pm10: Math.max(0, 80 * basePollution + (Math.random() - 0.5) * 40),
          co2: Math.max(300, 400 * basePollution + (Math.random() - 0.5) * 100),
          no2: Math.max(0, 30 * basePollution + (Math.random() - 0.5) * 20),
          temperature: 25 + 5 * Math.sin(2 * Math.PI * hour / 24) + (Math.random() - 0.5) * 6,
          humidity: 60 + (Math.random() - 0.5) * 30,
          noise_level: Math.max(30, 55 * basePollution + (Math.random() - 0.5) * 20),
          traffic_density: Math.max(0, 100 * basePollution + (Math.random() - 0.5) * 60),
          air_quality_index: 0, // Will be calculated
          environmental_health_score: 0, // Will be calculated
          green_space_ratio: loc.zone === 'green' ? 0.4 : 
                           loc.zone === 'residential' ? 0.2 : 
                           loc.zone === 'commercial' ? 0.1 : 0.05
        });
      });
    }
  }

  // Calculate derived metrics
  return data.map(d => ({
    ...d,
    air_quality_index: d.pm25 * 0.4 + d.pm10 * 0.3 + d.co2 * 0.0001 + d.no2 * 0.3,
    environmental_health_score: Math.max(0, 100 - (d.pm25 * 0.4 + d.pm10 * 0.3 + d.noise_level * 0.3))
  }));
}

// Calculate metrics from data
function calculateMetrics(data) {
  if (!data || data.length === 0) return {};

  const avgAQI = data.reduce((sum, d) => sum + d.air_quality_index, 0) / data.length;
  const avgHealthScore = data.reduce((sum, d) => sum + d.environmental_health_score, 0) / data.length;
  const uniqueLocations = [...new Set(data.map(d => d.location_id))].length;
  const hotspots = data.filter(d => d.air_quality_index > 100).length;

  return {
    avgAQI: Number(avgAQI.toFixed(1)),
    avgHealthScore: Number(avgHealthScore.toFixed(1)),
    uniqueLocations,
    hotspots
  };
}

module.exports = {
  generateEnvironmentalData,
  calculateMetrics
};