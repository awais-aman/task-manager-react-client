// Keys of the Rails Task status enum, exactly as the API returns them.
export const TASK_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "In progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export const statusLabel = (value) =>
  TASK_STATUSES.find((status) => status.value === value)?.label ?? value;
