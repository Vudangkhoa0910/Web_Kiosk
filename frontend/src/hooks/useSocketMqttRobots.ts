import { useState, useEffect } from 'react';
import { socketMqttService } from '../services/socketMqttService';
import type { RobotData, FormattedRobotStatus } from '../services/socketMqttService';

export const useSocketMqttRobots = () => {
  const [robots, setRobots] = useState<RobotData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to robot data updates
    const unsubscribeRobots = socketMqttService.subscribe((updatedRobots) => {
      setRobots(updatedRobots);
      setIsLoading(false);
    });

    // Subscribe to connection status updates
    const unsubscribeStatus = socketMqttService.subscribeToStatus((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setIsLoading(false);
      }
    });

    // Set initial data
    setRobots(socketMqttService.getRobots());
    setConnectionStatus(socketMqttService.getStatus());

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeRobots();
      unsubscribeStatus();
    };
  }, []);

  // Format robot status for display
  const formatRobotStatus = (robot: RobotData): FormattedRobotStatus => {
    return socketMqttService.formatRobotStatus(robot);
  };

  // Reconnect function
  const reconnect = () => {
    setIsLoading(true);
    socketMqttService.reconnect();
  };

  return {
    robots,
    connectionStatus,
    isLoading,
    formatRobotStatus,
    reconnect,
    isConnected: connectionStatus === 'connected',
    hasRobots: robots.length > 0
  };
};
