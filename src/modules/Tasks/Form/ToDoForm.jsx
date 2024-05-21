import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { Box, Button, MenuItem, Paper, Typography } from "@mui/material";

import DatePicker from "components/shared/DatePicker";
import TextField from "components/shared/TextField";
import { toastErrors } from "helpers/errorMessages";
import { toDeadlinePayload } from "helpers/dateFormat";
import { editCleared, fetchTasks, saveTask } from "store/slices/tasksSlice";
import validationSchema, { TITLE_MAX } from "modules/Tasks/Form/validationSchema";
import { PRIORITIES } from "modules/Tasks/status";

const AddToDoForm = ({ formState, isEdit }) => {
  const dispatch = useDispatch();

  const handleSubmit = async ({ id, ...task }, { resetForm }) => {
    try {
      const payload = {
        ...task,
        title: task.title.trim(),
        description: task.description.trim(),
        deadline: toDeadlinePayload(task.deadline),
      };
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
    <Paper
      component="section"
      aria-labelledby="task-form-heading"
      sx={{
        p: { xs: 2.5, sm: 3 },
        position: { md: "sticky" },
        top: { md: 24 },
        borderTop: 4,
        borderTopColor: isEdit ? "secondary.main" : "primary.main",
      }}
    >
      <Typography id="task-form-heading" variant="h2" component="h2" sx={{ mb: 2 }}>
        {isEdit ? "Edit task" : "New task"}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={formState}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur={false}
      >
        {({ isSubmitting, values }) => (
          <Box component={Form} noValidate sx={{ display: "grid", gap: 2 }}>
            <TextField
              name="title"
              label="Title"
              helperText={`${values.title.length}/${TITLE_MAX}`}
            />
            <TextField name="description" label="Description" multiline minRows={2} />
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr" } }}>
              <TextField name="priority" label="Priority" select>
                {PRIORITIES.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <DatePicker name="deadline" label="Deadline" disablePast={!isEdit} />
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isEdit ? "Save changes" : "Add task"}
              </Button>
              {isEdit && (
                <Button variant="text" color="inherit" onClick={() => dispatch(editCleared())}>
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Formik>
    </Paper>
  );
};

export default AddToDoForm;
