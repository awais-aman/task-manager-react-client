import { TextField } from "@mui/material";
import { useField } from "formik";

const TextFieldComponent = ({ name, helperText, ...props }) => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      {...field}
      {...props}
      id={props.id ?? name}
      fullWidth
      error={hasError}
      helperText={hasError ? meta.error : helperText}
    />
  );
};

export default TextFieldComponent;
