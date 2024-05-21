import { makeStyles } from "@mui/styles";

export const layoutStyles = makeStyles((theme) => ({
  footerContainer: {
    width: "100%",
  },
  footerContent: {
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(6),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.layoutBackgroundColor,
    padding: theme.spacing(1),
    marginTop: theme.spacing(8),
  },
  copyRightText: {
    color: `${theme.palette.layoutTextColor} !important`,
  },
  footerText: {
    color: "#455066",
  },
  footerHeading: {
    color: `${theme.palette.layoutTextColor} !important`,
    textAlign: "center",
  },

  headerContainer: {
    width: "100%",
    backgroundColor: theme.palette.layoutBackgroundColor,
    marginBottom: theme.spacing(7),
  },
  headerContent: {
    padding: theme.spacing(2),
    display: "flex",
    columnGap: theme.spacing(1),
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Roboto",
    color: theme.palette.layoutTextColor,
  },
  emailText: {
    "&.MuiBox-root": {
      color: theme.palette.layoutTextColor,
      fontWeight: "700",
    },
  },
  logoutButton: {
    marginBottom: `${theme.spacing(2)} !important`,
    color: `${theme.palette.layoutTextColor} !important`,
  },
  logoutText: {
    display: "flex",
    flexDirection: "column",
    "&.MuiTypography-root": {
      color: theme.palette.grey,
      fontWeight: "400",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
}));
