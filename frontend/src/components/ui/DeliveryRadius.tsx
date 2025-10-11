import React from 'react';
import { Circle } from 'react-leaflet';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { Badge } from './Badge';
import type { Location } from '../../utils/mapUtils';
import { isWithinDeliveryRadius } from '../../utils/mapUtils';

interface DeliveryRadiusProps {
  center: Location;
  radius?: number; // meters
  showRadius?: boolean;
}

export const DeliveryRadius: React.FC<DeliveryRadiusProps> = ({
  center,
  radius = 2000, // 2km default
  showRadius = true
}) => {
  return (
    <>
      {/* Delivery radius circle */}
      {showRadius && (
        <Circle
          center={[center.lat, center.lng]}
          radius={radius}
          pathOptions={{
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '10, 10'
          }}
        />
      )}
    </>
  );
};

interface DeliveryValidationProps {
  center: Location;
  pickup?: Location;
  delivery?: Location;
  radius?: number;
  className?: string;
}

export const DeliveryValidation: React.FC<DeliveryValidationProps> = ({
  center,
  pickup,
  delivery,
  radius = 2000,
  className = ''
}) => {
  const pickupInRadius = pickup ? isWithinDeliveryRadius(center, pickup, radius) : true;
  const deliveryInRadius = delivery ? isWithinDeliveryRadius(center, delivery, radius) : true;
  
  const allValid = pickupInRadius && deliveryInRadius;

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (isValid: boolean) => {
    return (
      <Badge 
        variant={isValid ? 'success' : 'danger'}
        className="text-xs"
      >
        {isValid ? 'OK' : 'Out of range'}
      </Badge>
    );
  };

  return (
    <div className={`delivery-validation space-y-3 ${className}`}>
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Delivery Zone Validation
        </h4>
        
        <div className="space-y-2 text-sm">
          {pickup && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(pickupInRadius)}
                <span>Pickup Point</span>
              </div>
              {getStatusBadge(pickupInRadius)}
            </div>
          )}
          
          {delivery && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(deliveryInRadius)}
                <span>Delivery Point</span>
              </div>
              {getStatusBadge(deliveryInRadius)}
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status</span>
              <Badge 
                variant={allValid ? 'success' : 'warning'}
                className="text-xs"
              >
                {allValid ? 'Ready for delivery' : 'Check points'}
              </Badge>
            </div>
          </div>
        </div>
        
        {!allValid && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Some points are outside the delivery radius ({(radius/1000).toFixed(1)}km). 
            Please select points within the service area.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRadius;