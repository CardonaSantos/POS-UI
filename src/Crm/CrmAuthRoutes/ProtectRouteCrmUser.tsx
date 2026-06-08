import { Navigate } from "react-router-dom";
import gif from "@/assets/loading.gif";
import { useAuthStoreCRM } from "./AuthStateCRM";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const CRM_ALLOWED_ROLES = [
  "ADMIN",
  "TECNICO",
  "SUPER_ADMIN",
  "COBRADOR",
] as const;

export function ProtectRouteCrmUser({ children }: ProtectedRouteProps) {
  const { userRol, isLoading } = useAuthStoreCRM();

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <img src={gif} alt="Cargando..." className="h-16 w-16 object-contain" />
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!userRol) {
    return <Navigate to="/crm/login" replace />;
  }

  if (
    !CRM_ALLOWED_ROLES.includes(userRol as (typeof CRM_ALLOWED_ROLES)[number])
  ) {
    return <Navigate to="/crm" replace />;
  }

  return children;
}
