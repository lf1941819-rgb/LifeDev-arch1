import React from 'react';
import { ShieldCheck, CreditCard, QrCode, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';

interface PaymentOptionProps {
  title: string;
  description: string;
  amount: number;
  features: string[];
  highlighted?: boolean;
  onSelect: () => void;
}

export function PaymentOptionCard({ title, description, amount, features, highlighted, onSelect }: PaymentOptionProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 border-zinc-200",
      highlighted ? "ring-2 ring-primary shadow-xl shadow-primary/10 scale-105 z-10" : "hover:border-primary/30 shadow-sm"
    )}>
      {highlighted && (
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
          Mais Escolhido
        </div>
      )}
      <CardHeader className="p-8">
        <CardTitle className="text-xl font-bold text-zinc-950">{title}</CardTitle>
        <CardDescription className="text-zinc-500 mt-2">{description}</CardDescription>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-sm font-bold text-zinc-400">R$</span>
          <span className="text-4xl font-black text-zinc-950 tracking-tight">
            {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          onClick={onSelect} 
          className="w-full h-12 rounded-xl text-base font-bold gap-2 group"
          variant={highlighted ? 'default' : 'outline'}
        >
          Iniciar Pagamento
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function PaymentSummaryBox({ amount, service }: { amount: number, service: string }) {
  return (
    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
      <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-4">Resumo do Pedido</h4>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-zinc-600">{service}</span>
        <span className="text-sm font-bold text-zinc-950">R$ {amount.toFixed(2)}</span>
      </div>
      <div className="border-t border-zinc-200 my-4 pt-4 flex justify-between items-center">
        <span className="font-bold text-zinc-950">Total</span>
        <span className="text-xl font-black text-primary">R$ {amount.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-4">
        <ShieldCheck className="w-3 h-3" />
        Pagamento 100% Seguro via PIX ou Checkout Externo
      </div>
    </div>
  );
}

export function PaymentStatusMessage({ status }: { status: string }) {
  const configs: Record<string, any> = {
    paid: {
      icon: ShieldCheck,
      title: "Pagamento Confirmado!",
      description: "Recebemos seu pagamento com sucesso. Nossa equipe entrará em contato em breve para os próximos passos.",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    awaiting_payment: {
      icon: QrCode,
      title: "Aguardando Pagamento",
      description: "Escaneie o QR Code ou utilize o código Copia e Cola para finalizar sua reserva.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    failed: {
      icon: CreditCard,
      title: "Ops! Algo deu errado",
      description: "Não conseguimos processar seu pagamento. Por favor, tente novamente ou fale com nosso suporte.",
      color: "text-red-600",
      bg: "bg-red-50"
    }
  };

  const config = configs[status] || configs.awaiting_payment;
  const Icon = config.icon;

  return (
    <div className={cn("p-8 rounded-3xl text-center space-y-4", config.bg)}>
      <div className={cn("w-16 h-16 mx-auto rounded-full flex items-center justify-center", config.color, "bg-white shadow-sm")}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className={cn("text-xl font-bold", config.color)}>{config.title}</h3>
      <p className="text-sm text-zinc-600 max-w-xs mx-auto">{config.description}</p>
    </div>
  );
}

export function PaymentFallbackNotice() {
  return (
    <div className="p-6 bg-zinc-100 rounded-2xl border border-zinc-200 text-center">
      <p className="text-sm text-zinc-600">
        Prefere pagar de outra forma ou está com dúvidas?
      </p>
      <Button variant="link" className="text-primary font-bold mt-2 h-auto p-0">
        Falar com Especialista no WhatsApp
      </Button>
    </div>
  );
}
