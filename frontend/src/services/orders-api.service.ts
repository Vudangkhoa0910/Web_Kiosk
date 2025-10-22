/**
 * Orders API Service
 * Gọi các endpoint của Orders từ Alpha Asimov Backend
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authService } from './auth.service';
import { apiConfig } from '../config/auth.config';

// Types - copy từ backend hoặc tự define
export interface CreateOrderInput {
  note?: string;
  externalId?: string;
  sender: SenderInput;
  recipients: RecipientInput[];
  clientId?: string;
  availableRobots?: string[];
}

export interface SenderInput {
  name?: string;
  phone?: string;
  address?: string;
  coordinates?: Coordinate;
  note?: string;
}

export interface RecipientInput {
  name?: string;
  phone?: string;
  address?: string;
  coordinates?: Coordinate;
  note?: string;
  items?: OrderItemDto[];
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface OrderItemDto {
  description?: string;
}

export interface CreateOrderResult {
  deliveryDtos: DeliveryDto[];
}

export interface DeliveryDto {
  id: string;
  orderId: string;
  robotId: string;
  status: string;
  // ... thêm fields khác nếu cần
}

export interface OrderDto {
  id: string;
  code?: string;
  status: number;
  note?: string;
  sender?: SenderInput;
  recipient?: RecipientInput;
  type: number;
  externalId?: string;
  clientId?: string;
  items?: OrderItemDto[];
  creationTime: string;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}

export interface GetOrdersInput {
  filterText?: string;
  code?: string;
  clientId?: string;
  status?: number[];
  note?: string;
  type?: number;
  senderAddress?: string;
  recipientAddress?: string;
  dateTimeMin?: string;
  dateTimeMax?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface CancelOrderInput {
  deliveryId: string;
  reasonCode: string;
  reasonNote?: string;
}

export interface CancelOrderResult {
  deliveryDto: DeliveryDto;
}

class OrdersApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Tạo axios instance với config
    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: apiConfig.headers,
    });

    // Interceptor: Tự động thêm Bearer token vào mọi request
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await authService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor: Xử lý response error
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Nếu 401 Unauthorized - token hết hạn
        if (error.response?.status === 401) {
          // Thử renew token
          const renewed = await authService.renewToken();
          if (renewed) {
            // Retry request với token mới
            const config = error.config;
            config.headers.Authorization = `Bearer ${renewed.access_token}`;
            return this.axiosInstance.request(config);
          } else {
            // Không renew được - redirect login
            await authService.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Tạo order mới
   * POST /api/app/orders/create-order
   */
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const response = await this.axiosInstance.post<CreateOrderResult>(
      '/api/app/orders/create-order',
      input
    );
    return response.data;
  }

  /**
   * Lấy danh sách orders
   * GET /api/app/orders
   */
  async getOrders(input: GetOrdersInput): Promise<PagedResultDto<OrderDto>> {
    const response = await this.axiosInstance.get<PagedResultDto<OrderDto>>(
      '/api/app/orders',
      { params: input }
    );
    return response.data;
  }

  /**
   * Lấy chi tiết order
   * GET /api/app/orders/{id}
   */
  async getOrder(id: string): Promise<OrderDto> {
    const response = await this.axiosInstance.get<OrderDto>(
      `/api/app/orders/${id}`
    );
    return response.data;
  }

  /**
   * Hủy order
   * POST /api/app/orders/cancel-order
   */
  async cancelOrder(input: CancelOrderInput): Promise<CancelOrderResult> {
    const response = await this.axiosInstance.post<CancelOrderResult>(
      '/api/app/orders/cancel-order',
      input
    );
    return response.data;
  }

  /**
   * Tracking order (public - không cần token)
   * GET /api/app/orders/tracking/{id}
   */
  async trackOrder(id: string): Promise<any> {
    // Gọi trực tiếp không cần token
    const response = await axios.get(
      `${apiConfig.baseURL}/api/app/orders/tracking/${id}`
    );
    return response.data;
  }

  /**
   * Lấy live orders
   * GET /api/app/orders/live-orders
   */
  async getLiveOrders(input: GetOrdersInput): Promise<PagedResultDto<any>> {
    const response = await this.axiosInstance.get<PagedResultDto<any>>(
      '/api/app/orders/live-orders',
      { params: input }
    );
    return response.data;
  }

  /**
   * Lấy orders của user hiện tại
   * GET /api/app/orders/mine
   */
  async getMyOrders(input: GetOrdersInput): Promise<PagedResultDto<OrderDto>> {
    const response = await this.axiosInstance.get<PagedResultDto<OrderDto>>(
      '/api/app/orders/mine',
      { params: input }
    );
    return response.data;
  }
}

// Export singleton instance
export const ordersApi = new OrdersApiService();
