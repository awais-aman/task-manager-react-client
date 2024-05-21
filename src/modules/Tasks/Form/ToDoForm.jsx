import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import DatePicker from "components/shared/DatePicker";
import Heading from "components/shared/Heading";
import Button from "components/shared/Button";
import Autocomplete from "components/shared/Autocomplete";
import TextField from "components/shared/TextField";
import Loader from "components/shared/Loader";

import { toastErrors } from "helpers/errorMessages";
import { editCleared, fetchTasks, saveTask } from "store/slices/tasksSlice";
import validationSchema from "modules/Tasks/Form/validationSchema";
import { styles } from "assets/styles";

const AddToDoForm = ({ formState, isEdit }) => {
  const classes = styles();
  const dispatch = useDispatch();

  const handleSubmit = async ({ id, ...task }, { resetForm }) => {
    try {
      const payload = { ...task, deadline: task.deadline?.toISOString() };
      await dispatch(
        saveTask({ id: isEdit ? id : undefined, task: payload })
      ).unwrap();
      dispatch(editCleared());
      dispatch(fetchTasks());
      resetForm();
      toast.success(`Task ${isEdit ? "updated" : "created"} successfully`);
    } catch (messages) {
      toastErrors(messages);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={formState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => (
        <>
          {isSubmitting && <Loader />}
          <Box className={classes.formHeaderBox}>
            <Heading text={isEdit ? "Edit a Task" : "Add a Task"} />
            {isEdit && (
              <IconButton
                aria-label="Cancel editing"
                onClick={() => dispatch(editCleared())}
              >
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
              <Button type="submit" disabled={isSubmitting}>
                {isEdit ? "Edit" : "Add"}
              </Button>
            </Box>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default AddToDoForm;
