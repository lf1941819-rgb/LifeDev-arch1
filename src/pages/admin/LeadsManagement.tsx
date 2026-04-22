import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  Archive,
  Search,
  User,
  Building,
  ArrowRight,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { getLeads, updateLeadStatus } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';

export function LeadsManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    const { data } = await getLeads();
    setLeads(data || []);
    setLoading(false);
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateLeadStatus(id, status);
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            className="pl-10 rounded-full" 
            placeholder="Buscar por nome, e-mail ou empresa..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-full" onClick={loadLeads}>
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
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
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-zinc-500">
                  {search ? 'Nenhum resultado para sua busca.' : 'Nenhum lead recebido até o momento.'}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedLead(lead)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-950 text-sm">{lead.name}</span>
                        <span className="text-[10px] text-zinc-500">{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                      {lead.service_interest}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                      lead.status === 'new' ? "text-blue-600 bg-blue-50" : 
                      lead.status === 'contacted' ? "text-orange-600 bg-orange-50" :
                      lead.status === 'archived' ? "text-zinc-400 bg-zinc-50" :
                      "text-green-600 bg-green-50"
                    )}>
                      {lead.status === 'new' ? 'Novo' : 
                       lead.status === 'contacted' ? 'Contatado' : 
                       lead.status === 'archived' ? 'Arquivado' : 'Fechado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowRight className="w-4 h-4 text-zinc-300 ml-auto group-hover:translate-x-1 transition-transform group-hover:text-primary" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-950">{selectedLead.name}</h3>
                  <p className="text-xs text-zinc-500">{selectedLead.company || 'Empresa não informada'}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedLead(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{selectedLead.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <Building className="w-4 h-4 text-primary" />
                    <span>{selectedLead.company || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{new Date(selectedLead.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="font-bold">{selectedLead.service_interest}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 rounded-xl space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Mensagem</label>
                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  "{selectedLead.message || 'Sem mensagem adicional.'}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                <div className="flex gap-2">
                  <Button 
                    className="rounded-full gap-2" 
                    onClick={() => handleStatusUpdate(selectedLead.id, 'closed')}
                    disabled={selectedLead.status === 'closed'}
                  >
                    <CheckCircle className="w-4 h-4" /> Marcar como Fechado
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full gap-2"
                    onClick={() => handleStatusUpdate(selectedLead.id, 'contacted')}
                    disabled={selectedLead.status === 'contacted'}
                  >
                    <Clock className="w-4 h-4" /> Marcar Contatado
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="rounded-full gap-2 text-zinc-400 hover:text-orange-600"
                  onClick={() => handleStatusUpdate(selectedLead.id, 'archived')}
                  disabled={selectedLead.status === 'archived'}
                >
                  <Archive className="w-4 h-4" /> Arquivar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
