import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Zap,
  WifiOff,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  Hourglass,
  Kanban,
  UserX,
} from "lucide-react";
import DesvanecerHaciaArriba from "../Motion/DashboardAnimations";
import { motion } from "framer-motion";
import MyTickets from "./MyTickets";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { getTicketEnProceso } from "../CrmTicketsMeta/api";
import TicketsEnProcesoCard from "../CrmTicketsMeta/TicketsEnProcesoTable";
import { TicketMoment } from "../CrmTicketsMeta/types";
import { FormattedTicket, formatearMoneda } from "./types";
import { Link } from "react-router-dom";
const tokencrm = localStorage.getItem("authTokenCRM");
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Definimos la interfaz de los datos que vamos a recibir desde el backend
export interface DashboardData {
  activeClients: number;
  delinquentClients: number;
  suspendedClients: number;
  activeServices: number;
  suspendedServices: number;
  clientsAddedThisMonth: number;
  ticketsResueltosDelMes: number;
  clientesRegistrados: number;
  clientesNuevosDelMes: number;

  facturasEmitidas: number;
  facturasEmitidasDelMes: number;

  facturasCobradas: number;
  facturasCobradasDelMes: number;

  totalCobradoDelMes: number;
  moraDeMorosos: number;
  facturasSinPagarMonto: number;
  //
  pendientesPago: number;
  atrasados: number;
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
        `${VITE_CRM_API_URL}/dashboard/get-tickets-asignados/${userId}`
      );
      if (response.status === 200) {
        setTickets(response.data);
      }
    } catch (error) {
      console.log("Error al conseguir mis tickets", error);
    }
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

  console.log("Los tickets asignados son: ", tickets);

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

  console.log("La data de las cards es: ", dashboardData);

  interface DashboardData {
    activeClients: number;
    delinquentClients: number;
    suspendedClients: number;
    activeServices: number;
    suspendedServices: number;
    clientsAddedThisMonth: number;
    ticketsResueltosDelMes: number;
    clientesRegistrados: number;
    clientesNuevosDelMes: number;
    facturasEmitidas: number;
    facturasEmitidasDelMes: number;
    facturasCobradas: number;
    facturasCobradasDelMes: number;
    totalCobradoDelMes: number;
    moraDeMorosos: number;
    facturasSinPagarMonto: number;
    //nuevos
    pendientesPago: number;
    atrasados: number;
    desinstalados: number;
  }

  // Componente de tarjeta compacta
  interface CompactStatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    variant?: "default" | "success" | "warning" | "danger" | "info";
    subtitle?: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }

  function CompactStatCard({
    title,
    value,
    icon,
    variant = "default",
    subtitle,
    trend,
  }: CompactStatCardProps) {
    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "border-green-500/20 bg-green-500/5";
        case "warning":
          return "border-yellow-500/20 bg-yellow-500/5";
        case "danger":
          return "border-red-500/20 bg-red-500/5";
        case "info":
          return "border-blue-500/20 bg-blue-500/5";
        default:
          return "border-border bg-card";
      }
    };

    const getIconColor = () => {
      switch (variant) {
        case "success":
          return "text-green-500";
        case "warning":
          return "text-yellow-500";
        case "danger":
          return "text-red-500";
        case "info":
          return "text-blue-500";
        default:
          return "text-muted-foreground";
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        <Card
          className={`h-24 transition-all duration-200 hover:shadow-md ${getVariantStyles()}`}
        >
          <CardContent className="flex flex-col justify-between h-full p-3">
            <div className="flex items-start justify-between min-h-0">
              <div className="flex flex-col justify-between flex-1 h-full min-w-0">
                <p className="text-xs font-semibold leading-tight tracking-wide uppercase truncate text-muted-foreground">
                  {title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-baseline min-w-0 gap-1">
                    <p className="text-lg font-bold truncate text-foreground">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : value}
                    </p>
                    {trend && (
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {trend.isPositive ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span
                          className={`text-xs ${
                            trend.isPositive ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {trend.value}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {subtitle && (
                  <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5 font-semibold">
                    {subtitle}
                  </p>
                )}
              </div>
              <div
                className={`p-1.5 rounded-md bg-background/50 ${getIconColor()} flex-shrink-0 ml-2`}
              >
                {icon}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Componente de resumen ejecutivo
  function ExecutiveSummary({
    dashboardData,
  }: {
    dashboardData: DashboardData;
  }) {
    const totalClients =
      dashboardData.activeClients +
      dashboardData.delinquentClients +
      dashboardData.suspendedClients;

    const healthScore =
      Math.round((dashboardData.activeClients / totalClients) * 100) || 0;

    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-foreground">
            <Activity className="w-5 h-5 text-blue-500" />
            Resumen Ejecutivo
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {totalClients}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Total Clientes
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {healthScore}%
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Salud del Sistema
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {formatearMoneda(dashboardData.totalCobradoDelMes)}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Cobrado Este Mes
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {formatearMoneda(dashboardData.facturasSinPagarMonto)}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Por Cobrar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div {...DesvanecerHaciaArriba} className="w-full p-1">
      <h2 className="text-xl font-bold text-center underline">Dashboard CRM</h2>

      {rol !== "TECNICO" && dashboardData && (
        <>
          {/* Resumen Ejecutivo */}
          <ExecutiveSummary dashboardData={dashboardData} />

          {/* Grid compacto con todas las métricas */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {/* Clientes */}
            <CompactStatCard
              title="Clientes Activos"
              value={dashboardData.activeClients}
              icon={<Users className="w-4 h-4" />}
              variant="success"
            />

            <Link to={"/crm-clientes?estado=ACTIVO"}>
              <CompactStatCard
                title="Clientes al día"
                value={dashboardData.activeServices}
                icon={<Zap className="w-4 h-4" />}
                variant="success"
              />
            </Link>

            <Link to={"/crm-clientes?estado=PENDIENTE_ACTIVO"}>
              <CompactStatCard
                title="Pendientes Pago"
                value={dashboardData.pendientesPago}
                icon={<CreditCard className="w-4 h-4" />}
                variant="warning"
                // subtitle={formatearMoneda(dashboardData.moraDeMorosos)}
              />
            </Link>

            <Link to={"/crm-clientes?estado=ATRASADO"}>
              <CompactStatCard
                title="Atrasados"
                value={dashboardData.atrasados}
                icon={<Hourglass className="w-4 h-4" />}
                variant="warning"
                // subtitle={formatearMoneda(dashboardData.moraDeMorosos)}
              />
            </Link>

            <Link to={"/crm-clientes?estado=MOROSO"}>
              <CompactStatCard
                title="Clientes Morosos"
                value={dashboardData.delinquentClients}
                icon={<AlertTriangle className="w-4 h-4" />}
                variant="danger"
                subtitle={formatearMoneda(dashboardData.moraDeMorosos)}
              />
            </Link>

            <Link to={"/crm-clientes?estado=SUSPENDIDO"}>
              <CompactStatCard
                title="Suspendidos"
                value={dashboardData.suspendedClients}
                icon={<WifiOff className="w-4 h-4" />}
                variant="danger"
              />
            </Link>

            <CompactStatCard
              title="Nuevos/Mes"
              value={dashboardData.clientesNuevosDelMes}
              icon={<UserPlus className="w-4 h-4" />}
              variant="info"
              trend={{ value: 12, isPositive: true }}
            />

            {/* Facturación */}
            <Link to={"/crm/facturacion"}>
              <CompactStatCard
                title="Facturas Emitidas"
                value={dashboardData.facturasEmitidas}
                icon={<FileText className="w-4 h-4" />}
                variant="info"
                subtitle={`${dashboardData.facturasEmitidasDelMes} este mes`}
              />
            </Link>

            <Link to={"/crm/facturacion?estadoFactura=PAGADA"}>
              <CompactStatCard
                title="Facturas Cobradas"
                value={dashboardData.facturasCobradas}
                icon={<CheckCircle className="w-4 h-4" />}
                variant="success"
                subtitle={`${dashboardData.facturasCobradasDelMes} este mes`}
              />
            </Link>

            <CompactStatCard
              title="Total Cobrado"
              value={formatearMoneda(dashboardData.totalCobradoDelMes)}
              icon={<DollarSign className="w-4 h-4" />}
              variant="success"
              subtitle="este mes"
            />
            <CompactStatCard
              title="Sin Pagar"
              value={formatearMoneda(dashboardData.facturasSinPagarMonto)}
              icon={<AlertTriangle className="w-4 h-4" />}
              variant="danger"
            />

            <Link to={"/crm/facturacion?estadoFactura=PENDIENTE"}>
              <CompactStatCard
                title="Por cobrar"
                value={formatearMoneda(
                  dashboardData.facturasSinPagarMonto -
                    dashboardData.totalCobradoDelMes
                )}
                icon={<Kanban className="w-4 h-4" />}
                variant="info"
              />
            </Link>

            {/* Soporte */}
            <CompactStatCard
              title="Tickets Resueltos"
              value={dashboardData.ticketsResueltosDelMes}
              icon={<CheckCircle className="w-4 h-4" />}
              variant="success"
              trend={{ value: 8, isPositive: true }}
              subtitle="este mes"
            />
            <CompactStatCard
              title="Total Registrados"
              value={dashboardData.clientesRegistrados}
              icon={<Users className="w-4 h-4" />}
              variant="info"
            />

            <Link to={"/crm-clientes?estado=DESINSTALADO"}>
              <CompactStatCard
                title="Desinstalados"
                value={dashboardData.desinstalados}
                icon={<UserX className="w-4 h-4" />}
                variant="danger"
              />
            </Link>
          </div>
        </>
      )}

      <MyTickets
        getEnProcesoStatus={getEnProceso}
        getEnProceso={getTickets}
        tickets={tickets}
      />
      <TicketsEnProcesoCard data={dataTicketsEnProceso} />
    </motion.div>
  );
}
