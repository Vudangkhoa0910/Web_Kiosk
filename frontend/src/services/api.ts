// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  token?: string;
  errors?: any[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'user' | 'admin' | 'operator';
  isVerified: boolean;
  lastLogin?: string;
  preferences: {
    language: 'vi' | 'en';
    notifications: {
      email: boolean;
      push: boolean;
    };
    dashboard: {
      theme: 'light' | 'dark' | 'auto';
      defaultView: 'overview' | 'robots' | 'orders' | 'maps';
    };
  };
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  preferences?: Partial<User['preferences']>;
}

// HTTP Client with automatic token handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      ...(data && { body: JSON.stringify(data) }),
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      ...(data && { body: JSON.stringify(data) }),
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Authentication Service
export class AuthService {
  // Register new user
  static async register(userData: RegisterData): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.post<{ user: User }>('/auth/register', userData);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.data?.user));
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.post<{ user: User }>('/auth/login', credentials);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.data?.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, clear local storage
      this.clearAuthData();
      throw error;
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      return await apiClient.post('/auth/forgotpassword', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(token: string, password: string): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.put<{ user: User }>(`/auth/resetpassword/${token}`, { password });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.data?.user));
      }
      
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Refresh token
  static async refreshToken(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.post<{ user: User }>('/auth/refresh');
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.data?.user));
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored user data
  static getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Get stored token
  static getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Clear authentication data
  static clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

// User Service
export class UserService {
  // Update user profile
  static async updateProfile(profileData: UpdateProfileData): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.put<{ user: User }>('/user/profile', profileData);
      
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(passwordData: ChangePasswordData): Promise<ApiResponse> {
    try {
      return await apiClient.put('/user/password', passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Delete account
  static async deleteAccount(): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete('/user/account');
      
      // Clear auth data after successful deletion
      AuthService.clearAuthData();
      
      return response;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  // Get user stats
  static async getUserStats(): Promise<ApiResponse<{ stats: any }>> {
    try {
      return await apiClient.get<{ stats: any }>('/user/stats');
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }
}

// Order Service
export class OrderService {
  // Get available items for ordering
  static async getAvailableItems(): Promise<ApiResponse<{ items: any[] }>> {
    try {
      return await apiClient.get<{ items: any[] }>('/orders/items');
    } catch (error) {
      console.error('Get available items error:', error);
      throw error;
    }
  }

  // Create new order
  static async createOrder(orderData: {
    items: { itemId: string; quantity: number }[];
    customer: { name: string; phone: string };
    deliveryLocation: { lat: number; lng: number };
  }): Promise<ApiResponse<{ order: any }>> {
    try {
      return await apiClient.post<{ order: any }>('/orders', orderData);
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Get live orders (for restaurant/admin view)
  static async getLiveOrders(): Promise<ApiResponse<{ orders: any[] }>> {
    try {
      return await apiClient.get<{ orders: any[] }>('/orders/live');
    } catch (error) {
      console.error('Get live orders error:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<{ order: any }>> {
    try {
      return await apiClient.put<{ order: any }>(`/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<ApiResponse<{ order: any }>> {
    try {
      return await apiClient.get<{ order: any }>(`/orders/${orderId}`);
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  // Get user's orders
  static async getUserOrders(): Promise<ApiResponse<{ orders: any[] }>> {
    try {
      return await apiClient.get<{ orders: any[] }>('/orders/user');
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string): Promise<ApiResponse<{ order: any }>> {
    try {
      return await apiClient.put<{ order: any }>(`/orders/${orderId}/cancel`);
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  // Get order analytics
  static async getOrderAnalytics(): Promise<ApiResponse<{ analytics: any }>> {
    try {
      return await apiClient.get<{ analytics: any }>('/orders/analytics');
    } catch (error) {
      console.error('Get order analytics error:', error);
      throw error;
    }
  }
}

// Store Service
export class StoreService {
  // Get available stores
  static async getStores(): Promise<ApiResponse<{ stores: any[] }>> {
    try {
      return await apiClient.get<{ stores: any[] }>('/stores');
    } catch (error) {
      console.error('Get stores error:', error);
      throw error;
    }
  }

  // Get store by ID
  static async getStoreById(storeId: string): Promise<ApiResponse<{ store: any }>> {
    try {
      return await apiClient.get<{ store: any }>(`/stores/${storeId}`);
    } catch (error) {
      console.error('Get store by ID error:', error);
      throw error;
    }
  }

  // Get store menu/items
  static async getStoreItems(storeId: string): Promise<ApiResponse<{ items: any[] }>> {
    try {
      return await apiClient.get<{ items: any[] }>(`/stores/${storeId}/items`);
    } catch (error) {
      console.error('Get store items error:', error);
      throw error;
    }
  }

  // Get store categories
  static async getCategories(): Promise<ApiResponse<{ categories: any[] }>> {
    try {
      return await apiClient.get<{ categories: any[] }>('/stores/categories');
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }
}

// Robot Service (for monitoring and control)
export class RobotService {
  // Get all robots
  static async getRobots(): Promise<ApiResponse<{ robots: any[] }>> {
    try {
      return await apiClient.get<{ robots: any[] }>('/robots');
    } catch (error) {
      console.error('Get robots error:', error);
      throw error;
    }
  }

  // Get robot by ID
  static async getRobotById(robotId: string): Promise<ApiResponse<{ robot: any }>> {
    try {
      return await apiClient.get<{ robot: any }>(`/robots/${robotId}`);
    } catch (error) {
      console.error('Get robot by ID error:', error);
      throw error;
    }
  }

  // Send command to robot
  static async sendRobotCommand(robotId: string, command: any): Promise<ApiResponse<{ result: any }>> {
    try {
      return await apiClient.post<{ result: any }>(`/robots/${robotId}/commands`, command);
    } catch (error) {
      console.error('Send robot command error:', error);
      throw error;
    }
  }

  // Get robot analytics
  static async getRobotAnalytics(): Promise<ApiResponse<{ analytics: any }>> {
    try {
      return await apiClient.get<{ analytics: any }>('/robots/analytics');
    } catch (error) {
      console.error('Get robot analytics error:', error);
      throw error;
    }
  }
}

// Export API client for direct use if needed
export { apiClient };

// Default export
export default {
  AuthService,
  UserService,
  OrderService,
  StoreService,
  RobotService,
  apiClient,
};
