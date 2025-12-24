// ============================================================================
// 📁 unpaid-sessions/utils/formatters.ts
// ============================================================================
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getMonthName = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  return `${month}/${year}`;
};