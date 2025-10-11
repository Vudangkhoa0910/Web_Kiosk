import React, { useState, useEffect } from 'react';
import { mqttService } from '../../services/mqttService';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  useEffect(() => {
    // Mock connection status for build
    setConnectionStatus('connected');
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'connecting':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'disconnected':
        return 'text-red-500 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        );
      case 'connecting':
        return (
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-spin border border-yellow-600 border-t-transparent"></div>
        );
      case 'disconnected':
        return (
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        );
      default:
        return (
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        );
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Real-time Data Active';
      case 'connecting':
        return 'Connecting to MQTT...';
      case 'disconnected':
        return 'Simulated Data Mode';
      default:
        return 'Unknown Status';
    }
  };

  const handleReconnect = () => {
    mqttService.disconnect();
    setTimeout(() => {
      mqttService.connect();
    }, 1000);
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">
        {getStatusText()}
      </span>
      {connectionStatus === 'disconnected' && (
        <button
          onClick={handleReconnect}
          className="ml-2 text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
