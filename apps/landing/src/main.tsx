import { ThemeProvider } from "@/components/theme-provider.tsx";
import React from "react";
import reactDom from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

reactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
