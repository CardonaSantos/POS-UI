import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserMinus, UserX, Zap, ZapOff, WifiOff } from "lucide-react";
import DesvanecerHaciaArriba from "../Motion/DashboardAnimations";
import { motion } from "framer-motion";
import LightCardMotion from "../Motion/CardMotion";
import MyTickets from "./MyTickets";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { getTicketEnProceso } from "../CrmTicketsMeta/api";
import TicketsEnProcesoCard from "../CrmTicketsMeta/TicketsEnProcesoTable";
import { TicketMoment } from "../CrmTicketsMeta/types";
import { FormattedTicket } from "./types";
const tokencrm = localStorage.getItem("authTokenCRM");
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Definimos la interfaz de los datos que vamos a recibir desde el backend
interface DashboardData {
  activeClients: number;
  delinquentClients: number;
  suspendedClients: number;
  activeServices: number;
  suspendedServices: number;
  clientsAddedThisMonth: number;
}
// src/interfaces/ticket.ts

export default function CrmDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const [dataTicketsEnProceso, setDataTicketsEnProceso] = useState<
    TicketMoment[]
  >([]);

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const rol = useStoreCrm((state) => state.rol) ?? "";

  console.log(tokencrm);
  const nombre = useStoreCrm((state) => state.nombre);
  console.log("nombre crm", nombre);

  const [tickets, setTickets] = useState<FormattedTicket[]>([]);
  const getTickets = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/dashboard/get-dashboard-info/${userId}`
      );
      if (response.status === 200) {
        setTickets(response.data);
      }
    } catch (error) {}
  };

  const getEnProceso = async () => {
    await getTicketEnProceso()
      .then((data) => setDataTicketsEnProceso(data))
      .catch((error) => {
        console.log("Error al conseguir los registros: ", error);
      })
      .finally(() => {
        console.log("Data conseguida");
      });
  };

  useEffect(() => {
    getTickets();
    fetchDashboardData();
    getEnProceso();
  }, []);

  // Función para obtener los datos del dashboard desde el backend
  const fetchDashboardData = async () => {
    try {
      // Hacemos la solicitud GET al servicio de NestJS
      const response = await axios.get(
        `${VITE_CRM_API_URL}/dashboard/get-dashboard-data`
      ); // Asegúrate de que esta URL esté correcta
      if (response.status === 200) {
        // Si la respuesta es exitosa, almacenamos los datos en el estado
        const data: DashboardData = await response.data;
        setDashboardData(data);
      }
    } catch (err) {
      // Manejo de errores si la solicitud falla
      console.error(err);
    }
  };

  return (
    <motion.div
      {...DesvanecerHaciaArriba}
      className="container mx-auto p-4 space-y-4"
    >
      <h2 className="text-xl font-bold  text-center underline">
        Dashboard CRM
      </h2>

      {rol == "TECNICO" ? null : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatCard
            title="Clientes Activos"
            value={dashboardData?.activeClients.toString() ?? ""}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Clientes Morosos"
            value={dashboardData?.delinquentClients.toString() ?? ""}
            icon={<UserMinus className="h-4 w-4 text-muted-foreground" />}
          />

          <StatCard
            title="Clientes Suspendidos"
            value={dashboardData?.suspendedClients.toString() ?? ""}
            icon={<WifiOff className="h-4 w-4 text-muted-foreground" />}
          />

          <StatCard
            title="Clientes Desconectados"
            value={dashboardData?.suspendedClients.toString() ?? ""}
            icon={<UserX className="h-4 w-4 text-muted-foreground" />}
          />

          <StatCard
            title="Servicios Activos"
            value={dashboardData?.activeServices.toString() ?? ""}
            icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Servicios Suspendidos"
            value={dashboardData?.suspendedServices.toString() ?? ""}
            icon={<ZapOff className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      )}

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <MyTickets getEnProceso={getEnProceso} tickets={tickets} />
          <TicketsEnProcesoCard data={dataTicketsEnProceso} />
        </div>
      </div>

      <div className="container mx-auto space-y-4">
        {/* <MorososInvoices /> */}
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      {...LightCardMotion}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <p className="text-xl font-bold">{value}</p>
            </div>
            <div className="flex-shrink-0 ml-3">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
