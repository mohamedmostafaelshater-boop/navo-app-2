import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>
  );
} catch (error) {
  document.getElementById("root").innerHTML = `
    <div style="padding: 40px; font-family: sans-serif;">
      <h2 style="color: red;">Error:</h2>
      <pre style="white-space: pre-wrap;">${error.message}</pre>
    </div>
  `;
}
