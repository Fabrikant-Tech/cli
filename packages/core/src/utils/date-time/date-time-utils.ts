export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function isSameMonth(month: number, currentMonth: number) {
  return month === currentMonth;
}

export function getWeekNumber(date: Date): number {
  const copiedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  copiedDate.setUTCDate(copiedDate.getUTCDate() + 4 - (copiedDate.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(copiedDate.getUTCFullYear(), 0, 4));
  yearStart.setUTCDate(yearStart.getUTCDate() - (yearStart.getUTCDay() || 7) + 1);

  const daysDifference = (copiedDate.getTime() - yearStart.getTime()) / 86400000;

  const weekNumber = Math.floor(daysDifference / 7) + 1;

  return weekNumber;
}

export function isToday(currentDay: Date) {
  const today = new Date();
  const dayToday = today.getDate();
  const monthToday = today.getMonth();
  const yearToday = today.getFullYear();
  const currentDayDay = currentDay.getDate();
  const currentDayMonth = currentDay.getMonth();
  const currentDayYear = currentDay.getFullYear();
  return (
    dayToday === currentDayDay && monthToday === currentDayMonth && yearToday === currentDayYear
  );
}

export function isNow(currentDay: Date, precision: 'hour' | 'minute' | 'second' | 'millisecond') {
  const today = new Date();
  const sameDate = isToday(currentDay);
  const isSameHour = currentDay.getHours() === today.getHours();
  const isSameMinute = currentDay.getMinutes() === today.getMinutes();
  const isSameSecond = currentDay.getSeconds() === today.getSeconds();
  const precisionHour = precision === 'hour' && isSameHour;
  const precisionMinute = precision === 'minute' && isSameMinute && isSameHour;
  const precisionSecond = precision === 'second' && isSameSecond && isSameMinute && isSameHour;
  const precisionMillisecond = false;
  return sameDate && (precisionHour || precisionMinute || precisionSecond || precisionMillisecond);
}

export function getDayNames(locale = 'en-US', startDay = 0) {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.UTC(2024, 0, i + 1));
    const dayName = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    days.push(dayName);
  }

  const reorderedDays = days.slice(startDay).concat(days.slice(0, startDay));

  return reorderedDays;
}

export function getShortDayNames(locale = 'en-US', startDay: number) {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.UTC(2024, 0, i + 1));
    const dayName = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
    days.push(dayName);
  }

  const reorderedDays = days.slice(startDay).concat(days.slice(0, startDay));

  return reorderedDays;
}

export function getMonthNames(locale = 'en-US') {
  const months = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
    months.push(monthName);
  }

  return months;
}

export function getShortMonthNames(locale = 'en-US') {
  const months = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    const monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    months.push(monthName);
  }

  return months;
}

export function isMonthInRange(
  month: number,
  year: number,
  minDate: Date,
  maxDate: Date,
  inclusive = true,
) {
  const targetDate = new Date(year, month, 1);

  const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  if (inclusive) {
    return targetDate >= start && targetDate <= end;
  } else {
    return targetDate > start && targetDate < end;
  }
}

export function isDateBetween(date: Date, minDate: Date, maxDate: Date, inclusive = true) {
  const d = date;
  const start = minDate;
  const end = maxDate;
  if (inclusive) {
    return d >= start && d <= end;
  } else {
    return d > start && d < end;
  }
}

export function getYearsBetweenYears(start: number, end: number, inclusive = false) {
  const numbers = [];

  const lower = inclusive ? start : start + 1;
  const upper = inclusive ? end : end - 1;

  for (let i = lower; i <= upper; i++) {
    numbers.push(i);
  }

  return numbers;
}

export function getAllDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function getMonthsBetween(startDate: Date, endDate: Date) {
  const result = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (current <= endDate) {
    result.push({
      monthNumber: current.getMonth(),
      year: current.getFullYear(),
    });

    current.setMonth(current.getMonth() + 1);
  }

  return result;
}

