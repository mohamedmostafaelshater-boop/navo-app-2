import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { authStyles as s } from "./authStyles.js";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError("البريد الإلكتروني أو كلمة المرور غلط. حاول تاني.");
      return;
    }
    navigate("/app");
  }

  return (
    <div dir="rtl" style={s.page}>
      <Link to="/" style={s.brand}>
        <span style={s.brandMark}>N</span>
        <span style={s.brandName}>NAVO</span>
      </Link>
      <div style={s.card}>
        <h1 style={s.h1}>تسجيل الدخول</h1>
        <p style={s.sub}>ارجع لحسابك عشان تكمل تحليل بياناتك.</p>

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
              placeholder="••••••••"
            />
          </label>

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <p style={s.footNote}>
          مالكش حساب؟ <Link to="/signup" style={s.link}>ابدأ تجربتك المجانية</Link>
        </p>
      </div>
    </div>
  );
}
