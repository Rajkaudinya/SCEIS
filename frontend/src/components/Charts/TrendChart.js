import React from 'react';
import Plot from 'react-plotly.js';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No trend data available</p>
      </div>
    );
  }

  const dates = data.map(d => new Date(d.date).toLocaleDateString());
  
  const traces = [
    {
      x: dates,
      y: data.map(d => d.avgAQI),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Average AQI',
      line: { color: '#FF6B6B', width: 3 },
      marker: { size: 6 }
    },
    {
      x: dates,
      y: data.map(d => d.avgHealthScore),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Health Score',
      line: { color: '#4ECDC4', width: 3 },
      marker: { size: 6 },
      yaxis: 'y2'
    },
    {
      x: dates,
      y: data.map(d => d.avgPM25),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'PM2.5 (μg/m³)',
      line: { color: '#45B7D1', width: 2, dash: 'dot' },
      marker: { size: 4 }
    }
  ];

  const layout = {
    title: {
      text: '7-Day Environmental Trends',
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'Date',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: {
      title: 'AQI / PM2.5',
      showgrid: true,
      gridcolor: '#f0f0f0',
      side: 'left'
    },
    yaxis2: {
      title: 'Health Score',
      overlaying: 'y',
      side: 'right',
      showgrid: false
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
      style={{ width: '100%', height: '350px' }}
    />
  );
};
