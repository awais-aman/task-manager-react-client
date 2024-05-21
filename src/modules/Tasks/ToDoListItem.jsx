import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Chip, IconButton, Paper, Popover, Tooltip, Typography } from "@mui/material";
import { toast } from "react-toastify";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import MoreActions from "modules/Tasks/MoreActions";
import { priorityOf, statusLabel } from "modules/Tasks/status";
import { colors } from "assets/theme";
import { displayDeadline, isOverdue } from "helpers/dateFormat";
import { fetchTask, removeTask } from "store/slices/tasksSlice";
import { toastErrors } from "helpers/errorMessages";

const STATUS_CHIP = {
  pending: { bgcolor: "#ECE6D8", color: colors.text },
  "In progress": { bgcolor: "#F3E3BA", color: "#5C420C" },
  completed: { bgcolor: "#DCEADF", color: "#2B5236" },
};

const ToDoListItem = ({ task }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const priority = priorityOf(task.priority);
  const overdue = isOverdue(task);
  const done = task.status === "completed";
  const menuId = `task-${task.id}-status`;

  const handleEditTask = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    dispatch(fetchTask(task.id)).unwrap().catch(toastErrors);
  };

  const handleDeleteTask = () => {
    dispatch(removeTask(task.id))
      .unwrap()
      .then(() => toast.success("Task deleted successfully"), toastErrors);
  };

  return (
    <Paper
      component="li"
      sx={{
        p: 2,
        borderLeft: 5,
        borderLeftColor: priority.color,
        display: "grid",
        gap: 1,
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "start",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h3"
          component="h3"
          sx={{ overflowWrap: "anywhere", ...(done && { textDecoration: "line-through", color: "text.secondary" }) }}
        >
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, overflowWrap: "anywhere" }}>
          {task.description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1.25 }}>
          <Chip size="small" label={statusLabel(task.status)} sx={STATUS_CHIP[task.status]} />
          <Chip
            size="small"
            variant="outlined"
            label={`${priority.label} priority`}
            sx={{ borderColor: priority.color, color: priority.color }}
          />
          <Typography
            variant="body2"
            component="span"
            sx={{ fontVariantNumeric: "tabular-nums", color: overdue ? "error.main" : "text.secondary", fontWeight: overdue ? 700 : 400 }}
          >
            {overdue ? "Overdue · " : "Due "}
            {displayDeadline(task.deadline)}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        <Tooltip title="Edit">
          <IconButton aria-label={`Edit ${task.title}`} onClick={handleEditTask}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label={`Delete ${task.title}`} onClick={handleDeleteTask}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Change status">
          <IconButton
            aria-label={`Change status of ${task.title}`}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            aria-controls={anchorEl ? menuId : undefined}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Popover
          id={menuId}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MoreActions task={task} setAnchorEl={setAnchorEl} />
        </Popover>
      </Box>
    </Paper>
  );
};

export default ToDoListItem;
