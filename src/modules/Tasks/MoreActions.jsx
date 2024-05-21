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
        {task?.status !== "pending" && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleTaskUpdateStatus(0)}>
              <ListItemIcon>
                <PendingIcon />
              </ListItemIcon>
              <ListItemText primary="Mark as Pending" />
            </ListItemButton>
          </ListItem>
        )}
        {task?.status !== "in_progress" && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleTaskUpdateStatus(1)}>
              <ListItemIcon>
                <AutorenewIcon />
              </ListItemIcon>
              <ListItemText primary="Mark as In Progress" />
            </ListItemButton>
          </ListItem>
        )}
        {task?.status !== "completed" && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleTaskUpdateStatus(2)}>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Mark as Completed" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default MoreActions;
