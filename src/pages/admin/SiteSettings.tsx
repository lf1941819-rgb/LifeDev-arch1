import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Globe, Mail, Phone, Instagram, Layout } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { getSiteSettings, updateSiteSettings } from '@/src/lib/supabase';

const settingsSchema = z.object({
  company_display_name: z.string().min(2),
  main_whatsapp: z.string(),
  main_email: z.string().email(),
  instagram_url: z.string().optional(),
  hero_headline: z.string(),
  hero_subheadline: z.string(),
  cta_primary_text: z.string(),
  cta_secondary_text: z.string(),
  about_text_short: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    async function load() {
      const { data } = await getSiteSettings();
      if (data) {
        reset(data);
      }
      setLoading(false);
    }
    load();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    setStatus(null);
    const { error } = await updateSiteSettings(data);
    if (error) {
      setStatus({ type: 'error', message: 'Erro ao salvar configurações.' });
    } else {
      setStatus({ type: 'success', message: 'Configurações salvas com sucesso!' });
      setTimeout(() => setStatus(null), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-950">Configurações do Site</h2>
          <p className="text-sm text-zinc-500">Gerencie as informações institucionais exibidas no site público.</p>
        </div>
        <Button type="submit" className="gap-2 rounded-full px-8" disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Institucional */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Identidade & Contato
            </CardTitle>
            <CardDescription>Informações básicas de identificação da empresa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">Nome de Exibição</label>
                <Input {...register('company_display_name')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">WhatsApp Principal</label>
                <Input {...register('main_whatsapp')} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">E-mail Principal</label>
                <Input {...register('main_email')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">Instagram</label>
                <Input {...register('instagram_url')} placeholder="https://instagram.com/perfil" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" /> Seção Hero & Chamadas
            </CardTitle>
            <CardDescription>O primeiro conteúdo que o usuário vê ao entrar no site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Headline (Título Principal)</label>
              <Input {...register('hero_headline')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Subheadline (Texto de Apoio)</label>
              <Textarea {...register('hero_subheadline')} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">Texto Botão Primário</label>
                <Input {...register('cta_primary_text')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">Texto Botão Secundário</label>
                <Input {...register('cta_secondary_text')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Short */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-zinc-500">Texto Institucional Curto</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea {...register('about_text_short')} rows={4} placeholder="Breve resumo sobre a empresa para o rodapé ou seção sobre." />
          </CardContent>
        </Card>

        {status && (
          <div className={`p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}
