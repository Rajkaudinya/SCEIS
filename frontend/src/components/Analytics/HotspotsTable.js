import React, { useState } from 'react';
import './HotspotsTable.css';

const HotspotsTable = ({ data }) => {
  const [sortField, setSortField] = useState('severity');
  const [sortDirection, setSortDirection] = useState('desc');

  if (!data || data.length === 0) {
    return (
      <div className="no-data">
        <p>No hotspot data available</p>
      </div>
    );
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="hotspots-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('location')}>
              Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('severity')}>
              Severity {sortField === 'severity' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('aqi')}>
              AQI {sortField === 'aqi' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('pm25')}>
              PM2.5 {sortField === 'pm25' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('population')}>
              Population {sortField === 'population' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((hotspot, index) => (
            <tr key={index} className={`severity-${hotspot.severity.toLowerCase()}`}>
              <td>
                <div className="location-cell">
                  <strong>{hotspot.location}</strong>
                  <small>{hotspot.zone}</small>
                </div>
              </td>
              <td>
                <span 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(hotspot.severity) }}
                >
                  {hotspot.severity}
                </span>
              </td>
              <td>{hotspot.aqi}</td>
              <td>{hotspot.pm25} μg/m³</td>
              <td>{hotspot.population.toLocaleString()}</td>
              <td>
                <button className="action-btn view">View</button>
                <button className="action-btn alert">Alert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};