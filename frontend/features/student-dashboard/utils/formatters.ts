// ============================================================================
// FILE: student-dashboard/utils/formatters.ts
// ============================================================================
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};