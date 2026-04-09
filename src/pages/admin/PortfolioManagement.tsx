import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Edit2,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { getPortfolioItems } from '@/src/lib/supabase';

export function PortfolioManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getPortfolioItems();
      setItems(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input className="pl-10" placeholder="Buscar projetos..." />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filtrar
          </Button>
          <Button className="gap-2 rounded-full px-6">
            <Plus className="w-4 h-4" /> Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-zinc-100 animate-pulse rounded-2xl" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="font-bold text-zinc-950">Nenhum projeto encontrado</h3>
            <p className="text-sm text-zinc-500 mt-1">Comece adicionando seu primeiro case de sucesso.</p>
            <Button className="mt-6 gap-2">
              <Plus className="w-4 h-4" /> Adicionar Projeto
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm group">
              <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                    item.status === 'published' ? "text-green-600 bg-green-50" : "text-zinc-500 bg-zinc-100"
                  )}>
                    {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <h4 className="font-bold text-zinc-950 truncate">{item.title}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.short_description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

import { Briefcase } from 'lucide-react';
import { cn } from '@/src/lib/utils';
