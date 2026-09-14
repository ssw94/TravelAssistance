import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatCurrency = (amount: number | string = 0, currency = 'INR'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';

  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateStr: string | Date | undefined, format = 'DD MMM YYYY'): string => {
  if (!dateStr) return '';
  return dayjs(dateStr).format(format);
};

export const formatDateTime = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return '';
  return dayjs(dateStr).format('DD MMM YYYY, hh:mm A');
};

export const formatTime = (timeStr: string | undefined): string => {
  if (!timeStr) return '';
  return timeStr;
};

export const formatFromNow = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return '';
  return dayjs(dateStr).fromNow();
};

export const getDaysDuration = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 1;
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return Math.max(1, end.diff(start, 'day') + 1);
};
