export const toISOString = (date: Date): string => {
  const pad = (num: number, digit?: number): string => {
    return num.toString().padStart(digit ?? 2, '0');
  };

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  const millisecond = pad(date.getMilliseconds(), 3);
  const offset = date.getTimezoneOffset();
  const offsetSign = offset < 0 ? '+' : '-';
  const offsetHour = pad(Math.abs(offset) / 60);
  const offsetMinute = pad(Math.abs(offset) % 60);

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hour}:${minute}:${second}.${millisecond}`;
  const offsetStr = `${offsetSign}${offsetHour}:${offsetMinute}`;

  return `${dateStr}T${timeStr}${offsetStr}`;
};
