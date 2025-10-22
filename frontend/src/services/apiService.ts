/**
 * Complete API Service for AlphaAsimov Robot Delivery System
 * 
 * This service handles all HTTP requests to the backend API
 */

import type {
  // Auth
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  // Products
  MenuItem,
  GetMenuItemsRequest,
  GetMenuItemsResponse,
  // Orders
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  Order,
  UpdateOrderStatusRequest,
  CancelOrderRequest,
  // Robots
  Robot,
  GetRobotsResponse,
  SendRobotCommandRequest,
  SendRobotCommandResponse,
  // Tracking
  GetTrackingResponse,
  DeliveryTracking,
  // Payment
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentSession,
  // Stats
  GetStatsResponse,
  // Notifications
  GetNotificationsResponse,
  Notification,
  // Generic
  APIResponse,
  APIError,
  RequestConfig,
} from '../types/api';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// ============================================
// HTTP CLIENT
// ============================================

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers(this.defaultHeaders);
    
    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const language = localStorage.getItem('language') || 'vi';
    headers.set('Accept-Language', language);

    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format');
    }

    const data = await response.json();

    if (!response.ok) {
      const error: APIError = {
        status: 'error',
        message: data.message || 'Request failed',
        code: data.code,
        details: data.details || data.error,
        timestamp: new Date().toISOString(),
      };
      throw error;
    }

    return data;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config?.timeout || DEFAULT_TIMEOUT);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(config?.headers),
        signal: config?.signal || controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config?.timeout || DEFAULT_TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(config?.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: config?.signal || controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config?.timeout || DEFAULT_TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(config?.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: config?.signal || controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config?.timeout || DEFAULT_TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(config?.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: config?.signal || controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config?.timeout || DEFAULT_TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(config?.headers),
        signal: config?.signal || controller.signal,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Create HTTP client instance
const httpClient = new HttpClient(API_BASE_URL);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store token
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>('/auth/register', userData);
    
    // Store token
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<APIResponse<User>> => {
    return httpClient.get<APIResponse<User>>('/auth/profile');
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>('/auth/refresh');
  },
};

// ============================================
// MENU/PRODUCTS API
// ============================================

export const menuAPI = {
  /**
   * Get all menu items with optional filters
   */
  getItems: async (params?: GetMenuItemsRequest): Promise<GetMenuItemsResponse> => {
    return httpClient.get<GetMenuItemsResponse>('/menu/items', { params });
  },

  /**
   * Get single menu item by ID
   */
  getItem: async (itemId: string): Promise<APIResponse<MenuItem>> => {
    return httpClient.get<APIResponse<MenuItem>>(`/menu/items/${itemId}`);
  },

  /**
   * Get menu categories
   */
  getCategories: async (): Promise<APIResponse<any[]>> => {
    return httpClient.get<APIResponse<any[]>>('/menu/categories');
  },

  /**
   * Search menu items
   */
  search: async (query: string): Promise<GetMenuItemsResponse> => {
    return httpClient.get<GetMenuItemsResponse>('/menu/search', { 
      params: { q: query } 
    });
  },
};

// ============================================
// ORDERS API
// ============================================

export const ordersAPI = {
  /**
   * Create new order
   */
  create: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    return httpClient.post<CreateOrderResponse>('/orders', orderData);
  },

  /**
   * Get orders with filters
   */
  getAll: async (params?: GetOrdersRequest): Promise<GetOrdersResponse> => {
    return httpClient.get<GetOrdersResponse>('/orders', { params });
  },

  /**
   * Get single order by ID
   */
  getById: async (orderId: string): Promise<APIResponse<Order>> => {
    return httpClient.get<APIResponse<Order>>(`/orders/${orderId}`);
  },

  /**
   * Update order status
   */
  updateStatus: async (
    orderId: string,
    statusData: UpdateOrderStatusRequest
  ): Promise<APIResponse<Order>> => {
    return httpClient.patch<APIResponse<Order>>(`/orders/${orderId}/status`, statusData);
  },

  /**
   * Cancel order
   */
  cancel: async (
    orderId: string,
    cancelData: CancelOrderRequest
  ): Promise<APIResponse<Order>> => {
    return httpClient.post<APIResponse<Order>>(`/orders/${orderId}/cancel`, cancelData);
  },

  /**
   * Get order history for current user
   */
  getHistory: async (limit = 10, offset = 0): Promise<GetOrdersResponse> => {
    return httpClient.get<GetOrdersResponse>('/orders/history', {
      params: { limit, offset },
    });
  },

  /**
   * Rate order
   */
  rate: async (
    orderId: string,
    rating: number,
    feedback?: string
  ): Promise<APIResponse<Order>> => {
    return httpClient.post<APIResponse<Order>>(`/orders/${orderId}/rate`, {
      rating,
      feedback,
    });
  },
};

// ============================================
// ROBOTS API
// ============================================

export const robotsAPI = {
  /**
   * Get all robots
   */
  getAll: async (): Promise<GetRobotsResponse> => {
    return httpClient.get<GetRobotsResponse>('/robots');
  },

  /**
   * Get single robot by ID
   */
  getById: async (robotId: string): Promise<APIResponse<Robot>> => {
    return httpClient.get<APIResponse<Robot>>(`/robots/${robotId}`);
  },

  /**
   * Send command to robot
   */
  sendCommand: async (
    robotId: string,
    commandData: SendRobotCommandRequest
  ): Promise<SendRobotCommandResponse> => {
    return httpClient.post<SendRobotCommandResponse>(
      `/robots/${robotId}/commands`,
      commandData
    );
  },

  /**
   * Get robot status
   */
  getStatus: async (robotId: string): Promise<APIResponse<Robot>> => {
    return httpClient.get<APIResponse<Robot>>(`/robots/${robotId}/status`);
  },

  /**
   * Get available robots
   */
  getAvailable: async (): Promise<GetRobotsResponse> => {
    return httpClient.get<GetRobotsResponse>('/robots/available');
  },
};

// (MoMo test endpoints merged into main paymentAPI below)

// ============================================
// TRACKING API
// ============================================

export const trackingAPI = {
  /**
   * Get delivery tracking by order ID
   */
  getByOrderId: async (orderId: string): Promise<GetTrackingResponse> => {
    return httpClient.get<GetTrackingResponse>(`/tracking/orders/${orderId}`);
  },

  /**
   * Get tracking by robot ID
   */
  getByRobotId: async (robotId: string): Promise<APIResponse<DeliveryTracking[]>> => {
    return httpClient.get<APIResponse<DeliveryTracking[]>>(`/tracking/robots/${robotId}`);
  },

  /**
   * Get real-time tracking updates
   */
  subscribe: async (orderId: string): Promise<APIResponse<any>> => {
    return httpClient.post<APIResponse<any>>(`/tracking/subscribe/${orderId}`);
  },
};

// ============================================
// PAYMENT API
// ============================================

export const paymentAPI = {
  /**
   * Create payment session
   */
  create: async (paymentData: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    return httpClient.post<CreatePaymentResponse>('/payments', paymentData);
  },

  /**
   * Get payment status
   */
  getStatus: async (paymentId: string): Promise<APIResponse<PaymentSession>> => {
    return httpClient.get<APIResponse<PaymentSession>>(`/payments/${paymentId}`);
  },

  /**
   * Verify payment
   */
  verify: async (paymentId: string, data?: any): Promise<APIResponse<PaymentSession>> => {
    return httpClient.post<APIResponse<PaymentSession>>(`/payments/${paymentId}/verify`, data);
  },

  /**
   * Cancel payment
   */
  cancel: async (paymentId: string): Promise<APIResponse<PaymentSession>> => {
    return httpClient.post<APIResponse<PaymentSession>>(`/payments/${paymentId}/cancel`);
  },

  // --- MoMo test endpoints (personal / merchant) ---
  /**
   * Create a personal MoMo payment using the test server
   * Returns { success, data: { orderId, amount, qrCodeDataURL, momoLink, phoneNumber } }
   */
  createPersonal: async (payload: { amount: number; orderInfo?: string; items?: any[] }) => {
    return httpClient.post<any>('/payment/create-personal', payload);
  },

  /**
   * Create a merchant MoMo payment using the test server (requires merchant credentials)
   */
  createMerchant: async (payload: { amount: number; orderInfo?: string; items?: any[]; userInfo?: any }) => {
    return httpClient.post<any>('/payment/create', payload);
  },
};

// ============================================
// STATS & ANALYTICS API
// ============================================

export const statsAPI = {
  /**
   * Get dashboard statistics
   */
  getDashboard: async (): Promise<GetStatsResponse> => {
    return httpClient.get<GetStatsResponse>('/stats/dashboard');
  },

  /**
   * Get order statistics
   */
  getOrders: async (period: 'day' | 'week' | 'month' | 'year'): Promise<APIResponse<any>> => {
    return httpClient.get<APIResponse<any>>('/stats/orders', { params: { period } });
  },

  /**
   * Get robot statistics
   */
  getRobots: async (): Promise<APIResponse<any>> => {
    return httpClient.get<APIResponse<any>>('/stats/robots');
  },

  /**
   * Get revenue statistics
   */
  getRevenue: async (period: 'day' | 'week' | 'month' | 'year'): Promise<APIResponse<any>> => {
    return httpClient.get<APIResponse<any>>('/stats/revenue', { params: { period } });
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsAPI = {
  /**
   * Get all notifications
   */
  getAll: async (limit = 20, offset = 0): Promise<GetNotificationsResponse> => {
    return httpClient.get<GetNotificationsResponse>('/notifications', {
      params: { limit, offset },
    });
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string): Promise<APIResponse<Notification>> => {
    return httpClient.patch<APIResponse<Notification>>(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async (): Promise<APIResponse<void>> => {
    return httpClient.post<APIResponse<void>>('/notifications/read-all');
  },

  /**
   * Delete notification
   */
  delete: async (notificationId: string): Promise<APIResponse<void>> => {
    return httpClient.delete<APIResponse<void>>(`/notifications/${notificationId}`);
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthAPI = {
  /**
   * Check API health
   */
  check: async (): Promise<APIResponse<any>> => {
    return httpClient.get<APIResponse<any>>('/health');
  },
};

// ============================================
// EXPORT ALL APIs
// ============================================

const api = {
  auth: authAPI,
  menu: menuAPI,
  orders: ordersAPI,
  robots: robotsAPI,
  tracking: trackingAPI,
  payment: paymentAPI,
  stats: statsAPI,
  notifications: notificationsAPI,
  health: healthAPI,
};

export default api;

// Also export individual APIs for convenience
export {
  httpClient,
  API_BASE_URL,
};
