export type PaymentStatus = 'pending' | 'awaiting_payment' | 'paid' | 'expired' | 'failed' | 'cancelled';

export interface PaymentRequest {
  id?: string;
  created_at?: string;
  updated_at?: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  company_name?: string;
  service_name: string;
  service_slug: string;
  amount_brl: number;
  payment_method: 'pix' | 'checkout_externo';
  gateway_provider?: string;
  checkout_url?: string;
  pix_code?: string;
  pix_qr_code_url?: string;
  external_reference?: string;
  status: PaymentStatus;
  notes?: string;
  source?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  pixCode?: string;
  error?: string;
}
