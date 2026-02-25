import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import NewDashboard from "./admin-dashboard";
import TecDashboard from "./tec-dashboard";

export function MainDashboardPage() {
  const userRol = useStoreCrm((state) => state.rol);

  const isAdmin = userRol === "ADMIN" || userRol === "SUPER_ADMIN";

  return isAdmin ? <NewDashboard /> : <TecDashboard />;
}
