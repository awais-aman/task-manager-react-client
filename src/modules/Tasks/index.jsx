import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Box } from "@mui/material";

import AddToDoForm from "modules/Tasks/Form/ToDoForm";
import ToDoList from "modules/Tasks/ToDoList";
import Divider from "components/shared/Divider";
import { getAllTasks } from "store/actions/tasks";

const Tasks = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    priority: "low",
    deadline: moment(),
  });

  const { task, isLoading } = useSelector((state) => state?.tasksReducer);

  useEffect(() => {
    if (task && isEdit) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setFormState({
        id: task?.id,
        description: task?.description,
        title: task?.title,
        priority: task?.priority,
        deadline: moment(task?.deadline),
      });
      setIsEdit(true);
    } else if(!isLoading) {
      setFormState({
        title: "",
        description: "",
        priority: "low",
        deadline: moment(),
      });
      setIsEdit(false);
    }
  }, [task, isEdit, isLoading]);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  return (
    <Box>
      <AddToDoForm formState={formState} isEdit={isEdit} />
      <Divider />
      <ToDoList setIsEdit={setIsEdit} />
    </Box>
  );
};

export default Tasks;
