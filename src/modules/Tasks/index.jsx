import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Box } from "@mui/material";

import AddToDoForm from "modules/Tasks/Form/ToDoForm";
import ToDoList from "modules/Tasks/ToDoList";
import Divider from "components/shared/Divider";
import { getAllTasks } from "store/actions/tasks";

const Tasks = () => {
  const dispatch = useDispatch();
  const { task } = useSelector((state) => state?.tasksReducer);
  const isEdit = Boolean(task);

  const formState = useMemo(
    () =>
      task
        ? {
            id: task.id,
            description: task.description,
            title: task.title,
            priority: task.priority,
            deadline: moment(task.deadline),
          }
        : { title: "", description: "", priority: "low", deadline: moment() },
    [task]
  );

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  return (
    <Box>
      <AddToDoForm formState={formState} isEdit={isEdit} />
      <Divider />
      <ToDoList />
    </Box>
  );
};

export default Tasks;
