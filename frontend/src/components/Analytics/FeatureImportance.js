import React from 'react';
import Plot from 'react-plotly.js';

const FeatureImportance = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No feature importance data available</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.importance - a.importance);

  const trace = {
    x: sortedData.map(d => d.importance),
    y: sortedData.map(d => d.feature),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: sortedData.map((d, i) => `rgba(102, 126, 234, ${1 - i * 0.1})`),
      line: {
        color: '#667eea',
        width: 1
      }
    },
    text: sortedData.map(d => `${(d.importance * 100).toFixed(1)}%`),
    textposition: 'outside'
  };

  const layout = {
    title: {
      text: 'Feature Importance in Health Score Prediction',
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'Importance Score',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: {
      title: 'Environmental Factors',
      automargin: true
    },
    margin: { l: 120, r: 50, t: 50, b: 50 },
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
      data={[trace]}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default FeatureImportance;
