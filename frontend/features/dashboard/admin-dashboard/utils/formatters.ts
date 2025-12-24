// ============================================================================
// FILE: admin-dashboard/utils/formatters.ts
// ============================================================================
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getMonthName = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return `Tháng ${month}/${year}`;
};