export function clampDate(date: Date, minDate: Date, maxDate: Date, elm: globalThis.Element) {
  if (date < minDate) {
    console.error(
      `WARNING - The value was below the minimum, the minimum date was used instead.`,
      elm,
    );
    return minDate;
  } else if (date > maxDate) {
    console.error(
      `WARNING - The value was above the maximum, the maximum date was used instead.`,
      elm,
    );
    return maxDate;
  } else {
    return date;
  }
}

export function clampDates(dates: Date[], minDate: Date, maxDate: Date, elm: globalThis.Element) {
  return dates.map((date) => clampDate(date, minDate, maxDate, elm));
}

export function cleanUpDates(dates: Date[], minDate: Date, maxDate: Date, elm: globalThis.Element) {
  const newDates = dates
    .map((date) => {
      if (date >= minDate && date <= maxDate) {
        return date;
      }
    })
    .filter((d) => d !== undefined);
  if (newDates.length !== dates.length) {
    console.error(
      `WARNING - Some values where falling outside of the min and max. Those values have been removed.`,
      elm,
    );
  }
  return newDates;
}

export function getDateWithLiteral(date: Date, locale: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
  };

  // Use formatToParts to break the date string into meaningful parts
  const formatter = new Intl.DateTimeFormat(locale, options);
  const parts = formatter.formatToParts(date);

  let result = '';
  let encounteredTimePart = false;

  for (const part of parts) {
    if (encounteredTimePart) break;

    if (
      part.type === 'literal' ||
      part.type === 'year' ||
      part.type === 'month' ||
      part.type === 'day'
    ) {
      result += part.value;
    } else if (part.type === 'hour') {
      encounteredTimePart = true;
    }
  }

  return result;
}

export function getFormatOptionsForParts(locale: string, format: 12 | 24) {
  const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
  const hasAmPm = date.toLocaleTimeString(locale).match(/am|pm/i);
  const confirmMeridiem = format === 12 ? hasAmPm !== null : false;
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: confirmMeridiem && format === 12,
  };
  return options;
}

export function getLastPartForPrecision(
  precision: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond',
  locale: string,
  format: 12 | 24,
) {
  const name = precision === 'millisecond' ? 'fractionalSecond' : precision;
  const options = getFormatOptionsForParts(locale, format);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatter = new Intl.DateTimeFormat(locale, options as any);
  const dateToFormat = new Date(2024, 10, 1, 12, 12, 12, 12);
  const parts = formatter.formatToParts(dateToFormat);

  const stopIndex = parts.findIndex((p) => p.type === name);
  const validParts = parts.slice(0, stopIndex + 1);

  return validParts[validParts.length - 1].type;
}

export function getSelectedDatePart(
  clickPosition: number,
  locale: string,
  format: 12 | 24,
  omitDayParts?: boolean | string,
) {
  const options = getFormatOptionsForParts(locale, format);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatter = new Intl.DateTimeFormat(locale, options as any);
  const getUsedParts = (parts: { type: string; value: string }[]) => {
    const hourIndex = parts.findIndex(
      (p) => p.type === (typeof omitDayParts === 'string' ? omitDayParts : 'hour'),
    );
    const newArray = parts
      .map((p, i) => {
        if (
          (i >= hourIndex && typeof omitDayParts !== 'string') ||
          (i <= hourIndex && typeof omitDayParts === 'string')
        ) {
          return p;
        }
      })
      .filter((p) => p !== undefined);
    return newArray;
  };
  const parts = omitDayParts
    ? getUsedParts(formatter.formatToParts(new Date()))
    : formatter.formatToParts(new Date());

  let currentIndex = 0;
  let previousPart = null;

  for (const part of parts) {
    const partLength = part.value.length;

    if (clickPosition >= currentIndex && clickPosition < currentIndex + partLength) {
      if (part.type === 'literal') {
        return previousPart;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switch (part.type as any) {
          case 'year':
            return 'year';
          case 'month':
            return 'month';
          case 'day':
            return 'day';
          case 'hour':
            return 'hour';
          case 'minute':
            return 'minute';
          case 'second':
            return 'second';
          case 'fractionalSecond':
            return 'fractionalSecond';
          case 'dayPeriod':
            return 'dayPeriod';
          default:
            return null;
        }
      }
    }

    if (part.type !== 'literal') {
      previousPart = part.type;
    }

    currentIndex += partLength;
  }

  return 'all';
}

