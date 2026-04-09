import axios from 'axios';
import { PaymentRequest, CreatePaymentResponse } from '@/src/types/payment';

/**
 * Camada de abstração para pagamentos.
 * No futuro, esta camada pode ser alterada para integrar com Stripe, Mercado Pago, etc.
 */
export const paymentService = {
  async initiatePayment(data: Omit<PaymentRequest, 'status'>): Promise<CreatePaymentResponse> {
    try {
      // Chamada para o nosso backend seguro (Express)
      const response = await axios.post('/api/payments/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao iniciar pagamento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento. Tente novamente ou fale conosco no WhatsApp.'
      };
    }
  },

  async checkStatus(paymentId: string): Promise<{ status: string }> {
    try {
      const response = await axios.get(`/api/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return { status: 'error' };
    }
  }
};
