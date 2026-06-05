import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import RegisterView from "./Pages/Auth/Register";
import NotFoundPage from "./Pages/NotFount/NotFoundPage";
import Layout2 from "./components/Layout/Layout";
import { ProtectRouteAdmin } from "./components/Auth/ProtectRouteAdmin";
import { useAuthStore } from "./components/Auth/AuthState";
import { useEffect } from "react";
import CreateCustomers from "./Crm/CrmCreateCustomers/CreateCustomers";
import EmpresaForm from "./Crm/CrmEmpresa/EmpresaForm";
import { ProtectRouteCrmUser } from "./Crm/CrmAuthRoutes/ProtectRouteCrmUser";
import { useAuthStoreCRM } from "./Crm/CrmAuthRoutes/AuthStateCRM";
import CrmRegist from "./Crm/CrmAuth/CrmRegist";
import CrmLogin from "./Crm/CrmAuth/CrmLogin";
import CrmServiceManage from "./Crm/CrmServices/CrmServiceManage";
import ServicioInternetManage from "./Crm/CrmServices/CrmServiciosWifi/CrmServicesWifi";
import FacturacionZonaManage from "./Crm/CrmFacturacion/FacturacionZonaManage";
import Samples1 from "./Samples/Samples1";
import EtiquetaTicketManage from "./Crm/CrmTickets/CrmUtilidadesSoporte/UtilidadesSoporteMain";
import CrmPaymentFactura from "./Crm/CrmBilling/CrmFacturacion/CrmPaymentFactura";
import CrmRuta from "./Crm/CrmRutas/CrmRuta";
import CrmPdfPago from "./Crm/CrmPdfPago/CrmPdfPago";
import RutaCobro from "./Crm/CrmRutas/CrmRutasCobro/RutaCobro";
import EditCustomers from "./Crm/CrmCustomerEdition/CrmCustomerEdition";
import SectorsManagement from "./Crm/CrmSector/SectorsManagement";
import PlantillasMensajes from "./Crm/CrmMensajes/PlantillasMensajes";
import BoletaTicket from "./Crm/CrmTickets/CrmTicketsBoleta/BoletaTicket";
import PlantillaContratoManage from "./Crm/CrmPlantillaContrato/CrmPlantillaContratoManage";
import ContratoServicioPDF from "./Crm/CrmPlantillaContrato/CrmContratoPdf";
import { RutasCobroEdit } from "./Crm/CrmRutas/RutasCobroEdit";
import FacturaEdit from "./Crm/CrmFacturacion/FacturaEdicion/FacturaEdit";
import CrmProfileConfig from "./Crm/CrmProfile/CrmProfileConfig";
import CrmUsers from "./Crm/CrmProfile/CrmUsers";
import MetasTecnicosPage from "./Crm/CrmTicketsMeta/MetasTecnicosPage";
import DeletedInvoicesView from "./Crm/CrmFacturasEliminadas/DeletedFacturas";
import CustomerProfile from "./Crm/CrmCustomer/newCustomerPage/customer-profile";
import RutasAsignadasMain from "./Crm/CrmRutas/_rutas_asignadas/rutas_asignadas_main";
import ReportsMainPage from "./Crm/reports/page/ReportsMainPage";
import ClientesTable from "./Crm/CrmCustomers/CrmCustomerTable";
import RouterMainPage from "./Crm/routers/page";
import OltMainPage from "./Crm/Olt/page";
import BotMainPage from "./Crm/CrmBot/page";
import { MainDashboardPage } from "./Crm/CrmNewDashboard/page";
import TecDashboard from "./Crm/CrmNewDashboard/tec-dashboard";
import TicketAsignadoDetails from "./Crm/CrmNewDashboard/_components/tec-ticket/ticket-details";
import WhatsappChats from "./Crm/CrmWhatsapp/page";
import CrmCreditoMainPage from "./Crm/CrmCredito/create/page";
import { CreditosMainPage } from "@/Crm/CrmCredito/main/page";
import CreditoDetails from "./Crm/CrmCredito/credito/page";
import ContratoBuilder from "./Crm/CrmCredito/contrato/page";
import PrinteablePlantilla from "./Crm/CrmCredito/contrato/printeable";
import TicketDashboard from "./Crm/CrmTickets/crm-ticket-dashboard";
import ComprobantesMediaPage from "./Crm/CrmWhatsapp/galery-whatsapp/page";
import WhatsappTemplatesPage from "./Crm/CrmWhatsappCampaings/whatsapp-campaing/page";
import { WhatsappTemplateCreatePage } from "./Crm/CrmWhatsappCampaings/whatsapp-campaing/create-templates/create-templates";
import { WhatsappMessaginCapaing } from "./Crm/CrmWhatsappCampaings/whatsapp-campaing/send-messages/page";

