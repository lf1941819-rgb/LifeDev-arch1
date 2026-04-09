# Life Dev Admin Panel

Painel administrativo privado para gerenciamento de conteúdo e leads da Life Dev.

## Segurança e Acesso

- **URL Privada**: O acesso é feito via `/admin`.
- **Autenticação**: Protegido por Supabase Auth.
- **NoIndex**: Configurado para não ser indexado por motores de busca.
- **Isolamento**: Nenhuma referência ao painel existe no site público.

## Módulos Implementados

1. **Dashboard**: Visão geral de métricas e leads recentes.
2. **Portfólio**: Gerenciamento de cases e projetos.
3. **Leads**: Visualização e controle de status de contatos recebidos.
4. **Configurações**: Edição de dados institucionais e textos do site.

## Setup de Banco de Dados (Supabase)

Execute os seguintes comandos SQL no editor do Supabase para criar a estrutura necessária:

```sql
-- Leads
CREATE TABLE contact_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  service_interest TEXT,
  message TEXT,
  source TEXT,
  status TEXT DEFAULT 'new'
);

-- Portfolio
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  short_description TEXT,
  full_description TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false
);

-- Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  company_display_name TEXT,
  main_whatsapp TEXT,
  main_email TEXT,
  instagram TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT
);

-- Inserir configurações iniciais
INSERT INTO site_settings (company_display_name, main_whatsapp, main_email)
VALUES ('Life Dev', '11920559685', 'contato@lifedevtech.com.br');
```

## Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
