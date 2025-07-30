import React from 'react';
import Plot from 'react-plotly.js';

const ScatterAnalysis = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No scatter analysis data available</p>
      </div>
    );
  }

  // Group data by zone
  const zones = ['residential', 'commercial', 'industrial', 'green'];
  const colors = ['#4CAF50', '#2196F3', '#FF5722', '#8BC34A'];
  
  const traces = zones.map((zone, index) => {
    const zoneData = data.filter(d => d.zone === zone);
    return {
      x: zoneData.map(d => d.x),
      y: zoneData.map(d => d.y),
      mode: 'markers',
      type: 'scatter',
      name: zone.charAt(0).toUpperCase() + zone.slice(1),
      marker: {
        color: colors[index],
        size: 10,
        opacity: 0.7
      },
      text: zoneData.map(d => `Location: ${d.location}<br>AQI: ${d.aqi}`),
      hovertemplate: '%{text}<br>Health Score: %{x}<br>Economic Index: %{y}<extra></extra>'
    };
  });

  const layout = {
    title: {
      text: 'Environmental Health vs Economic Performance',
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'Environmental Health Score',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: {
      title: 'Economic Performance Index',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
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
export default ScatterAnalysis;