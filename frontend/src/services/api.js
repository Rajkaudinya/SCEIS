import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Dashboard API calls
export const dashboardApi = {
  getMetrics: () => api.get('/dashboard/metrics'),
  getLocations: () => api.get('/dashboard/locations'),
  getTrends: (days = 30) => api.get(`/dashboard/trends?days=${days}`)
};

// Analytics API calls
export const analyticsApi = {
  getCorrelations: () => api.get('/analytics/correlations'),
  getHotspots: () => api.get('/analytics/hotspots'),
  getClusters: () => api.get('/analytics/clusters'),
  getZoneAnalysis: () => api.get('/analytics/zones')
};

// Predictions API calls
export const predictionsApi = {
  calculateHealthScore: (data) => api.post('/predictions/health-score', data),
  getFeatureImportance: () => api.get('/predictions/feature-importance'),
  getForecast: (locationId) => api.get(`/predictions/forecast?locationId=${locationId}`)
};

// Geospatial API calls
export const geospatialApi = {
  getHeatmapData: () => api.get('/geospatial/heatmap'),
  getScatterAnalysis: () => api.get('/geospatial/scatter-analysis'),
  getRadarComparison: (locations) => api.get(`/geospatial/radar-comparison?locations=${locations.join(',')}`),
  getZones: () => api.get('/geospatial/zones')
};

// Reports API calls
export const reportsApi = {
  getSummary: () => api.get('/reports/summary'),
  getDetailedReport: (params) => api.get('/reports/detailed', { params }),
  exportData: (format, days) => api.get(`/reports/export?format=${format}&days=${days}`)
};

export default api;