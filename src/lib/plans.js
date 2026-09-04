// كل الأسعار بالجنيه المصري. amountCents = القيمة بالقروش (مطلوبة لبوابات الدفع).
export const TRIAL_DAYS = 3;

export const PLANS = [
  {
    id: "starter",
    name: "أساسي",
    price: 199,
    amountCents: 19900,
    tagline: "للمستقلين والأفراد اللي بيديروا شغلهم لوحدهم",
    features: [
      "تحليل حتى 5 ملفات شهريًا",
      "رسوم بيانية تفاعلية",
      "تصدير تقرير PDF",
      "دعم عبر البريد الإلكتروني",
    ],
    highlight: false,
  },
  {
    id: "growth",
    name: "نمو",
    price: 549,
    amountCents: 54900,
    tagline: "للشركات الصغيرة اللي محتاجة فريق يشتغل مع بعض",
    features: [
      "تحليلات غير محدودة",
      "حتى 5 مستخدمين على نفس الحساب",
      "تقارير أسبوعية تلقائية بالإيميل",
      "دعم مباشر عبر واتساب",
    ],
    highlight: true,
  },
  {
    id: "scale",
    name: "احترافي",
    price: 1290,
    amountCents: 129000,
    tagline: "للشركات المتوسطة وفرق العمليات الكبيرة",
    features: [
      "كل مميزات خطة نمو",
      "صلاحيات مخصصة لكل عضو فريق",
      "مدير حساب مخصص",
      "أولوية في الدعم الفني",
    ],
    highlight: false,
  },
];

export function planById(id) {
  return PLANS.find((p) => p.id === id) || null;
}

// تاريخ بداية الحساب هو أساس حساب التجربة، فمش محتاجين عمود إضافي في قاعدة البيانات.
export function trialInfo(userCreatedAt) {
  if (!userCreatedAt) return { active: false, daysLeft: 0 };
  const started = new Date(userCreatedAt).getTime();
  const now = Date.now();
  const elapsedDays = (now - started) / (1000 * 60 * 60 * 24);
  const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - elapsedDays));
  return { active: daysLeft > 0, daysLeft };
}
