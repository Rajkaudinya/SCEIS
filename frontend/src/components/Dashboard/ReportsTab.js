import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExecutiveSummary from '../Reports/ExecutiveSummary';
import DetailedReport from '../Reports/DetailedReport';
import DataExport from '../Reports/DataExport';
import './ReportsTab.css';

const ReportsTab = () => {
  const [executiveSummary, setExecutiveSummary] = useState(null);
  const [detailedReport, setDetailedReport] = useState(null);
  const [activeReport, setActiveReport] = useState('executive');
  const [loading, setLoading] = useState(true);
  const [reportParams, setReportParams] = useState({
    days: 7,
    zone: 'all'
  });

  useEffect(() => {
    fetchReportsData();
  }, [reportParams]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [summaryResponse, detailedResponse] = await Promise.all([
        axios.get('/api/reports/summary'),
        axios.get(`/api/reports/detailed?days=${reportParams.days}&zone=${reportParams.zone !== 'all' ? reportParams.zone : ''}`)
      ]);
      
      setExecutiveSummary(summaryResponse.data);
      setDetailedReport(detailedResponse.data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { id: 'executive', label: '📊 Executive Summary', description: 'High-level overview and insights' },
    { id: 'detailed', label: '📈 Detailed Analysis', description: 'Comprehensive data analysis' },
    { id: 'export', label: '💾 Data Export', description: 'Download raw data and reports' }
  ];

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating report...</p>
        </div>
      );
    }

    switch (activeReport) {
      case 'executive':
        return <ExecutiveSummary data={executiveSummary} />;
      case 'detailed':
        return <DetailedReport data={detailedReport} params={reportParams} setParams={setReportParams} />;
      case 'export':
        return <DataExport />;
      default:
        return null;
    }
  };

  return (
    <div className="reports-tab">
      <div className="reports-header">
        <h2>📋 Reports & Documentation</h2>
        <p>Comprehensive environmental intelligence reports</p>
      </div>

      <div className="report-controls">
        <div className="report-selector">
          {reportTypes.map(type => (
            <div
              key={type.id}
              className={`report-type ${activeReport === type.id ? 'active' : ''}`}
              onClick={() => setActiveReport(type.id)}
            >
              <div className="type-label">{type.label}</div>
              <div className="type-description">{type.description}</div>
            </div>
          ))}
        </div>
        
        <div className="report-actions">
          <button className="action-btn primary" onClick={fetchReportsData}>
            🔄 Refresh Data
          </button>
          <button className="action-btn secondary">
            📧 Schedule Report
          </button>
          <button className="action-btn secondary">
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div className="report-container">
        {renderReportContent()}
      </div>
    </div>
  );
};