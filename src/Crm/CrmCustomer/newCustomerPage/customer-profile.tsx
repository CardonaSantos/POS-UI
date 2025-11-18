"use client";
import { useEffect, useState } from "react";
import { User, Ticket, Image } from "lucide-react"; // Mantener User y Ticket para otros triggers
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { LocationTab } from "./location-tab";
import { TicketsTab } from "./tickets-tab";
import { BillingTab } from "./billing-tab";
import { CustomerHeader } from "./customer-header";
import { CustomerDialogs } from "./customer-dialogs";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { ClientOverview } from "./overview";
import {
  useClienteDetails,
  usePlantillasContrato,
} from "../API/customer-profile.queries";
import { clienteInitialState } from "../helpers/clienteInitialState";
import { CustomerImagesGallery } from "./CrmCustomerGalery/CustomerGaleryMain";
import { CustomerImage } from "@/Crm/features/customer-galery/customer-galery.interfaces";
import EmptyImages from "./CrmCustomerGalery/EmptyImages";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

interface PlantillasInterface {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
}

interface FacturaToDeleter {
  id: number;
  estado: string;
  fechaEmision: string;
  fechaVencimiento: string;
}

interface Contrato {
  clienteId: number;
  fechaInstalacionProgramada: string;
  costoInstalacion: number;
  fechaPago: string;
  observaciones: string;
  ssid: string;
  wifiPassword: string;
}
type TabValue =
  | "resumen"
  | "imagenes"
  | "ubicacion"
  | "tickets"
  | "facturacion";

