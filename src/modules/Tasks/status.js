import { colors } from "assets/theme";

// Keys of the Rails Task status enum, exactly as the API returns them.
export const TASK_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "In progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export const PRIORITIES = [
  { value: "low", label: "Low", color: colors.low },
  { value: "medium", label: "Medium", color: colors.medium },
  { value: "high", label: "High", color: colors.high },
];

export const statusLabel = (value) =>
  TASK_STATUSES.find((status) => status.value === value)?.label ?? value;

export const priorityOf = (value) =>
  PRIORITIES.find((priority) => priority.value === value) ?? PRIORITIES[0];
