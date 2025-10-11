import { create } from 'zustand';
import type { Robot, Order, Store, NavigationSection } from '../types';
// import { OrderService, StoreService, RobotService } from '../services/api'; // TODO: Uncomment when ready

interface AppState {
  // Data - will be loaded from API
  robots: Robot[];
  orders: Order[];
  stores: Store[];
  
  // Loading states
  isLoadingRobots: boolean;
  isLoadingOrders: boolean;
  isLoadingStores: boolean;
  
  // UI State
  activeSection: NavigationSection;
  selectedRobot: Robot | null;
  selectedOrder: Order | null;
  
  // Maps State
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  
  // Actions
  setActiveSection: (section: NavigationSection) => void;
  setSelectedRobot: (robot: Robot | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;
  
  // Data Actions
  loadRobots: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadStores: () => Promise<void>;
  updateRobotStatus: (robotId: string, status: Robot['status']) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;
  
  // Filters
  orderStatusFilter: Order['status'] | 'all';
  robotStatusFilter: Robot['status'] | 'all';
  setOrderStatusFilter: (status: Order['status'] | 'all') => void;
  setRobotStatusFilter: (status: Robot['status'] | 'all') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial Data - empty, will be loaded from API
  robots: [],
  orders: [],
  stores: [],
  
  // Loading states
  isLoadingRobots: false,
  isLoadingOrders: false,
  isLoadingStores: false,
  
  // Initial UI State
  activeSection: 'home',
  selectedRobot: null,
  selectedOrder: null,
  
  // Initial Maps State
  mapCenter: { lat: 10.7769, lng: 106.7009 }, // Ho Chi Minh City
  mapZoom: 15,
  
  // UI Actions
  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedRobot: (robot) => set({ selectedRobot: robot }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  
  // Data Loading Actions
  loadRobots: async () => {
    set({ isLoadingRobots: true });
    try {
      // TODO: Uncomment when API is ready
      // const response = await RobotService.getRobots();
      // set({ robots: response.data?.robots || [] });
      console.log('TODO: Load robots from API');
    } catch (error) {
      console.error('Failed to load robots:', error);
    } finally {
      set({ isLoadingRobots: false });
    }
  },

  loadOrders: async () => {
    set({ isLoadingOrders: true });
    try {
      // TODO: Uncomment when API is ready
      // const response = await OrderService.getLiveOrders();
      // set({ orders: response.data?.orders || [] });
      console.log('TODO: Load orders from API');
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  loadStores: async () => {
    set({ isLoadingStores: true });
    try {
      // TODO: Uncomment when API is ready
      // const response = await StoreService.getStores();
      // set({ stores: response.data?.stores || [] });
      console.log('TODO: Load stores from API');
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      set({ isLoadingStores: false });
    }
  },
  
  // Data Actions
  updateRobotStatus: (robotId, status) => set((state) => ({
    robots: state.robots.map(robot =>
      robot.id === robotId
        ? { ...robot, status, lastUpdated: new Date() }
        : robot
    )
  })),
  
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(order =>
      order.id === orderId
        ? { ...order, status }
        : order
    )
  })),
  
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),
  
  // Initial Filters
  orderStatusFilter: 'all',
  robotStatusFilter: 'all',
  setOrderStatusFilter: (status) => set({ orderStatusFilter: status }),
  setRobotStatusFilter: (status) => set({ robotStatusFilter: status }),
}));

// Computed selectors
export const useFilteredOrders = () => {
  const { orders, orderStatusFilter } = useAppStore();
  
  if (orderStatusFilter === 'all') {
    return orders;
  }
  
  return orders.filter(order => order.status === orderStatusFilter);
};

export const useFilteredRobots = () => {
  const { robots, robotStatusFilter } = useAppStore();
  
  if (robotStatusFilter === 'all') {
    return robots;
  }
  
  return robots.filter(robot => robot.status === robotStatusFilter);
};

export const useActiveOrders = () => {
  const { orders } = useAppStore();
  return orders.filter(order => 
    order.status === 'pending' || order.status === 'in_progress'
  );
};

export const useAvailableRobots = () => {
  const { robots } = useAppStore();
  return robots.filter(robot => robot.status === 'available');
};