export default function CustomerProfile() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const { id } = useParams();
  const clienteId = id ? Number(id) : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = (searchParams.get("tab") as TabValue) || "resumen";
  const [activeTab, setActiveTab] = useState<TabValue>(defaultTab);
  // Estado local para mantener compatibilidad con el código existente
  const [plantillas, setPlantillas] = useState<PlantillasInterface[]>([]);
  // Estados para diálogos
  const [openGenerarFactura, setOpenGenerarFactura] = useState(false);
  const [openGenerateFacturas, setOpenGenerateFacturas] = useState(false);
  const [openDeleteFactura, setOpenDeleteFactura] = useState(false);
  const [openCreateContrato, setOpenCreateContrato] = useState(false);
  const [facturaAction, setFacturaAction] = useState<FacturaToDeleter | null>(
    null
  );
  const [motivo, setMotivo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataContrato, setDataContrato] = useState<Contrato>({
    clienteId: clienteId,
    fechaInstalacionProgramada: "",
    costoInstalacion: 0,
    fechaPago: "",
    observaciones: "",
    ssid: "",
    wifiPassword: "",
  });

  const {
    data: cliente,
    // isLoading: isClienteLoading,
    error: clienteError,
    refetch: refetchCliente,
  } = useClienteDetails(clienteId);

  const {
    data: plantillasData,
    // isLoading: isPlantillasLoading,
    error: plantillasError,
  } = usePlantillasContrato();

  const clienteSecure = cliente ? cliente : clienteInitialState;

  useEffect(() => {
    if (plantillasData) {
      setPlantillas(plantillasData);
    }
  }, [plantillasData]);

  useEffect(() => {
    if (clienteError) {
      console.error(clienteError);
      toast.info("Error al conseguir información sobre el cliente");
    }
  }, [clienteError]);

  useEffect(() => {
    if (plantillasError) {
      console.error(plantillasError);
      toast.info("Error al cargar plantillas de contrato");
    }
  }, [plantillasError]);

  const getClienteDetails = () => {
    refetchCliente();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params, { replace: true }); // replace para no llenar el historial, o quítalo si quieres que el back vaya tab por tab
  };

  useEffect(() => {
    const urlTab = (searchParams.get("tab") as TabValue) || "resumen";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  // Props comunes para los tabs
  const commonTabProps = {
    cliente: clienteSecure,
    getClienteDetails,
    setOpenGenerarFactura,
    setOpenGenerateFacturas,
    setOpenDeleteFactura,
    setFacturaAction,
  };

  const secureImages: CustomerImage[] = Array.isArray(cliente?.imagenes)
    ? cliente!.imagenes.map((img) => ({
        id: img.id,
        categoria: img.categoria,
        cdnUrl: img.cdnUrl,
        descripcion: img.descripcion,
        estado: img.estado,
        titulo: img.titulo,
        etiqueta: img.etiqueta,
        customerId: img.customerId,
      }))
    : [];

  console.log("Los datos del cliente son: ", cliente);
  return (
    <PageTransitionCrm
      titleHeader="Perfil del cliente"
      subtitle={``}
      variant="fade-pure"
    >
      <CustomerHeader
        cliente={clienteSecure}
        plantillas={plantillas}
        setOpenCreateContrato={setOpenCreateContrato}
      />
      <Tabs
        defaultValue="resumen" // Cambiado a 'resumen'
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        {/* Tabs mejorados para móvil */}
        <div className="w-full overflow-x-auto">
          <TabsList className="flex w-full border-b border-gray-200 dark:border-gray-700">
            <TabsTrigger
              value="resumen"
              className="
        flex-1 flex justify-center items-center gap-1
        px-2 py-1 sm:px-3 sm:py-2
        text-xs sm:text-sm whitespace-nowrap
        data-[state=active]:border-b-2
        data-[state=active]:border-primary
        data-[state=active]:text-primary
      "
            >
              <User className="h-4 w-4" />
              <span className="hidden xs:inline">Resumen</span>
            </TabsTrigger>

            <TabsTrigger
              value="imagenes"
              className="
        flex-1 flex justify-center items-center gap-1
        px-2 py-1 sm:px-3 sm:py-2
        text-xs sm:text-sm whitespace-nowrap
        data-[state=active]:border-b-2
        data-[state=active]:border-primary
        data-[state=active]:text-primary
      "
            >
              <Image className="h-4 w-4" />
              <span className="hidden xs:inline">Imagenes</span>
            </TabsTrigger>

            {/** Ubicación **/}
            <TabsTrigger
              value="ubicacion"
              className="
        flex-1 flex justify-center items-center gap-1
        px-2 py-1 sm:px-3 sm:py-2
        text-xs sm:text-sm whitespace-nowrap
        data-[state=active]:border-b-2
        data-[state=active]:border-primary
        data-[state=active]:text-primary
      "
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="hidden xs:inline">Ubicación</span>
            </TabsTrigger>

            {/** Tickets **/}
            <TabsTrigger
              value="tickets"
              className="
        flex-1 flex justify-center items-center gap-1
        px-2 py-1 sm:px-3 sm:py-2
        text-xs sm:text-sm whitespace-nowrap
        data-[state=active]:border-b-2
        data-[state=active]:border-primary
        data-[state=active]:text-primary
      "
            >
              <Ticket className="h-4 w-4" />
              <span className="hidden xs:inline">Tickets</span>
            </TabsTrigger>

            {/** Facturación **/}
            <TabsTrigger
              value="facturacion"
              className="
        flex-1 flex justify-center items-center gap-1
        px-2 py-1 sm:px-3 sm:py-2
        text-xs sm:text-sm whitespace-nowrap
        data-[state=active]:border-b-2
        data-[state=active]:border-primary
        data-[state=active]:text-primary
      "
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="hidden xs:inline">Facturación</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenido de los tabs */}
        <TabsContent value="resumen" className="mt-4">
          <ClientOverview cliente={clienteSecure} />{" "}
        </TabsContent>

        <TabsContent value="imagenes" className="mt-4">
          {secureImages.length > 0 ? (
            <CustomerImagesGallery
              customerId={clienteSecure.id}
              images={secureImages}
            />
          ) : (
            <EmptyImages customerId={clienteSecure.id} />
          )}
        </TabsContent>

        {/* Las TabsContent para "general" y "servicio" se eliminan */}
        <TabsContent value="ubicacion" className="mt-4">
          <LocationTab {...commonTabProps} />
        </TabsContent>
        <TabsContent value="tickets" className="mt-4">
          <TicketsTab {...commonTabProps} />
        </TabsContent>
        <TabsContent value="facturacion" className="mt-4">
          <BillingTab {...commonTabProps} />
        </TabsContent>
      </Tabs>
      {/* Diálogos modularizados */}
      <CustomerDialogs
        // Estados de diálogos
        openGenerarFactura={openGenerarFactura}
        setOpenGenerarFactura={setOpenGenerarFactura}
        openGenerateFacturas={openGenerateFacturas}
        setOpenGenerateFacturas={setOpenGenerateFacturas}
        openDeleteFactura={openDeleteFactura}
        setOpenDeleteFactura={setOpenDeleteFactura}
        openCreateContrato={openCreateContrato}
        setOpenCreateContrato={setOpenCreateContrato}
        // Datos
        cliente={clienteSecure}
        facturaAction={facturaAction}
        setFacturaAction={setFacturaAction}
        motivo={motivo}
        setMotivo={setMotivo}
        dataContrato={dataContrato}
        setDataContrato={setDataContrato}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        userId={userId}
        getClienteDetails={getClienteDetails}
      />
    </PageTransitionCrm>
  );
}
