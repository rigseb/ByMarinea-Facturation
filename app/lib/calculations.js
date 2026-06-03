function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function computeTotals(items) {
  const normalized = items.map((item) => {
    const qty = toNumber(item.qty);
    const unitPrice = toNumber(item.unitPrice);
    const vatRate = toNumber(item.vatRate);
    const totalHT = qty * unitPrice;
    const totalVAT = (totalHT * vatRate) / 100;
    const totalTTC = totalHT + totalVAT;

    return {
      ...item,
      qty,
      unitPrice,
      vatRate,
      totalHT,
      totalVAT,
      totalTTC,
    };
  });

  const totalHT = normalized.reduce((sum, item) => sum + item.totalHT, 0);
  const totalVAT = normalized.reduce((sum, item) => sum + item.totalVAT, 0);
  const totalTTC = normalized.reduce((sum, item) => sum + item.totalTTC, 0);

  return { normalized, totalHT, totalVAT, totalTTC };
}