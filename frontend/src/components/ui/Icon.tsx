import React from 'react';
import { 
  Home,
  Bot,
  Map,
  ShoppingBag,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Plus,
  Minus,
  Star,
  Clock,
  MapPin,
  Phone,
  Navigation,
  Zap,
  Target,
  Shield,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle,
  Circle,
  Package,
  User,
  Truck,
  MoreHorizontal,
  Wifi,
  WifiOff,
  Loader2,
  Coffee,
  Heart,
  Smartphone,
  Leaf
} from 'lucide-react';

// Icon size mapping
const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4', 
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10'
};

// Icon color mapping with Alpha Asimov theme
const iconColors = {
  primary: 'text-primary-600',
  secondary: 'text-accent-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
  gray: 'text-gray-600',
  white: 'text-white',
  current: 'text-current'
};

// Unified icon component
interface IconProps {
  name: keyof typeof iconMap;
  size?: keyof typeof iconSizes;
  color?: keyof typeof iconColors;
  className?: string;
}

// Map of all available icons
const iconMap = {
  // Navigation
  home: Home,
  bot: Bot,
  map: Map,
  'shopping-bag': ShoppingBag,
  activity: Activity,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  x: X,

  // Actions
  search: Search,
  filter: Filter,
  plus: Plus,
  minus: Minus,
  'arrow-right': ArrowRight,
  eye: Eye,
  'more-horizontal': MoreHorizontal,

  // Status & Progress
  star: Star,
  clock: Clock,
  'map-pin': MapPin,
  phone: Phone,
  navigation: Navigation,
  zap: Zap,
  target: Target,
  shield: Shield,
  'trending-up': TrendingUp,
  'check-circle': CheckCircle,
  circle: Circle,

  // Delivery & Orders
  package: Package,
  user: User,
  truck: Truck,

  // Connectivity
  wifi: Wifi,
  'wifi-off': WifiOff,
  'loader-2': Loader2,

  // Categories
  coffee: Coffee,
  heart: Heart,
  smartphone: Smartphone,
  leaf: Leaf
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  color = 'current',
  className = ''
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const classes = `${iconSizes[size]} ${iconColors[color]} ${className}`.trim();

  return <IconComponent className={classes} />;
};

// Export specific icons for direct use (backwards compatibility)
export {
  Home,
  Bot,
  Map,
  ShoppingBag,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Plus,
  Minus,
  Star,
  Clock,
  MapPin,
  Phone,
  Navigation,
  Zap,
  Target,
  Shield,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle,
  Circle,
  Package,
  User,
  Truck,
  MoreHorizontal,
  Wifi,
  WifiOff,
  Loader2,
  Coffee,
  Heart,
  Smartphone,
  Leaf
};

// Icon categories for easy reference
export const IconCategories = {
  navigation: ['home', 'bot', 'map', 'shopping-bag', 'activity'] as const,
  actions: ['search', 'filter', 'plus', 'minus', 'arrow-right', 'eye'] as const,
  status: ['star', 'clock', 'zap', 'target', 'shield', 'trending-up'] as const,
  delivery: ['package', 'user', 'truck', 'map-pin', 'phone', 'navigation'] as const,
  connectivity: ['wifi', 'wifi-off', 'loader-2'] as const,
  categories: ['coffee', 'heart', 'smartphone', 'leaf'] as const
};

// Helper function to get all icons in a category
export const getIconsByCategory = (category: keyof typeof IconCategories) => {
  return IconCategories[category];
};

// Usage examples:
// <Icon name="home" size="lg" color="primary" />
// <Icon name="bot" size="md" color="success" className="animate-pulse" />

export default Icon;
