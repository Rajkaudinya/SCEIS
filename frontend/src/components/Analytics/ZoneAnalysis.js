import React from 'react';
import Plot from 'react-plotly.js';
import './ZoneAnalysis.css';

const ZoneAnalysis = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="no-data">
        <p>No zone analysis data available</p>
      </div>
    );
  }

  const zones = data.map(d => d.zoneName);
  
  const traces = [
    {
      x: zones,
      y: data.map(d => d.avgAQI),
      type: 'bar',
      name: 'Average AQI',
      marker: { color: '#FF6B6B' }
    },
    {
      x: zones,
      y: data.map(d => d.avgPM25),
      type: 'bar',
      name: 'Average PM2.5',
      marker: { color: '#4ECDC4' },
      yaxis: 'y2'
    }
  ];

  const layout = {
    title: {
      text: 'Zone-wise Environmental Analysis',
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'Zones',
      tickangle: 45
    },
    yaxis: {
      title: 'AQI',
      side: 'left'
    },
    yaxis2: {
      title: 'PM2.5 (μg/m³)',
      overlaying: 'y',
      side: 'right'
    },
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { l: 50, r: 50, t: 50, b: 100 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Segoe UI, Arial, sans-serif' }
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <div className="zone-analysis">
      <Plot
        data={traces}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '400px' }}
      />
      
      <div className="zone-summary">
        <h4>Zone Summary</h4>
        <div className="summary-grid">
          {data.map((zone, index) => (
            <div key={index} className="zone-card">
              <h5>{zone.zoneName}</h5>
              <div className="zone-stats">
                <div className="stat">
                  <span className="label">AQI:</span>
                  <span className="value">{zone.avgAQI}</span>
                </div>
                <div className="stat">
                  <span className="label">PM2.5:</span>
                  <span className="value">{zone.avgPM25} μg/m³</span>
                </div>
                <div className="stat">
                  <span className="label">Status:</span>
                  <span className={`status ${zone.status}`}>{zone.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};