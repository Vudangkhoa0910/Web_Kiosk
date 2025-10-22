/**
 * CÁCH 1: Sử dụng API với Fixed Token
 * Đơn giản, phù hợp cho testing hoặc single-user app
 */

import axios, { type AxiosInstance } from 'axios';

// ===============================================
// BƯỚC 1: Lấy token từ admin của API
// ===============================================
// Cách lấy token:
// 1. Đăng nhập vào https://portal.alphaasimov.com
// 2. Mở DevTools → Application/Local Storage
// 3. Tìm key 'abp.auth.session' → Copy access_token
// 4. Paste vào đây (token có thời hạn, cần update thường xuyên)

const API_CONFIG = {
  baseURL: 'https://api.alphaasimov.com',
  
  // TODO: Thay bằng token thực tế
  // Token này sẽ hết hạn sau 1 khoảng thời gian (thường 1 giờ - 1 ngày)
  accessToken: 'YOUR_ACCESS_TOKEN_HERE',
  
  // Hoặc nếu admin cấp API Key
  // apiKey: 'YOUR_API_KEY_HERE',
};

// ===============================================
// BƯỚC 2: Tạo Axios instance với token
// ===============================================
class OrdersApi {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        // Thêm Bearer token vào mọi request
        'Authorization': `Bearer ${API_CONFIG.accessToken}`,
        
        // Nếu dùng API Key thay vì token:
        // 'X-API-Key': API_CONFIG.apiKey,
      },
    });

    // Error handler
    this.axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          console.error('❌ Token hết hạn hoặc không hợp lệ!');
          console.log('👉 Cần lấy token mới từ admin hoặc đăng nhập lại');
        }
        return Promise.reject(error);
      }
    );
  }

  // ===============================================
  // BƯỚC 3: Implement các API methods
  // ===============================================

  /**
   * Lấy danh sách orders
   */
  async getOrders(params?: {
    skipCount?: number;
    maxResultCount?: number;
    filterText?: string;
    status?: number[];
  }) {
    try {
      const response = await this.axios.get('/api/app/orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error getting orders:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Tạo order mới
   */
  async createOrder(input: {
    note?: string;
    sender: {
      name: string;
      phone: string;
      address: string;
      coordinates: { latitude: number; longitude: number };
    };
    recipients: Array<{
      name: string;
      phone: string;
      address: string;
      coordinates: { latitude: number; longitude: number };
      items?: Array<{ description: string }>;
    }>;
  }) {
    try {
      const response = await this.axios.post('/api/app/orders/create-order', input);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy chi tiết order
   */
  async getOrderById(id: string) {
    try {
      const response = await this.axios.get(`/api/app/orders/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting order:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Tracking order (public endpoint - không cần token)
   */
  async trackOrder(id: string) {
    try {
      // Gọi trực tiếp không cần token
      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/app/orders/tracking/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error tracking order:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Hủy order
   */
  async cancelOrder(deliveryId: string, reasonCode: string, reasonNote?: string) {
    try {
      const response = await this.axios.post('/api/app/orders/cancel-order', {
        deliveryId,
        reasonCode,
        reasonNote,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error cancelling order:', error.response?.data || error.message);
      throw error;
    }
  }
}

// ===============================================
// BƯỚC 4: Export instance để sử dụng
// ===============================================
export const ordersApi = new OrdersApi();

// ===============================================
// CÁCH SỬ DỤNG TRONG COMPONENT
// ===============================================
/*
import { ordersApi } from '@/services/orders-api-simple';

// Trong React component:
const MyComponent = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await ordersApi.getOrders({
        maxResultCount: 10,
        status: [10, 100] // Pending, InProgress
      });
      
      console.log('Total orders:', result.totalCount);
      setOrders(result.items);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const result = await ordersApi.createOrder({
        note: 'Test order',
        sender: {
          name: 'Nguyễn Văn A',
          phone: '0901234567',
          address: '123 Nguyễn Huệ',
          coordinates: { latitude: 10.7756, longitude: 106.7019 }
        },
        recipients: [{
          name: 'Trần Thị B',
          phone: '0907654321',
          address: '456 Lê Lợi',
          coordinates: { latitude: 10.7699, longitude: 106.6982 },
          items: [{ description: 'Package 1' }]
        }]
      });
      
      console.log('Order created:', result);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateOrder}>Create Order</button>
      {orders.map(order => (
        <div key={order.id}>{order.code}</div>
      ))}
    </div>
  );
};
*/

// ===============================================
// LƯU Ý QUAN TRỌNG
// ===============================================
/*
1. ⚠️ Token sẽ HẾT HẠN (thường sau 1 giờ - 1 ngày)
   → Khi gặp lỗi 401, cần lấy token mới

2. 🔒 KHÔNG commit token vào Git
   → Dùng .env file để lưu token

3. 📝 Cách lấy token mới:
   - Đăng nhập vào portal
   - DevTools → Application → Local Storage
   - Copy 'access_token' từ 'abp.auth.session'
   - Update vào API_CONFIG.accessToken

4. ✅ Nếu admin cấp API Key (không hết hạn):
   → Dùng header 'X-API-Key' thay vì Bearer token
   → An toàn hơn và không cần renew

5. 🌐 CORS phải được config ở backend
   → Nếu gặp lỗi CORS, liên hệ admin để thêm domain của bạn
*/
