import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import NotFoundPage from "../../Pages/NotFount/NotFoundPage";
import Layout2 from "../../components/Layout/layout-crm";

import { ProtectRouteCrmUser } from "../CrmAuthRoutes/ProtectRouteCrmUser";

import CreateCustomers from "../CrmCreateCustomers/CreateCustomers";
import EmpresaForm from "../CrmEmpresa/EmpresaForm";

import CrmRegist from "../CrmAuth/CrmRegist";
import CrmLogin from "../CrmAuth/CrmLogin";

import CrmServiceManage from "../CrmServices/CrmServiceManage";
import ServicioInternetManage from "../CrmServices/CrmServiciosWifi/CrmServicesWifi";

import FacturacionZonaManage from "../CrmFacturacion/FacturacionZonaManage";

import Samples1 from "../../Samples/Samples1";

import EtiquetaTicketManage from "../CrmTickets/CrmUtilidadesSoporte/UtilidadesSoporteMain";

import CrmPaymentFactura from "../CrmBilling/CrmFacturacion/CrmPaymentFactura";

import CrmRuta from "../CrmRutas/CrmRuta";
import CrmPdfPago from "../CrmPdfPago/CrmPdfPago";
import RutaCobro from "../CrmRutas/CrmRutasCobro/RutaCobro";

import EditCustomers from "../CrmCustomerEdition/CrmCustomerEdition";

import SectorsManagement from "../CrmSector/SectorsManagement";

import PlantillasMensajes from "../CrmMensajes/PlantillasMensajes";

import BoletaTicket from "../CrmTickets/CrmTicketsBoleta/BoletaTicket";

import PlantillaContratoManage from "../CrmPlantillaContrato/CrmPlantillaContratoManage";
import ContratoServicioPDF, {
  ContratoInstalacionPage,
} from "../CrmPlantillaContrato/CrmContratoPdf";

import { RutasCobroEdit } from "../CrmRutas/RutasCobroEdit";

import FacturaEdit from "../CrmFacturacion/FacturaEdicion/FacturaEdit";

import CrmProfileConfig from "../CrmProfile/CrmProfileConfig";
import CrmUsers from "../CrmProfile/CrmUsers";

import MetasTecnicosPage from "../CrmTicketsMeta/MetasTecnicosPage";

import DeletedInvoicesView from "../CrmFacturasEliminadas/DeletedFacturas";

import CustomerProfile from "../CrmCustomer/newCustomerPage/customer-profile";

import RutasAsignadasMain from "../CrmRutas/_rutas_asignadas/rutas_asignadas_main";

import ClientesTable from "../CrmCustomers/CrmCustomerTable";

import RouterMainPage from "../routers/page";
import OltMainPage from "../Olt/page";

import BotMainPage from "../CrmBot/page";

import { MainDashboardPage } from "../CrmNewDashboard/page";

import TicketAsignadoDetails from "../CrmNewDashboard/_components/tec-ticket/ticket-details";
import TicketFirmaTecnicoPage from "../CrmNewDashboard/_components/firma/tec-ticket/ticket-firma-tecnico";

import WhatsappChats from "../CrmWhatsapp/page";

import CrmCreditoMainPage from "../CrmCredito/create/page";
import { CreditosMainPage } from "@/Crm/CrmCredito/main/page";
import CreditoDetails from "../CrmCredito/credito/page";

import ContratoBuilder from "../CrmCredito/contrato/page";

import TicketDashboard from "../CrmTickets/crm-ticket-dashboard";

import ComprobantesMediaPage from "../CrmWhatsapp/galery-whatsapp/page";

import WhatsappTemplatesPage from "../CrmWhatsappCampaings/whatsapp-campaing/page";
import { WhatsappTemplateCreatePage } from "../CrmWhatsappCampaings/whatsapp-campaing/create-templates/create-templates";
import { WhatsappMessaginCapaing } from "../CrmWhatsappCampaings/whatsapp-campaing/send-messages/page";

import AppShowcasePage from "../../components/testeos";

import InstalacionesMainPage from "../Crm-instalaciones/page";
import InstalacionesListPage from "../Crm-instalaciones/tabla/instalaciones-list-page";
import InstalacionDetailPage from "../Crm-instalaciones/details/instalacion-detail-page";
import EditarInstalacionPage from "../Crm-instalaciones/EditarInstalacionPage";

import PerfilesHomologacionPage from "../CrmHomologaciones/page";