export function getFormattedString(
  value: Date,
  precision: 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond',
  locale: string,
  format: 12 | 24,
): string {
  const date = value;
  const hasAmPm = date.toLocaleTimeString(locale).match(/am|pm/i);
  const confirmMeridiem = format === 12 ? hasAmPm !== null : false;

  const hasHour = precision !== 'day' && precision !== 'month';
  const hasMinute = precision !== 'hour' && hasHour;
  const hasSecond = precision !== 'minute' && hasMinute;
  const hasMillisecond = precision !== 'second' && hasSecond;

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: hasHour ? '2-digit' : undefined,
    minute: hasMinute ? '2-digit' : undefined,
    second: hasSecond ? '2-digit' : undefined,
    fractionalSecondDigits: hasMillisecond ? 3 : undefined,
    hour12: confirmMeridiem && format === 12,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatter = new Intl.DateTimeFormat(locale, options as any);
  const stringParts = formatter.formatToParts(date);

  const yearArray = Array.from(Array(4 - value.getFullYear().toString().length).keys())
    .map(() => {
      return '0';
    })
    .join('');

  const string = `${stringParts
    .map((part) => {
      if (part.type === 'year') {
        return `${yearArray}${part.value}`;
      } else {
        return part.value;
      }
    })
    .join('')}`;
  return string;
}

export function getFormattedTimeString(
  date: Date,
  locale: string,
  format: 12 | 24,
  precision: 'hour' | 'minute' | 'second' | 'millisecond', // Precision level
): string {
  const hasAmPm = date.toLocaleTimeString(locale).match(/am|pm/i);
  const use12Hour = format === 12 && hasAmPm !== undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    hour: '2-digit',
    hour12: use12Hour,
  };

  if (precision === 'minute' || precision === 'second' || precision === 'millisecond') {
    options.minute = 'numeric';
  }
  if (precision === 'second' || precision === 'millisecond') {
    options.second = 'numeric';
  }
  if (precision === 'millisecond') {
    options.fractionalSecondDigits = 3;
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  const formattedTime = formatter.format(date);

  return formattedTime;
}

export function getPartRange(
  partName: string,
  locale: string,
  format: 12 | 24,
  omitDayParts?: boolean | string,
): [number, number] | null {
  const options = getFormatOptionsForParts(locale, format);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatter = new Intl.DateTimeFormat(locale, options as any);
  const getUsedParts = (parts: { type: string; value: string }[]) => {
    const hourIndex = parts.findIndex(
      (p) => p.type === (typeof omitDayParts === 'string' ? omitDayParts : 'hour'),
    );
    const newArray = parts
      .map((p, i) => {
        if (
          (i >= hourIndex && typeof omitDayParts !== 'string') ||
          (i <= hourIndex && typeof omitDayParts === 'string')
        ) {
          return p;
        }
      })
      .filter((p) => p !== undefined);
    return newArray;
  };
  const parts = omitDayParts
    ? getUsedParts(formatter.formatToParts(new Date()))
    : formatter.formatToParts(new Date());
  let currentIndex = 0;

  for (const part of parts) {
    const partLength = part.value.length;

    if (part.type === partName) {
      const start = currentIndex;
      const end = currentIndex + partLength;
      return [start, end];
    }

    currentIndex += partLength;
  }

  return null;
}

