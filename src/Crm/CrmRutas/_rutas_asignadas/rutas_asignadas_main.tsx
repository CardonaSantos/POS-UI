import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import { PageHeader } from "@/Crm/Utils/Components/PageHeader";
import { motion } from "framer-motion";
function RutasAsignadasMain() {
  return (
    <motion.div className="mx-auto container" {...DesvanecerHaciaArriba}>
      <PageHeader
        sticky={false}
        title="Ruta de cobro asignada"
        subtitle="Gestiona tus rutas y asignaciones"
        fallbackBackTo="/crm" // si no hay history
      />
    </motion.div>
  );
}

export default RutasAsignadasMain;
