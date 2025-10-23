/**
 * Kiosk Order Service
 * Service để tạo đơn hàng từ Kiosk đến Store thông qua Alpha Asimov API
 * 
 * ✨ Token Management: Sử dụng TokenManager để quản lý token tập trung
 */

import axios, { type AxiosInstance } from 'axios';
import type {
  CreateOrderInput,
  CreateOrderResult,
  KioskOrderRequest,
  KioskOrderResponse,
  OrderDto,
  OrderTracking,
  KioskLocation,
  StoreLocation,
  Coordinate
} from '../types/order';
import { tokenManager } from './tokenManager';

// ============================================
// CONFIG
// ============================================
const API_CONFIG = {
  // Use empty baseURL since Vite proxy handles /api/* → https://api.alphaasimov.com/*
  // Proxy config in vite.config.ts will prepend the target URL
  baseURL: '',
};

// ============================================
// PREDEFINED LOCATIONS (REAL COORDINATES)
// ============================================

// Danh sách các Kiosk có sẵn
export const KIOSKS: KioskLocation[] = [
  {
    id: 'kiosk-main',
    name: 'Kiosk Alpha Asimov',
    address: 'Điểm nhận hàng Kiosk',
    coordinates: {
      latitude: 20.959499,
      longitude: 105.746919
    }
  }
];

// Danh sách các cửa hàng/nhà hàng (nơi lấy hàng)
export const STORES: StoreLocation[] = [
  {
    id: 'store-main',
    name: 'Quầy Đồ Ăn',
    address: 'Điểm lấy hàng - Nơi đặt đồ',
    coordinates: {
      latitude: 20.959821,
      longitude: 105.746376
    },
    phone: '0901234567',
    isOpen: true
  }
];

// Kiosk mặc định (vị trí nhận hàng)
export const DEFAULT_KIOSK = KIOSKS[0];

// Store mặc định (vị trí lấy hàng)
export const DEFAULT_STORE = STORES[0];

// ============================================
// KIOSK ORDER SERVICE
// ============================================

