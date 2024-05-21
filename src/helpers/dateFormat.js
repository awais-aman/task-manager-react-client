import dayjs from "dayjs";

const DAY = "YYYY-MM-DD";

// A deadline is a calendar day. The API keeps it in a datetime column, so the
// client sends the bare day and reads back only the date part: converting the
// stored UTC midnight to local time would move it a day in the Americas.
export const deadlineToDay = (value) => {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value.startOf("day") : null;
  const day = dayjs(String(value).slice(0, 10));
  return day.isValid() ? day : null;
};

export const toDeadlinePayload = (day) => deadlineToDay(day)?.format(DAY) ?? null;

export const displayDeadline = (value) =>
  deadlineToDay(value)?.format("D MMM YYYY") ?? "No deadline";

export const isOverdue = (task, today = dayjs().startOf("day")) => {
  const day = deadlineToDay(task?.deadline);
  return Boolean(day && task.status !== "completed" && day.isBefore(today));
};
