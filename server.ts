import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurada no backend");
  }

  return createClient(supabaseUrl, supabaseKey);
}

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Muitas tentativas. Tente novamente mais tarde.",
  },
});

type PaymentMethod = "pix" | "checkout";

interface PaymentRequestBody {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  amount_brl?: number | string;
  payment_method?: string;
  description?: string;
}

function normalizeString(value: unknown, maxLength = 255): string {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedPaymentMethod(method: string): method is PaymentMethod {
  return method === "pix" || method === "checkout";
}

// --- API ROUTES ---

app.get("/api/health", (_req: Request, res: Response) => {
  return res.json({ status: "ok" });
});

app.post("/api/payments/create", paymentLimiter, async (req: Request, res: Response) => {
  try {
    const body = (req.body ?? {}) as PaymentRequestBody;
    const supabase = getSupabaseAdmin();

    const customerName = normalizeString(body.customer_name, 120);
    const customerEmail = normalizeString(body.customer_email, 160).toLowerCase();
    const customerPhone = normalizeString(body.customer_phone, 40);
    const description = normalizeString(body.description, 500);
    const paymentMethod = normalizeString(body.payment_method, 30).toLowerCase();
    const amount = Number(body.amount_brl);

    if (!customerEmail || !isValidEmail(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: "E-mail inválido",
      });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valor inválido",
      });
    }

    if (!isAllowedPaymentMethod(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Método de pagamento inválido",
      });
    }

    const payload = {
      customer_name: customerName || null,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      amount_brl: amount,
      payment_method: paymentMethod,
      description: description || null,
      status: "pending",
      source: "site_official",
      gateway_provider: "manual_pix_checkout",
    };

    const { data: record, error: insertError } = await supabase
      .from("payment_requests")
      .insert([payload])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({
        success: false,
        message: "Erro ao registrar pagamento",
      });
    }

    const updateData: {
      status: string;
      pix_code?: string;
      pix_qr_code_url?: string;
      checkout_url?: string;
    } = {
      status: "awaiting_payment",
    };

    if (paymentMethod === "pix") {
      const pixCode =
        "00020126580014BR.GOV.BCB.PIX0136lifedev-pix-key-placeholder5204000053039865405" +
        amount.toFixed(2) +
        "5802BR5913Life Dev Tech6009Sao Paulo62070503***6304";

      updateData.pix_code = pixCode;
      updateData.pix_qr_code_url =
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
    } else {
      updateData.checkout_url = `https://checkout.lifedevtech.com.br/pay/${record.id}`;
    }

    const { error: updateError } = await supabase
      .from("payment_requests")
      .update(updateData)
      .eq("id", record.id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar pagamento",
      });
    }

    return res.json({
      success: true,
      paymentId: record.id,
      checkoutUrl: updateData.checkout_url ?? null,
      pixCode: updateData.pix_code ?? null,
      pixQrCode: updateData.pix_qr_code_url ?? null,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao processar pagamento",
    });
  }
});

app.post("/api/payments/webhook", async (req: Request, res: Response) => {
  try {
    console.log("Webhook received:", req.body);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ received: false });
  }
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
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});