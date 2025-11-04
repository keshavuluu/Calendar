import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";

export function getMonthMatrix(active) {
  const start = startOfWeek(startOfMonth(active), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(active), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function toIso(date) {
  return format(date, "yyyy-MM-dd");
}

export function fromIso(iso) {
  return parse(iso, "yyyy-MM-dd", new Date());
}

export function isToday(date) {
  return isSameDay(date, startOfToday());
}

export function isPastDay(date) {
  return isBefore(date, startOfToday());
}

export function sameMonth(a, b) {
  return isSameMonth(a, b);
}

export function monthAdd(date, count) {
  return addMonths(date, count);
}

export const fmt = {
  monthYear(d) {
    return format(d, "LLLL yyyy");
  },
  dayNum(d) {
    return format(d, "d");
  },
};
