"use client";

import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Image, MapPinned, Ticket, User } from "lucide-react";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTabs, type AppTabItem } from "@/components/app/primitives/app-tabs";
import { useAppDisclosure } from "@/components/app/handlers";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { CustomerImage } from "@/Crm/features/customer-galery/customer-galery.interfaces";
import { MikroTikIcon } from "@/Crm/Icons/MikroTikIcon";
import { useTabChangeWithUrl } from "@/Crm/Utils/Components/handleTabChangeWithParamURL";

import { LocationTab } from "./_components/location-tab";
import { TicketsTab } from "./_components/tickets-tab";
import { BillingTab } from "./_components/billing-tab";
import { CustomerHeader } from "./_components/customer-header";
import { CustomerDialogs } from "./_components/customer-dialogs";
import { ClientOverview } from "./_components/overview";
import { CustomerImagesGallery } from "./CrmCustomerGalery/CustomerGaleryMain";
import EmptyImages from "./CrmCustomerGalery/EmptyImages";
import CustomerNetworkControl from "./customer-network-control/customer-network-controll";

import {
  useClienteDetails,
  usePlantillasContrato,
} from "../API/customer-profile.queries";
import { clienteInitialState } from "../helpers/clienteInitialState";

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

function createContratoInitialState(clienteId: number): Contrato {
  return {
    clienteId,
    fechaInstalacionProgramada: "",
    costoInstalacion: 0,
    fechaPago: "",
    observaciones: "",
    ssid: "",
    wifiPassword: "",
  };
}

export default function CustomerProfile() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const { id } = useParams();
  const clienteId = id ? Number(id) : 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "resumen";
  const [activeTab, setActiveTab] = React.useState<string>(defaultTab);

  const generarFacturaDialog = useAppDisclosure();
  const generateFacturasDialog = useAppDisclosure();
  const deleteFacturaDialog = useAppDisclosure();
  const createContratoDialog = useAppDisclosure();

  const [facturaAction, setFacturaAction] =
    React.useState<FacturaToDeleter | null>(null);
  const [motivo, setMotivo] = React.useState("");
  const [dataContrato, setDataContrato] = React.useState<Contrato>(() =>
    createContratoInitialState(clienteId),
  );

  const {
    data: cliente,
    error: clienteError,
    refetch: refetchCliente,
  } = useClienteDetails(clienteId);

  const { data: plantillasData, error: plantillasError } =
    usePlantillasContrato();

  const clienteSecure = cliente ?? clienteInitialState;

  const plantillas = React.useMemo<PlantillasInterface[]>(
    () => plantillasData ?? [],
    [plantillasData],
  );

  React.useEffect(() => {
    setDataContrato((prev) => ({
      ...prev,
      clienteId,
    }));
  }, [clienteId]);

  React.useEffect(() => {
    if (!clienteError) return;

    console.error(clienteError);
    toast.info("Error al conseguir información sobre el cliente");
  }, [clienteError]);

  React.useEffect(() => {
    if (!plantillasError) return;

    console.error(plantillasError);
    toast.info("Error al cargar plantillas de contrato");
  }, [plantillasError]);

  React.useEffect(() => {
    const urlTab = searchParams.get("tab") || "resumen";

    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const getClienteDetails = React.useCallback(() => {
    refetchCliente();
  }, [refetchCliente]);

  const handleChangeTabs = useTabChangeWithUrl({
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
  });

  const commonTabProps = React.useMemo(
    () => ({
      cliente: clienteSecure,
      getClienteDetails,
      setOpenGenerarFactura: generarFacturaDialog.setOpen,
      setOpenGenerateFacturas: generateFacturasDialog.setOpen,
      setOpenDeleteFactura: deleteFacturaDialog.setOpen,
      setFacturaAction,
    }),
    [
      clienteSecure,
      getClienteDetails,
      generarFacturaDialog.setOpen,
      generateFacturasDialog.setOpen,
      deleteFacturaDialog.setOpen,
    ],
  );

  const secureImages = React.useMemo<CustomerImage[]>(
    () =>
      Array.isArray(cliente?.imagenes)
        ? cliente.imagenes.map((img) => ({
            id: img.id,
            categoria: img.categoria,
            cdnUrl: img.cdnUrl,
            descripcion: img.descripcion,
            estado: img.estado,
            titulo: img.titulo,
            etiqueta: img.etiqueta,
            customerId: img.customerId,
          }))
        : [],
    [cliente?.imagenes],
  );

  const contentMediaSection = React.useMemo(
    () =>
      secureImages.length ? (
        <CustomerImagesGallery
          customerId={clienteSecure.id}
          images={secureImages}
        />
      ) : (
        <EmptyImages customerId={clienteSecure.id} />
      ),
    [clienteSecure.id, secureImages],
  );
  const tabs = React.useMemo<Array<AppTabItem>>(
    () => [
      {
        value: "resumen",
        label: "General",
        content: <ClientOverview cliente={clienteSecure} />,
        icon: <User size={16} />,
      },
      {
        value: "facturacion",
        label: "Facturación",
        content: <BillingTab {...commonTabProps} />,
        icon: <FileText size={16} />,
      },
      {
        value: "tickets",
        label: "Soporte",
        content: <TicketsTab {...commonTabProps} />,
        icon: <Ticket size={16} />,
      },
      {
        value: "ubicacion",
        label: "Dirección",
        content: <LocationTab {...commonTabProps} />,
        icon: <MapPinned size={16} />,
      },
      {
        value: "imagenes",
        label: "Media",
        content: contentMediaSection,
        icon: <Image size={16} />,
      },
      {
        value: "mikrotik",
        label: "MikroTik",
        content: <CustomerNetworkControl cliente={clienteSecure} />,
        icon: <MikroTikIcon scale={16} />,
      },
    ],
    [clienteSecure, commonTabProps, contentMediaSection],
  );

  return (
    <PageTransitionCrm
      titleHeader="Perfil del cliente"
      subtitle=""
      variant="fade-pure"
    >
      <AppContainer size="full" paddingX="none" paddingY="none">
        <AppStack gap="sm">
          <CustomerHeader
            cliente={clienteSecure}
            plantillas={plantillas}
            setOpenCreateContrato={createContratoDialog.setOpen}
          />

          <AppTabs
            value={activeTab}
            onValueChange={handleChangeTabs}
            tabs={tabs}
            variant="compact"
            size="sm"
            contentSpacing="sm"
            listClassName="w-full"
          />
        </AppStack>
      </AppContainer>

      <CustomerDialogs
        openGenerarFactura={generarFacturaDialog.isOpen}
        setOpenGenerarFactura={generarFacturaDialog.setOpen}
        openGenerateFacturas={generateFacturasDialog.isOpen}
        setOpenGenerateFacturas={generateFacturasDialog.setOpen}
        openDeleteFactura={deleteFacturaDialog.isOpen}
        setOpenDeleteFactura={deleteFacturaDialog.setOpen}
        openCreateContrato={createContratoDialog.isOpen}
        setOpenCreateContrato={createContratoDialog.setOpen}
        cliente={clienteSecure}
        facturaAction={facturaAction}
        setFacturaAction={setFacturaAction}
        motivo={motivo}
        setMotivo={setMotivo}
        dataContrato={dataContrato}
        setDataContrato={setDataContrato}
        userId={userId}
        getClienteDetails={getClienteDetails}
      />
    </PageTransitionCrm>
  );
}
