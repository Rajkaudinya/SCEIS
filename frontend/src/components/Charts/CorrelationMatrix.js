import React from 'react';
import Plot from 'react-plotly.js';

const CorrelationMatrix = ({ data }) => {
  if (!data || !data.matrix || !data.labels) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No correlation data available</p>
      </div>
    );
  }

  const trace = {
    z: data.matrix,
    x: data.labels,
    y: data.labels,
    type: 'heatmap',
    colorscale: [
      [0, '#313695'],
      [0.25, '#4575b4'],
      [0.5, '#ffffff'],
      [0.75, '#f46d43'],
      [1, '#a50026']
    ],
    zmid: 0,
    zmin: -1,
    zmax: 1,
    showscale: true,
    colorbar: {
      title: 'Correlation',
      titleside: 'right'
    }
  };

  const layout = {
    title: {
      text: 'Environmental Variables Correlation Matrix',
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'Variables',
      tickangle: 45
    },
    yaxis: {
      title: 'Variables'
    },
    margin: { l: 80, r: 50, t: 80, b: 100 },
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
export default CorrelationMatrix;