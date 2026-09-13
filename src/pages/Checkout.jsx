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
        throw new Error("مفيش رابط دفع رجع من السيرفر");
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

const gradientPrimary = "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)";

const s = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, var(--paper) 55%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 20px",
    fontFamily: "var(--font-body)",
    color: "var(--ink)",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  brandMark: { width: 36, height: 36, borderRadius: 10, background: gradientPrimary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, boxShadow: "0 4px 16px rgba(139,92,246,0.45)" },
  brandName: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 },
  card: { width: "100%", maxWidth: 420, background: "var(--paper-raised)", border: "1px solid var(--ink-15)", borderRadius: 20, padding: 36, boxShadow: "0 25px 60px rgba(0,0,0,0.4)" },
  h1: { fontSize: 24, marginBottom: 6 },
  sub: { fontSize: 14, color: "var(--ink-45)", marginBottom: 24 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 22 },
  priceNum: { fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 700, background: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  priceUnit: { fontSize: 14, color: "var(--ink-45)" },
  features: { listStyle: "none", padding: 0, margin: "0 0 26px", display: "flex", flexDirection: "column", gap: 10 },
  featureItem: { fontSize: 14, color: "var(--ink-70)", paddingInlineStart: 18, position: "relative" },
  error: { fontSize: 13, color: "#fca5a5", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", padding: "10px 14px", borderRadius: 10, marginBottom: 16 },
  payBtn: { width: "100%", padding: "15px 20px", borderRadius: 12, border: "none", background: gradientPrimary, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 28px rgba(139,92,246,0.4)" },
  trustNote: { fontSize: 12, color: "var(--ink-45)", marginTop: 16, textAlign: "center" },
  link: { color: "var(--gold-ink)", fontWeight: 600 },
};
