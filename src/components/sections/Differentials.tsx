import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const differentials = [
  {
    title: 'Identidade Exclusiva',
    description: 'Design sob medida que diferencia sua marca da concorrência genérica.',
  },
  {
    title: 'Foco em Resultados',
    description: 'Cada elemento é estrategicamente posicionado para gerar conversão.',
  },
  {
    title: 'Velocidade que Vende',
    description: 'Sites extremamente rápidos que garantem a retenção do seu visitante.',
  },
  {
    title: 'Experiência Mobile',
    description: 'Navegação impecável em smartphones, onde seus clientes mais estão.',
  },
  {
    title: 'Estrutura Evolutiva',
    description: 'Código moderno e organizado que permite o crescimento do seu projeto.',
  },
  {
    title: 'Parceria Estratégica',
    description: 'Compromisso real com a entrega e o sucesso contínuo do seu negócio.',
  },
];

export function Differentials() {
  return (
    <section id="differentials" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="heading-md mb-6">Por que escolher a Life Dev?</h2>
          <p className="text-lg text-zinc-600 mb-10 leading-relaxed">
            Não somos apenas uma agência de sites. Somos parceiros estratégicos que cuidam 
            da sua presença digital com o rigor técnico e estético que o seu negócio exige.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {differentials.map((item) => (
              <div key={item.title} className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-zinc-950 mb-1">{item.title}</h4>
                  <p className="text-sm text-zinc-500 leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/minimal-office/800/800" 
              alt="Life Dev Quality" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -right-6 bg-zinc-950 text-white p-8 rounded-2xl shadow-xl max-w-[240px]">
            <p className="text-3xl font-bold text-primary mb-1">100%</p>
            <p className="text-sm font-medium opacity-80">Compromisso com a qualidade e prazos de entrega.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
