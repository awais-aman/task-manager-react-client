import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import AppRoutes from "routes/Routes";
import ErrorBoundary from "components/shared/ErrorBoundary";
import { theme } from "assets/theme";
import store, { persistor } from "store/store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
              <ToastContainer position="bottom-right" newestOnTop />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </BrowserRouter>
          </LocalizationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
