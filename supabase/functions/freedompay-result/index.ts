// BEKNAZAURUS — подтверждение оплаты от FreedomPay (result_url).
// FreedomPay сам присылает сюда результат платежа. Функция проверяет подпись
// и отмечает заказ как оплаченный. При деплое отключите проверку JWT
// (FreedomPay не присылает токен Supabase): supabase functions deploy freedompay-result --no-verify-jwt
import { createClient } from "npm:@supabase/supabase-js@2";
import { crypto } from "jsr:@std/crypto@1";
import { encodeHex } from "jsr:@std/encoding@1/hex";

const SCRIPT = "freedompay-result"; // последний сегмент адреса result_url — участвует в подписи

async function md5(s: string) {
  return encodeHex(await crypto.subtle.digest("MD5", new TextEncoder().encode(s)));
}
async function sign(script: string, params: Record<string, string>, secret: string) {
  const values = Object.keys(params).filter((k) => k !== "pg_sig").sort().map((k) => params[k]);
  return md5([script, ...values, secret].join(";"));
}
async function reply(status: "ok" | "rejected", description: string, secret: string) {
  const p: Record<string, string> = { pg_status: status, pg_description: description, pg_salt: crypto.randomUUID().replace(/-/g, "") };
  p.pg_sig = await sign(SCRIPT, p, secret);
  const body = `<?xml version="1.0" encoding="utf-8"?><response>${Object.entries(p).map(([k, v]) => `<${k}>${v}</${k}>`).join("")}</response>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}

Deno.serve(async (req) => {
  const secret = Deno.env.get("FREEDOMPAY_SECRET_KEY") ?? "";
  const url = new URL(req.url);
  const params: Record<string, string> = Object.fromEntries(url.searchParams);
  if (req.method === "POST") {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("form")) Object.assign(params, Object.fromEntries((await req.formData()) as unknown as Iterable<[string, string]>));
    else Object.assign(params, Object.fromEntries(new URLSearchParams(await req.text())));
  }

  if (!params.pg_sig || params.pg_sig !== await sign(SCRIPT, params, secret)) {
    return reply("rejected", "Неверная подпись", secret);
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: order } = await admin.from("orders").select("id, amount, status").eq("id", params.pg_order_id).single();
  if (!order) return reply("rejected", "Заказ не найден", secret);
  if (Number(params.pg_amount) < Number(order.amount)) return reply("rejected", "Сумма не совпадает", secret);

  const paid = params.pg_result === "1";
  if (order.status === "pending") {
    await admin.from("orders").update({
      status: paid ? "paid" : "failed",
      payment_id: params.pg_payment_id ?? null,
      paid_at: paid ? new Date().toISOString() : null,
    }).eq("id", order.id);
  }
  return reply("ok", paid ? "Оплата принята" : "Оплата не прошла", secret);
});
