import { createTheme, ThemeProvider as Theme } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./input.css";

const themeMUI = createTheme({
  palette: {
    primary: {
      main: "#0ea5e9",
    },
    secondary: {
      main: "#49A1D7",
    },
    success: {
      main: "#85B86E",
    },
    warning: {
      main: "#F39C50",
    },
    error: {
      main: "#f17057",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme theme={themeMUI}>
      <App />
    </Theme>
  </React.StrictMode>
);
