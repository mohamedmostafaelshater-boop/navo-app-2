import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { TRIAL_DAYS } from "../lib/plans";
import { authStyles as s } from "./authStyles.js";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const plan = params.get("plan");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("كلمة المرور لازم تكون 6 حروف أو أكتر.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password);
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "حصل خطأ أثناء إنشاء الحساب. حاول تاني.");
      return;
    }

    if (plan) {
      navigate(`/checkout?plan=${plan}`);
    } else {
      navigate("/app");
    }
  }

  return (
    <div dir="rtl" style={s.page}>
      <Link to="/" style={s.brand}>
        <span style={s.brandMark}>N</span>
        <span style={s.brandName}>NAVO</span>
      </Link>
      <div style={s.card}>
        <h1 style={s.h1}>ابدأ تجربتك المجانية</h1>
        <p style={s.sub}>
          {TRIAL_DAYS} أيام كاملة المميزات، من غير بطاقة ائتمان.
        </p>

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>
            البريد الإلكتروني
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={s.input}
              placeholder="example@email.com"
            />
          </label>
          <label style={s.label}>
            كلمة المرور
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={s.input}
              placeholder="6 حروف على الأقل"
            />
          </label>

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p style={s.footNote}>
          عندك حساب بالفعل؟ <Link to="/login" style={s.link}>سجّل دخولك</Link>
        </p>
      </div>
    </div>
  );
}
