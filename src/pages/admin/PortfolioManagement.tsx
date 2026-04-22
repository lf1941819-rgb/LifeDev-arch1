import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2,
  Image as ImageIcon,
  Briefcase,
  X,
  Save,
  Layout,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { getPortfolioItems, upsertPortfolioItem, deletePortfolioItem } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

interface PortfolioItem {
  id?: string;
  title: string;
  slug: string;
  category: string;
  client_label: string;
  short_description: string;
  full_description: string;
  cover_image_url: string;
  gallery: any[];
  project_url: string;
  status: 'draft' | 'published';
  featured: boolean;
}

const initialForm: PortfolioItem = {
  title: '',
  slug: '',
  category: '',
  client_label: '',
  short_description: '',
  full_description: '',
  cover_image_url: '',
  gallery: [],
  project_url: '',
  status: 'draft',
  featured: false
};

export function PortfolioManagement() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<PortfolioItem>(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    const { data } = await getPortfolioItems();
    setItems(data || []);
    setLoading(false);
  }

  const handleEdit = (item: PortfolioItem) => {
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    await deletePortfolioItem(id);
    loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await upsertPortfolioItem(formData);
    if (!error) {
      setIsFormOpen(false);
      setFormData(initialForm);
      loadItems();
    } else {
      alert('Erro ao salvar projeto');
    }
    setSaving(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (isFormOpen) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b pb-6 border-zinc-200">
          <div>
            <h2 className="text-2xl font-bold text-zinc-950">{formData.id ? 'Editar Projeto' : 'Novo Projeto'}</h2>
            <p className="text-sm text-zinc-500">Preencha os dados do case de sucesso.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="rounded-full" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button className="gap-2 rounded-full px-8" onClick={handleSubmit} disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Projeto'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Título do Projeto</label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({ ...prev, title, slug: prev.id ? prev.slug : generateSlug(title) }));
                    }}
                    placeholder="Ex: Landing Page Premium" 
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">Slug (URL)</label>
                    <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">Categoria</label>
                    <Input value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Ex: Landing Page" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Descrição Curta</label>
                  <Input value={formData.short_description} onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))} placeholder="Breve resumo para o card" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Descrição Completa</label>
                  <Textarea value={formData.full_description} onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))} rows={6} placeholder="Detalhes do projeto..." />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">Cliente/Etiqueta</label>
                    <Input value={formData.client_label} onChange={(e) => setFormData(prev => ({ ...prev, client_label: e.target.value }))} placeholder="Ex: Life Dev" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">Link do Projeto</label>
                    <Input value={formData.project_url} onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))} placeholder="https://..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <ImageUpload 
                  label="Imagem de Capa"
                  bucket="portfolio"
                  value={formData.cover_image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                />

                <div className="pt-4 border-t border-zinc-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700">Status de Publicação</label>
                    <select 
                      className="text-sm border-none bg-zinc-100 rounded-lg px-3 py-1.5 focus:ring-0"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700">Destaque na Home</label>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary rounded border-zinc-300 focus:ring-primary"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input className="pl-10" placeholder="Buscar projetos..." />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 rounded-full" onClick={loadItems}>
            Atualizar
          </Button>
          <Button className="gap-2 rounded-full px-6" onClick={() => { setFormData(initialForm); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4" /> Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-zinc-100 animate-pulse rounded-2xl" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="font-bold text-zinc-950">Nenhum projeto encontrado</h3>
            <p className="text-sm text-zinc-500 mt-1">Comece adicionando seu primeiro case de sucesso.</p>
            <Button className="mt-6 gap-2 rounded-full" onClick={() => { setFormData(initialForm); setIsFormOpen(true); }}>
              <Plus className="w-4 h-4" /> Adicionar Projeto
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm group bg-white">
              <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full" onClick={() => handleEdit(item)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="rounded-full" onClick={() => item.id && handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {item.featured && (
                  <div className="absolute top-2 left-2 bg-primary text-white p-1 rounded-full">
                    <Layout className="w-3 h-3" />
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                    item.status === 'published' ? "text-emerald-600 bg-emerald-50" : "text-zinc-500 bg-zinc-100"
                  )}>
                    {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <h4 className="font-bold text-zinc-950 truncate">{item.title}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.short_description}</p>
                <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{item.client_label}</span>
                  {item.project_url && (
                    <a href={item.project_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
