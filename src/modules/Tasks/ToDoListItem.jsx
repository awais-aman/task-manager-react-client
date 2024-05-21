import { useState } from "react";
import { useDispatch } from "react-redux";
import { TableRow, TableCell, IconButton, Popover } from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import MoreActions from "modules/Tasks/MoreActions";
import { statusLabel } from "modules/Tasks/status";
import { formattedDate } from "helpers/dateFormat";
import { fetchTask, removeTask } from "store/slices/tasksSlice";
import { toastErrors } from "helpers/errorMessages";
import { styles } from "assets/styles";

const ToDoListItem = ({ task }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditTask = (id) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    dispatch(fetchTask(id)).unwrap().catch(toastErrors);
  };

  const handleDeleteTask = (id) => {
    dispatch(removeTask(id))
      .unwrap()
      .then(() => toast.success("Task deleted successfully"), toastErrors);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{task?.id}</TableCell>
      <TableCell>{task?.title}</TableCell>
      <TableCell>{task?.description}</TableCell>
      <TableCell className={classes.capitalizeText}>{task?.priority}</TableCell>
      <TableCell>{statusLabel(task?.status)}</TableCell>
      <TableCell>{formattedDate(task?.deadline)}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => handleEditTask(task?.id)}>
          <BorderColorIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteTask(task?.id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MoreActions task={task} setAnchorEl={setAnchorEl} />
        </Popover>
      </TableCell>
    </TableRow>
  );
};

export default ToDoListItem;
