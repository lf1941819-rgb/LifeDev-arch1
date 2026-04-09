import React from 'react';
import { motion } from 'motion/react';
import { Search, Code, Cpu, Layers } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Imersão Estratégica',
    description: 'Analisamos seu negócio e objetivos para traçar a rota digital mais eficiente.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Planejamento Criativo',
    description: 'Desenhamos a estrutura visual e funcional focada em experiência e conversão.',
    icon: Layers,
  },
  {
    number: '03',
    title: 'Engenharia de Precisão',
    description: 'Transformamos o projeto em código de alta performance, seguro e escalável.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Entrega & Evolução',
    description: 'Ativamos sua presença digital e acompanhamos os resultados do seu crescimento.',
    icon: Cpu,
  },
];

export function Process() {
  return (
    <section id="process" className="section-padding bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-4">Nosso Método</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Um fluxo organizado e transparente para garantir que cada entrega supere suas expectativas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="mb-6">
                <span className="text-6xl font-black text-zinc-200 group-hover:text-primary/10 transition-colors duration-500">
                  {step.number}
                </span>
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-zinc-950 mb-3">{step.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-zinc-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
