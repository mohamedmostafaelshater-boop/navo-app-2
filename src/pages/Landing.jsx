import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PLANS, TRIAL_DAYS } from "../lib/plans";

const bars = [38, 52, 45, 68, 60, 82, 95];

function HeroChart() {
  const [grown, setGrown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={s.chartCard} ref={ref}>
      <div style={s.chartHead}>
        <span style={s.chartTitle}>صافي المبيعات</span>
        <span style={s.chartBadge}>+41% عن الشهر اللي فات</span>
      </div>
      <div style={s.chartBars}>
        {bars.map((v, i) => (
          <div key={i} style={s.barTrack}>
            <div
              style={{
                ...s.barFill,
                height: grown ? `${v}%` : "0%",
                background: i === bars.length - 1 ? "var(--gold)" : "var(--forest)",
                transitionDelay: `${i * 70}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div style={s.chartFoot}>
        <span>مارس</span>
        <span>سبتمبر</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div style={s.page}>
      <style>{responsiveCss}</style>
      <header style={s.header}>
        <div style={s.headerInner}>
          <Link to="/" style={s.brand}>
            <span style={s.brandMark}>N</span>
            <span style={s.brandName}>NAVO</span>
          </Link>
          <nav style={s.nav} className="bs-nav">
            <a href="#features" style={s.navLink}>المميزات</a>
            <a href="#pricing" style={s.navLink}>الأسعار</a>
            <a href="#faq" style={s.navLink}>الأسئلة الشائعة</a>
          </nav>
          <div style={s.headerActions}>
            <Link to="/login" style={s.ghostBtn} className="bs-hide-sm">تسجيل الدخول</Link>
            <Link to="/signup" style={s.primaryBtn}>ابدأ مجانًا</Link>
          </div>
        </div>
      </header>

      <section style={s.hero}>
        <div style={s.heroInner} className="bs-hero-grid">
          <div style={s.heroText}>
            <h1 style={s.h1}>
              أرقام تجارتك، واضحة قدامك من غير إكسل معقّد
            </h1>
            <p style={s.heroSub}>
              ارفع ملف المبيعات أو الفواتير بتاعك، وNAVO تحوّله لرسوم
              بيانية وتقرير مفهوم خلال ثواني. من غير صيغ، من غير أكواد،
              من غير محاسب يقعد يشرحلك.
            </p>
            <div style={s.heroCtas}>
              <Link to="/signup" style={s.primaryBtnLg}>
                جرّب {TRIAL_DAYS} أيام مجانًا
              </Link>
              <span style={s.heroNote}>من غير بطاقة ائتمان، إلغاء في أي وقت</span>
            </div>
          </div>
          <HeroChart />
        </div>
      </section>

      <section style={s.statsStrip}>
        <div style={s.statsInner} className="bs-stats">
          <div style={s.statCell}>
            <span style={s.statNum} className="tabular">12 ثانية</span>
            <span style={s.statLabel}>متوسط وقت تحليل ملف مبيعات شهر كامل</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statCell}>
            <span style={s.statNum} className="tabular">2,400+</span>
            <span style={s.statLabel}>ملف اتحلل من غير ما حد يفتح Excel</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statCell}>
            <span style={s.statNum} className="tabular">100%</span>
            <span style={s.statLabel}>البيانات بتفضل عندك، منخزنش أرقام بطاقات</span>
          </div>
        </div>
      </section>

      <section style={s.section} id="how">
        <h2 style={s.h2}>من الملف للقرار في ٣ خطوات</h2>
        <div style={s.steps} className="bs-steps">
          <div style={s.step}>
            <span style={s.stepNum}>01</span>
            <div>
              <h3 style={s.stepTitle}>ارفع ملفك</h3>
              <p style={s.stepText}>
                إكسل، CSV، أو حتى تصوير كشف حساب — NAVO بتقرأه زي ما هو من
                غير ما تعدّل فيه حاجة.
              </p>
            </div>
          </div>
          <div style={s.step}>
            <span style={s.stepNum}>02</span>
            <div>
              <h3 style={s.stepTitle}>NAVO تحلل وترتب</h3>
              <p style={s.stepText}>
                تحدد المبيعات والمصروفات والاتجاهات، وتبني رسوم بيانية
                جاهزة من غير ما تكتب صيغة واحدة.
              </p>
            </div>
          </div>
          <div style={s.step}>
            <span style={s.stepNum}>03</span>
            <div>
              <h3 style={s.stepTitle}>تاخد قرار واثق</h3>
              <p style={s.stepText}>
                تشوف مين أكتر عميل بيشتري، إمتى بتقل مبيعاتك، وفين بتسرّب
                فلوسك — وتصدّر تقرير PDF تشاركه مع فريقك.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={s.section} id="features">
        <h2 style={s.h2}>مبنية لصاحب المحل، مش للمبرمج</h2>
        <div style={s.featureGrid} className="bs-feature-grid">
          {features.map((f) => (
            <div style={s.featureCell} key={f.title}>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.pricingSection} id="pricing">
        <h2 style={s.h2}>خطة بتكبر مع تجارتك</h2>
        <p style={s.pricingSub}>
          كل خطة تبدأ بـ {TRIAL_DAYS} أيام تجربة كاملة المميزات، من غير
          بطاقة ائتمان.
        </p>
        <div style={s.pricingGrid} className="bs-pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                ...s.planCard,
                ...(plan.highlight ? s.planCardHighlight : {}),
              }}
            >
              {plan.highlight && <span style={s.planBadge}>الأكثر طلبًا</span>}
              <h3 style={s.planName}>{plan.name}</h3>
              <p style={s.planTagline}>{plan.tagline}</p>
              <div style={s.planPrice}>
                <span style={s.planPriceNum} className="tabular">{plan.price}</span>
                <span style={s.planPriceUnit}>جنيه / شهر</span>
              </div>
              <ul style={s.planFeatures}>
                {plan.features.map((f) => (
                  <li key={f} style={s.planFeatureItem}>{f}</li>
                ))}
              </ul>
              <Link
                to={`/signup?plan=${plan.id}`}
                style={plan.highlight ? s.primaryBtn : s.ghostBtnBordered}
              >
                ابدأ تجربتك المجانية
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section style={s.section} id="faq">
        <h2 style={s.h2}>أسئلة بتتسأل كتير</h2>
        <div style={s.faqList}>
          {faq.map((item) => (
            <details style={s.faqItem} key={item.q}>
              <summary style={s.faqQ}>{item.q}</summary>
              <p style={s.faqA}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.brand}>
            <span style={s.brandMarkDark}>N</span>
            <span style={s.brandNameDark}>NAVO</span>
          </div>
          <p style={s.footerText}>
            منصة عربية لتحليل بيانات الأعمال، بدون Excel معقّد وبدون سطر كود.
          </p>
          <p style={s.footerCopy}>© {new Date().getFullYear()} NAVO. كل الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "قراءة ذكية للملفات",
    text: "NAVO تفهم أعمدة ملفك تلقائيًا حتى لو مكتوبة عربي أو إنجليزي أو مخلوطة.",
  },
  {
    title: "رسوم بيانية جاهزة",
    text: "مبيعات، مصروفات، أرباح — كل حاجة في لوحة واحدة تفهمها من أول نظرة.",
  },
  {
    title: "تقارير PDF أنيقة",
    text: "صدّر تقرير جاهز تشاركه مع شريكك أو محاسبك من غير ما تعمل تنسيق بنفسك.",
  },
  {
    title: "دعوة فريقك",
    text: "شارك الحساب مع فريقك، وكل واحد يشوف اللي يخصه بصلاحيات محددة.",
  },
  {
    title: "تنبيهات مبكرة",
    text: "NAVO تنبهك لو المبيعات نزلت فجأة أو لو فيه مصروف غير طبيعي.",
  },
  {
    title: "بياناتك تفضل عندك",
    text: "بنحلل ملفك ومنحتفظش بيه أكتر من اللازم، وميوصلش لحد تاني أبدًا.",
  },
];

const faq = [
  {
    q: "محتاج خبرة في Excel عشان أستخدم NAVO؟",
    a: "لأ خالص. بترفع الملف زي ما هو، وNAVO تتولى الباقي.",
  },
  {
    q: "التجربة المجانية محتاجة بيانات بطاقة؟",
    a: `لأ. جرّب NAVO ${TRIAL_DAYS} أيام كاملة من غير أي بيانات دفع، وادفع بس لو قررت تكمل.`,
  },
  {
    q: "أي أنواع ملفات NAVO بتقرأها؟",
    a: "ملفات Excel (xlsx) وCSV حاليًا، وبنشتغل على إضافة صيغ تانية قريبًا.",
  },
  {
    q: "أقدر ألغي اشتراكي إمتى ما أنا عايز؟",
    a: "أيوه، تقدر تلغي في أي وقت من إعدادات حسابك من غير أي شرط.",
  },
];

const responsiveCss = `
  @media (max-width: 860px) {
    .bs-hero-grid { grid-template-columns: 1fr !important; }
    .bs-steps { grid-template-columns: 1fr !important; }
    .bs-feature-grid { grid-template-columns: 1fr 1fr !important; }
    .bs-pricing-grid { grid-template-columns: 1fr !important; }
    .bs-nav { display: none !important; }
    .bs-hide-sm { display: none !important; }
  }
  @media (max-width: 520px) {
    .bs-feature-grid { grid-template-columns: 1fr !important; }
    .bs-stats { flex-direction: column !important; gap: 24px; }
  }
`;

const s = {
  page: { fontFamily: "var(--font-body)", color: "var(--ink)", background: "var(--paper)" },
  header: { position: "sticky", top: 0, zIndex: 10, background: "rgba(241,244,239,0.92)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--ink-15)" },
  headerInner: { maxWidth: 1120, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 8, background: "var(--ink)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 },
  brandName: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 },
  nav: { display: "flex", gap: 28 },
  navLink: { fontSize: 15, color: "var(--ink-70)" },
  headerActions: { display: "flex", alignItems: "center", gap: 14 },
  ghostBtn: { fontSize: 15, color: "var(--ink-70)", padding: "10px 4px" },
  ghostBtnBordered: { fontSize: 15, color: "var(--ink)", padding: "12px 20px", border: "1px solid var(--ink-15)", borderRadius: 8, textAlign: "center", display: "block" },
  primaryBtn: { fontSize: 15, fontWeight: 600, color: "var(--paper-raised)", background: "var(--ink)", padding: "12px 20px", borderRadius: 8, textAlign: "center", display: "block" },
  primaryBtnLg: { fontSize: 17, fontWeight: 600, color: "var(--paper-raised)", background: "var(--ink)", padding: "16px 28px", borderRadius: 10, display: "inline-block" },

  hero: { borderBottom: "1px solid var(--ink-15)" },
  heroInner: { maxWidth: 1120, margin: "0 auto", padding: "64px 24px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" },
  heroText: { display: "flex", flexDirection: "column", gap: 20 },
  h1: { fontSize: "clamp(30px, 4.4vw, 46px)", maxWidth: 560 },
  heroSub: { fontSize: 17, color: "var(--ink-70)", maxWidth: 480 },
  heroCtas: { display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" },
  heroNote: { fontSize: 13, color: "var(--ink-45)" },

  chartCard: { background: "var(--ink)", borderRadius: 16, padding: 24, color: "var(--paper-raised)" },
  chartHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 },
  chartTitle: { fontSize: 14, color: "rgba(241,244,239,0.6)" },
  chartBadge: { fontSize: 13, color: "var(--gold)", fontWeight: 600 },
  chartBars: { display: "flex", alignItems: "flex-end", gap: 10, height: 160 },
  barTrack: { flex: 1, height: "100%", display: "flex", alignItems: "flex-end", background: "rgba(241,244,239,0.06)", borderRadius: 4 },
  barFill: { width: "100%", borderRadius: 4, transition: "height 900ms cubic-bezier(.2,.8,.2,1)" },
  chartFoot: { display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "rgba(241,244,239,0.5)" },

  statsStrip: { borderBottom: "1px solid var(--ink-15)" },
  statsInner: { maxWidth: 1120, margin: "0 auto", padding: "40px 24px", display: "flex", alignItems: "center" },
  statCell: { flex: 1, display: "flex", flexDirection: "column", gap: 6, textAlign: "center" },
  statNum: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--forest)" },
  statLabel: { fontSize: 13, color: "var(--ink-45)", maxWidth: 220, margin: "0 auto" },
  statDivider: { width: 1, height: 48, background: "var(--ink-15)" },

  section: { maxWidth: 1120, margin: "0 auto", padding: "72px 24px", borderBottom: "1px solid var(--ink-15)" },
  h2: { fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 36, textAlign: "center" },

  steps: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 },
  step: { display: "flex", flexDirection: "column", gap: 12, borderTop: "2px solid var(--ink)", paddingTop: 16 },
  stepNum: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--gold-ink)" },
  stepTitle: { fontSize: 19 },
  stepText: { fontSize: 15, color: "var(--ink-70)" },

  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)" },
  featureCell: { padding: 24, borderTop: "1px solid var(--ink-15)", borderInlineStart: "1px solid var(--ink-15)" },
  featureTitle: { fontSize: 17, marginBottom: 8 },
  featureText: { fontSize: 14, color: "var(--ink-70)" },

  pricingSection: { maxWidth: 1120, margin: "0 auto", padding: "72px 24px", borderBottom: "1px solid var(--ink-15)" },
  pricingSub: { textAlign: "center", color: "var(--ink-45)", marginTop: -20, marginBottom: 40, fontSize: 15 },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  planCard: { position: "relative", background: "var(--paper-raised)", border: "1px solid var(--ink-15)", borderTop: "3px solid var(--ink)", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 16 },
  planCardHighlight: { borderTop: "3px solid var(--gold)" },
  planBadge: { position: "absolute", top: -12, insetInlineStart: 24, background: "var(--gold)", color: "var(--ink)", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 },
  planName: { fontSize: 20 },
  planTagline: { fontSize: 13, color: "var(--ink-45)", minHeight: 34 },
  planPrice: { display: "flex", alignItems: "baseline", gap: 6 },
  planPriceNum: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 700 },
  planPriceUnit: { fontSize: 13, color: "var(--ink-45)" },
  planFeatures: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  planFeatureItem: { fontSize: 14, color: "var(--ink-70)", paddingInlineStart: 18, position: "relative" },

  faqList: { display: "flex", flexDirection: "column", gap: 0, maxWidth: 760, margin: "0 auto" },
  faqItem: { borderTop: "1px solid var(--ink-15)", padding: "18px 0" },
  faqQ: { fontSize: 16, fontWeight: 600, cursor: "pointer" },
  faqA: { fontSize: 14, color: "var(--ink-70)", marginTop: 10 },

  footer: { background: "var(--ink)", color: "var(--paper)" },
  footerInner: { maxWidth: 1120, margin: "0 auto", padding: "48px 24px", display: "flex", flexDirection: "column", gap: 12 },
  brandMarkDark: { width: 34, height: 34, borderRadius: 8, background: "var(--gold)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginInlineEnd: 10 },
  brandNameDark: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 },
  footerText: { fontSize: 14, color: "rgba(241,244,239,0.6)", maxWidth: 420 },
  footerCopy: { fontSize: 12, color: "rgba(241,244,239,0.4)" },
};
