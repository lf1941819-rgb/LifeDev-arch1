import React from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { COMPANY_INFO } from '@/src/constants';
import { submitLead } from '@/src/lib/supabase';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  company: z.string().min(2, 'Empresa é obrigatória'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  service_interest: z.string().min(1, 'Selecione um serviço'),
  message: z.string().min(10, 'Mensagem muito curta'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    const { error } = await submitLead(data);
    
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      reset();
    }
  };

  return (
    <section id="contact" className="section-padding bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para elevar seu patamar digital?</h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            Estamos prontos para transformar sua visão em uma estrutura profissional, segura e lucrativa. 
            Escolha como prefere iniciar:
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">Atendimento Especializado</h4>
                <p className="text-zinc-400 mb-4">Tire suas dúvidas e receba uma orientação inicial sem compromisso.</p>
                <Button asChild variant="outline" className="rounded-full border-zinc-800 hover:bg-zinc-900 text-white">
                  <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noreferrer">
                    Falar com Especialista
                  </a>
                </Button>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800">
              <h4 className="font-bold text-lg mb-4">Contatos Institucionais</h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-400">
                <div>
                  <p className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest mb-1">Comercial</p>
                  <p>{COMPANY_INFO.email.commercial}</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest mb-1">Suporte</p>
                  <p>{COMPANY_INFO.email.support}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-zinc-950">
          <h3 className="text-2xl font-bold mb-2">Solicitar Diagnóstico</h3>
          <p className="text-zinc-500 text-sm mb-8">Preencha os dados abaixo e entraremos em contato em até 24h.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">Nome</label>
                <Input {...register('name')} placeholder="Seu nome completo" />
                {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">Empresa</label>
                <Input {...register('company')} placeholder="Nome da sua empresa" />
                {errors.company && <p className="text-red-500 text-[10px] font-bold">{errors.company.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">E-mail</label>
                <Input {...register('email')} type="email" placeholder="email@empresa.com.br" />
                {errors.email && <p className="text-red-500 text-[10px] font-bold">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-500">WhatsApp</label>
                <Input {...register('whatsapp')} placeholder="(11) 99999-9999" />
                {errors.whatsapp && <p className="text-red-500 text-[10px] font-bold">{errors.whatsapp.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Serviço de Interesse</label>
              <select 
                {...register('service_interest')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecione uma opção</option>
                <option value="site">Site Institucional</option>
                <option value="landing_page">Landing Page</option>
                <option value="system">Sistema Sob Medida</option>
                <option value="other">Outro</option>
              </select>
              {errors.service_interest && <p className="text-red-500 text-[10px] font-bold">{errors.service_interest.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Mensagem</label>
              <Textarea {...register('message')} placeholder="Conte-nos um pouco sobre seu projeto..." />
              {errors.message && <p className="text-red-500 text-[10px] font-bold">{errors.message.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-full text-lg"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Enviando...' : (
                <>
                  Enviar Solicitação
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>

            {status === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                <CheckCircle className="w-5 h-5" />
                Solicitação enviada com sucesso! Entraremos em contato em breve.
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                <AlertCircle className="w-5 h-5" />
                Ocorreu um erro ao enviar. Por favor, tente pelo WhatsApp.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
