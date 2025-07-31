import React, { useState, useEffect } from 'react';
import './AlertNotification.css';

const AlertNotification = ({ alerts, onClearAlert }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    setVisibleAlerts(alerts.slice(0, 3)); // Show only latest 3 alerts
  }, [alerts]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'HIGH_POLLUTION': return '🚨';
      case 'SENSOR_OFFLINE': return '📡';
      case 'SYSTEM_ERROR': return '⚠️';
      default: return '🔔';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'HIGH_POLLUTION': return '#f44336';
      case 'SENSOR_OFFLINE': return '#ff9800';
      case 'SYSTEM_ERROR': return '#f44336';
      default: return '#2196f3';
    }
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="alert-notifications">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className="alert-notification"
          style={{ borderLeftColor: getAlertColor(alert.type) }}
        >
          <div className="alert-content">
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-details">
              <div className="alert-title">
                {alert.type.replace('_', ' ')} - {alert.location}
              </div>
              <div className="alert-message">
                AQI: {alert.data?.aqi} | PM2.5: {alert.data?.pm25}
              </div>
              <div className="alert-timestamp">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <button
            className="alert-close"
            onClick={() => onClearAlert(alert.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertNotification;