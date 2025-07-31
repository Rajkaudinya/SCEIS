import React from 'react';
import './ExecutiveSummary.css';

const ExecutiveSummary = ({ data }) => {
  if (!data) {
    return (
      <div className="loading">
        <p>Loading executive summary...</p>
      </div>
    );
  }

  return (
    <div className="executive-summary">
      <div className="summary-header">
        <h3>📊 Executive Summary</h3>
        <p className="report-date">Generated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-icon">🌪️</div>
          <div className="metric-content">
            <div className="metric-value">{data.averageAQI}</div>
            <div className="metric-label">Average AQI</div>
            <div className={`metric-trend ${data.aqiTrend >= 0 ? 'up' : 'down'}`}>
              {data.aqiTrend >= 0 ? '↗️' : '↘️'} {Math.abs(data.aqiTrend)}% vs last period
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚨</div>
          <div className="metric-content">
            <div className="metric-value">{data.totalAlerts}</div>
            <div className="metric-label">Total Alerts</div>
            <div className="metric-breakdown">
              Critical: {data.criticalAlerts} | High: {data.highAlerts}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💚</div>
          <div className="metric-content">
            <div className="metric-value">{data.healthScore}</div>
            <div className="metric-label">Health Score</div>
            <div className={`metric-trend ${data.healthTrend >= 0 ? 'up' : 'down'}`}>
              {data.healthTrend >= 0 ? '↗️' : '↘️'} {Math.abs(data.healthTrend)}% improvement
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📍</div>
          <div className="metric-content">
            <div className="metric-value">{data.activeSensors}</div>
            <div className="metric-label">Active Sensors</div>
            <div className="metric-breakdown">
              {data.sensorUptime}% uptime
            </div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h4>🔍 Key Insights</h4>
        <div className="insights-grid">
          <div className="insight-card positive">
            <h5>✅ Positive Trends</h5>
            <ul>
              {data.positiveInsights?.map((insight, index) => (
                <li key={index}>{insight}</li>
              )) || ['Air quality improving in residential areas', 'Reduced PM2.5 levels during weekends']}
            </ul>
          </div>
          
          <div className="insight-card concerning">
            <h5>⚠️ Areas of Concern</h5>
            <ul>
              {data.concerningInsights?.map((insight, index) => (
                <li key={index}>{insight}</li>
              )) || ['Industrial zones showing elevated NO2', 'Traffic-related pollution during peak hours']}
            </ul>
          </div>
          
          <div className="insight-card recommendations">
            <h5>💡 Recommendations</h5>
            <ul>
              {data.recommendations?.map((rec, index) => (
                <li key={index}>{rec}</li>
              )) || ['Increase monitoring in industrial areas', 'Implement traffic management during peak hours']}
            </ul>
          </div>
        </div>
      </div>

      <div className="summary-footer">
        <div className="data-quality">
          <h5>📈 Data Quality</h5>
          <div className="quality-metrics">
            <span>Completeness: {data.dataCompleteness || 95}%</span>
            <span>Accuracy: {data.dataAccuracy || 98}%</span>
            <span>Timeliness: {data.dataTimeliness || 99}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;