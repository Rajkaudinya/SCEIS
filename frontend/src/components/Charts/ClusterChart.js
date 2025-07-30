import React from 'react';
import Plot from 'react-plotly.js';

const ClusterChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No clustering data available</p>
      </div>
    );
  }

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const traces = [];

  Object.entries(data).forEach(([clusterName, points], index) => {
    traces.push({
      x: points.map(p => p.x),
      y: points.map(p => p.y),
      mode: 'markers',
      type: 'scatter',
      name: clusterName,
      marker: {
        color: colors[index % colors.length],
        size: 8,
        opacity: 0.7
      },
      text: points.map(p => `Location: ${p.location}<br>Zone: ${p.zone}`),
      hovertemplate: '%{text}<br>PM2.5: %{x}<br>Health Score: %{y}<extra></extra>'
    });
  });

  const layout = {
    title: {
      text: 'Environmental Clustering Analysis',
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'PM2.5 Concentration (μg/m³)',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: {
      title: 'Environmental Health Score',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    legend: {
      x: 1,
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
