export const BENGALI_NUMERALS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBengaliNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '০';
  const str = num.toString();
  return str.replace(/[0-9]/g, (digit) => BENGALI_NUMERALS[parseInt(digit, 10)]);
};

export const formatTaka = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '৳ ০';
  const formatted = new Intl.NumberFormat('en-IN').format(amount);
  return `৳ ${toBengaliNumber(formatted)}`;
};

export const formatBengaliPrice = (amount: number | undefined | null): string => {
  return formatTaka(amount);
};

export const formatBengaliDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const day = toBengaliNumber(date.getDate());
    const month = months[date.getMonth()];
    const year = toBengaliNumber(date.getFullYear());
    const hours = toBengaliNumber(date.getHours());
    const minutes = toBengaliNumber(date.getMinutes().toString().padStart(2, '0'));
    return `${day} ${month}, ${year} (${hours}:${minutes})`;
  } catch {
    return isoString;
  }
};
