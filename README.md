# Life Dev | Sites & Sistemas

Site oficial da Life Dev, focado em apresentar soluções digitais premium (sites, landing pages e sistemas) com alto padrão visual e técnico.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Backend**: Preparado para Supabase

## Setup

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura de Pastas

- `src/components/ui`: Componentes de interface reutilizáveis.
- `src/components/sections`: Seções principais da página inicial.
- `src/lib`: Utilitários e configurações de serviços (Supabase, etc).
- `src/types`: Definições de tipos TypeScript.
- `src/constants.ts`: Informações institucionais e constantes globais.

## Integração Supabase

O formulário de contato está preparado para enviar leads para uma tabela chamada `contact_leads` no Supabase. Caso as variáveis de ambiente não estejam configuradas, o sistema exibirá um aviso no console e o formulário degradará graciosamente.

**Schema esperado para `contact_leads`:**
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `name`: text
- `company`: text
- `email`: text
- `whatsapp`: text
- `service_interest`: text
- `message`: text
- `source`: text
