import { useDispatch } from "react-redux";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { toast } from "react-toastify";
import PendingIcon from "@mui/icons-material/Pending";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { toastErrors } from "helpers/errorMessages";
import { editCleared, fetchTasks, saveTask } from "store/slices/tasksSlice";
import { TASK_STATUSES } from "modules/Tasks/status";

const ICONS = {
  pending: PendingIcon,
  "In progress": AutorenewIcon,
  completed: CheckCircleIcon,
};

const MoreActions = ({ task, setAnchorEl }) => {
  const dispatch = useDispatch();

  const handleTaskUpdateStatus = (status) => {
    dispatch(saveTask({ id: task.id, task: { status } }))
      .unwrap()
      .then(() => {
        dispatch(fetchTasks());
        dispatch(editCleared());
        setAnchorEl(null);
        toast.success("Status updated successfully");
      }, toastErrors);
  };

  return (
    <Box>
      <List>
        {TASK_STATUSES.filter(({ value }) => value !== task.status).map(
          ({ value, label }) => {
            const Icon = ICONS[value];
            return (
              <ListItem disablePadding key={value}>
                <ListItemButton onClick={() => handleTaskUpdateStatus(value)}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={`Mark as ${label}`} />
                </ListItemButton>
              </ListItem>
            );
          }
        )}
      </List>
    </Box>
  );
};

export default MoreActions;
