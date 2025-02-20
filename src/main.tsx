import { createRoot } from "react-dom/client";
import "./globals.css";
import Calendar from "./calendar";

createRoot(document.getElementById("root")!).render(
  <Calendar />
);
