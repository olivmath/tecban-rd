export function getTradeTotal(tpftAmount: string, unitPrice: number) {
  const amount = parseFloat(tpftAmount) / 100;
  const formattedAmount = amount.toFixed(2);

  const total = (Number(formattedAmount) * unitPrice).toFixed(2);

  const formattedTotal = total.toString().replace('.', '');

  return { total, formattedTotal };
}