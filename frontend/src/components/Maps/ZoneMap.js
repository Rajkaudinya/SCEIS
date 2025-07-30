import React from 'react';
import Plot from 'react-plotly.js';

const ZoneMap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No zone data available</p>
      </div>
    );
  }

  const getZoneColor = (zoneType) => {
    switch (zoneType) {
      case 'residential': return 'rgba(76, 175, 80, 0.6)';
      case 'commercial': return 'rgba(33, 150, 243, 0.6)';
      case 'industrial': return 'rgba(255, 87, 34, 0.6)';
      case 'green': return 'rgba(139, 195, 74, 0.6)';
      default: return 'rgba(158, 158, 158, 0.6)';
    }
  };

  const traces = data.map(zone => ({
    type: 'scattermapbox',
    fill: 'toself',
    lat: zone.boundary.map(point => point.lat),
    lon: zone.boundary.map(point => point.lng),
    mode: 'lines',
    line: { width: 2, color: getZoneColor(zone.type).replace('0.6', '1') },
    fillcolor: getZoneColor(zone.type),
    name: `${zone.name} (${zone.type})`,
    text: `Zone: ${zone.name}<br>Type: ${zone.type}<br>Avg AQI: ${zone.avgAQI}`,
    hovertemplate: '%{text}<extra></extra>'
  }));

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
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)'
    }
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '450px' }}
    />
  );
};
export default ZoneMap;