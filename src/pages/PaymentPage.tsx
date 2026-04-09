import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, ArrowLeft, QrCode, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card, CardContent } from '@/src/components/ui/Card';
import { paymentService } from '@/src/lib/payments/service';
import { PaymentSummaryBox, PaymentStatusMessage, PaymentFallbackNotice } from '@/src/components/payment/PaymentComponents';

const paymentSchema = z.object({
  customer_name: z.string().min(3, 'Nome muito curto'),
  customer_email: z.string().email('E-mail inválido'),
  customer_whatsapp: z.string().min(10, 'WhatsApp inválido'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentPage() {
  const [step, setStep] = useState<'form' | 'processing' | 'checkout'>('form');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Exemplo de serviço selecionado (poderia vir da URL)
  const selectedService = {
    name: "Landing Page Profissional",
    slug: "lp-profissional",
    amount: 697.00
  };

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    setStep('processing');
    const result = await paymentService.initiatePayment({
      ...data,
      service_name: selectedService.name,
      service_slug: selectedService.slug,
      amount_brl: selectedService.amount,
      payment_method: 'pix', // Prioridade PIX
    });

    if (result.success) {
      setPaymentData(result);
      setStep('checkout');
    } else {
      alert(result.error);
      setStep('form');
    }
  };

  const copyPixCode = () => {
    if (paymentData?.pixCode) {
      navigator.clipboard.writeText(paymentData.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Left Column: Flow */}
          <div className="lg:col-span-3 space-y-8">
            {step === 'form' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Finalizar Reserva</h1>
                  <p className="text-zinc-500 mt-2">Preencha seus dados para gerar a cobrança segura.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-zinc-500">Seu Nome</label>
                      <Input {...register('customer_name')} placeholder="Ex: João Silva" />
                      {errors.customer_name && <p className="text-red-500 text-[10px] font-bold">{errors.customer_name.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-zinc-500">WhatsApp</label>
                      <Input {...register('customer_whatsapp')} placeholder="(11) 99999-9999" />
                      {errors.customer_whatsapp && <p className="text-red-500 text-[10px] font-bold">{errors.customer_whatsapp.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-500">E-mail para Receber Nota/Acesso</label>
                    <Input {...register('customer_email')} type="email" placeholder="joao@empresa.com.br" />
                    {errors.customer_email && <p className="text-red-500 text-[10px] font-bold">{errors.customer_email.message}</p>}
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gap-2 mt-4">
                    Gerar Pagamento PIX
                    <ShieldCheck className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold text-zinc-950">Gerando sua cobrança segura...</p>
                <p className="text-sm text-zinc-500">Não feche esta página.</p>
              </div>
            )}

            {step === 'checkout' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PaymentStatusMessage status="awaiting_payment" />
                
                <Card className="border-none shadow-xl shadow-zinc-200/50 overflow-hidden">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-inner mb-6">
                      <QRCodeSVG value={paymentData.pixCode} size={200} />
                    </div>
                    
                    <div className="w-full space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Código Copia e Cola</label>
                        <div className="flex gap-2">
                          <div className="flex-grow bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs font-mono text-zinc-500 truncate">
                            {paymentData.pixCode}
                          </div>
                          <Button onClick={copyPixCode} variant="secondary" size="icon" className="shrink-0 rounded-xl">
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-100">
                        <p className="text-xs text-zinc-400">
                          Após o pagamento, a confirmação é automática. <br />
                          Você receberá um e-mail com os detalhes do seu projeto.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="ghost" onClick={() => setStep('form')} className="gap-2 text-zinc-500 hover:text-zinc-950">
                  <ArrowLeft className="w-4 h-4" /> Alterar dados ou forma de pagamento
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-2 space-y-6">
            <PaymentSummaryBox amount={selectedService.amount} service={selectedService.name} />
            <PaymentFallbackNotice />
            
            <div className="p-6 border border-zinc-200 rounded-2xl space-y-4">
              <h5 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Garantia Life Dev
              </h5>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Sua segurança é nossa prioridade. Utilizamos criptografia de ponta a ponta e processadores de pagamento certificados pelo Banco Central.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
