import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedMockData } from "@/services/seed";
import { ThemeProvider } from "@/components/ThemeProvider.tsx"; // Import ThemeProvider

seedMockData();
createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
);