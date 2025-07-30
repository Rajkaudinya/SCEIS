import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeatmapVisualization from '../Maps/HeatmapVisualization';
import ScatterAnalysis from '../Charts/ScatterAnalysis';
import RadarComparison from '../Charts/RadarComparison';
import ZoneMap from '../Maps/ZoneMap';
import './GeospatialTab.css';

const GeospatialTab = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [activeVisualization, setActiveVisualization] = useState('heatmap');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeospatialData();
  }, []);

  const fetchGeospatialData = async () => {
    try {
      setLoading(true);
      const [heatmapResponse, scatterResponse, radarResponse, zoneResponse] = await Promise.all([
        axios.get('/api/geospatial/heatmap'),
        axios.get('/api/geospatial/scatter-analysis'),
        axios.get('/api/geospatial/radar-comparison?locations=LOC_001,LOC_010,LOC_020'),
        axios.get('/api/geospatial/zones')
      ]);
      
      setHeatmapData(heatmapResponse.data);
      setScatterData(scatterResponse.data);
      setRadarData(radarResponse.data);
      setZoneData(zoneResponse.data);
    } catch (error) {
      console.error('Error fetching geospatial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const visualizationOptions = [
    { id: 'heatmap', label: '🔥 Pollution Heatmap', description: 'Spatial distribution of air quality' },
    { id: 'zones', label: '🏙️ City Zones', description: 'Administrative and environmental zones' },
    { id: 'scatter', label: '📊 Environmental vs Economic', description: 'Relationship analysis' },
    { id: 'radar', label: '🎯 Location Comparison', description: 'Multi-dimensional comparison' }
  ];

  const renderVisualization = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading geospatial data...</p>
        </div>
      );
    }

    switch (activeVisualization) {
      case 'heatmap':
        return <HeatmapVisualization data={heatmapData} />;
      case 'zones':
        return <ZoneMap data={zoneData} />;
      case 'scatter':
        return <ScatterAnalysis data={scatterData} />;
      case 'radar':
        return <RadarComparison data={radarData} />;
      default:
        return null;
    }
  };

  return (
    <div className="geospatial-tab">
      <div className="geospatial-header">
        <h2>🗺️ Geospatial Analysis</h2>
        <p>Spatial intelligence for environmental monitoring</p>
      </div>

      <div className="visualization-selector">
        {visualizationOptions.map(option => (
          <div
            key={option.id}
            className={`visualization-option ${activeVisualization === option.id ? 'active' : ''}`}
            onClick={() => setActiveVisualization(option.id)}
          >
            <div className="option-header">
              <span className="option-label">{option.label}</span>
            </div>
            <div className="option-description">{option.description}</div>
          </div>
        ))}
      </div>

      <div className="visualization-container">
        <div className="visualization-content">
          {renderVisualization()}
        </div>
        
        <div className="visualization-info">
          <h4>📋 Analysis Summary</h4>
          <div className="info-stats">
            <div className="info-stat">
              <span className="stat-label">Data Points:</span>
              <span className="stat-value">{heatmapData.length}</span>
            </div>
            <div className="info-stat">
              <span className="stat-label">Coverage Area:</span>
              <span className="stat-value">125 km²</span>
            </div>
            <div className="info-stat">
              <span className="stat-label">Zones:</span>
              <span className="stat-value">{zoneData.length}</span>
            </div>
            <div className="info-stat">
              <span className="stat-label">Last Updated:</span>
              <span className="stat-value">Real-time</span>
            </div>
          </div>
          
          <div className="legend">
            <h5>🎨 Legend</h5>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color good"></div>
                <span>Good (0-50 AQI)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color moderate"></div>
                <span>Moderate (51-100 AQI)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color unhealthy"></div>
                <span>Unhealthy (101+ AQI)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
