// BEKNAZAURUS — создание платежа FreedomPay.
// Сайт вызывает эту функцию с id заказа; функция подписывает запрос секретным
// ключом (он хранится только здесь, в секретах Supabase) и возвращает ссылку на оплату.
//
// Секреты (Supabase → Edge Functions → Secrets):
//   FREEDOMPAY_MERCHANT_ID   — ID магазина из кабинета FreedomPay
//   FREEDOMPAY_SECRET_KEY    — секретный ключ для приёма платежей
//   FREEDOMPAY_API           — https://api.freedompay.kg (по умолчанию)
//   FREEDOMPAY_TEST          — 1 = тестовый режим, 0 = реальные платежи
//   SITE_URL                 — https://alizhajloobekov-cmd.github.io/beknazaurus/
import { createClient } from "npm:@supabase/supabase-js@2";
import { crypto } from "jsr:@std/crypto@1";
import { encodeHex } from "jsr:@std/encoding@1/hex";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

async function md5(s: string) {
  return encodeHex(await crypto.subtle.digest("MD5", new TextEncoder().encode(s)));
}
// подпись FreedomPay: имя скрипта; значения параметров по алфавиту ключей; секретный ключ
export async function sign(script: string, params: Record<string, string>, secret: string) {
  const values = Object.keys(params).filter((k) => k !== "pg_sig").sort().map((k) => params[k]);
  return md5([script, ...values, secret].join(";"));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const env = (k: string, d = "") => Deno.env.get(k) ?? d;
    const admin = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "Войдите в аккаунт" }, 401);

    const { order_id } = await req.json();
    const { data: order } = await admin.from("orders").select("*").eq("id", order_id).single();
    if (!order || order.user_id !== user.id) return json({ error: "Заказ не найден" }, 404);
    if (order.status !== "pending") return json({ error: "Заказ уже обработан" }, 400);

    const site = env("SITE_URL").replace(/\/?$/, "/");
    const resultUrl = env("SUPABASE_URL") + "/functions/v1/freedompay-result";
    const params: Record<string, string> = {
      pg_merchant_id: env("FREEDOMPAY_MERCHANT_ID"),
      pg_order_id: order.id,
      pg_amount: Number(order.amount).toFixed(2),
      pg_currency: order.currency || "KGS",
      pg_description: String(order.title).slice(0, 200),
      pg_salt: crypto.randomUUID().replace(/-/g, ""),
      pg_result_url: resultUrl,
      pg_success_url: site + "#/account?paid=" + order.id,
      pg_failure_url: site + "#/account?failed=" + order.id,
      pg_user_contact_email: user.email ?? "",
      pg_testing_mode: env("FREEDOMPAY_TEST", "1"),
    };
    params.pg_sig = await sign("init_payment.php", params, env("FREEDOMPAY_SECRET_KEY"));

    const api = env("FREEDOMPAY_API", "https://api.freedompay.kg");
    const res = await fetch(api + "/init_payment.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    });
    const xml = await res.text();
    const tag = (n: string) => (xml.match(new RegExp(`<${n}>([\\s\\S]*?)</${n}>`)) || [])[1] ?? "";
    if (tag("pg_status") !== "ok") return json({ error: tag("pg_error_description") || "Платёжная система не ответила" }, 502);

    await admin.from("orders").update({ payment_id: tag("pg_payment_id") }).eq("id", order.id);
    return json({ url: tag("pg_redirect_url").replace(/&amp;/g, "&") });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
