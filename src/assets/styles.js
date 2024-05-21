import { makeStyles } from "@mui/styles";

export const styles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
  },
  form: {
    display: "flex",
    columnGap: theme.spacing(2),
  },
  formHeaderBox: {
    display: "flex",
    columnGap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  authContainer: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  authForm: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(1.5),
    alignItems: "center",
  },
  capitalizeText: {
    textTransform: "capitalize",
  },
  field: {
    "& .MuiInputBase-root": {
      height: "42px",
      "& input": {
        padding: "0 !important",
      },
    },
  },
  button: {
    "&.MuiButton-root": {
      backgroundColor: theme.palette.layoutTextColor,
      color: theme.palette.white,
      fontWeight: "700",
      width: "130px",
      "&:hover": {
        backgroundColor: "hsl(11deg 83% 71%)",
        opacity: 0.9,
        cursor: "pointer",
      },
    },
  },
  datePicker: {
    width: "300px",
    "& .MuiInputBase-root": {
      height: "42px",
    },
  },
  divider: {
    "&.MuiDivider-root": {
      borderBottom: `0.08 solid ${theme.palette.grey}`,
      width: "80% !important",
      margin: `${theme.spacing(4)} 0`,
    },
  },
  typographyText: {
    "&.MuiTypography-root": {
      color: theme.palette.layoutTextColor,
      fontWeight: "700",
      fontSize: "2rem",
      fontFamily: "Roboto",
    },
  },
  label: {
    "&.MuiTypography-root": {
      color: theme.greyLabel,
      fontWeight: "500",
      fontSize: "15px",
      alignSelf: "flex-start",
    },
  },
  textfield: {
    width: "300px",
    "& .MuiInputBase-root": {
      height: "42px",
      "& input": {
        boxSizing: "border-box",
      },
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
      "& input[type=number]::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "& input[type=number]::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
  },
  tableContent: {
    marginTop: theme.spacing(2),
  },
  todoList: {
    marginTop: theme.spacing(2),
  },
  notFoundContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  notFoundTitle: {
    fontSize: "36px",
    marginBottom: "16px",
  },
  notFoundMessage: {
    fontSize: "18px",
  },
  tasksForm: {
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(2),
  },
  tasksRow: {
    display: "flex",
    columnGap: theme.spacing(2),
  },
  loaderContainer: {
    height: "100vh",
    width: "100%",
    position: "fixed",
    top: "0",
    left: "0",
    overflow: "hidden",
    zIndex: 99999,
  },
  loaderBlurBg: {
    width: "inherit",
    height: "inherit",
    backgroundColor: "rgba(211,211,211,0.4)",
  },
  loaderWhiteBg: {
    width: "inherit",
    height: "inherit",
    backgroundColor: "white",
  },
  loader: {
    width: "inherit",
    height: "inherit",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999",
  },
}));
