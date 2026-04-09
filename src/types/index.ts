export interface Lead {
  id?: string;
  created_at?: string;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  service_interest: string;
  message: string;
  source?: string;
}

export type ServiceType = 'site' | 'landing_page' | 'system' | 'other';
