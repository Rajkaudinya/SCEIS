import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: '🏠 Overview' },
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'predictions', label: '🤖 Predictions' },
    { id: 'geospatial', label: '🗺️ Geospatial' },
    { id: 'reports', label: '📈 Reports' }
  ];

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;