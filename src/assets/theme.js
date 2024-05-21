import { createTheme } from "@mui/material/styles";

const display = '"Bricolage Grotesque Variable", "Avenir Next", "Segoe UI", sans-serif';
const body = '"Public Sans Variable", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

// Ledger and strongroom tones: deep ink green, brass, warm paper.
export const colors = {
  ink: "#17241E",
  vault: "#2C5A4B",
  brass: "#8A6418",
  brassLight: "#E2BE6B",
  paper: "#F5F1E8",
  card: "#FFFDF8",
  line: "#DCD3C1",
  text: "#1F2421",
  muted: "#57605A",
  high: "#A3392B",
  medium: "#8A6418",
  low: "#3F6E4C",
};

export const theme = createTheme({
  palette: {
    primary: { main: colors.vault, contrastText: "#FFFFFF" },
    secondary: { main: colors.brass, light: colors.brassLight },
    error: { main: colors.high },
    success: { main: colors.low },
    ink: { main: colors.ink, contrastText: colors.paper },
    background: { default: colors.paper, paper: colors.card },
    text: { primary: colors.text, secondary: colors.muted },
    divider: colors.line,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.02em" },
    h2: { fontFamily: display, fontWeight: 650, fontSize: "1.375rem", letterSpacing: "-0.01em" },
    h3: { fontFamily: display, fontWeight: 600, fontSize: "1.0625rem" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { outlined: { borderColor: colors.line } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            outline: `3px solid ${colors.brassLight}`,
            outlineOffset: 2,
          },
        },
      },
    },
  },
});

export const displayFont = display;
