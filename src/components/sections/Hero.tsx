import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { COMPANY_INFO } from '@/src/constants';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" />
            <span>Presença Digital de Alto Padrão</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-950 leading-[1.1] mb-6 text-balance">
            Sua empresa com a presença digital que ela <span className="text-primary">merece</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 mb-8 max-w-xl leading-relaxed">
            Desenvolvemos sites e sistemas de alto padrão que transmitem confiança imediata e 
            convertem visitantes em clientes para o seu negócio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
              <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noreferrer">
                Falar com Especialista
                <MessageSquare className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg">
              <a href="#services">
                Ver Nossas Soluções
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-6 text-zinc-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Segurança Total</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Compromisso Real</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-200">
            <img 
              src="https://picsum.photos/seed/tech-workspace/1200/800" 
              alt="Life Dev Workspace" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-zinc-950/5 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
