// ============================================================================
// FILE: calendar-view/utils.ts
// ============================================================================
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const getLocalDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMonthStr = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};