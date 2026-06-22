import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import { SocketProvider } from "./components/Context/SocketContext.tsx";
import { GoogleMapsProvider } from "./Crm/CrmRutas/CrmRutasCobro/GoogleMapsProvider .tsx";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "./utils/getApiAxiosMessage.ts";
import { SocketProvider } from "./Crm/WEB/SocketProvider.tsx";
import "./index.css";
import "@/components/app/theme/app-theme.css";
import { AppThemeProvider } from "./components/app/config/app-theme-provider.tsx";
// import { AppThemeProvider } from "./components/app/theme/app-theme-provider.tsx";

const VITE_WS_URL = import.meta.env.VITE_WS_URL;
const VITE_WS_NAMESPACE = "/ws";
const VITE_WS_PATH = "/socket.io";

const getToken = () => localStorage.getItem("tokenAuthCRM");

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // global toast opcional (v5)
    onError: (err) => toast.error(getApiErrorMessageAxios(err)),
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      // refetchOnWindowFocus: false, // si lo prefieres
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider
      baseUrl={VITE_WS_URL}
      namespace={VITE_WS_NAMESPACE}
      path={VITE_WS_PATH}
      getToken={getToken}
      debug={import.meta.env.DEV}
      withCredentials={false}
    >
      <GoogleMapsProvider>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <App />
          </AppThemeProvider>
        </QueryClientProvider>
      </GoogleMapsProvider>
    </SocketProvider>
  </StrictMode>,
);
