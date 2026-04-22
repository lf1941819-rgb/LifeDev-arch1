import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Admin Client Helper
function getSupabaseAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

// --- API ROUTES ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Create Payment Request
app.post("/api/payments/create", async (req, res) => {
  try {
    const paymentData = req.body;
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      console.error("Supabase not configured in backend");
      return res.status(500).json({ success: false, message: "Erro de configuração no servidor" });
    }

    // 1. Validar dados básicos
    if (!paymentData.customer_email || !paymentData.amount_brl) {
      return res.status(400).json({ success: false, message: "Dados incompletos" });
    }

    // 2. Registrar intenção no Supabase
    const { data: record, error: dbError } = await supabase
      .from('payment_requests')
      .insert([{
        ...paymentData,
        status: 'pending',
        source: 'site_official',
        gateway_provider: 'manual_pix_checkout' // Placeholder para o provider real
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // 3. Lógica de Integração com Gateway (Simulada para PIX/Checkout Externo)
    // Aqui você chamaria a API do Mercado Pago, Stripe, etc.
    // Por enquanto, geramos um link de checkout "fake" ou instruções PIX
    
    const isPix = paymentData.payment_method === 'pix';
    
    let updateData: any = { status: 'awaiting_payment' };
    
    if (isPix) {
      updateData.pix_code = "00020126580014BR.GOV.BCB.PIX0136lifedev-pix-key-placeholder5204000053039865405" + paymentData.amount_brl.toFixed(2) + "5802BR5913Life Dev Tech6009Sao Paulo62070503***6304";
      updateData.pix_qr_code_url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(updateData.pix_code)}`;
    } else {
      // Simulação de checkout externo (ex: link do Mercado Pago)
      updateData.checkout_url = `https://checkout.lifedevtech.com.br/pay/${record.id}`;
    }

    // Atualizar registro com dados do gateway
    await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', record.id);

    res.json({
      success: true,
      paymentId: record.id,
      checkoutUrl: updateData.checkout_url,
      pixCode: updateData.pix_code,
      pixQrCode: updateData.pix_qr_code_url
    });

  } catch (error: any) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: "Erro interno ao processar pagamento" });
  }
});

// Webhook Placeholder
app.post("/api/payments/webhook", async (req, res) => {
  // Aqui você receberia a notificação do gateway e atualizaria o Supabase
  console.log("Webhook received:", req.body);
  res.status(200).send("OK");
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
