import React from 'react';
import Plot from 'react-plotly.js';
import './FeatureImportance.css';
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
    x: sortedData.map(item => item.feature),
    y: sortedData.map(item => item.importance),
    type: 'bar',
    marker: {
      color: '#42a5f5'
    }
  };

  const layout = {
    title: 'Feature Importance Analysis',
    xaxis: { title: 'Feature' },
    yaxis: { title: 'Importance Score' },
    margin: { l: 50, r: 30, t: 50, b: 80 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Segoe UI, Arial, sans-serif' }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Plot data={[trace]} layout={layout} config={{ responsive: true }} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FeatureImportance;
