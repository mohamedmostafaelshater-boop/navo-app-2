import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  document.getElementById("root").innerHTML = `
    <div style="padding: 40px; font-family: monospace; direction: ltr; text-align: left;">
      <h2 style="color: red;">Error:</h2>
      <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 15px;">${error.message}\n\n${error.stack}</pre>
    </div>
  `;
}
