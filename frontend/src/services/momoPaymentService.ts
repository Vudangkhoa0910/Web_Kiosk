/**
 * MoMo Payment Service - Kết nối với backend chính
 */

// Backend API URL (port 3001 - backend chính thức)
const MOMO_API_BASE_URL = import.meta.env.VITE_MOMO_API_URL || 'http://localhost:3001/api/momo';

interface MomoPaymentRequest {
  amount: number;
  orderInfo?: string;
  items?: any[];
  userInfo?: any;
}

interface MomoPaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    payUrl?: string;
    qrCodeUrl?: string;
    deeplink?: string;
  };
  error?: string;
  message?: string;
}

class MomoPaymentService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async handleResponse(response: Response): Promise<any> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  /**
   * Tạo thanh toán MoMo Merchant
   */
  async createMerchantPayment(payload: MomoPaymentRequest): Promise<MomoPaymentResponse> {
    try {
      console.log('🔵 MomoService: Calling', `${this.baseURL}/create`);
      console.log('🔵 MomoService: Payload', payload);

      const response = await fetch(`${this.baseURL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await this.handleResponse(response);
      console.log('🔵 MomoService: Response', data);
      
      return data;
    } catch (error) {
      console.error('❌ MomoService: Error', error);
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  async checkPaymentStatus(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  }

  /**
   * Giả lập thanh toán thành công (CHỈ DÙNG ĐỂ DEMO)
   */
  async simulatePaymentSuccess(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/simulate-success/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Simulate payment success error:', error);
      throw error;
    }
  }
}

// Export singleton instance
const momoPaymentService = new MomoPaymentService(MOMO_API_BASE_URL);

export default momoPaymentService;
export { MomoPaymentService };
export type { MomoPaymentRequest, MomoPaymentResponse };
