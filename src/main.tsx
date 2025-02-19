import { createRoot } from "react-dom/client";
import "./globals.css";
import Calendar from "./Calendar";

createRoot(document.getElementById("root")!).render(
  <Calendar />
);
