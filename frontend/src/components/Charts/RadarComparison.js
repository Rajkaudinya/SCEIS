import React from 'react';
import Plot from 'react-plotly.js';

const RadarComparison = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No comparison data available</p>
      </div>
    );
  }

  const categories = ['Air Quality', 'Noise Level', 'Green Space', 'Temperature', 'Health Score'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

  const traces = data.map((location, index) => ({
    type: 'scatterpolar',
    r: [
      location.airQuality,
      location.noiseLevel,
      location.greenSpace,
      location.temperature,
      location.healthScore
    ],
    theta: categories,
    fill: 'toself',
    name: location.name,
    line: { color: colors[index % colors.length] },
    fillcolor: colors[index % colors.length].replace(')', ', 0.2)').replace('rgb', 'rgba')
  }));

  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100]
      }
    },
    title: {
      text: 'Multi-dimensional Location Comparison',
      font: { size: 16, color: '#333' }
    },
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Segoe UI, Arial, sans-serif' }
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
      style={{ width: '100%', height: '400px' }}
    />
  );
};
export default RadarComparison;