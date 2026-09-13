import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { trialInfo, planById } from "../lib/plans";

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
  return { headers, rows };
}

function isNumeric(value) {
  return value !== "" && !isNaN(Number(value));
}

function summarize(headers, rows) {
  return headers
    .map((h) => {
      const values = rows.map((r) => r[h]).filter(isNumeric).map(Number);
      if (values.length < rows.length * 0.6) return null; // العمود مش رقمي في معظمه
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const max = Math.max(...values);
      return { column: h, sum, avg, max, count: values.length };
    })
    .filter(Boolean);
}

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [fileError, setFileError] = useState(null);

  const trial = trialInfo(user?.created_at);
  const currentPlan = planById(profile?.plan);
  const hasAccess = Boolean(currentPlan) || trial.active;

  const summary = useMemo(() => {
    if (!parsed) return [];
    return summarize(parsed.headers, parsed.rows);
  }, [parsed]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);

    if (!file.name.endsWith(".csv")) {
      setFileError("حاليًا بندعم ملفات CSV بس. صدّر ملف الإكسل بصيغة CSV وارفعه تاني.");
      return;
    }

    setParsing(true);
    setFileName(file.name);
    const text = await file.text();
    const result = parseCsv(text);
    setParsed(result);
    setParsing(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div dir="rtl" style={s.page}>
      <header style={s.header}>
        <Link to="/" style={s.brand}>
          <span style={s.brandMark}>N</span>
          <span style={s.brandName}>NAVO</span>
        </Link>
        <div style={s.headerRight}>
          <span style={s.email}>{user?.email}</span>
          <button onClick={handleSignOut} style={s.logoutBtn}>خروج</button>
        </div>
      </header>

      {!hasAccess && (
        <div style={s.lockedBanner}>
          <div>
            <strong>خلصت فترة التجربة المجانية.</strong>
            <p style={s.lockedText}>اشترك في خطة عشان تكمل تحليل ملفاتك.</p>
          </div>
          <Link to="/#pricing" style={s.upgradeBtn}>عرض الخطط</Link>
        </div>
      )}

      {hasAccess && !currentPlan && (
        <div style={s.trialBanner}>
          باقيلك <strong>{trial.daysLeft}</strong> {trial.daysLeft === 1 ? "يوم" : "أيام"} في التجربة المجانية.
        </div>
      )}

      <main style={s.main}>
        <div style={s.uploadCard}>
          <h1 style={s.h1}>ارفع ملف بياناتك</h1>
          <p style={s.uploadSub}>ملف CSV يحتوي على أعمدة أرقام (مبيعات، مصروفات، كميات...)</p>
          <label style={s.upload
