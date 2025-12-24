// 📁 monthly-view/utils/formatters.ts
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const getMonthName = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return `Tháng ${month}/${year}`;
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};