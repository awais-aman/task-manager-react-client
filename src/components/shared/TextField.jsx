import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Field } from "formik";

import { styles } from "assets/styles";

const TextFieldComponent = (props) => {
  const {
    name,
    placeholder,
    isLabel=true,
    type="text"
  } = props;

  const classes = styles();

  return (
    <Box>
      {isLabel && (
        <Typography className={classes.label}>{placeholder}</Typography>
      )}
      <Field name={name}>
        {({ field, form, meta }) => (
          <TextField
            type={type}
            value={field?.value}
            placeholder={placeholder}
            className={classes.textfield}
            error={meta.touched && meta.error ? true : false}
            helperText={meta.touched && meta.error ? meta.error : ""}
            {...field}
          />
        )}
      </Field>
    </Box>
  );
};

export default TextFieldComponent;
