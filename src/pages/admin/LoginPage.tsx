import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authService } from '@/src/lib/supabase';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    const { error } = await authService.signIn(data.email, data.password);
    
    if (error) {
      setError('Credenciais inválidas ou erro de conexão.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950">Acesso Administrativo</h1>
          <p className="text-zinc-500 text-sm mt-1">Life Dev | Sites & Sistemas</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                <Mail className="w-3 h-3" /> E-mail
              </label>
              <Input {...register('email')} type="email" placeholder="admin@lifedevtech.com.br" />
              {errors.email && <p className="text-red-500 text-[10px] font-bold">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Senha
              </label>
              <Input {...register('password')} type="password" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-[10px] font-bold">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={loading}>
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </Button>
          </form>
        </div>

        <p className="text-center text-zinc-400 text-[10px] mt-8 uppercase tracking-widest font-bold">
          Área Privada • Life Dev Tech
        </p>
      </div>
    </div>
  );
}
