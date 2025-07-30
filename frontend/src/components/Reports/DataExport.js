import React from 'react';

const DataExport = ({ data }) => {
  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'environmental_data.csv';
    a.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={exportCSV} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Export Data as CSV
      </button>
    </div>
  );
};

export default DataExport;
