import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2,
  Image as ImageIcon,
  FileText,
  Save,
  Calendar,
  Layers
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { getPosts, upsertPost, deletePost } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

interface Post {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image_url: string;
  category: string;
  status: 'draft' | 'published';
  published_at?: string;
}

const initialForm: Post = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  cover_image_url: '',
  category: '',
  status: 'draft'
};

export function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Post>(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    const { data } = await getPosts();
    setPosts(data || []);
    setLoading(false);
  }

  const handleEdit = (post: Post) => {
    setFormData(post);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    await deletePost(id);
    loadPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const postToSave = {
      ...formData,
      published_at: formData.status === 'published' && !formData.published_at 
        ? new Date().toISOString() 
        : formData.published_at
    };

    const { error } = await upsertPost(postToSave);
    if (!error) {
      setIsFormOpen(false);
      setFormData(initialForm);
      loadPosts();
    } else {
      alert('Erro ao salvar post');
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
            <h2 className="text-2xl font-bold text-zinc-950">{formData.id ? 'Editar Post' : 'Novo Post'}</h2>
            <p className="text-sm text-zinc-500">Gestão de conteúdo institucional.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="rounded-full" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button className="gap-2 rounded-full px-8" onClick={handleSubmit} disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Post'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Título do Post</label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({ ...prev, title, slug: prev.id ? prev.slug : generateSlug(title) }));
                    }}
                    placeholder="Ex: Novos padrões de UI para 2024" 
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">Slug (URL)</label>
                    <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">Categoria</label>
                    <Input value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Ex: Tecnologia" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Resumo (Summary)</label>
                  <Textarea value={formData.summary} onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))} placeholder="Uma breve introdução para atrair o leitor..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-500">Conteúdo (Markdown/Text)</label>
                  <Textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={12} placeholder="Escreva seu artigo aqui..." />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <ImageUpload 
                  label="Imagem de Capa"
                  bucket="posts"
                  value={formData.cover_image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                />

                <div className="pt-4 border-t border-zinc-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700">Status</label>
                    <select 
                      className="text-sm border-none bg-zinc-100 rounded-lg px-3 py-1.5 focus:ring-0"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                  {formData.published_at && (
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Publicado em:</span>
                      <span>{new Date(formData.published_at).toLocaleDateString()}</span>
                    </div>
                  )}
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
          <Input className="pl-10" placeholder="Buscar posts..." />
        </div>
        <Button className="gap-2 rounded-full px-6 w-full sm:w-auto" onClick={() => { setFormData(initialForm); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4" /> Novo Post
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-100 animate-pulse rounded-xl" />
          ))
        ) : posts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-zinc-200">
            <FileText className="w-8 h-8 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-bold text-zinc-950">Nenhuma postagem encontrada</h3>
            <p className="text-sm text-zinc-500 mt-1">Comece criando seu primeiro artigo.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden">
                  {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-primary px-1.5 py-0.5 rounded bg-primary/5">
                      {post.category}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                      post.status === 'published' ? "text-emerald-600 bg-emerald-50" : "text-zinc-500 bg-zinc-100"
                    )}>
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-950 truncate">{post.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-zinc-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Não publicado'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="rounded-full" onClick={() => handleEdit(post)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => post.id && handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
