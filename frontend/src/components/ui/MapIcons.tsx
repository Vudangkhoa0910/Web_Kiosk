import React from 'react';

interface MapIconProps {
  icon: React.ComponentType<any>;
  color?: string;
  size?: number;
  className?: string;
}

export const MapIcon: React.FC<MapIconProps> = ({ 
  icon: IconComponent, 
  color = '#3b82f6', 
  size = 24,
  className = ''
}) => {
  return (
    <div 
      className={`map-icon ${className}`}
      style={{
        width: size,
        height: size,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconComponent size={size * 0.8} />
    </div>
  );
};

// Custom map marker components for different entity types
export const StoreMarkerIcon: React.FC<{ color?: string }> = ({ color = '#10b981' }) => (
  <div 
    className="store-marker"
    style={{
      width: 32,
      height: 32,
      backgroundColor: color,
      border: '3px solid white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px'
    }}
  >
    🏪
  </div>
);

export const CustomerMarkerIcon: React.FC<{ color?: string }> = ({ color = '#f59e0b' }) => (
  <div 
    className="customer-marker"
    style={{
      width: 32,
      height: 32,
      backgroundColor: color,
      border: '3px solid white',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px'
    }}
  >
    👤
  </div>
);

export const RobotMarkerIcon: React.FC<{ status?: string; color?: string }> = ({ 
  status = 'available', 
  color 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'delivering': return '#3b82f6';
      case 'charging': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      className="robot-marker"
      style={{
        width: 36,
        height: 36,
        backgroundColor: color || getStatusColor(status),
        border: '3px solid white',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      }}
    >
      🤖
    </div>
  );
};

export const UserLocationIcon: React.FC<{ color?: string }> = ({ color = '#8b5cf6' }) => (
  <div 
    className="user-location-marker animate-pulse"
    style={{
      width: 20,
      height: 20,
      backgroundColor: color,
      border: '3px solid white',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div 
      style={{
        width: 8,
        height: 8,
        backgroundColor: 'white',
        borderRadius: '50%'
      }}
    />
  </div>
);