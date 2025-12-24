// ============================================================================
// 📁 student-list/utils/formatters.ts
// ============================================================================
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};