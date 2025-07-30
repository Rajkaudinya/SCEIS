import React from 'react';
import './MetricsGrid.css';

const MetricsGrid = ({ metrics }) => {
  const getAQIColor = (aqi) => {
    const numAqi = parseFloat(aqi);
    if (isNaN(numAqi)) return '#666';
    return numAqi <= 50 ? '#4CAF50' : 
           numAqi <= 100 ? '#FF9800' : 
           '#F44336';
  };

  const metricCards = [
    {
      id: 'aqi',
      value: metrics.avgAQI,
      label: 'Average AQI',
      color: getAQIColor(metrics.avgAQI),
      icon: '🌬️'
    },
    {
      id: 'locations',
      value: metrics.locationsMonitored,
      label: 'Locations Monitored',
      color: '#2196F3',
      icon: '📍'
    },
    {
      id: 'health',
      value: metrics.healthScore,
      label: 'Health Score',
      color: '#4CAF50',
      icon: '💚'
    },
    {
      id: 'hotspots',
      value: metrics.pollutionHotspots,
      label: 'Pollution Hotspots',
      color: '#F44336',
      icon: '🚨'
    }
  ];

  return (
    <div className="metrics-grid">
      {metricCards.map(card => (
        <div key={card.id} className="metric-card">
          <div className="metric-icon">{card.icon}</div>
          <div 
            className="metric-value"
            style={{ color: card.color }}
          >
            {card.value}
          </div>
          <div className="metric-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;