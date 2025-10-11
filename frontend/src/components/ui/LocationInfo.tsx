import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Target } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import type { Location } from '../../utils/mapUtils';
import { formatCoordinates, calculateDistance } from '../../utils/mapUtils';

interface LocationInfoProps {
  location: Location;
  type: 'pickup' | 'delivery' | 'robot' | 'user';
  title?: string;
  showAddressLookup?: boolean;
  onAddressFound?: (address: string) => void;
  className?: string;
}

// Mock address lookup (in production, use a geocoding service)
const mockAddressLookup = async (_lat: number, _lng: number): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock addresses for Ocean Park 2 area
  const mockAddresses = [
    'Ocean Park 2, Hà Nội',
    'Vinhomes Ocean Park 2, Gia Lâm, Hà Nội', 
    'Khu đô thị Ocean Park 2, Đa Tốn, Gia Lâm',
    'Tòa nhà A, Ocean Park 2, Hà Nội',
    'Công viên trung tâm, Ocean Park 2',
    'Trung tâm thương mại, Ocean Park 2'
  ];
  
  return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
};

export const LocationInfo: React.FC<LocationInfoProps> = ({
  location,
  type,
  title,
  showAddressLookup = false,
  onAddressFound,
  className = ''
}) => {
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (showAddressLookup && location) {
      lookupAddress();
    }
  }, [location, showAddressLookup]);

  const lookupAddress = async () => {
    setIsLoadingAddress(true);
    try {
      const foundAddress = await mockAddressLookup(location.lat, location.lng);
      setAddress(foundAddress);
      if (onAddressFound) {
        onAddressFound(foundAddress);
      }
    } catch (error) {
      console.error('Address lookup failed:', error);
      setAddress('Địa chỉ không xác định');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'pickup': return <MapPin className="w-4 h-4" />;
      case 'delivery': return <Target className="w-4 h-4" />;
      case 'robot': return <Navigation className="w-4 h-4" />;
      case 'user': return <Clock className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'pickup': return 'bg-green-500';
      case 'delivery': return 'bg-blue-500';
      case 'robot': return 'bg-purple-500';
      case 'user': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'pickup': return 'Điểm nhận';
      case 'delivery': return 'Điểm giao';
      case 'robot': return 'Robot';
      case 'user': return 'Vị trí của bạn';
      default: return 'Vị trí';
    }
  };

  return (
    <div className={`location-info ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${getTypeColor()} text-white`}>
          {getTypeIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">
              {title || getTypeLabel()}
            </h4>
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              📍 {formatCoordinates(location.lat, location.lng)}
            </p>
            
            {showAddressLookup && (
              <div className="flex items-center gap-2">
                {isLoadingAddress ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-gray-500">Đang tìm địa chỉ...</span>
                  </div>
                ) : address ? (
                  <p className="text-gray-700">🏠 {address}</p>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={lookupAddress}
                    className="text-blue-600 p-0 h-auto"
                  >
                    Tìm địa chỉ
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DistanceInfoProps {
  from: Location;
  to: Location;
  label?: string;
  showTime?: boolean;
  robotSpeed?: number; // m/s
}

export const DistanceInfo: React.FC<DistanceInfoProps> = ({
  from,
  to,
  label = 'Khoảng cách',
  showTime = true,
  robotSpeed = 1.5
}) => {
  const distance = calculateDistance(from, to);
  const timeMinutes = Math.ceil(distance / robotSpeed / 60);

  return (
    <div className="distance-info bg-blue-50 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-800">{label}</span>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-900">
            {(distance / 1000).toFixed(2)} km
          </div>
          {showTime && (
            <div className="text-sm text-blue-600">
              ⏱️ {timeMinutes} phút
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;