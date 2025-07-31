import { useState, useEffect } from 'react';
import socketService from '../services/socket';

export const useRealTimeData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();

    // Handle connection events
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle environmental updates
    socket.on('environmental-update', (data) => {
      setLastUpdate(data);
      
      // Handle alerts
      if (data.alert) {
        setAlerts(prev => [
          {
            id: Date.now(),
            type: data.alert,
            location: data.location,
            data: data.data,
            timestamp: data.timestamp
          },
          ...prev.slice(0, 9) // Keep only last 10 alerts
        ]);
      }
    });

    // Handle system health updates
    socket.on('system-health', (data) => {
      console.log('System Health:', data);
    });

    // Cleanup on unmount
    return () => {
      socketService.cleanup();
      socketService.disconnect();
    };
  }, []);

  const subscribeToLocation = (locationId) => {
    socketService.subscribeToLocation(locationId);
  };

  const clearAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    isConnected,
    lastUpdate,
    alerts,
    subscribeToLocation,
    clearAlert
  };
};