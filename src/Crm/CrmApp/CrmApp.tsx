import { GoogleMapsProvider } from "../CrmRutas/CrmRutasCobro/GoogleMapsProvider ";
import { SocketProvider } from "../WEB/SocketProvider";
import CrmRoutes from "./Routes";

const VITE_WS_URL = import.meta.env.VITE_WS_URL;
const VITE_WS_NAMESPACE = "/ws";
const VITE_WS_PATH = "/socket.io";

const getToken = () => localStorage.getItem("tokenAuthCRM");

function CrmApp() {
  return (
    <SocketProvider
      baseUrl={VITE_WS_URL}
      namespace={VITE_WS_NAMESPACE}
      path={VITE_WS_PATH}
      getToken={getToken}
      debug={import.meta.env.DEV}
      withCredentials={false}
    >
      <GoogleMapsProvider>
        <CrmRoutes />
      </GoogleMapsProvider>
    </SocketProvider>
  );
}

export default CrmApp;