import TecnicoInstalacionesPage from "../CrmTecInstalaciones/page";
import TecnicoInstalacionDetallePage from "../CrmInstalacionesDetalle/TecnicoInstalacionDetallePage";

import DesinstalacionesPage from "../CrmDesinstalaciones/DesinstalacionesPage";
import DesinstalacionDetallePage from "../CrmDesinstalaciones/DesinstalacionDetallePage";
import DesinstalacionCreatePage from "../CrmDesinstalaciones/create/common/crear-desinstalacion.mapper";

import AutorizacionesDesinstalacionPage from "../CrmDesinstalacionesAuth/AutorizacionesDesinstalacionPage";
import { useAuthorization } from "../CrmAuthRoutes/auth/use-authorization";
import {
  CRM_PERMISSION,
  CrmPermission,
} from "../CrmAuthRoutes/auth/crm-permissions";
import { RequirePermission } from "../CrmAuthRoutes/auth/require-permission";
import { CrmForbiddenPage } from "../CrmAuthRoutes/auth/CrmForbiddenPage";
import TicketsAsignados from "../CrmNewDashboard/tickets-asignados";
import TecDashboard from "../CrmNewDashboard/tecnico-panel/TecDashboard";
import { ReportesPage } from "../CrmReportes/pages/reportes-page";
import PppoeCuentasListPage from "../CrmPppoeCuentas/listado/pppoe-cuentas-list-page";
import PppoeCuentaDetailPage from "../CrmPppoeCuentas/detalles/pppoe-cuenta-detail-page";
import PppoeCuentaCreatePage from "../CrmPppoeCuentas/crear/pppoe-cuenta-create-page";

import PppoeCuentaAdopcionPage from "../CrmPppoeCuentas/adopcion/pppoe-cuenta-adopcion-page";

/*
 * Entrada principal del CRM.
 *
 * La mayoría de roles utiliza el dashboard normal.
 * El técnico utiliza su dashboard específico.
 *
 * Esto permite que el login siga enviando a /crm
 * sin mandar al técnico primero a una página 403.
 */
function CrmHomeRoute() {
  const { can } = useAuthorization();

  if (can(CRM_PERMISSION.DASHBOARD_VER)) {
    return <MainDashboardPage />;
  }

  if (can(CRM_PERMISSION.DASHBOARD_TECNICO_VER)) {
    return <Navigate to="/crm/tec-dashboard" replace />;
  }

  return <Navigate to="/crm/forbidden" replace />;
}

