import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Field } from "formik";

import { styles } from "assets/styles";

const AutocompleteComponent = ({ name }) => {
  const classes = styles();
  return (
    <Field name={name}>
      {({ field, form, meta }) => (
        <Autocomplete
          disableClearable
          options={["low", "medium", "high"]}
          sx={{ width: 300 }}
          value={field?.value}
          getOptionLabel={(option) =>
            option?.charAt(0).toUpperCase() + option?.substring(1)
          }
          onChange={(_, value) => form.setFieldValue(name, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Priority"
              className={classes.field}
              error={meta.touched && meta.error ? true : false}
              helperText={meta.touched && meta.error ? meta.error : ""}
            />
          )}
        />
      )}
    </Field>
  );
};

export default AutocompleteComponent;
