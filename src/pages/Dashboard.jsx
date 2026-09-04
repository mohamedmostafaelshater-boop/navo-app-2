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
          <label style={s.uploadBtn}>
            {parsing ? "جاري القراءة..." : "اختر ملف CSV"}
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
              style={{ display: "none" }}
              disabled={!hasAccess}
            />
          </label>
          {fileError && <div style={s.error}>{fileError}</div>}
          {fileName && !fileError && (
            <p style={s.fileName}>الملف: {fileName}</p>
          )}
        </div>

        {parsed && parsed.rows.length > 0 && (
          <>
            <section style={s.summaryGrid}>
              {summary.length === 0 && (
                <p style={s.noNumeric}>
                  مش لاقيين أعمدة أرقام واضحة في الملف ده. تأكد إن ملفك فيه عمود أرقام زي المبيعات أو الكمية.
                </p>
              )}
              {summary.map((col) => (
                <div style={s.summaryCard} key={col.column}>
                  <span style={s.summaryLabel}>{col.column}</span>
                  <span style={s.summaryNum} className="tabular">
                    {col.sum.toLocaleString("ar-EG")}
                  </span>
                  <span style={s.summarySub}>
                    متوسط {Math.round(col.avg).toLocaleString("ar-EG")} · أعلى قيمة {col.max.toLocaleString("ar-EG")}
                  </span>
                </div>
              ))}
            </section>

            <section style={s.tableCard}>
              <h2 style={s.tableTitle}>أول {Math.min(8, parsed.rows.length)} صفوف من {parsed.rows.length}</h2>
              <div style={s.tableScroll}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {parsed.headers.map((h) => (
                        <th style={s.th} key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 8).map((row, i) => (
                      <tr key={i}>
                        {parsed.headers.map((h) => (
                          <td style={s.td} key={h}>{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-body)", color: "var(--ink)" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--ink-15)", background: "var(--paper-raised)" },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: { width: 32, height: 32, borderRadius: 8, background: "var(--ink)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 },
  brandName: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 },
  headerRight: { display: "flex", alignItems: "center", gap: 14 },
  email: { fontSize: 13, color: "var(--ink-45)" },
  logoutBtn: { fontSize: 13, background: "none", border: "1px solid var(--ink-15)", borderRadius: 8, padding: "8px 14px", color: "var(--ink-70)" },

  trialBanner: { background: "rgba(217,164,65,0.14)", color: "var(--gold-ink)", padding: "10px 24px", fontSize: 14, textAlign: "center" },
  lockedBanner: { background: "rgba(181,72,45,0.1)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  lockedText: { fontSize: 13, color: "var(--ink-70)", margin: 0 },
  upgradeBtn: { background: "var(--ink)", color: "var(--paper-raised)", padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600 },

  main: { maxWidth: 900, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 28 },
  uploadCard: { background: "var(--paper-raised)", border: "1px solid var(--ink-15)", borderRadius: 14, padding: 28, textAlign: "center" },
  h1: { fontSize: 22, marginBottom: 8 },
  uploadSub: { fontSize: 14, color: "var(--ink-45)", marginBottom: 20 },
  uploadBtn: { display: "inline-block", background: "var(--ink)", color: "var(--paper-raised)", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  error: { marginTop: 14, fontSize: 13, color: "var(--brick)" },
  fileName: { marginTop: 14, fontSize: 13, color: "var(--ink-45)" },

  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 },
  noNumeric: { fontSize: 14, color: "var(--ink-45)" },
  summaryCard: { background: "var(--paper-raised)", border: "1px solid var(--ink-15)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 4 },
  summaryLabel: { fontSize: 13, color: "var(--ink-45)" },
  summaryNum: { fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--forest)" },
  summarySub: { fontSize: 12, color: "var(--ink-45)" },

  tableCard: { background: "var(--paper-raised)", border: "1px solid var(--ink-15)", borderRadius: 14, padding: 20 },
  tableTitle: { fontSize: 15, marginBottom: 14, fontFamily: "var(--font-body)", fontWeight: 600 },
  tableScroll: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "right", padding: "8px 10px", borderBottom: "1px solid var(--ink-15)", color: "var(--ink-45)", fontWeight: 600, whiteSpace: "nowrap" },
  td: { padding: "8px 10px", borderBottom: "1px solid var(--ink-08)", whiteSpace: "nowrap" },
};
