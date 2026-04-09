import React from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';

export function AdminDashboard() {
  const stats = [
    { name: 'Total de Leads', value: '24', icon: Users, change: '+12%', color: 'text-blue-600' },
    { name: 'Projetos Ativos', value: '8', icon: Briefcase, change: '+2', color: 'text-primary' },
    { name: 'Postagens', value: '15', icon: FileText, change: '0', color: 'text-zinc-600' },
    { name: 'Taxa de Conversão', value: '4.2%', icon: TrendingUp, change: '+0.8%', color: 'text-green-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
                {stat.name}
              </CardTitle>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-950">{stat.value}</div>
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change} <span className="text-zinc-400 font-normal">desde o último mês</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Leads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-950">João da Silva</p>
                      <p className="text-xs text-zinc-500">Empresa Exemplo Ltda</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">Landing Page</p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" /> 2 horas atrás
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all group">
              <span className="text-sm font-bold">Novo Projeto</span>
              <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all group">
              <span className="text-sm font-bold">Nova Postagem</span>
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all group">
              <span className="text-sm font-bold">Configurações</span>
              <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

