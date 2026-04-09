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
  instagram: z.string(),
  hero_headline: z.string(),
  hero_subheadline: z.string(),
  about_text_short: z.string(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    async function load() {
      const { data } = await getSiteSettings();
      if (data) {
        setSettingsId(data.id);
        reset(data);
      }
      setLoading(false);
    }
    load();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!settingsId) return;
    setSaving(true);
    await updateSiteSettings({ ...data, id: settingsId });
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
                <Input {...register('instagram')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" /> Seção Hero
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
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
