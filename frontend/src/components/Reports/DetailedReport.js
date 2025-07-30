import React from 'react';

const DetailedReport = ({ reportData }) => {
  if (!reportData) {
    return <p style={{ padding: '20px', color: '#777' }}>No detailed report available.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Detailed Environmental Report</h2>
      <p><strong>Date:</strong> {reportData.date}</p>
      <p><strong>Air Quality Index:</strong> {reportData.aqi}</p>
      <p><strong>Noise Level:</strong> {reportData.noise} dB</p>
      <p><strong>Population Exposure Risk:</strong> {reportData.risk}</p>
      <p><strong>Suggested Action:</strong> {reportData.action}</p>
    </div>
  );
};

export default DetailedReport;