import React from "react";
import reportWebVitals from "./reportWebVitals";
import { SmartwaterWrapper } from "./app/SmartwaterWrapper";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container as Element);
root.render(<React.StrictMode>
  <SmartwaterWrapper />
</React.StrictMode>)

reportWebVitals();
