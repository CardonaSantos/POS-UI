// NewDashboard.tsx
import { fadeElegant } from "@/components/Layout/page-transition";
import {
  useGetCobrosDashboard,
  useGetDashboardChartInstalaciones,
  useGetDashboardData,
  useGetInstalacionesVsDesinstalaciones,
  useGetTicketProceso,
} from "../CrmHooks/hooks/dashboard/useDashboard";

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
import { useGetUsersRealTime } from "../CrmHooks/hooks/use-real-time-location/use-real-time-location";
import { RealTimeLocationRaw } from "../features/real-time-location/real-time-location";
import { realTimeQkeys } from "../CrmHooks/hooks/use-real-time-location/Qk";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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

  const { data: locationsRaw } = useGetUsersRealTime();

  let locations = locationsRaw ? locationsRaw : [];

  const rutasActivas = cobros.rutasActiva;
  const topMorosos = cobros.morosoTop;

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

  console.log("los locations son: ", locations);

  useSocketEvent("emit:location:real-time", (payload) => {
    queryClient.setQueryData(
      realTimeQkeys.all,
      (oldData: RealTimeLocationRaw[] | undefined) => {
        console.log("El payload entrante es: ", payload);

        // CORRECCIÓN: El payload YA ES el dato que necesitas.
        // No intentes acceder a .locationResponse
        const incoming = payload;

        if (!oldData) return [incoming];

        const exists = oldData.find((l) => l.usuarioId === incoming.usuarioId);

        if (exists) {
          return oldData.map((l) =>
            l.usuarioId === incoming.usuarioId ? incoming : l,
          );
        }

        return [...oldData, incoming];
      },
    );
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
        usuariosEnCampo={locations}
        instalacionesHistoricas={instalacionesHistoricas}
      />
    </motion.div>
  );
}

export default NewDashboard;
