import React from "react";
import { useDispatch } from "react-redux";
import { TableRow, TableCell, IconButton, Popover } from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import MoreActions from "modules/Tasks/MoreActions";
import { formattedDate } from "helpers/dateFormat";
import { getAllTasks, getSingleTask } from "store/actions/tasks";
import { deleteTask } from "store/api/tasks";
import { withTryCatch } from "helpers/withTryCatch";
import { styles } from "assets/styles";

const ToDoListItem = ({ setIsEdit, task }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditTask = (id) => {
    setIsEdit(true);
    dispatch(getSingleTask(id));
  };

  const handleDeleteTask = (id) => {
    withTryCatch({
      tryFunc: () => deleteTask(id),
      success: () => {
        dispatch(getAllTasks(id));
        toast.success("Task deleted successfully");
      },
    });
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{task?.id}</TableCell>
      <TableCell>{task?.title}</TableCell>
      <TableCell>{task?.description}</TableCell>
      <TableCell className={classes.capitalizeText}>{task?.priority}</TableCell>
      <TableCell className={classes.capitalizeText}>{task?.status}</TableCell>
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
