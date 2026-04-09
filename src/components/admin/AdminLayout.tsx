import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { authService } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Portfólio', href: '/admin/portfolio', icon: Briefcase },
  { name: 'Postagens', href: '/admin/posts', icon: FileText },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Life<span className="text-primary">Dev</span> <span className="text-[10px] opacity-50 uppercase tracking-widest ml-1">Admin</span>
            </span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="font-bold text-zinc-950">
            {navigation.find(n => n.href === location.pathname)?.name || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-950">Administrador</p>
              <p className="text-[10px] text-zinc-500">Life Dev | Sites & Sistemas</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
        </header>

        <div className="p-8 flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
}
