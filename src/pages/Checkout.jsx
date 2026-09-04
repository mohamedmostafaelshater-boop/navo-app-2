import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient";
import { planById } from "../lib/plans";
import { gatewayForCountry } from "../lib/gateway";

export default function Checkout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planId = params.get("plan") || "growth";
  const plan = planById(planId);

  const country = profile?.country || "EG";
  const gateway = gatewayForCountry(country);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!plan) {
    return (
      <div dir="rtl" style={s.page}>
        <div style={s.card}>
          <h1 style={s.h1}>الخطة مش موجودة</h1>
          <Link to="/#pricing" style={s.link}>ارجع لصفحة الأسعار</Link>
        </div>
      </div>
    );
  }

  async function handlePay() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            plan: plan.id,
            country,
            gateway,
            userId: user.id,
            email: user.email,
          },
        }
      );
      if (fnError) throw fnError;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("مفيش رابط دفع رجع من السيرفر.");
      }
    } catch (err) {
      setError(err.message || "حصل خطأ أثناء تجهيز الدفع. حاول تاني.");
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" style={s.page}>
      <Link to="/" style={s.brand}>
        <span style={s.brandMark}>N</span>
        <span style={s.brandName}>NAVO</span>
      </Link>

      <div style={s.card}>
        <h1 style={s.h1}>تفعيل خطة {plan.name}</h1>
        <p style={s.sub}>هتتحول لصفحة دفع آمنة عبر {gateway === "paymob" ? "Paymob" : gateway}.</p>

        <div style={s.priceRow}>
          <span style={s.priceNum} className="tabular">{plan.price}</span>
          <span style={s.priceUnit}>جنيه / شهر</span>
        </div>

        <ul style={s.features}>
          {plan.features.map((f) => (
            <li key={f} style={s.featureItem}>{f}</li>
          ))}
        </ul>

        {error && <div style={s.error}>{error}</div>}

        <button onClick={handlePay} style={s.payBtn} disabled={loading}>
          {loading ? "جاري التجهيز..." : "الانتقال للدفع"}
        </button>

        <p style={s.trustNote}>
          دفع مباشر، إحنا مبنخزنش أي أرقام بطاقات على سيرفراتنا.
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--paper)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 20px",
    fontFamily: "var(--font-body)",
    color: "var(--ink)",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  brandMark: { width: 34, height: 34, borderRadius: 8, background: "var(--ink)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 },
  brandName: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 },
  card: { width: "100%", maxWidth: 420, background: "var(--paper-raised)", border: "1px solid var(--ink-15)", borderRadius: 14, padding: 32 },
  h1: { fontSize: 22, marginBottom: 6 },
  sub: { fontSize: 14, color: "var(--ink-45)", marginBottom: 20 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 },
  priceNum: { fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700 },
  priceUnit: { fontSize: 14, color: "var(--ink-45)" },
  features: { listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 },
  featureItem: { fontSize: 14, color: "var(--ink-70)", paddingInlineStart: 18, position: "relative" },
  error: { fontSize: 13, color: "var(--brick)", background: "rgba(181,72,45,0.08)", padding: "10px 12px", borderRadius: 8, marginBottom: 16 },
  payBtn: { width: "100%", padding: "14px 20px", borderRadius: 8, border: "none", background: "var(--ink)", color: "var(--paper-raised)", fontSize: 15, fontWeight: 600 },
  trustNote: { fontSize: 12, color: "var(--ink-45)", marginTop: 14, textAlign: "center" },
  link: { color: "var(--forest)", fontWeight: 600 },
};
