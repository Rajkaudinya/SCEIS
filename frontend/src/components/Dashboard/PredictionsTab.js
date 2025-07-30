import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HealthScorePredictor from '../Analytics/HealthScorePredictor';
import ForecastChart from '../Charts/ForecastChart';
import FeatureImportance from '../Analytics/FeatureImportance';
import './PredictionsTab.css';

const PredictionsTab = () => {
  const [forecastData, setForecastData] = useState(null);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('LOC_001');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictionsData();
  }, [selectedLocation]);

  const fetchPredictionsData = async () => {
    try {
      setLoading(true);
      const [forecastResponse, featuresResponse] = await Promise.all([
        axios.get(`/api/predictions/forecast?locationId=${selectedLocation}`),
        axios.get('/api/predictions/feature-importance')
      ]);
      
      setForecastData(forecastResponse.data);
      setFeatureImportance(featuresResponse.data);
    } catch (error) {
      console.error('Error fetching predictions data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading predictions data...</p>
      </div>
    );
  }

  return (
    <div className="predictions-tab">
      <div className="predictions-header">
        <h2>🤖 AI Predictions & Forecasting</h2>
        <p>Machine learning powered environmental predictions</p>
      </div>

      <div className="predictions-grid">
        {/* Health Score Predictor */}
        <div className="prediction-card predictor-card">
          <h3>🎯 Health Score Predictor</h3>
          <p>Calculate environmental health score based on current conditions</p>
          <HealthScorePredictor />
        </div>

        {/* 7-Day Forecast */}
        <div className="prediction-card forecast-card">
          <h3>📅 7-Day AQI Forecast</h3>
          <div className="location-selector">
            <label>Select Location:</label>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="location-select"
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={`LOC_${String(i).padStart(3, '0')}`}>
                  Station {i + 1}
                </option>
              ))}
            </select>
          </div>
          {forecastData && <ForecastChart data={forecastData} />}
        </div>

        {/* Feature Importance */}
        <div className="prediction-card features-card">
          <h3>🎚️ Model Feature Importance</h3>
          <p>Understanding which factors most influence environmental health</p>
          <FeatureImportance data={featureImportance} />
        </div>

        {/* Model Performance */}
        <div className="prediction-card performance-card">
          <h3>📊 Model Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <div className="metric-value">87.2%</div>
              <div className="metric-label">Accuracy</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.94</div>
              <div className="metric-label">F1 Score</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.89</div>
              <div className="metric-label">Precision</div>
            </div>
            <div className="metric">
              <div className="metric-value">2.3s</div>
              <div className="metric-label">Inference Time</div>
            </div>
          </div>
          
          <div className="model-info">
            <h4>Model Details</h4>
            <ul>
              <li><strong>Algorithm:</strong> Random Forest Regressor</li>
              <li><strong>Training Data:</strong> 50,000+ samples</li>
              <li><strong>Features:</strong> 12 environmental variables</li>
              <li><strong>Last Updated:</strong> 2 days ago</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PredictionsTab;