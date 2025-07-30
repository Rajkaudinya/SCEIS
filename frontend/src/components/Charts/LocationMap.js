import React from 'react';
import Plot from 'react-plotly.js';

const LocationMap = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No location data available</p>
      </div>
    );
  }

  const getMarkerColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const trace = {
    type: 'scattermapbox',
    lat: locations.map(loc => loc.latitude),
    lon: locations.map(loc => loc.longitude),
    mode: 'markers',
    marker: {
      size: 12,
      color: locations.map(loc => getMarkerColor(loc.status)),
      opacity: 0.8
    },
    text: locations.map(loc => 
      `${loc.name}<br>Status: ${loc.status}<br>AQI: ${loc.currentAQI}`
    ),
    hovertemplate: '%{text}<extra></extra>'
  };

  const layout = {
    mapbox: {
      style: 'open-street-map',
      center: {
        lat: 28.4595,
        lon: 77.0266
      },
      zoom: 10
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    showlegend: false
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Plot
      data={[trace]}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '300px' }}
    />
  );
};
export default LocationMap;