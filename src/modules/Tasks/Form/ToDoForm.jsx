import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import DatePicker from "components/shared/DatePicker";
import Heading from "components/shared/Heading";
import Button from "components/shared/Button";
import Autocomplete from "components/shared/Autocomplete";
import TextField from "components/shared/TextField";
import Loader from "components/shared/Loader";

import { withTryCatch } from "helpers/withTryCatch";
import { createTask, updateTask } from "store/api/tasks";
import { getAllTasks } from "store/actions/tasks";
import { RESET_SINGLE_TASK } from "store/constants/taskConstants";
import validationSchema from "modules/Tasks/Form/validationSchema";
import { styles } from "assets/styles";
import { Box } from "@mui/material";

const AddToDoForm = ({ formState, isEdit, setFormState }) => {
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm }) => {
    setIsLoading(true);
    const body = {
      task: {
        ...values,
      },
    };
    withTryCatch(
      {
        tryFunc: () =>
          isEdit ? updateTask(values?.id, body) : createTask(body),
        success: () => {
          dispatch({ type: RESET_SINGLE_TASK });
          dispatch(getAllTasks());
          resetForm();
          toast.success(`Task ${isEdit ? "updated" : "created"} successfully`);
        },
      },
      null,
      () => setIsLoading(false)
    );
  };

  const handleClearForm = () => {
    dispatch({ type: RESET_SINGLE_TASK });
  };

  return (
    <>
      {isLoading && <Loader />}

      <Formik
        enableReinitialize
        initialValues={formState}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur={false}
      >
        {() => (
          <>
            <Box className={classes.formHeaderBox}>
              <Heading text={isEdit ? "Edit a Task" : "Add a Task"} />
              {isEdit && (
                <IconButton onClick={handleClearForm}>
                  <CancelIcon />
                </IconButton>
              )}
            </Box>
            <Form className={classes.tasksForm}>
              <Box className={classes.tasksRow}>
                <TextField name="title" placeholder="Title" isLabel={false} />
                <TextField
                  name="description"
                  placeholder="Description"
                  isLabel={false}
                />
              </Box>
              <Box className={classes.tasksRow}>
                <Autocomplete name="priority" />
                <DatePicker name="deadline" />
                <Button type="submit">{isEdit ? "Edit" : "Add"}</Button>
              </Box>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddToDoForm;
