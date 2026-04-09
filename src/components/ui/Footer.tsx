import React from 'react';
import { Instagram, MessageSquare, Mail, Globe } from 'lucide-react';
import { COMPANY_INFO } from '@/src/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-950">
                Life<span className="text-primary">Dev</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Transformamos tecnologia em resultados reais para o seu negócio. 
              Compromisso, segurança e confiabilidade em cada linha de código.
            </p>
            <div className="flex items-center gap-4">
              <a href={`https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-primary transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-zinc-950 mb-6">Links Rápidos</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#hero" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Soluções</a></li>
              <li><a href="#differentials" className="hover:text-primary transition-colors">Diferenciais</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-950 mb-6">Contatos</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {COMPANY_INFO.email.main}
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                {COMPANY_INFO.whatsapp}
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                www.lifedevtech.com.br
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-950 mb-6">Localização</h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Atendimento digital para todo o Brasil.<br />
              Base operacional em São Paulo - SP.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col md:row items-center justify-between gap-4 text-xs text-zinc-400 font-medium uppercase tracking-widest">
          <p>© {currentYear} {COMPANY_INFO.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
