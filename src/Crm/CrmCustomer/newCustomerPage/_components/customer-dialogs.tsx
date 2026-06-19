"use client";

import * as React from "react";
import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "sonner";

import { useAppAsyncAction } from "@/components/app/handlers";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";
import { DeleteFacturaDialog, FacturaToDeleter } from "./delete-factura-dialog";
import { Contrato, CreateContratoDialog } from "./create-contrato-dialog";
import FacturaGenerateDialog from "./factura-generate-dialog";
import GenerateFacturas from "./generate-factura";

dayjs.extend(utc);
dayjs.extend(timezone);

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface CustomerDialogsProps {
  openGenerarFactura: boolean;
  setOpenGenerarFactura: (open: boolean) => void;

  openGenerateFacturas: boolean;
  setOpenGenerateFacturas: (open: boolean) => void;

  openDeleteFactura: boolean;
  setOpenDeleteFactura: (open: boolean) => void;

  openCreateContrato: boolean;
  setOpenCreateContrato: (open: boolean) => void;

  cliente: ClienteDetailsDto;

  facturaAction: FacturaToDeleter | null;
  setFacturaAction: (factura: FacturaToDeleter | null) => void;

  motivo: string;
  setMotivo: (motivo: string) => void;

  dataContrato: Contrato;
  setDataContrato: React.Dispatch<React.SetStateAction<Contrato>>;

  userId: number;
  getClienteDetails: () => void;
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

function normalizeDateValue(value: string) {
  if (!value) return "";

  return dayjs(value).tz("America/Guatemala").format("YYYY-MM-DD");
}

export function CustomerDialogs({
  openGenerarFactura,
  setOpenGenerarFactura,
  openGenerateFacturas,
  setOpenGenerateFacturas,
  openDeleteFactura,
  setOpenDeleteFactura,
  openCreateContrato,
  setOpenCreateContrato,
  cliente,
  facturaAction,
  setFacturaAction,
  motivo,
  setMotivo,
  dataContrato,
  setDataContrato,
  userId,
  getClienteDetails,
}: CustomerDialogsProps) {
  const resetContrato = React.useCallback(() => {
    setDataContrato(createContratoInitialState(cliente.id));
  }, [cliente.id, setDataContrato]);

  const setContratoField = React.useCallback(
    <K extends keyof Contrato>(key: K, value: Contrato[K]) => {
      setDataContrato((prev) => ({
        ...prev,
        clienteId: cliente.id,
        [key]: value,
      }));
    },
    [cliente.id, setDataContrato],
  );

  const deleteFacturaAction = useAppAsyncAction(
    async (factura: FacturaToDeleter) => {
      return axios.delete(
        `${VITE_CRM_API_URL}/facturacion/delete-one-factura`,
        {
          data: {
            facturaId: factura.id,
            estadoFactura: factura.estado,
            userId,
            fechaEmision: factura.fechaEmision,
            fechaVencimiento: factura.fechaVencimiento,
            motivo,
          },
        },
      );
    },
    {
      onSuccess: async () => {
        toast.success("Factura eliminada correctamente");

        setFacturaAction(null);
        setMotivo("");
        setOpenDeleteFactura(false);

        await getClienteDetails();
      },
      onError: (error) => {
        console.error("Error al eliminar factura:", error);
        toast.error("Ocurrió un error al intentar eliminar la factura");
      },
    },
  );

  const createContratoAction = useAppAsyncAction(
    async (payload: Contrato) => {
      return axios.post(`${VITE_CRM_API_URL}/contrato-cliente`, payload);
    },
    {
      onSuccess: async (response: AxiosResponse) => {
        if (response.status !== 201 && response.status !== 200) {
          toast.error("No se pudo crear el contrato");
          return;
        }

        toast.success("Contrato creado correctamente");

        setOpenCreateContrato(false);
        resetContrato();

        await getClienteDetails();
      },
      onError: (error) => {
        console.error("Error al crear contrato:", error);
        toast.error("Ocurrió un error al crear el contrato");
      },
    },
  );

  const handleDeleteFacturaOpenChange = React.useCallback(
    (open: boolean) => {
      setOpenDeleteFactura(open);

      if (!open) {
        setFacturaAction(null);
        setMotivo("");
        deleteFacturaAction.resetError();
      }
    },
    [deleteFacturaAction, setFacturaAction, setMotivo, setOpenDeleteFactura],
  );

  const handleCreateContratoOpenChange = React.useCallback(
    (open: boolean) => {
      setOpenCreateContrato(open);

      if (!open) {
        createContratoAction.resetError();
      }
    },
    [createContratoAction, setOpenCreateContrato],
  );

  const handleDeleteFactura = React.useCallback(async () => {
    if (!facturaAction) {
      toast.warning("No hay factura seleccionada para eliminar");
      return;
    }

    await deleteFacturaAction.run(facturaAction);
  }, [deleteFacturaAction, facturaAction]);

  const handleCreateContrato = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!cliente.id || cliente.id <= 0) {
        toast.error("No se ha proporcionado un cliente válido.");
        return;
      }

      if (!dataContrato.fechaInstalacionProgramada || !dataContrato.fechaPago) {
        toast.error("Complete las fechas requeridas.");
        return;
      }

      if (Number(dataContrato.costoInstalacion) < 0) {
        toast.error("El costo de instalación no puede ser negativo.");
        return;
      }

      const payload: Contrato = {
        ...dataContrato,
        clienteId: cliente.id,
        fechaInstalacionProgramada: normalizeDateValue(
          dataContrato.fechaInstalacionProgramada,
        ),
        fechaPago: normalizeDateValue(dataContrato.fechaPago),
        costoInstalacion: Number(dataContrato.costoInstalacion || 0),
      };

      await createContratoAction.run(payload);
    },
    [cliente.id, createContratoAction, dataContrato],
  );

  return (
    <>
      <FacturaGenerateDialog
        openGenerarFactura={openGenerarFactura}
        setOpenGenerarFactura={setOpenGenerarFactura}
        clienteId={cliente.id}
        userId={userId}
        getClienteDetails={getClienteDetails}
      />

      <GenerateFacturas
        openGenerateFacturas={openGenerateFacturas}
        setOpenGenerateFacturas={setOpenGenerateFacturas}
        clienteId={cliente.id}
        userId={userId}
        getClienteDetails={getClienteDetails}
      />

      <DeleteFacturaDialog
        open={openDeleteFactura}
        onOpenChange={handleDeleteFacturaOpenChange}
        facturaAction={facturaAction}
        motivo={motivo}
        setMotivo={setMotivo}
        isLoading={deleteFacturaAction.isLoading}
        onDelete={handleDeleteFactura}
      />

      <CreateContratoDialog
        open={openCreateContrato}
        onOpenChange={handleCreateContratoOpenChange}
        dataContrato={dataContrato}
        setContratoField={setContratoField}
        isLoading={createContratoAction.isLoading}
        onSubmit={handleCreateContrato}
      />
    </>
  );
}
