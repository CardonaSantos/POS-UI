import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "./utils/getApiAxiosMessage";
import "./index.css";
import "@/components/app/theme/app-theme.css";
import { AppThemeProvider } from "./components/app/config/app-theme-provider";
import App from "./App";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => toast.error(getApiErrorMessageAxios(err)),
  }),

  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
