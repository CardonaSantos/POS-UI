// NewDashboard.tsx
import { fadeElegant } from "@/components/Layout/page-transition";
import {
  useGetCobrosDashboard,
  useGetDashboardChartInstalaciones,
  useGetDashboardData,
  useGetInstalacionesVsDesinstalaciones,
  useGetTicketProceso,
} from "../CrmHooks/hooks/dashboard/useDashboard";

import { PersonaCampo } from "./interfaces/dashboard-interfaces";
import { DashboardRoutesSidebar } from "./_components/DashboardRoutesSidebar";
import { DashboardSupportSidebar } from "./_components/DashboardSupportSidebar";
import { DashboardChartsGrid } from "./_components/DashboardChartsGrid";
import { DashboardKpisSection } from "./_components/DashboardKpisSection";
import {
  DashboardCobrosResponse,
  DashboardData,
} from "../features/dashboard/dashboard.interfaces";
import { useSocketEvent } from "../WEB/SocketProvider";
import {
  DashboardQkeys,
  TicketsProcesoQkeys,
} from "../CrmHooks/hooks/dashboard/Qk";
import { useInvalidateQk } from "../CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { showTicketBrowserNotification } from "../WEB/browserNotifications";

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  clientes: {
    totalEnSistema: 0,
    activos: 0,
    suspendidos: 0,
    desinstalados: 0,
    pendientesActivacion: 0,
    morosos: 0,
  },
  facturacion: {
    facturasEmitidasMes: 0,
    facturasPagadasMes: 0,
    montoFacturadoMes: 0,
    montoCobradoMes: 0,
    montoPendienteMes: 0,
  },
};

const initialCobrosData: DashboardCobrosResponse = {
  rutasActiva: [
    {
      nombreRuta: "Ruta Centro",
      cobrador: "Juan Pérez",
      totalClientes: 120,
    },
  ],
  morosoTop: [
    {
      id: 101,
      nombre: "Pedro Pablo Ramírez",
      cantidad: 12, // 12 meses/facturas pendientes
    },
  ],
};

function NewDashboard() {
  const invalidateQk = useInvalidateQk();

  const { data: instalacionesMes = [] } = useGetDashboardChartInstalaciones();

  const { data: instalacionesHistoricas = [] } =
    useGetInstalacionesVsDesinstalaciones();

  const { data: kpis } = useGetDashboardData();

  const kpisData = kpis ? kpis : DEFAULT_DASHBOARD_DATA;

  const {
    data: tickets = {
      tickets: [],
      ticketsMetricas: {
        enLinea: 1,
      },
    },
  } = useGetTicketProceso();

  const { data: cobros = initialCobrosData } = useGetCobrosDashboard();

  const rutasActivas = cobros.rutasActiva;
  const topMorosos = cobros.morosoTop;

  const usuariosEnCampo: PersonaCampo[] = [
    {
      id: 1,
      nombreCompleto: "Pedro Tec.",
      location: {
        lat: 15.667949507438097,
        lng: -91.71367510658024,
      },
    },
    {
      id: 2,
      nombreCompleto: "Luis Tec.",
      location: {
        lat: 15.667497802956671,
        lng: -91.71273683529152,
      },
    },
  ];

  console.log("Tickets: ", tickets);
  console.log("Las instalaciones historicas: ", instalacionesHistoricas);
  console.log("Las kpisData: ", kpisData);

  useSocketEvent(
    "ticket-soporte:change-status",
    (payload) => {
      invalidateQk(TicketsProcesoQkeys.all);
      if (payload.nuevoEstado === "EN_PROCESO") {
        toast.success(`Ticket #${payload.ticketId} fue tomado en proceso`);
      } else if (payload.nuevoEstado === "PENDIENTE_REVISION") {
        toast.info(`Ticket #${payload.ticketId} quedó pendiente de revisión`);
      } else {
        toast.info(
          `Ticket #${payload.ticketId} cambió a ${payload.nuevoEstado}`,
        );
      }

      showTicketBrowserNotification({
        ticketId: payload.ticketId,
        nuevoEstado: payload.nuevoEstado,
        titulo: payload.titulo,
        tecnico: payload.tecnico,
      });
    },
    [invalidateQk],
  );

  useSocketEvent(
    "ruta-cobro:change-status",
    () => {
      invalidateQk(DashboardQkeys.cobros);
    },
    [invalidateQk],
  );

  useSocketEvent("facturacion:change-event", () => {
    invalidateQk(DashboardQkeys.kps);
  });

  return (
    <motion.div
      {...fadeElegant}
      className="w-full flex flex-col gap-3 pb-4 py-2 px-2"
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <DashboardRoutesSidebar
          rutaActiva={rutasActivas}
          topMorosos={topMorosos}
        />

        <DashboardKpisSection kpisData={kpisData} />

        <DashboardSupportSidebar ticketsSoporte={tickets} />
      </div>

      <DashboardChartsGrid
        instalacionesMes={instalacionesMes}
        usuariosEnCampo={usuariosEnCampo}
        instalacionesHistoricas={instalacionesHistoricas}
      />
    </motion.div>
  );
}

export default NewDashboard;
