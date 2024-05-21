import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";

import ToDoListItem from "modules/Tasks/ToDoListItem";
import { fetchTasks } from "store/slices/tasksSlice";
import { isOverdue } from "helpers/dateFormat";

const summarise = (tasks) => {
  const open = tasks.filter((task) => task.status !== "completed").length;
  const overdue = tasks.filter((task) => isOverdue(task)).length;
  return [
    `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`,
    `${open} open`,
    overdue ? `${overdue} overdue` : null,
  ]
    .filter(Boolean)
    .join(" · ");
};

const ToDoList = () => {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((state) => state.tasks);
  const loading = status === "loading" || status === "idle";

  let body;
  if (status === "failed") {
    body = (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(fetchTasks())}>
            Retry
          </Button>
        }
      >
        {error?.[0] ?? "Your tasks could not be loaded."}
      </Alert>
    );
  } else if (loading && tasks.length === 0) {
    body = (
      <Box aria-hidden sx={{ display: "grid", gap: 1.5 }}>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} variant="rounded" height={92} />
        ))}
      </Box>
    );
  } else if (tasks.length === 0) {
    body = (
      <Paper sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}>
        <Typography variant="h3" component="p">
          No tasks yet
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Add your first task with the form and it will be listed here.
        </Typography>
      </Paper>
    );
  } else {
    body = (
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 1.5 }}>
        {tasks.map((task) => (
          <ToDoListItem task={task} key={task.id} />
        ))}
      </Box>
    );
  }

  return (
    <Box component="section" aria-labelledby="task-list-heading" aria-busy={loading}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Typography id="task-list-heading" variant="h1" component="h2">
          Your tasks
        </Typography>
        {status === "succeeded" && tasks.length > 0 && (
          <Typography color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {summarise(tasks)}
          </Typography>
        )}
      </Box>
      <Box sx={{ height: 4, mb: 1 }}>
        {loading && tasks.length > 0 && <LinearProgress aria-label="Refreshing tasks" />}
      </Box>
      {body}
    </Box>
  );
};

export default ToDoList;
