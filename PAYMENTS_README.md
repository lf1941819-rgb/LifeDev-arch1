# Integração de Pagamentos Life Dev

Estrutura profissional para recebimento de pagamentos via PIX e Checkout Externo.

## Arquitetura

1.  **Frontend (React/Vite)**: 
    -   `PaymentPage`: Interface de checkout premium.
    -   `paymentService`: Camada de abstração que chama o backend.
2.  **Backend (Express)**:
    -   `server.ts`: Gerencia a criação segura de cobranças e integração com o Supabase.
    -   Valida dados e armazena segredos (API Keys) longe do cliente.
3.  **Persistência (Supabase)**:
    -   Tabela `payment_requests` rastreia todo o ciclo de vida da cobrança.

## Variáveis de Ambiente (.env)

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYMENT_PROVIDER_SECRET_KEY=your_gateway_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup de Banco de Dados

Execute no Supabase SQL Editor:

```sql
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  company_name TEXT,
  service_name TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  amount_brl DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  gateway_provider TEXT,
  checkout_url TEXT,
  pix_code TEXT,
  pix_qr_code_url TEXT,
  external_reference TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  source TEXT
);
```

## Como trocar o Gateway no futuro

Para trocar o provedor de pagamento (ex: de PIX manual para Stripe ou Mercado Pago):
1.  Edite `server.ts` na rota `/api/payments/create`.
2.  Substitua a lógica de geração de PIX/Link pela chamada da SDK do novo provedor.
3.  O frontend continuará funcionando pois utiliza a interface abstrata do `paymentService`.
