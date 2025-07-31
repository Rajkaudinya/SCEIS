import React from 'react';
import Plot from 'react-plotly.js';
import './DetailedReport.css';

const DetailedReport = ({ data, params, setParams }) => {
  if (!data) {
    return (
      <div className="loading">
        <p>Loading detailed report...</p>
      </div>
    );
  }

  const handleParamChange = (field, value) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  // Prepare chart data
  const chartData = [
    {
      x: data.timeSeries?.map(d => d.date) || [],
      y: data.timeSeries?.map(d => d.aqi) || [],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'AQI',
      line: { color: '#FF6B6B', width: 2 }
    },
    {
      x: data.timeSeries?.map(d => d.date) || [],
      y: data.timeSeries?.map(d => d.pm25) || [],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'PM2.5',
      line: { color: '#4ECDC4', width: 2 },
      yaxis: 'y2'
    }
  ];

  const chartLayout = {
    title: 'Detailed Environmental Trends',
    xaxis: { title: 'Date' },
    yaxis: { title: 'AQI', side: 'left' },
    yaxis2: { title: 'PM2.5 (μg/m³)', overlaying: 'y', side: 'right' },
    margin: { l: 50, r: 50, t: 50, b: 50 }
  };

  return (
    <div className="detailed-report">
      <div className="report-controls">
        <div className="control-group">
          <label>Time Period:</label>
          <select 
            value={params.days} 
            onChange={(e) => handleParamChange('days', parseInt(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Zone Filter:</label>
          <select 
            value={params.zone} 
            onChange={(e) => handleParamChange('zone', e.target.value)}
          >
            <option value="all">All Zones</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="green">Green Areas</option>
          </select>
        </div>
      </div>

      <div className="report-content">
        {/* Time Series Chart */}
        <div className="chart-section">
          <h4>📈 Environmental Trends Over Time</h4>
          <Plot
            data={chartData}
            layout={chartLayout}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '400px' }}
          />
        </div>

        {/* Statistical Summary */}
        <div className="stats-section">
          <h4>📊 Statistical Summary</h4>
          <div className="stats-grid">
            <div className="stat-box">
              <h5>Air Quality Index</h5>
              <div className="stat-values">
                <span>Average: {data.statistics?.aqi?.average || 'N/A'}</span>
                <span>Max: {data.statistics?.aqi?.max || 'N/A'}</span>
                <span>Min: {data.statistics?.aqi?.min || 'N/A'}</span>
                <span>Std Dev: {data.statistics?.aqi?.stdDev || 'N/A'}</span>
              </div>
            </div>
            
            <div className="stat-box">
              <h5>PM2.5 Concentration</h5>
              <div className="stat-values">
                <span>Average: {data.statistics?.pm25?.average || 'N/A'} μg/m³</span>
                <span>Max: {data.statistics?.pm25?.max || 'N/A'} μg/m³</span>
                <span>Min: {data.statistics?.pm25?.min || 'N/A'} μg/m³</span>
                <span>Std Dev: {data.statistics?.pm25?.stdDev || 'N/A'}</span>
              </div>
            </div>
            
            <div className="stat-box">
              <h5>Health Impact</h5>
              <div className="stat-values">
                <span>Health Score: {data.statistics?.health?.score || 'N/A'}</span>
                <span>Risk Level: {data.statistics?.health?.riskLevel || 'N/A'}</span>
                <span>Affected Pop.: {data.statistics?.health?.affectedPopulation || 'N/A'}</span>
                <span>Health Alerts: {data.statistics?.health?.alerts || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Performance */}
        <div className="locations-section">
          <h4>📍 Location Performance Analysis</h4>
          <div className="locations-table">
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Zone Type</th>
                  <th>Avg AQI</th>
                  <th>Avg PM2.5</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.locationAnalysis?.map((location, index) => (
                  <tr key={index}>
                    <td>{location.name}</td>
                    <td>{location.zoneType}</td>
                    <td>{location.avgAQI}</td>
                    <td>{location.avgPM25} μg/m³</td>
                    <td>
                      <span className={`status-badge ${location.status.toLowerCase()}`}>
                        {location.status}
                      </span>
                    </td>
                    <td>
                      <span className={`trend ${location.trend >= 0 ? 'improving' : 'declining'}`}>
                        {location.trend >= 0 ? '↗️' : '↘️'} {Math.abs(location.trend)}%
                      </span>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#666' }}>
                      No location data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Analysis */}
        <div className="compliance-section">
          <h4>✅ Regulatory Compliance</h4>
          <div className="compliance-grid">
            <div className="compliance-item">
              <div className="compliance-metric">
                <span className="metric-name">WHO PM2.5 Standard</span>
                <span className={`compliance-status ${data.compliance?.pm25WHO ? 'compliant' : 'non-compliant'}`}>
                  {data.compliance?.pm25WHO ? '✅ Compliant' : '❌ Non-Compliant'}
                </span>
              </div>
              <div className="compliance-details">
                Standard: ≤15 μg/m³ | Current: {data.compliance?.currentPM25 || 'N/A'} μg/m³
              </div>
            </div>
            
            <div className="compliance-item">
              <div className="compliance-metric">
                <span className="metric-name">National AQI Standard</span>
                <span className={`compliance-status ${data.compliance?.nationalAQI ? 'compliant' : 'non-compliant'}`}>
                  {data.compliance?.nationalAQI ? '✅ Compliant' : '❌ Non-Compliant'}
                </span>
              </div>
              <div className="compliance-details">
                Standard: ≤100 AQI | Current: {data.compliance?.currentAQI || 'N/A'} AQI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReport;
