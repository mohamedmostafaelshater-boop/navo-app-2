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
        throw new Error("مفيش رابط دفع
