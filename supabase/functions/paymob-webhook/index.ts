// دالة paymob-webhook: Paymob بينادي عليها تلقائيًا بعد كل عملية دفع.
// بتتحقق من توقيع HMAC عشان تتأكد إن الطلب فعلاً جاي من Paymob، وبعدين
// تفعّل اشتراك المستخدم في جدول profiles.
//
// الإعداد المطلوب في Paymob:
//   Developers → Webhooks → ضيف رابط الدالة دي كـ "Transaction Processed Callback"
//
// المتغيرات المطلوبة: PAYMOB_HMAC (اتحطت بالفعل).
// SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY بيتوفروا تلقائيًا من Supabase.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const HMAC_FIELDS_ORDER = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
];

function getField(obj: any, path: string) {
  const parts = path.split(".");
  let value = obj;
  for (const p of parts) value = value?.[p];
  if (value === undefined || value === null) return "";
  return String(value);
}

async function hmacSha512Hex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const receivedHmac = url.searchParams.get("hmac") || "";
    const body = await req.json();
    const obj = body.obj || body;

    const hmacSecret = Deno.env.get("PAYMOB_HMAC") || "";
    const message = HMAC_FIELDS_ORDER.map((f) => getField(obj, f)).join("");
    const computedHmac = await hmacSha512Hex(hmacSecret, message);

    if (computedHmac.toLowerCase() !== receivedHmac.toLowerCase()) {
      return new Response(JSON.stringify({ error: "توقيع غير صالح" }), {
        status: 401,
      });
    }

    if (obj.success !== true && obj.success !== "true") {
      return new Response(JSON.stringify({ received: true, activated: false }), {
        status: 200,
      });
    }

    // merchant_order_id اتبنى في create-checkout بالشكل: userId_plan_timestamp
    const merchantOrderId: string = obj.order?.merchant_order_id || "";
    const [userId, plan] = merchantOrderId.split("_");

    if (userId && plan) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabaseAdmin
        .from("profiles")
        .update({ plan, subscription_status: "active" })
        .eq("id", userId);
    }

    return new Response(JSON.stringify({ received: true, activated: true }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "خطأ" }),
      { status: 500 }
    );
  }
});
