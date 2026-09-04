// بوابة الدفع المتاحة حاليًا: Paymob فقط (جنيه مصري).
// لما تضاف بوابات جديدة لدول تانية، يتحدث الملف ده والدالة create-checkout مع بعض.
export const GATEWAY_BY_COUNTRY = {
  EG: "paymob",
};

export function gatewayForCountry(code) {
  return GATEWAY_BY_COUNTRY[code] || "paymob";
}

export const GATEWAY_LABEL = {
  paymob: "Paymob",
};
