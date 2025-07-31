import moment from 'moment';
import _ from 'lodash';

// Format API response data
export const formatTimeSeriesData = (data, dateField = 'date', valueField = 'value') => {
  return data.map(item => ({
    ...item,
    [dateField]: moment(item[dateField]).format('YYYY-MM-DD'),
    [valueField]: Number(item[valueField])
  }));
};

// Calculate moving average
export const calculateMovingAverage = (data, window = 7) => {
  const result = [];
  for (let i = window - 1; i < data.length; i++) {
    const slice = data.slice(i - window + 1, i + 1);
    const average = slice.reduce((sum, val) => sum + val, 0) / window;
    result.push(average);
  }
  return result;
};

// Group data by time period
export const groupByTimePeriod = (data, period = 'day') => {
  return _.groupBy(data, (item) => {
    return moment(item.timestamp).startOf(period).format();
  });
};

// Calculate aggregated statistics
export const calculateStats = (data, field) => {
  const values = data.map(item => item[field]).filter(val => val != null);
  
  if (values.length === 0) return null;
  
  const sorted = values.sort((a, b) => a - b);
  
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: values.reduce((sum, val) => sum + val, 0) / values.length,
    median: sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)],
    stdDev: Math.sqrt(
      values.reduce((sum, val) => {
        const mean = values.reduce((s, v) => s + v, 0) / values.length;
        return sum + Math.pow(val - mean, 2);
      }, 0) / values.length
    )
  };
};

// Get color for AQI value
export const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#4CAF50'; // Good - Green
  if (aqi <= 100) return '#FFEB3B'; // Moderate - Yellow
  if (aqi <= 150) return '#FF9800'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#F44336'; // Unhealthy - Red
  if (aqi <= 300) return '#9C27B0'; // Very Unhealthy - Purple
  return '#8D6E63'; // Hazardous - Maroon
};

// Get AQI status text
export const getAQIStatus = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Format numbers with appropriate precision
export const formatNumber = (num, decimals = 1) => {
  if (num == null) return 'N/A';
  return Number(num).toFixed(decimals);
};

// Calculate percentage change
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

// Debounce function for API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};