function App() {
  const { checkAuth } = useAuthStore();
  const { checkAuthCRM } = useAuthStoreCRM();

  useEffect(() => {
    checkAuth();
    checkAuthCRM();
  }, []);

  const adminRoute = (element: JSX.Element) => (
    <ProtectRouteAdmin>{element}</ProtectRouteAdmin>
  );

  const crmRoute = (element: JSX.Element) => (
    <ProtectRouteCrmUser>{element}</ProtectRouteCrmUser>
  );

  return (
    <Router>
      <Toaster
        richColors
        expand={true}
        closeButton={true}
        position="top-right"
        duration={3000}
      />

      <Routes>
        {/* ========================= */}
        {/* RUTAS PÚBLICAS / AUTH */}
        {/* ========================= */}

        <Route path="/" element={adminRoute(<Navigate to="/crm" />)} />

        {/* <Route path="/" element={<RedirectToDashboard />} /> */}

        <Route path="/crm/register" element={<RegisterView />} />
        <Route path="/crm/regist" element={<CrmRegist />} />
        <Route path="/crm/login" element={<CrmLogin />} />

        {/* ========================= */}
        {/* RUTAS CON LAYOUT PRINCIPAL */}
        {/* ========================= */}

        <Route element={<Layout2 />}>
          {/* ========================= */}
          {/* DASHBOARD CRM */}
          {/* ========================= */}

          <Route path="/crm" element={crmRoute(<MainDashboardPage />)} />

          {/* ========================= */}
          {/* CLIENTES CRM */}
          {/* ========================= */}

          <Route path="/crm-clientes" element={crmRoute(<ClientesTable />)} />

          <Route
            path="/crm/cliente/:id"
            element={crmRoute(<CustomerProfile />)}
          />

          <Route
            path="/crm/cliente-edicion/:customerId"
            element={crmRoute(<EditCustomers />)}
          />

          <Route
            path="/crm/crear-cliente-crm"
            element={crmRoute(<CreateCustomers />)}
          />

          {/* ========================= */}
          {/* EMPRESA / PERFIL / USUARIOS */}
          {/* ========================= */}

          <Route path="/crm/empresa" element={crmRoute(<EmpresaForm />)} />

          <Route path="/crm/perfil" element={crmRoute(<CrmProfileConfig />)} />

          <Route path="/crm/usuarios" element={crmRoute(<CrmUsers />)} />

          {/* ========================= */}
          {/* SERVICIOS / INTERNET / ZONAS */}
          {/* ========================= */}

          <Route
            path="/crm-servicios"
            element={crmRoute(<CrmServiceManage />)}
          />

          <Route
            path="/crm-servicios-internet"
            element={crmRoute(<ServicioInternetManage />)}
          />

          <Route
            path="/crm-facturacion-zona"
            element={crmRoute(<FacturacionZonaManage />)}
          />

          <Route
            path="/crm-sectores"
            element={crmRoute(<SectorsManagement />)}
          />

          {/* ========================= */}
          {/* TICKETS / SOPORTE */}
          {/* ========================= */}

          <Route path="/crm/tickets" element={crmRoute(<TicketDashboard />)} />

          <Route
            path="/crm/tags"
            element={crmRoute(<EtiquetaTicketManage />)}
          />

          <Route
            path="/crm-boleta-ticket-soporte/:ticketId"
            element={crmRoute(<BoletaTicket />)}
          />

          <Route
            path="/crm/metas-soporte"
            element={crmRoute(<MetasTecnicosPage />)}
          />

          <Route
            path="/crm/tec-dashboard"
            element={crmRoute(<TecDashboard />)}
          />

          <Route
            path="/crm/ticket-detalles/:id"
            element={crmRoute(<TicketAsignadoDetails />)}
          />

          {/* ========================= */}
          {/* FACTURACIÓN / PAGOS */}
          {/* ========================= */}

          <Route
            path="/crm/facturacion/pago-factura/:facturaId"
            element={crmRoute(<CrmPaymentFactura />)}
          />

          <Route path="/crm/editar" element={crmRoute(<FacturaEdit />)} />

          <Route
            path="/crm/factura-pago/pago-servicio-pdf/:factudaId"
            element={crmRoute(<CrmPdfPago />)}
          />

          <Route
            path="/crm/facturas-eliminadas"
            element={crmRoute(<DeletedInvoicesView />)}
          />

          {/* ========================= */}
          {/* RUTAS / COBROS EN RUTA */}
          {/* ========================= */}

          <Route path="/crm/ruta" element={crmRoute(<CrmRuta />)} />

          <Route
            path="/crm/rutas-cobro/edit/:id"
            element={crmRoute(<RutasCobroEdit />)}
          />

          <Route
            path="/crm/rutas-asignadas"
            element={crmRoute(<RutasAsignadasMain />)}
          />

          <Route
            path="/crm/cobros-en-ruta/:rutaId"
            element={crmRoute(<RutaCobro />)}
          />

          {/* ========================= */}
          {/* MENSAJES / BOT / WHATSAPP */}
          {/* ========================= */}

          <Route
            path="/crm-mensajes-automaticos"
            element={crmRoute(<PlantillasMensajes />)}
          />

          <Route path="/crm/bot" element={crmRoute(<BotMainPage />)} />

          <Route
            path="/crm/bot/whatsapp"
            element={crmRoute(<WhatsappChats />)}
          />

          <Route
            path="/crm/bot/whatsapp/galery"
            element={crmRoute(<ComprobantesMediaPage />)}
          />

          <Route
            path="/whatsapp-campaign-templates"
            element={adminRoute(<WhatsappTemplatesPage />)}
          />

          <Route
            path="/whatsapp-campaing-create-templates"
            element={adminRoute(<WhatsappTemplateCreatePage />)}
          />

          <Route
            path="/whatsapp-campaign-messaging"
            element={adminRoute(<WhatsappMessaginCapaing />)}
          />

          {/* ========================= */}
          {/* CONTRATOS / PLANTILLAS */}
          {/* ========================= */}

          <Route
            path="/crm-contrato-plantilla"
            element={<PlantillaContratoManage />}
          />

          <Route
            path="/crm/contrato/:id/vista"
            element={crmRoute(<ContratoServicioPDF />)}
          />

          <Route
            path="/crm/contrato/:creditoId/:plantillaId"
            element={crmRoute(<PrinteablePlantilla />)}
          />

          <Route path="/crm/contrato" element={crmRoute(<ContratoBuilder />)} />

          {/* ========================= */}
          {/* CRÉDITOS */}
          {/* ========================= */}

          <Route
            path="/crm/credito"
            element={crmRoute(<CrmCreditoMainPage />)}
          />

          <Route
            path="/crm/credito-registros"
            element={crmRoute(<CreditosMainPage />)}
          />

          <Route
            path="/crm/credito/:creditoId"
            element={crmRoute(<CreditoDetails />)}
          />

          {/* ========================= */}
          {/* ADMIN / RED / EQUIPOS */}
          {/* ========================= */}

          <Route path="/crm/olt" element={adminRoute(<OltMainPage />)} />

          <Route path="/crm/routers" element={adminRoute(<RouterMainPage />)} />

          {/* ========================= */}
          {/* REPORTES */}
          {/* ========================= */}

          <Route path="/crm/reports" element={crmRoute(<ReportsMainPage />)} />

          {/* ========================= */}
          {/* SAMPLES / PRUEBAS */}
          {/* ========================= */}

          <Route path="/crm-samples" element={crmRoute(<Samples1 />)} />
        </Route>

        {/* ========================= */}
        {/* NOT FOUND */}
        {/* ========================= */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
