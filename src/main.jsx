import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/public-sans";

import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
