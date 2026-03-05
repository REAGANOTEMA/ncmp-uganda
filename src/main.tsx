// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// No need to wrap BrowserRouter here anymore
createRoot(document.getElementById("root")!).render(<App />);