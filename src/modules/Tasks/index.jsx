import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Box } from "@mui/material";

import AddToDoForm from "modules/Tasks/Form/ToDoForm";
import ToDoList from "modules/Tasks/ToDoList";
import Divider from "components/shared/Divider";
import { fetchTasks } from "store/slices/tasksSlice";
import { deadlineToDay } from "helpers/dateFormat";

const Tasks = () => {
  const dispatch = useDispatch();
  const task = useSelector((state) => state.tasks.editing);
  const isEdit = Boolean(task);

  const formState = useMemo(
    () =>
      task
        ? {
            id: task.id,
            description: task.description,
            title: task.title,
            priority: task.priority,
            deadline: deadlineToDay(task.deadline),
          }
        : { title: "", description: "", priority: "low", deadline: dayjs().startOf("day") },
    [task]
  );

  useEffect(() => {
    dispatch(fetchTasks());
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
