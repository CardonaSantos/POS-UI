"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Ticket, Image } from "lucide-react"; // Mantener User y Ticket para otros triggers
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

// Importar el nuevo componente combinado

// Importar los otros componentes de tabs que no se fusionan
import { LocationTab } from "./location-tab";
import { TicketsTab } from "./tickets-tab";
import { BillingTab } from "./billing-tab";
import { CustomerHeader } from "./customer-header";
import { CustomerDialogs } from "./customer-dialogs";

// Import types
import type { ClienteDetailsDto } from "./types"; // Asegúrate de que este tipo esté completo
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { ClientOverview } from "./overview";
import ImagesCustomer from "./ImagesCustomer";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

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

export default function CustomerProfile() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  // Estados principales
  const defaultTab = searchParams.get("tab") || "resumen"; // Cambiado a 'resumen'
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [cliente, setCliente] = useState<ClienteDetailsDto>({
    id: 0,
    sector: { id: 1, nombre: "" },
    nombre: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dpi: "",
    observaciones: "",
    contactoReferenciaNombre: "",
    contactoReferenciaTelefono: "",
    estadoCliente: "",
    contrasenaWifi: "",
    ssidRouter: "",
    fechaInstalacion: "",
    asesor: null,
    servicio: null,
    municipio: { id: 1, nombre: "" },
    departamento: { id: 1, nombre: "" },
    empresa: { id: 1, nombre: "" },
    IP: { direccion: "192.168.100.1", gateway: "", id: 1, mascara: "" },
    ubicacion: {
      id: 1,
      latitud: 15.667147636975496,
      longitud: -91.71722598563508,
    },
    saldoCliente: null,
    creadoEn: "",
    actualizadoEn: "",
    ticketSoporte: [],
    facturaInternet: [],
    clienteServicio: [],
    contratoServicioInternet: null,
  });

  // Estados para diálogos
  const [plantillas, setPlantillas] = useState<PlantillasInterface[]>([]);
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
    clienteId: id ? Number(id) : 0,
    fechaInstalacionProgramada: "",
    costoInstalacion: 0,
    fechaPago: "",
    observaciones: "",
    ssid: "",
    wifiPassword: "",
  });

  // Funciones de API
  const getClienteDetails = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/get-customer-details/${Number(
          id
        )}`
      );
      if (response.status === 200) {
        setCliente(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir información sobre el cliente");
    }
  };

  const getPlantillas = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/contrato-cliente/plantillas-contrato`
      );
      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClienteDetails();
    getPlantillas();
  }, []);

  // Props comunes para los tabs
  const commonTabProps = {
    cliente,
    getClienteDetails,
    setOpenGenerarFactura,
    setOpenGenerateFacturas,
    setOpenDeleteFactura,
    setFacturaAction,
  };

  console.log("Los datos del cliente son: ", cliente);

  return (
    <div className="container mx-auto py-4  sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CustomerHeader
          cliente={cliente}
          plantillas={plantillas}
          setOpenCreateContrato={setOpenCreateContrato}
        />
        <Tabs
          defaultValue="resumen" // Cambiado a 'resumen'
          value={activeTab}
          onValueChange={setActiveTab}
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
            <ClientOverview cliente={cliente} />{" "}
            {/* Renderiza el nuevo componente combinado */}
          </TabsContent>

          <TabsContent value="imagenes" className="mt-4">
            <ImagesCustomer /> {/* Renderiza el nuevo componente combinado */}
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
      </motion.div>
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
        cliente={cliente}
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
    </div>
  );
}
