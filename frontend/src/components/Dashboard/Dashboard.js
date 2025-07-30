import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import MetricsGrid from './MetricsGrid';
import TabNavigation from './TabNavigation';
import OverviewTab from './OverviewTab';
import AnalyticsTab from './AnalyticsTab';
import PredictionsTab from './PredictionsTab';
import GeospatialTab from './GeospatialTab';
import ReportsTab from './ReportsTab';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    avgAQI: 'Loading...',
    locationsMonitored: 'Loading...',
    healthScore: 'Loading...',
    pollutionHotspots: 'Loading...'
  });
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('environmental-update', (data) => {
      console.log('Real-time update:', data);
      setLastUpdate(data);
      // Update metrics if needed
      if (data.alert) {
        console.warn('Environmental Alert:', data.alert);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch initial metrics
  useEffect(() => {
    fetchMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/dashboard/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab socket={socket} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'predictions':
        return <PredictionsTab />;
      case 'geospatial':
        return <GeospatialTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab socket={socket} />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🌍 Smart City Environmental Intelligence System</h1>
          <p>Real-time monitoring and analysis of urban environmental conditions</p>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
            {lastUpdate && (
              <span className="last-update">
                Last update: {new Date(lastUpdate.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <MetricsGrid metrics={metrics} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;