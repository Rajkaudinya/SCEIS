import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrendChart from '../Charts/TrendChart';
import LocationMap from '../Maps/LocationMap';
import './OverviewTab.css';

const OverviewTab = ({ socket }) => {
  const [trendsData, setTrendsData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('environmental-update', (data) => {
        if (data.alert) {
          setRecentAlerts(prev => [
            {
              id: Date.now(),
              location: data.location,
              type: data.alert,
              message: `High pollution detected at ${data.location}`,
              timestamp: new Date(data.timestamp),
              severity: 'high'
            },
            ...prev.slice(0, 4) // Keep only 5 recent alerts
          ]);
        }
      });
    }
  }, [socket]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [trendsResponse, locationsResponse] = await Promise.all([
        axios.get('/api/dashboard/trends?days=7'),
        axios.get('/api/dashboard/locations')
      ]);
      
      setTrendsData(trendsResponse.data);
      setLocations(locationsResponse.data);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading overview data...</p>
      </div>
    );
  }

  return (
    <div className="overview-tab">
      <div className="overview-grid">
        {/* Recent Trends Chart */}
        <div className="overview-card trends-card">
          <h3>📈 7-Day Trends</h3>
          <TrendChart data={trendsData} />
        </div>

        {/* Location Map */}
        <div className="overview-card map-card">
          <h3>🗺️ Monitoring Locations</h3>
          <LocationMap locations={locations} />
        </div>

        {/* Recent Alerts */}
        <div className="overview-card alerts-card">
          <h3>🚨 Recent Alerts</h3>
          <div className="alerts-list">
            {recentAlerts.length > 0 ? (
              recentAlerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.severity}`}>
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-alerts">
                <div className="no-alerts-icon">✅</div>
                <p>No recent alerts. All systems operating normally.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="overview-card stats-card">
          <h3>📊 Quick Statistics</h3>
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">🌪️</div>
              <div className="stat-content">
                <div className="stat-value">
                  {trendsData.length > 0 ? trendsData[trendsData.length - 1]?.avgAQI?.toFixed(1) : 'N/A'}
                </div>
                <div className="stat-label">Current AQI</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <div className="stat-value">{locations.filter(l => l.status === 'active').length}</div>
                <div className="stat-label">Active Sensors</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💚</div>
              <div className="stat-content">
                <div className="stat-value">
                  {trendsData.length > 0 ? trendsData[trendsData.length - 1]?.avgHealthScore?.toFixed(1) : 'N/A'}
                </div>
                <div className="stat-label">Health Score</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-value">Live</div>
                <div className="stat-label">Data Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;