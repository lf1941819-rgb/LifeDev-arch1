import React from 'react';
import { motion } from 'motion/react';
import { Layout, Rocket, Settings, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const services = [
  {
    title: 'Sites Institucionais',
    description: 'Credibilidade imediata para sua marca com um design que transmite autoridade e confiança.',
    icon: Globe,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Landing Pages',
    description: 'Páginas de alta performance desenhadas com foco total em conversão e resultados reais.',
    icon: Rocket,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Sistemas Sob Medida',
    description: 'Soluções tecnológicas inteligentes para automatizar e otimizar os processos do seu negócio.',
    icon: Settings,
    color: 'bg-zinc-900/10 text-zinc-900',
  },
  {
    title: 'Design de Interface',
    description: 'Interfaces intuitivas e sofisticadas que encantam o usuário e facilitam a tomada de decisão.',
    icon: Layout,
    color: 'bg-purple-500/10 text-purple-600',
  },
];

export function Services() {
  return (
    <section id="services" className="section-padding bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-4">Nossas Soluções</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
            Desenvolvemos ferramentas digitais que não apenas funcionam, mas elevam o patamar da sua empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
