import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useField } from "formik";

const DatePickerComponent = ({ name, label, disablePast = false }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <DatePicker
      label={label}
      value={field.value}
      onChange={(value) => helpers.setValue(value)}
      format="D MMM YYYY"
      disablePast={disablePast}
      slotProps={{
        textField: {
          id: name,
          fullWidth: true,
          error: hasError,
          helperText: hasError ? meta.error : "",
          onBlur: () => helpers.setTouched(true),
        },
      }}
    />
  );
};

export default DatePickerComponent;
