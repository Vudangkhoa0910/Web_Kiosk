/**
 * MoMo Payment Service - Riêng biệt cho MoMo test server
 * Server này chạy độc lập trên port 3000
 */

// MoMo test server URL (khác với backend chính)
const MOMO_API_BASE_URL = import.meta.env.VITE_MOMO_API_URL || 'http://localhost:3000/api';

interface MomoPaymentRequest {
  amount: number;
  orderInfo?: string;
  items?: any[];
}

interface MomoPaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    description: string;
    qrCodeDataURL: string;
    momoLink: string;
    phoneNumber: string;
    payUrl?: string;
    qrCodeUrl?: string;
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
   * Tạo thanh toán MoMo Personal (không cần merchant account)
   */
  async createPersonalPayment(payload: MomoPaymentRequest): Promise<MomoPaymentResponse> {
    try {
      console.log('🔵 MomoService: Calling', `${this.baseURL}/payment/create-personal`);
      console.log('🔵 MomoService: Payload', payload);

      const response = await fetch(`${this.baseURL}/payment/create-personal`, {
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
   * Tạo thanh toán MoMo Merchant (cần merchant account)
   */
  async createMerchantPayment(payload: MomoPaymentRequest & { userInfo?: any }): Promise<MomoPaymentResponse> {
    try {
      const response = await fetch(`${this.baseURL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('MoMo merchant payment error:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  async checkPaymentStatus(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/payment/status/${orderId}`, {
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
}

// Export singleton instance
const momoPaymentService = new MomoPaymentService(MOMO_API_BASE_URL);

export default momoPaymentService;
export { MomoPaymentService };
export type { MomoPaymentRequest, MomoPaymentResponse };
