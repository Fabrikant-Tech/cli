import { getWeekNumber } from '../../../utils/date-time/date-time-utils';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function isDaySelected(day: Date, currentValue: Date[] | undefined) {
  if (!currentValue) {
    return false;
  }
  const index = currentValue.findIndex((d) => {
    return (
      d.getFullYear() === day.getFullYear() &&
      d.getMonth() === day.getMonth() &&
      d.getDate() === day.getDate()
    );
  });
  return index !== -1;
}

export function generateCalendarDays(year: number, month: number, startDay = 0) {
  const days = [];

  function adjustDayIndex(day: number) {
    return (day - startDay + 7) % 7;
  }

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month, getDaysInMonth(year, month));

  const firstDayOfWeek = adjustDayIndex(firstDayOfMonth.getDay());
  const lastDayOfWeek = adjustDayIndex(lastDayOfMonth.getDay());

  if (firstDayOfWeek > 0) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevMonthYear, prevMonth);

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        month: prevMonth,
        year: prevMonthYear,
        dayOfWeek: adjustDayIndex(i),
        weekNumber: getWeekNumber(new Date(prevMonthYear, prevMonth, prevMonthDays - i)),
      });
    }
  }

  for (let i = 1; i <= getDaysInMonth(year, month); i++) {
    const currentDate = new Date(year, month, i);
    days.push({
      date: i,
      month: month,
      year: year,
      dayOfWeek: adjustDayIndex(currentDate.getDay()),
      weekNumber: getWeekNumber(new Date(year, month, i)),
    });
  }

  if (lastDayOfWeek < 6) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      days.push({
        date: i,
        month: nextMonth,
        year: nextMonthYear,
        dayOfWeek: adjustDayIndex(lastDayOfWeek + i),
        weekNumber: getWeekNumber(new Date(nextMonthYear, nextMonth, i)),
      });
    }
  }

  return days;
}

export function getSelectionDirectionsForDay(
  day: {
    date: number;
    month: number;
    year: number;
    dayOfWeek: number;
    weekNumber: number;
  },
  calendarDays: Array<{
    date: number;
    month: number;
    year: number;
    dayOfWeek: number;
    weekNumber: number;
  }>,
  selectedDates: Array<Date>,
): string[] {
  let directions: string[] = [];

  const selectedStrings = selectedDates.map(
    (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
  );

  function isSelected(targetDay: {
    date: number;
    month: number;
    year: number;
    dayOfWeek: number;
    weekNumber: number;
  }): boolean {
    return selectedStrings.includes(`${targetDay.year}-${targetDay.month}-${targetDay.date}`);
  }

  const leftEdgeIndexes = [0, 7, 14, 21, 28];
  const rightEdgeIndexes = [6, 13, 20, 27, 34];

  const index = calendarDays.findIndex(
    (d) => d.year === day.year && d.month === day.month && d.date === day.date,
  );

  if (index === -1) return directions;

  if (index > 0) {
    const leftNeighbor = leftEdgeIndexes.includes(index) ? undefined : calendarDays[index - 1];
    if (leftNeighbor && isSelected(leftNeighbor)) {
      directions = [...directions, 'left'];
    }
  }

  if (index < calendarDays.length - 1) {
    const rightNeighbor = rightEdgeIndexes.includes(index) ? undefined : calendarDays[index + 1];
    if (rightNeighbor && isSelected(rightNeighbor)) {
      directions = [...directions, 'right'];
    }
  }

  const topNeighbor = calendarDays[index - 7];
  if (topNeighbor && isSelected(topNeighbor)) {
    directions = [...directions, 'top'];
  }

  const bottomNeighbor = calendarDays[index + 7];
  if (bottomNeighbor && isSelected(bottomNeighbor)) {
    directions = [...directions, 'bottom'];
  }

  return directions;
}

export function getSelectionDirectionsForMonth(
  item: {
    monthNumber: number;
    year: number;
  },
  selectedDates: Array<Date>,
): string[] {
  let directions: string[] = [];

  function isSelected(targetDay: { monthNumber: number; year: number }): boolean {
    return selectedStrings.includes(`${targetDay.year}-${targetDay.monthNumber}-1`);
  }

  const selectedStrings = selectedDates.map(
    (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
  );

  const leftNeighborDate = new Date(item.year, item.monthNumber - 1, 1);
  const rightNeighborDate = new Date(item.year, item.monthNumber + 1, 1);
  const topNeighborDate = new Date(item.year, item.monthNumber - 3, 1);
  const bottomNeighborDate = new Date(item.year, item.monthNumber + 3, 1);

  const getItemFromDate = (date: Date) => {
    return {
      monthNumber: date.getMonth(),
      year: date.getFullYear(),
    };
  };

  const leftEdgeMonths = [0, 3, 6, 9];
  const rightEdgeMonths = [2, 5, 8, 11];
  const topEdgeMonths = [0, 1, 2];
  const bottomEdgeMonths = [11, 10, 9];

  const leftNeighbor = leftEdgeMonths.includes(item.monthNumber)
    ? getItemFromDate(
        new Date(leftNeighborDate.getFullYear() - 1, leftNeighborDate.getMonth() + 3, 1),
      )
    : getItemFromDate(leftNeighborDate);
  if (leftNeighbor && isSelected(leftNeighbor)) {
    directions = [...directions, 'left'];
  }

  const rightNeighbor = rightEdgeMonths.includes(item.monthNumber)
    ? getItemFromDate(
        new Date(rightNeighborDate.getFullYear() + 1, rightNeighborDate.getMonth() - 3, 1),
      )
    : getItemFromDate(rightNeighborDate);
  if (rightNeighbor && isSelected(rightNeighbor)) {
    directions = [...directions, 'right'];
  }

  const topNeighbor = getItemFromDate(topNeighborDate);
  if (topNeighbor && isSelected(topNeighbor) && !topEdgeMonths.includes(item.monthNumber)) {
    directions = [...directions, 'top'];
  }

  const bottomNeighbor = getItemFromDate(bottomNeighborDate);
  if (
    bottomNeighbor &&
    isSelected(bottomNeighbor) &&
    !bottomEdgeMonths.includes(item.monthNumber)
  ) {
    directions = [...directions, 'bottom'];
  }

  return directions;
}
