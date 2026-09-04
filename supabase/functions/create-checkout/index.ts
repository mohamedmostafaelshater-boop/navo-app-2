// دالة create-checkout: بتستقبل طلب اشتراك من الفرونت إند، وبتتواصل مع Paymob
// بأمان من السيرفر (مفيش أي مفتاح سري بيوصل للمتصفح أبدًا).
//
// المتغيرات المطلوبة (تتحط في Supabase → Edge Functions → Secrets):
//   PAYMOB_SECRET_KEY      -> من Paymob: Settings > Account Info > Secret key
//   PAYMOB_INTEGRATION_ID  -> من Paymob: Developers > Payment Integrations
//   PAYMOB_IFRAME_ID       -> من Paymob: Developers > Iframes

const PLAN_AMOUNTS: Record<string, number> = {
  starter: 19900, // 199 جنيه بالقروش
  growth: 54900,  // 549 جنيه بالقروش
  scale: 129000,  // 1290 جنيه بالقروش
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { plan, email, userId } = await req.json();

    const amountCents = PLAN_AMOUNTS[plan];
    if (!amountCents) {
      return json({ error: "خطة اشتراك غير معروفة." }, 400);
    }

    const apiKey = Deno.env.get("PAYMOB_SECRET_KEY");
    const integrationId = Deno.env.get("PAYMOB_INTEGRATION_ID");
    const iframeId = Deno.env.get("PAYMOB_IFRAME_ID");

    if (!apiKey || !integrationId || !iframeId) {
      return json(
        {
          error:
            "إعدادات بوابة الدفع لسه مش مكتملة. لازم تضاف PAYMOB_INTEGRATION_ID و PAYMOB_IFRAME_ID في إعدادات السيرفر.",
        },
        500
      );
    }

    // 1) الحصول على Auth Token
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });
    const authData = await authRes.json();
    if (!authData.token) {
      return json({ error: "تعذر تسجيل الدخول لبوابة الدفع." }, 502);
    }

    // 2) إنشاء طلب (Order)
    const orderRes = await fetch(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authData.token,
          delivery_needed: false,
          amount_cents: amountCents,
          currency: "EGP",
          // "_" مش موجود في الـ UUID ولا في اسم الخطة، فمينفعش يتلخبط لما نفصل القيمة تاني في الويب هوك
          merchant_order_id: `${userId}_${plan}_${Date.now()}`,
          items: [],
        }),
      }
    );
    const orderData = await orderRes.json();
    if (!orderData.id) {
      return json({ error: "تعذر إنشاء طلب الدفع." }, 502);
    }

    // 3) إنشاء Payment Key
    const paymentKeyRes = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authData.token,
          amount_cents: amountCents,
          expiration: 3600,
          order_id: orderData.id,
          billing_data: {
            email: email || "customer@baseera.app",
            first_name: "عميل",
            last_name: "بصيرة",
            phone_number: "+201000000000",
            apartment: "NA",
            floor: "NA",
            street: "NA",
            building: "NA",
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "EG",
            state: "NA",
          },
          currency: "EGP",
          integration_id: Number(integrationId),
        }),
      }
    );
    const paymentKeyData = await paymentKeyRes.json();
    if (!paymentKeyData.token) {
      return json({ error: "تعذر إنشاء مفتاح الدفع." }, 502);
    }

    const url = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKeyData.token}`;

    return json({ url });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "خطأ غير متوقع." }, 500);
  }
});
