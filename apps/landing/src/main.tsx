import { ThemeProvider } from "@/components/theme-provider.tmp.tsx";
import React from "react";
import reactDom from "react-dom/client";
import App from "./app.tmp.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

reactDom.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
