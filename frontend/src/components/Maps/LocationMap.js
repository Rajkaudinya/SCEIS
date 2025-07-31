import React from 'react';
import Plot from 'react-plotly.js';
import './LocationMap.css';

const LocationMap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="no-data">
        <p>No location data available</p>
      </div>
    );
  }

  const trace = {
    type: 'scattermapbox',
    lat: data.map((point) => point.lat),
    lon: data.map((point) => point.lon),
    mode: 'markers',
    marker: {
      size: 10,
      color: '#1E88E5'
    },
    text: data.map((point) => point.label || 'Unknown'),
  };

  const layout = {
    autosize: true,
    hovermode: 'closest',
    mapbox: {
      style: 'open-street-map',
      center: {
        lat: data[0].lat,
        lon: data[0].lon,
      },
      zoom: 10,
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
  };

  const config = {
    mapboxAccessToken: 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2ttOGVzdjEyMDBhdjJxcGplODAxMmNvayJ9.z1GEeMff8m09O2NYY5BVEg',
    responsive: true
  };

  return (
    <div className="map-container">
      <Plot data={[trace]} layout={layout} config={config} useResizeHandler style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LocationMap;