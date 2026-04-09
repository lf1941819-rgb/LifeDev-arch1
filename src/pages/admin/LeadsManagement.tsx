import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  MoreVertical, 
  CheckCircle, 
  Clock,
  Archive,
  Search
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { getLeads, updateLeadStatus } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';

export function LeadsManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getLeads();
      setLeads(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateLeadStatus(id, status);
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input className="pl-10" placeholder="Buscar leads..." />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Lead</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Interesse</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8 bg-zinc-50/50" />
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-zinc-500">
                  Nenhum lead recebido até o momento.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-950 text-sm">{lead.name}</span>
                      <span className="text-xs text-zinc-500">{lead.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                      {lead.service_interest}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                      lead.status === 'new' ? "text-blue-600 bg-blue-50" : 
                      lead.status === 'contacted' ? "text-orange-600 bg-orange-50" :
                      "text-green-600 bg-green-50"
                    )}>
                      {lead.status === 'new' ? 'Novo' : 
                       lead.status === 'contacted' ? 'Contatado' : 'Fechado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => handleStatusUpdate(lead.id, 'contacted')}>
                        <CheckCircle className="w-4 h-4 text-zinc-400 hover:text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <Archive className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
