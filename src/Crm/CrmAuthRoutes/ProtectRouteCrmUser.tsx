import { Navigate } from "react-router-dom";

import gif from "@/assets/loading.gif";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export function ProtectRouteCrmUser({ children }: ProtectedRouteProps) {
  const isLoading = useStoreCrm((state) => state.isLoading);

  const isAuthenticated = useStoreCrm((state) => state.isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <img src={gif} alt="Cargando..." className="h-16 w-16 object-contain" />

        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/crm/login" replace />;
  }

  return children;
}
