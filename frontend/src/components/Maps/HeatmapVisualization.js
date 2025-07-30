import React from 'react';
import Plot from 'react-plotly.js';

const HeatmapVisualization = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No heatmap data available</p>
      </div>
    );
  }

  const trace = {
    type: 'densitymapbox',
    lat: data.map(d => d.latitude),
    lon: data.map(d => d.longitude),
    z: data.map(d => d.pollution_intensity),
    radius: 20,
    colorscale: [
      [0, '#00FF00'],
      [0.5, '#FFFF00'],
      [1, '#FF0000']
    ],
    showscale: true,
    colorbar: {
      title: 'Pollution Intensity'
    }
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
    title: {
      text: 'Air Quality Heatmap',
      font: { size: 16, color: '#333' }
    }
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
      style={{ width: '100%', height: '450px' }}
    />
  );
};