class KioskOrderService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - thêm token (sử dụng TokenManager)
    this.axios.interceptors.request.use(
      async (config) => {
        // Get valid token from TokenManager (auto refresh if needed)
        const token = await tokenManager.getValidAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - xử lý errors
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.error('❌ Token hết hạn, attempting to refresh...');
          
          // Try to refresh token
          const newToken = await tokenManager.refreshAccessToken();
          
          if (newToken) {
            // Retry original request with new token
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axios(originalRequest);
          } else {
            console.error('❌ Token refresh failed, please login again');
            // TODO: Redirect to login or show error
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Check robot availability cho route
   * Returns: { available: boolean, message: string, robotCount?: number }
   */
  async checkRobotAvailability(params: {
    fromCoordinates: Coordinate;
    toCoordinates: Coordinate;
  }): Promise<{
    available: boolean;
    message: string;
    robotCount?: number;
    estimatedTime?: number;
  }> {
    try {
      console.log('🔍 Checking robot availability...', params);
      
      // Option 1: Try to get available robots list
      // Note: This endpoint might not exist, adjust based on actual API
      try {
        const response = await this.axios.get('/api/app/robots/available', {
          params: {
            latitude: params.fromCoordinates.latitude,
            longitude: params.fromCoordinates.longitude,
            radius: 1000 // meters
          }
        });
        
        const robots = response.data?.items || [];
        const robotCount = robots.length;
        
        if (robotCount > 0) {
          return {
            available: true,
            message: `Có ${robotCount} robot khả dụng`,
            robotCount,
            estimatedTime: 10
          };
        } else {
          return {
            available: false,
            message: 'Không có robot khả dụng trong khu vực này',
            robotCount: 0
          };
        }
      } catch (apiError) {
        // If robot list API doesn't exist, try test order creation
        console.log('⚠️ Robot list API not available, will check on order creation');
        
        return {
          available: true, // Assume available, will check when creating order
          message: 'Không thể kiểm tra robot trước. Sẽ kiểm tra khi tạo đơn.',
          robotCount: undefined
        };
      }
      
    } catch (error: any) {
      console.error('❌ Error checking robot availability:', error);
      
      return {
        available: false,
        message: 'Lỗi khi kiểm tra robot: ' + (error.message || 'Unknown error')
      };
    }
  }

  /**
   * Tạo đơn hàng từ Store đến Kiosk (simplified cho Zustand store)
   */
  async createSimpleKioskOrder(params: {
    items: Array<{ name: string; quantity: number; price: number }>;
    customerName?: string;
    customerPhone: string;
    storeId?: string;
    deliveryFee?: number;
    note?: string;
    externalId?: string; // OrderID đã được tạo sẵn để đồng bộ
  }): Promise<KioskOrderResponse> {
    // Find store by ID or use first store
    const store = params.storeId 
      ? STORES.find(s => s.id === params.storeId) || STORES[0]
      : STORES[0];
    
    const totalAmount = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0) 
      + (params.deliveryFee || 0);
    
    return this.createKioskOrder({
      store,
      kiosk: DEFAULT_KIOSK,
      customerPhone: params.customerPhone,
      customerName: params.customerName,
      items: params.items,
      note: params.note,
      totalAmount,
      externalId: params.externalId // Truyền externalId xuống
    });
  }

  /**
   * Tạo đơn hàng từ Store đến Kiosk
   */
  async createKioskOrder(request: KioskOrderRequest): Promise<KioskOrderResponse> {
    try {
      console.log('Creating kiosk order:', request);

      // Chuẩn bị data cho API
      const orderInput: CreateOrderInput = {
        // External ID để tracking - Sử dụng externalId được cung cấp hoặc tạo mới
        externalId: request.externalId || `KIOSK-${Date.now()}`,
        
        // Note chứa thông tin đơn hàng
        note: this.formatOrderNote(request),
        
        // Sender: Cửa hàng/nhà hàng
        sender: {
          name: request.store.name,
          phone: request.store.phone,
          address: request.store.address,
          coordinates: request.store.coordinates,
          note: `Store: ${request.store.id}`
        },
        
        // Recipients: Kiosk (nơi nhận hàng)
        recipients: [{
          name: request.kiosk.name,
          phone: request.customerPhone, // SĐT khách hàng để nhận thông báo
          address: request.kiosk.address,
          coordinates: request.kiosk.coordinates,
          note: `Kiosk: ${request.kiosk.id} | Customer: ${request.customerName || 'Guest'}`,
          
          // Items - danh sách món đã đặt
          items: request.items.map(item => ({
            description: `${item.name} x${item.quantity} - ${this.formatPrice(item.price * item.quantity)}`
          }))
        }],
        
        // Client ID (nếu có)
        clientId: 'Web_Kiosk',
        
        // Available robots (để trống cho backend tự chọn)
        availableRobots: []
      };

      // Gọi API tạo order
      const response = await this.axios.post<CreateOrderResult>(
        '/api/app/orders/create-order',
        orderInput
      );

      console.log('✅ Order created successfully:', response.data);

      // Parse kết quả
      const result = response.data;
      const firstDelivery = result.deliveryDtos[0];

      return {
        success: true,
        orderId: firstDelivery.orderId,
        deliveryId: firstDelivery.id,
        robotId: firstDelivery.robotId,
        estimatedTime: 10, // TODO: Tính toán dựa trên khoảng cách
        orderCode: orderInput.externalId
      };

    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      
      // Parse error message để xác định loại lỗi
      const errorData = error.response?.data?.error;
      const errorMessage = errorData?.message || error.message || 'Unknown error';
      const errorCode = errorData?.code || error.response?.data?.code;
      
      // Check for specific error types
      let friendlyMessage = errorMessage;
      let errorType: KioskOrderResponse['errorType'] = 'UNKNOWN';
      
      if (errorMessage.includes('no robot') || errorMessage.includes('No robot')) {
        errorType = 'NO_ROBOT';
        friendlyMessage = 'Không có robot khả dụng cho tuyến đường này. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.';
      } else if (error.response?.status === 401) {
        errorType = 'UNAUTHORIZED';
        friendlyMessage = 'Token hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorType = 'FORBIDDEN';
        friendlyMessage = errorMessage || 'Không có quyền thực hiện thao tác này.';
      } else if (errorMessage.includes('coordinates') || errorMessage.includes('location')) {
        errorType = 'INVALID_LOCATION';
        friendlyMessage = 'Tọa độ không hợp lệ. Vui lòng kiểm tra lại vị trí.';
      }
      
      console.log('📊 Error Details:', {
        type: errorType,
        code: errorCode,
        message: errorMessage,
        status: error.response?.status
      });
      
      return {
        success: false,
        error: friendlyMessage,
        errorType,
        errorCode,
        rawError: errorMessage
      };
    }
  }

  /**
   * Lấy thông tin tracking của order
   */
  async trackOrder(orderId: string): Promise<OrderTracking | null> {
    try {
      const response = await this.axios.get<OrderDto>(`/api/app/orders/${orderId}`);
      const order = response.data;

      return {
        orderId: order.id,
        orderCode: order.code,
        status: order.status,
        // TODO: Get real-time location from robot tracking
        currentLocation: order.sender.coordinates,
        robotId: order.id // TODO: Get from delivery
      };

    } catch (error: any) {
      console.error('❌ Error tracking order:', error);
      return null;
    }
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(deliveryId: string, reason: string): Promise<boolean> {
    try {
      await this.axios.post('/api/app/orders/cancel-order', {
        deliveryId,
        reasonCode: 'CUSTOMER_REQUEST',
        reasonNote: reason
      });

      console.log('✅ Order cancelled successfully');
      return true;

    } catch (error: any) {
      console.error('❌ Error cancelling order:', error);
      return false;
    }
  }

  /**
   * Lấy danh sách orders của kiosk
   */
  async getKioskOrders(limit: number = 10): Promise<OrderDto[]> {
    try {
      const response = await this.axios.get('/api/app/orders', {
        params: {
          maxResultCount: limit,
          skipCount: 0,
          clientId: 'Web_Kiosk'
        }
      });

      return response.data.items || [];

    } catch (error: any) {
      console.error('❌ Error getting orders:', error);
      return [];
    }
  }

  /**
   * Helper: Format order note
   */
  private formatOrderNote(request: KioskOrderRequest): string {
    const itemsList = request.items
      .map(item => `${item.name} x${item.quantity}`)
      .join(', ');

    return `Kiosk Order | Items: ${itemsList} | Total: ${this.formatPrice(request.totalAmount)} | Customer: ${request.customerPhone}`;
  }

  /**
   * Helper: Format price
   */
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  /**
   * Set access token
   */
  setAccessToken(token: string) {
    localStorage.setItem('aa_access_token', token);
  }

  /**
   * Clear access token
   */
  clearAccessToken() {
    localStorage.removeItem('aa_access_token');
  }
}

// Export singleton instance
export const kioskOrderService = new KioskOrderService();

export default kioskOrderService;