function CrmRoutes() {
  const checkAuthCRM = useStoreCrm((state) => state.checkAuthCRM);

  useEffect(() => {
    checkAuthCRM();
  }, [checkAuthCRM]);

  const permissionRoute = (permission: CrmPermission, element: JSX.Element) => (
    <RequirePermission permission={permission}>{element}</RequirePermission>
  );

  return (
    <Routes>
      {/* ===================================================== */}
      {/* PÚBLICAS */}
      {/* ===================================================== */}

      <Route path="/" element={<Navigate to="/crm" replace />} />

      <Route path="/crm/login" element={<CrmLogin />} />

      {/* ===================================================== */}
      {/* REGISTRO DE USUARIOS */}
      {/* ===================================================== */}

      <Route
        path="/crm/regist"
        element={
          <ProtectRouteCrmUser>
            <RequirePermission permission={CRM_PERMISSION.USUARIOS_CREAR}>
              <CrmRegist />
            </RequirePermission>
          </ProtectRouteCrmUser>
        }
      />

      {/* ===================================================== */}
      {/* CRM AUTENTICADO */}
      {/* ===================================================== */}

      <Route
        element={
          <ProtectRouteCrmUser>
            <Layout2 />
          </ProtectRouteCrmUser>
        }
      >
        {/* ================================================= */}
        {/* INICIO / 403 */}
        {/* ================================================= */}

        <Route path="/crm" element={<CrmHomeRoute />} />

        <Route path="/crm/forbidden" element={<CrmForbiddenPage />} />

        {/* ================================================= */}
        {/* CLIENTES */}
        {/* ================================================= */}

        <Route
          path="/crm-clientes"
          element={permissionRoute(
            CRM_PERMISSION.CLIENTES_VER,
            <ClientesTable />,
          )}
        />

        <Route
          path="/crm/cliente/:id"
          element={permissionRoute(
            CRM_PERMISSION.CLIENTES_VER,
            <CustomerProfile />,
          )}
        />

        <Route
          path="/crm/cliente-edicion/:customerId"
          element={permissionRoute(
            CRM_PERMISSION.CLIENTES_EDITAR,
            <EditCustomers />,
          )}
        />

        <Route
          path="/crm/crear-cliente-crm"
          element={permissionRoute(
            CRM_PERMISSION.CLIENTES_CREAR,
            <CreateCustomers />,
          )}
        />

        {/* ================================================= */}
        {/* EMPRESA / PERFIL / USUARIOS */}
        {/* ================================================= */}

        <Route
          path="/crm/empresa"
          element={permissionRoute(CRM_PERMISSION.EMPRESA_VER, <EmpresaForm />)}
        />

        <Route
          path="/crm/perfil"
          element={permissionRoute(
            CRM_PERMISSION.PERFIL_VER,
            <CrmProfileConfig />,
          )}
        />

        <Route
          path="/crm/usuarios"
          element={permissionRoute(CRM_PERMISSION.USUARIOS_VER, <CrmUsers />)}
        />

        {/* ================================================= */}
        {/* SERVICIOS / INTERNET / ZONAS */}
        {/* ================================================= */}

        <Route
          path="/crm-servicios"
          element={permissionRoute(
            CRM_PERMISSION.SERVICIOS_VER,
            <CrmServiceManage />,
          )}
        />

        <Route
          path="/crm-servicios-internet"
          element={permissionRoute(
            CRM_PERMISSION.SERVICIOS_VER,
            <ServicioInternetManage />,
          )}
        />

        <Route
          path="/crm-facturacion-zona"
          element={permissionRoute(
            CRM_PERMISSION.FACTURACION_ZONA_VER,
            <FacturacionZonaManage />,
          )}
        />

        <Route
          path="/crm-sectores"
          element={permissionRoute(
            CRM_PERMISSION.SECTORES_VER,
            <SectorsManagement />,
          )}
        />

        {/* ================================================= */}
        {/* TICKETS / SOPORTE */}
        {/* ================================================= */}

        <Route
          path="/crm/tickets"
          element={permissionRoute(
            CRM_PERMISSION.TICKETS_VER,
            <TicketDashboard />,
          )}
        />

        <Route
          path="/crm/tags"
          element={permissionRoute(
            CRM_PERMISSION.SOPORTE_CATEGORIAS_VER,
            <EtiquetaTicketManage />,
          )}
        />

        <Route
          path="/crm-boleta-ticket-soporte/:ticketId"
          element={permissionRoute(
            CRM_PERMISSION.TICKETS_VER,
            <BoletaTicket />,
          )}
        />

        <Route
          path="/crm/metas-soporte"
          element={permissionRoute(
            CRM_PERMISSION.SOPORTE_METAS_VER,
            <MetasTecnicosPage />,
          )}
        />

        <Route
          path="/crm/tec-dashboard"
          element={permissionRoute(
            CRM_PERMISSION.DASHBOARD_TECNICO_VER,
            <TecDashboard />,
          )}
        />

        <Route
          path="/crm/tickets/tecnico"
          element={permissionRoute(
            CRM_PERMISSION.DASHBOARD_TECNICO_VER,
            <TicketsAsignados />,
          )}
        />

        <Route
          path="/crm/ticket-detalles/:id"
          element={permissionRoute(
            CRM_PERMISSION.TICKETS_TECNICO_GESTIONAR,
            <TicketAsignadoDetails />,
          )}
        />

        <Route
          path="/crm/ticket-detalles/:id/firma-tecnico"
          element={permissionRoute(
            CRM_PERMISSION.TICKETS_TECNICO_GESTIONAR,
            <TicketFirmaTecnicoPage />,
          )}
        />

        {/* ================================================= */}
        {/* FACTURACIÓN / PAGOS */}
        {/* ================================================= */}

        <Route
          path="/crm/facturacion/pago-factura/:facturaId"
          element={permissionRoute(
            CRM_PERMISSION.PAGOS_GESTIONAR,
            <CrmPaymentFactura />,
          )}
        />

        <Route
          path="/crm/editar"
          element={permissionRoute(
            CRM_PERMISSION.PAGOS_GESTIONAR,
            <FacturaEdit />,
          )}
        />

        <Route
          path="/crm/factura-pago/pago-servicio-pdf/:factudaId"
          element={permissionRoute(
            CRM_PERMISSION.PAGOS_GESTIONAR,
            <CrmPdfPago />,
          )}
        />

        <Route
          path="/crm/facturas-eliminadas"
          element={permissionRoute(
            CRM_PERMISSION.REGISTROS_ELIMINADOS_VER,
            <DeletedInvoicesView />,
          )}
        />

        {/* ================================================= */}
        {/* RUTAS / COBROS */}
        {/* ================================================= */}

        <Route
          path="/crm/ruta"
          element={permissionRoute(CRM_PERMISSION.RUTAS_COBRO_VER, <CrmRuta />)}
        />

        <Route
          path="/crm/rutas-cobro/edit/:id"
          element={permissionRoute(
            CRM_PERMISSION.RUTAS_COBRO_VER,
            <RutasCobroEdit />,
          )}
        />

        <Route
          path="/crm/rutas-asignadas"
          element={permissionRoute(
            CRM_PERMISSION.RUTAS_ASIGNADAS_VER,
            <RutasAsignadasMain />,
          )}
        />

        <Route
          path="/crm/cobros-en-ruta/:rutaId"
          element={permissionRoute(
            CRM_PERMISSION.RUTAS_ASIGNADAS_VER,
            <RutaCobro />,
          )}
        />

        {/* ================================================= */}
        {/* MENSAJES / BOT / WHATSAPP */}
        {/* ================================================= */}

        <Route
          path="/crm-mensajes-automaticos"
          element={permissionRoute(
            CRM_PERMISSION.BOT_VER,
            <PlantillasMensajes />,
          )}
        />

        <Route
          path="/crm/bot"
          element={permissionRoute(CRM_PERMISSION.BOT_VER, <BotMainPage />)}
        />

        <Route
          path="/crm/bot/whatsapp"
          element={permissionRoute(
            CRM_PERMISSION.WHATSAPP_VER,
            <WhatsappChats />,
          )}
        />

        <Route
          path="/crm/bot/whatsapp/galery"
          element={permissionRoute(
            CRM_PERMISSION.WHATSAPP_GALERIA_VER,
            <ComprobantesMediaPage />,
          )}
        />

        <Route
          path="/crm/whatsapp-campaign-templates"
          element={permissionRoute(
            CRM_PERMISSION.WHATSAPP_PLANTILLAS_VER,
            <WhatsappTemplatesPage />,
          )}
        />

        <Route
          path="/crm/whatsapp-campaing-create-templates"
          element={permissionRoute(
            CRM_PERMISSION.WHATSAPP_PLANTILLAS_VER,
            <WhatsappTemplateCreatePage />,
          )}
        />

        <Route
          path="/crm/whatsapp-campaign-messaging"
          element={permissionRoute(
            CRM_PERMISSION.WHATSAPP_CAMPANAS_VER,
            <WhatsappMessaginCapaing />,
          )}
        />

        {/* ================================================= */}
        {/* CONTRATOS / PLANTILLAS */}
        {/* ================================================= */}

        <Route
          path="/crm-contrato-plantilla"
          element={permissionRoute(
            CRM_PERMISSION.PLANTILLAS_CONTRATO_VER,
            <PlantillaContratoManage />,
          )}
        />

        <Route
          path="/crm/contrato/:id/vista"
          element={permissionRoute(
            CRM_PERMISSION.PLANTILLAS_CONTRATO_VER,
            <ContratoServicioPDF />,
          )}
        />

        <Route
          path="/crm/instalaciones/:instalacionId/contrato"
          element={permissionRoute(
            CRM_PERMISSION.CREDITOS_VER,
            <ContratoInstalacionPage />,
          )}
        />

        <Route
          path="/crm/contrato"
          element={permissionRoute(
            CRM_PERMISSION.CREDITOS_VER,
            <ContratoBuilder />,
          )}
        />

        {/* ================================================= */}
        {/* CRÉDITOS */}
        {/* ================================================= */}

        <Route
          path="/crm/credito"
          element={permissionRoute(
            CRM_PERMISSION.CREDITOS_CREAR,
            <CrmCreditoMainPage />,
          )}
        />

        <Route
          path="/crm/credito-registros"
          element={permissionRoute(
            CRM_PERMISSION.CREDITOS_VER,
            <CreditosMainPage />,
          )}
        />

        <Route
          path="/crm/credito/:creditoId"
          element={permissionRoute(
            CRM_PERMISSION.CREDITOS_VER,
            <CreditoDetails />,
          )}
        />

        {/* ================================================= */}
        {/* RED / EQUIPOS */}
        {/* ================================================= */}

        <Route
          path="/crm/olt"
          element={permissionRoute(CRM_PERMISSION.OPTICO_VER, <OltMainPage />)}
        />

        <Route
          path="/crm/routers"
          element={permissionRoute(
            CRM_PERMISSION.OPTICO_VER,
            <RouterMainPage />,
          )}
        />

        {/* ================================================= */}
        {/* REPORTES */}
        {/* ================================================= */}

        <Route
          path="/crm/reports"
          element={permissionRoute(
            CRM_PERMISSION.REPORTES_VER,
            <ReportesPage />,
          )}
        />

        {/* ================================================= */}
        {/* PRUEBAS */}
        {/* ================================================= */}

        <Route
          path="/crm/testeos"
          element={permissionRoute(
            CRM_PERMISSION.PRUEBAS_VER,
            <AppShowcasePage />,
          )}
        />

        <Route
          path="/crm-samples"
          element={permissionRoute(CRM_PERMISSION.PRUEBAS_VER, <Samples1 />)}
        />

        {/* ================================================= */}
        {/* INSTALACIONES */}
        {/* ================================================= */}

        <Route
          path="/crm/crear-instalacion"
          element={permissionRoute(
            CRM_PERMISSION.INSTALACIONES_CREAR,
            <InstalacionesMainPage />,
          )}
        />

        <Route
          path="/crm/instalaciones/:instalacionId/editar"
          element={permissionRoute(
            CRM_PERMISSION.INSTALACIONES_EDITAR,
            <EditarInstalacionPage />,
          )}
        />

        <Route
          path="/crm/instalaciones"
          element={permissionRoute(
            CRM_PERMISSION.INSTALACIONES_VER,
            <InstalacionesListPage />,
          )}
        />

        <Route
          path="/crm/instalacion/:instalacionId"
          element={permissionRoute(
            CRM_PERMISSION.INSTALACIONES_VER,
            <InstalacionDetailPage />,
          )}
        />

        <Route
          path="/crm/instalaciones/tecnico"
          element={permissionRoute(
            CRM_PERMISSION.INSTALACIONES_TECNICO_VER,
            <TecnicoInstalacionesPage />,
          )}
        />

        <Route
          path="/crm/instalaciones/tecnico/:instalacionId"
          element={permissionRoute(
            CRM_PERMISSION.INSTALACIONES_TECNICO_VER,
            <TecnicoInstalacionDetallePage />,
          )}
        />

        {/* ================================================= */}
        {/* PPPoE */}
        {/* ================================================= */}
        <Route
          path="/crm/pppoe/cuentas"
          element={permissionRoute(
            CRM_PERMISSION.PPPOE_ADMINISTRACION_VER,
            <PppoeCuentasListPage />,
          )}
        />

        <Route
          path="/crm/pppoe/cuentas/nueva"
          element={permissionRoute(
            CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL,
            <PppoeCuentaCreatePage />,
          )}
        />

        <Route
          path="/crm/pppoe/cuentas/adoptar"
          element={permissionRoute(
            CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL,
            <PppoeCuentaAdopcionPage />,
          )}
        />

        <Route
          path="/crm/pppoe/cuentas/:cuentaPppoeId"
          element={permissionRoute(
            CRM_PERMISSION.PPPOE_ADMINISTRACION_VER,
            <PppoeCuentaDetailPage />,
          )}
        />

        <Route
          path="/crm/pppoe/homologacion-perfiles"
          element={permissionRoute(
            CRM_PERMISSION.PPPOE_HOMOLOGACIONES_VER,
            <PerfilesHomologacionPage />,
          )}
        />

        {/* ================================================= */}
        {/* DESINSTALACIONES */}
        {/* ================================================= */}

        <Route
          path="/crm/desinstalaciones"
          element={permissionRoute(
            CRM_PERMISSION.DESINSTALACIONES_VER,
            <DesinstalacionesPage />,
          )}
        />

        <Route
          path="/crm/desinstalacion/:desinstalacionId"
          element={permissionRoute(
            CRM_PERMISSION.DESINSTALACIONES_VER,
            <DesinstalacionDetallePage />,
          )}
        />

        <Route
          path="/crm/crear-desinstalacion"
          element={permissionRoute(
            CRM_PERMISSION.DESINSTALACIONES_CREAR,
            <DesinstalacionCreatePage />,
          )}
        />

        <Route
          path="/crm/desinstalacion-auth"
          element={permissionRoute(
            CRM_PERMISSION.DESINSTALACIONES_AUTORIZAR,
            <AutorizacionesDesinstalacionPage />,
          )}
        />
      </Route>

      {/* ===================================================== */}
      {/* NOT FOUND */}
      {/* ===================================================== */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default CrmRoutes;
