import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

const CrmApp = lazy(() => import("./Crm/CrmApp/CrmApp"));

const TicketConformidadPublicPage = lazy(
  () => import("./public/ticket-conformidad/pages/TicketConformidadPublicPage"),
);

function App() {
  return (
    <Router>
      <Toaster
        richColors
        expand
        closeButton
        position="top-right"
        duration={3000}
      />

      <Suspense fallback={null}>
        <Routes>
          {/* ================================= */}
          {/* ÁREA PÚBLICA                      */}
          {/* ================================= */}

          <Route
            path="/conformidad/:token"
            element={<TicketConformidadPublicPage />}
          />

          {/* ================================= */}
          {/* APLICACIÓN PRIVADA                */}
          {/* ================================= */}

          <Route path="/*" element={<CrmApp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
