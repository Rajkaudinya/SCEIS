import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CorrelationMatrix from '../Charts/CorrelationMatrix';
import HotspotsTable from '../Analytics/HotspotsTable';
import ZoneAnalysis from '../Analytics/ZoneAnalysis';
import ClusterChart from '../Charts/ClusterChart';
import './AnalyticsTab.css';

const AnalyticsTab = () => {
  const [correlationData, setCorrelationData] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [clusterData, setClusterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeAnalysis, setActiveAnalysis] = useState('correlations');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [correlationResponse, hotspotsResponse, zoneResponse, clusterResponse] = await Promise.all([
        axios.get('/api/analytics/correlations'),
        axios.get('/api/analytics/hotspots'),
        axios.get('/api/analytics/zones'),
        axios.get('/api/analytics/clusters')
      ]);
      
      setCorrelationData(correlationResponse.data);
      setHotspots(hotspotsResponse.data);
      setZoneData(zoneResponse.data);
      setClusterData(clusterResponse.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analysisOptions = [
    { id: 'correlations', label: '🔗 Correlations', icon: '📊' },
    { id: 'hotspots', label: '🔥 Hotspots', icon: '🗺️' },
    { id: 'zones', label: '🏙️ Zone Analysis', icon: '📈' },
    { id: 'clusters', label: '🎯 Clustering', icon: '🔍' }
  ];

  const renderAnalysisContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      );
    }

    switch (activeAnalysis) {
      case 'correlations':
        return (
          <div className="analysis-content">
            <h3>Variable Correlations</h3>
            <p>Understanding relationships between environmental factors</p>
            {correlationData && <CorrelationMatrix data={correlationData} />}
          </div>
        );
      case 'hotspots':
        return (
          <div className="analysis-content">
            <h3>Pollution Hotspots</h3>
            <p>Areas requiring immediate attention</p>
            <HotspotsTable data={hotspots} />
          </div>
        );
      case 'zones':
        return (
          <div className="analysis-content">
            <h3>Zone-wise Environmental Analysis</h3>
            <p>Comparative analysis across different city zones</p>
            <ZoneAnalysis data={zoneData} />
          </div>
        );
      case 'clusters':
        return (
          <div className="analysis-content">
            <h3>Environmental Clustering</h3>
            <p>Grouping locations by environmental characteristics</p>
            <ClusterChart data={clusterData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>🔬 Advanced Analytics</h2>
        <p>Deep insights into environmental patterns and relationships</p>
      </div>

      <div className="analysis-selector">
        {analysisOptions.map(option => (
          <button
            key={option.id}
            className={`analysis-option ${activeAnalysis === option.id ? 'active' : ''}`}
            onClick={() => setActiveAnalysis(option.id)}
          >
            <span className="option-icon">{option.icon}</span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="analysis-container">
        {renderAnalysisContent()}
      </div>
    </div>
  );
};
