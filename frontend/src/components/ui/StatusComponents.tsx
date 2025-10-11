// Loading and status components
import React from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  );
};

export const ConnectionStatus: React.FC<{ isConnected: boolean }> = ({ isConnected }) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
};

export const StatusDot: React.FC<{ 
  status: 'available' | 'delivering' | 'charging' | 'maintenance';
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    available: 'bg-green-400',
    delivering: 'bg-blue-400 animate-pulse',
    charging: 'bg-yellow-400',
    maintenance: 'bg-red-400'
  };

  return (
    <div className={`rounded-full ${sizeClasses[size]} ${statusClasses[status]}`} />
  );
};

export const ProgressBar: React.FC<{ 
  value: number; 
  max?: number; 
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}> = ({ value, max = 100, className = '', color = 'blue' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Skeleton: React.FC<{ 
  className?: string; 
  lines?: number;
}> = ({ className = '', lines = 1 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={`bg-gray-200 rounded ${className} ${i > 0 ? 'mt-2' : ''}`}
          style={{ height: lines > 1 ? '1rem' : undefined }}
        />
      ))}
    </div>
  );
};
