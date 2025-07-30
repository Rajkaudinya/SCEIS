import React, { useState } from 'react';
import axios from 'axios';
import './HealthScorePredictor.css';

const HealthScorePredictor = () => {
  const [inputs, setInputs] = useState({
    pm25: 35,
    pm10: 65,
    no2: 45,
    so2: 20,
    co: 1.2,
    o3: 60,
    temperature: 25,
    humidity: 60,
    windSpeed: 15,
    population: 50000
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const predictHealthScore = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/predictions/health-score', inputs);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error predicting health score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-score-predictor">
      <div className="input-grid">
        <div className="input-group">
          <label>PM2.5 (μg/m³)</label>
          <input
            type="range"
            min="0"
            max="150"
            value={inputs.pm25}
            onChange={(e) => handleInputChange('pm25', e.target.value)}
          />
          <span className="input-value">{inputs.pm25}</span>
        </div>
        
        <div className="input-group">
          <label>PM10 (μg/m³)</label>
          <input
            type="range"
            min="0"
            max="300"
            value={inputs.pm10}
            onChange={(e) => handleInputChange('pm10', e.target.value)}
          />
          <span className="input-value">{inputs.pm10}</span>
        </div>
        
        <div className="input-group">
          <label>NO₂ (ppb)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={inputs.no2}
            onChange={(e) => handleInputChange('no2', e.target.value)}
          />
          <span className="input-value">{inputs.no2}</span>
        </div>
        
        <div className="input-group">
          <label>Temperature (°C)</label>
          <input
            type="range"
            min="0"
            max="50"
            value={inputs.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
          />
          <span className="input-value">{inputs.temperature}</span>
        </div>
      </div>
      
      <button 
        className="predict-btn"
        onClick={predictHealthScore}
        disabled={loading}
      >
        {loading ? 'Calculating...' : '🧮 Calculate Health Score'}
      </button>
      
      {prediction && (
        <div className="prediction-result">
          <div className="score-display">
            <div className="score-value">{prediction.healthScore}</div>
            <div className="score-label">Environmental Health Score</div>
          </div>
          <div className="risk-level">
            <span className={`risk-badge ${prediction.riskLevel.toLowerCase()}`}>
              {prediction.riskLevel} Risk
            </span>
          </div>
          <div className="recommendations">
            <h5>Recommendations:</h5>
            <ul>
              {prediction.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
