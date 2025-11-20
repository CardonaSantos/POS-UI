"use client";
import { useEffect, useState } from "react";
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
import {
  ReusableTabs,
  TabItem,
} from "@/Crm/Utils/Components/tabs/reusable-tabs";
import { FileText, Image, MapPinned, Ticket, User } from "lucide-react";
import { useTabChangeWithUrl } from "@/Crm/Utils/Components/handleTabChangeWithParamURL";
import { MikroTikIcon } from "@/Crm/Icons/MikroTikIcon";
import CustomerNetworkControl from "./CustomerNetworkControl/customer-network-controll";
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
  const { id } = useParams();
  const clienteId = id ? Number(id) : 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = (searchParams.get("tab") as string) || "resumen";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
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

  const handleChangeTabs = useTabChangeWithUrl({
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
  });

  useEffect(() => {
    const urlTab = (searchParams.get("tab") as string) || "resumen";
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
  const contentMediaSection = secureImages.length ? (
    <CustomerImagesGallery
      customerId={clienteSecure.id}
      images={secureImages}
    />
  ) : (
    <EmptyImages customerId={clienteSecure.id} />
  );

  const tabs: Array<TabItem> = [
    {
      value: "resumen",
      label: "General",
      content: <ClientOverview cliente={clienteSecure} />,
      icon: <User size={16} />,
    },

    {
      value: "imagenes",
      label: "Media",
      content: contentMediaSection,
      icon: <Image size={16} />,
    },

    {
      value: "ubicacion",
      label: "Dirección",
      content: <LocationTab {...commonTabProps} />,
      icon: <MapPinned size={16} />,
    },

    {
      value: "tickets",
      label: "Soporte",
      content: <TicketsTab {...commonTabProps} />,
      icon: <Ticket size={16} />,
    },
    {
      value: "facturacion",
      label: "Facturación",
      content: <BillingTab {...commonTabProps} />,
      icon: <FileText size={16} />,
    },

    {
      value: "mikrotik",
      label: "MikroTik",
      content: <CustomerNetworkControl cliente={clienteSecure} />,
      icon: <MikroTikIcon scale={16} />,
    },
  ];

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
      <ReusableTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleTabChange={handleChangeTabs}
        tabs={tabs}
      />

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
