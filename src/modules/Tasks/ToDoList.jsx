import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import Heading from "components/shared/Heading";
import Loader from "components/shared/Loader";
import ToDoListItem from "modules/Tasks/ToDoListItem";

const ToDoList = ({ setIsEdit }) => {
  const { tasks, isLoading } = useSelector((state) => state?.tasksReducer);

  return (
    <Box>
      {isLoading && <Loader />}
      <Heading text="My To Do List" />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(({ attributes: task }) => (
              <ToDoListItem task={task} setIsEdit={setIsEdit} key={task?.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ToDoList;
