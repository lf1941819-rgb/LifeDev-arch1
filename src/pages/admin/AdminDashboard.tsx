import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';
import { getLeads, getPortfolioItems, getPosts } from '@/src/lib/supabase';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: 'Total de Leads', value: '0', icon: Users, color: 'text-blue-600' },
    { name: 'Projetos Ativos', value: '0', icon: Briefcase, color: 'text-primary' },
    { name: 'Postagens', value: '0', icon: FileText, color: 'text-zinc-600' },
    { name: 'Leads Novos', value: '0', icon: TrendingUp, color: 'text-emerald-600' },
  ]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [leadsRes, portfolioRes, postsRes] = await Promise.all([
        getLeads(),
        getPortfolioItems(),
        getPosts()
      ]);

      const leads = leadsRes.data || [];
      const projects = portfolioRes.data || [];
      const posts = postsRes.data || [];

      setStats([
        { name: 'Total de Leads', value: leads.length.toString(), icon: Users, color: 'text-blue-600' },
        { name: 'Projetos', value: projects.length.toString(), icon: Briefcase, color: 'text-primary' },
        { name: 'Postagens', value: posts.length.toString(), icon: FileText, color: 'text-zinc-600' },
        { name: 'Leads Novos', value: leads.filter(l => l.status === 'new').length.toString(), icon: TrendingUp, color: 'text-emerald-600' },
      ]);

      setRecentLeads(leads.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
                {stat.name}
              </CardTitle>
              <div className={cn("p-2 rounded-lg bg-zinc-50 group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-950">{loading ? '...' : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 pb-6">
            <CardTitle className="text-lg font-bold">Leads Recentes</CardTitle>
            <Link to="/admin/leads" className="text-xs font-bold text-primary flex items-center hover:underline">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-50 animate-pulse rounded-xl" />)
              ) : recentLeads.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 text-sm italic">
                  Nenhum lead recebido ainda.
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-primary/20 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-primary">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-950">{lead.name}</p>
                        <p className="text-[10px] text-zinc-500">{lead.company || lead.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded inline-block mb-1">
                        {lead.service_interest}
                      </p>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/portfolio" className="w-full flex items-center justify-between p-4 rounded-xl bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] text-white hover:brightness-110 transition-all group">
              <span className="text-sm font-bold">Gerenciar Portfólio</span>
              <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/admin/posts" className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all group">
              <span className="text-sm font-bold">Nova Postagem</span>
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/admin/settings" className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all group">
              <span className="text-sm font-bold">Configurações Gerais</span>
              <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

