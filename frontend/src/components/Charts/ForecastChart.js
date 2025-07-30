import React from 'react';
import Plot from 'react-plotly.js';

const ForecastChart = ({ data }) => {
  if (!data || !data.forecast) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No forecast data available</p>
      </div>
    );
  }

  const forecast = data.forecast;
  const dates = forecast.map(f => f.date);
  const predictedAQI = forecast.map(f => f.predictedAQI);
  const confidence = forecast.map(f => f.confidence);

  // Calculate confidence bands
  const upperBound = forecast.map(f => f.predictedAQI * (1 + (1 - f.confidence) * 0.3));
  const lowerBound = forecast.map(f => f.predictedAQI * (1 - (1 - f.confidence) * 0.3));

  const traces = [
    {
      x: dates,
      y: upperBound,
      fill: 'tonexty',
      fillcolor: 'rgba(102, 126, 234, 0.2)',
      line: { color: 'rgba(255,255,255,0)' },
      name: 'Confidence Band',
      showlegend: false,
      hoverinfo: 'skip'
    },
    {
      x: dates,
      y: lowerBound,
      fill: 'tonexty',
      fillcolor: 'rgba(102, 126, 234, 0.2)',
      line: { color: 'rgba(255,255,255,0)' },
      name: 'Confidence Band',
      showlegend: false,
      hoverinfo: 'skip'
    },
    {
      x: dates,
      y: predictedAQI,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Predicted AQI',
      line: { color: '#667eea', width: 3 },
      marker: { size: 8, color: '#667eea' }
    }
  ];

  const layout = {
    title: {
      text: `7-Day AQI Forecast - ${data.locationId}`,
      font: { size: 16, color: '#333' }
    },
    xaxis: {
      title: 'Date',
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: {
      title: 'Air Quality Index',
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
    font: { family: 'Segoe UI, Arial, sans-serif' },
    shapes: [
      // Good AQI line
      {
        type: 'line',
        x0: dates[0],
        x1: dates[dates.length - 1],
        y0: 50,
        y1: 50,
        line: { color: '#4CAF50', width: 2, dash: 'dash' }
      },
      // Moderate AQI line
      {
        type: 'line',
        x0: dates[0],
        x1: dates[dates.length - 1],
        y0: 100,
        y1: 100,
        line: { color: '#FF9800', width: 2, dash: 'dash' }
      }
    ],
    annotations: [
      {
        x: dates[Math.floor(dates.length / 2)],
        y: 50,
        text: 'Good (≤50)',
        showarrow: false,
        font: { size: 10, color: '#4CAF50' },
        bgcolor: 'rgba(255,255,255,0.8)'
      },
      {
        x: dates[Math.floor(dates.length / 2)],
        y: 100,
        text: 'Moderate (≤100)',
        showarrow: false,
        font: { size: 10, color: '#FF9800' },
        bgcolor: 'rgba(255,255,255,0.8)'
      }
    ]
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <div>
      <Plot
        data={traces}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '350px' }}
      />
      <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Model Accuracy:</strong> {(data.modelAccuracy * 100).toFixed(1)}%</p>
        <p><strong>Last Updated:</strong> {new Date(data.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  );
};