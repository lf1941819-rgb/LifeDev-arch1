import { COMPANY_INFO } from '@/src/constants';

export const ADMIN_CONFIG = {
  title: "Life Dev Admin",
  description: "Painel de controle interno da Life Dev",
  navigation: [
    { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { name: 'Portfólio', href: '/admin/portfolio', icon: 'Briefcase' },
    { name: 'Postagens', href: '/admin/posts', icon: 'FileText' },
    { name: 'Leads', href: '/admin/leads', icon: 'Users' },
    { name: 'Configurações', href: '/admin/settings', icon: 'Settings' },
  ]
};