export function getNextPart(
  part: string | undefined,
  direction: 'forward' | 'backward',
  locale: string,
  format: 12 | 24,
  omitDayParts?: boolean | string,
) {
  const options = getFormatOptionsForParts(locale, format);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatter = new Intl.DateTimeFormat(locale, options as any);
  const getUsedParts = (parts: Intl.DateTimeFormatPart[]) => {
    const hourIndex = parts.findIndex(
      (p) => p.type === (typeof omitDayParts === 'string' ? omitDayParts : 'hour'),
    );
    const newArray = parts
      .map((p, i) => {
        if (
          (i >= hourIndex && typeof omitDayParts !== 'string') ||
          (i <= hourIndex && typeof omitDayParts === 'string')
        ) {
          return p;
        }
      })
      .filter((p) => p !== undefined);
    return newArray;
  };
  const parts = omitDayParts
    ? getUsedParts(formatter.formatToParts(new Date()))
    : formatter.formatToParts(new Date());

  if (part === 'all') {
    return parts[0].type;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastPossiblePart = getLastPartForPrecision(part as any, locale, format);

  const relevantParts = parts.filter((p) => p.type !== 'literal');
  const index = relevantParts.findIndex((p) => p.type === part);
  const newPart = relevantParts[index + (direction === 'forward' ? 1 : -1)];

  return (newPart?.type !== lastPossiblePart && newPart?.type) || lastPossiblePart;
}

export function parseFormattedDate(
  dateString: string,
  locale: string,
  format: 12 | 24,
): Date | null {
  const referenceDate = new Date(Date.UTC(2012, 11, 12, 3, 0, 0, 123));

  const hasAmPm = referenceDate.toLocaleTimeString(locale).match(/am|pm/i);
  const confirmMeridiem = format === 12 ? hasAmPm !== null : false;

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: confirmMeridiem && format === 12,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatter = new Intl.DateTimeFormat(locale, options as any);
  const parts = formatter.formatToParts(referenceDate); // Reference to get part types

  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;
  let hour: number | undefined;
  let minute: number | undefined;
  let second: number | undefined;
  let millisecond: number | undefined;
  let isPM = false;

  for (const part of parts) {
    const partRange = getPartRange(part.type, locale, format);
    if (!partRange) {
      break;
    }
    const partValue = dateString.substring(partRange[0], partRange[1]) || '0';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    switch (part.type as any) {
      case 'year':
        year = parseInt(partValue, 10);
        break;
      case 'month':
        month = parseInt(partValue, 10) - 1;
        break;
      case 'day':
        day = parseInt(partValue, 10);
        break;
      case 'hour':
        hour = parseInt(partValue, 10);
        break;
      case 'minute':
        minute = parseInt(partValue, 10);
        break;
      case 'second':
        second = parseInt(partValue, 10);
        break;
      case 'fractionalSecond':
        millisecond = parseInt(partValue, 10);
        break;
      case 'dayPeriod':
        isPM = partValue.toLowerCase() === 'pm';
        break;
      default:
        break;
    }
  }

  if (confirmMeridiem && hour !== undefined) {
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
  }

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    hour === undefined ||
    minute === undefined ||
    second === undefined ||
    millisecond === undefined
  ) {
    return null;
  }

  let date: Date | 'string' | null;

  if (year < 1900) {
    const yearArray = `${Array.from(Array(4 - year.toString().length).keys())
      .map(() => {
        return '0';
      })
      .join('')}${year}`;
    const monthArray = `${Array.from(Array(2 - (month + 1).toString().length).keys())
      .map(() => {
        return '0';
      })
      .join('')}${month + 1}`;
    const dayArray = `${Array.from(Array(2 - day.toString().length).keys())
      .map(() => {
        return '0';
      })
      .join('')}${day}`;
    const hourArray = hour
      ? `${Array.from(Array(2 - hour.toString().length).keys())
          .map(() => {
            return '0';
          })
          .join('')}${hour}`
      : '00';
    const minuteArray = minute
      ? `${Array.from(Array(2 - minute.toString().length).keys())
          .map(() => {
            return '0';
          })
          .join('')}${minute}`
      : '00';
    const secondArray = second
      ? `${Array.from(Array(2 - second.toString().length).keys())
          .map(() => {
            return '0';
          })
          .join('')}${second}`
      : '00';
    const millisecondArray = millisecond
      ? `${Array.from(Array(3 - millisecond.toString().length).keys())
          .map(() => {
            return '0';
          })
          .join('')}${millisecond}`
      : '000';

    date = new Date(
      `${yearArray}-${monthArray}-${dayArray}T${hourArray}:${minuteArray}:${secondArray}.${millisecondArray}`,
    );
  } else {
    date = new Date(year, month, day, hour, minute, second, millisecond);
  }

  return date.toString() === 'Invalid Date' ? null : date;
}
