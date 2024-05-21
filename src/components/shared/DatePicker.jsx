import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field } from "formik";

import { styles } from "assets/styles";

const DatePickerComponent = ({ name }) => {
  const classes = styles();
  return (
    <Field name={name}>
      {({ field, form, meta }) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            className={classes.datePicker}
            value={field?.value}
            onChange={(newValue) => form.setFieldValue(name, newValue)}
            format="YYYY-MM-DD"
            disablePast
            slotProps={{
              textField: {
                helperText: meta.touched && meta.error ? meta.error : "",
              },
            }}
          />
        </LocalizationProvider>
      )}
    </Field>
  );
};

export default DatePickerComponent;
