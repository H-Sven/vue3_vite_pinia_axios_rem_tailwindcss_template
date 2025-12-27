import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期
 */
export function formatDate(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

export default dayjs;
