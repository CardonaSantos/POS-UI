import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useStore } from "../Context/ContextSucursal";
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectRouteAdmin({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem("authTokenPos");
  const userRol = useStore((state) => state.userRol);

  if (!isAuth || !userRol) return <Navigate to="/dashboard" />;

  if (userRol !== "ADMIN") {
    return <Navigate to="/dashboard-empleado" />;
  }

  return children;
}
