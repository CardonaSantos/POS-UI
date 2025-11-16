"use client";

import type React from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import FacturaGenerateDialog from "./../Factura/FacturaGenerateDialog";
import GenerateFacturas from "./../Factura/GenerateFacturas";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

dayjs.extend(timezone);

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

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

interface CustomerDialogsProps {
  // Estados de diálogos
  openGenerarFactura: boolean;
  setOpenGenerarFactura: (open: boolean) => void;
  openGenerateFacturas: boolean;
  setOpenGenerateFacturas: (open: boolean) => void;
  openDeleteFactura: boolean;
  setOpenDeleteFactura: (open: boolean) => void;
  openCreateContrato: boolean;
  setOpenCreateContrato: (open: boolean) => void;

  // Datos
  cliente: ClienteDetailsDto;
  facturaAction: FacturaToDeleter | null;
  setFacturaAction: (factura: FacturaToDeleter | null) => void;
  motivo: string;
  setMotivo: (motivo: string) => void;
  dataContrato: Contrato;
  setDataContrato: React.Dispatch<React.SetStateAction<Contrato>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userId: number;
  getClienteDetails: () => void;
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
  isLoading,
  setIsLoading,
  userId,
  getClienteDetails,
}: CustomerDialogsProps) {
  const handleInputChangeContrato = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    let newValue: any;
    console.log(newValue);

    if (name === "fechaPago" || name === "fechaInstalacionProgramada") {
      newValue = dayjs(value).tz("America/Guatemala").format();
    } else {
      newValue = value;
    }
    setDataContrato((prevData: Contrato) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteFactura = async () => {
    if (!facturaAction) {
      toast.warning("No hay factura seleccionada para eliminar");
      return;
    }
    const { id, estado, fechaEmision, fechaVencimiento } = facturaAction;
    try {
      const response: AxiosResponse = await axios.delete(
        `${VITE_CRM_API_URL}/facturacion/delete-one-factura`,
        {
          data: {
            facturaId: id,
            estadoFactura: estado,
            userId: userId,
            fechaEmision,
            fechaVencimiento,
            motivo: motivo,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Factura eliminada correctamente");
        getClienteDetails();
        setFacturaAction(null);
        setOpenDeleteFactura(false);
        setMotivo("");
      } else {
        toast.error("No se pudo eliminar la factura");
      }
    } catch (error: any) {
      console.error("Error al eliminar factura:", error);
      toast.error("Ocurrió un error al intentar eliminar la factura");
    }
  };

  const handleCreateContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !dataContrato.clienteId &&
        dataContrato.costoInstalacion &&
        !dataContrato.fechaPago &&
        !dataContrato.fechaInstalacionProgramada
      ) {
        toast.error("Por favor, completa todos los campos requeridos.");
        return;
      }
      setIsLoading(true);
      const response = await axios.post(
        `${VITE_CRM_API_URL}/contrato-cliente`,
        dataContrato
      );
      if (response.status === 201) {
        toast.success("Contrato creado correctamente");
        setOpenCreateContrato(false);
        getClienteDetails();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* DIALOG PARA GENERAR UNA FACTURA-PASADA-FUTURA */}
      <FacturaGenerateDialog
        openGenerarFactura={openGenerarFactura}
        setOpenGenerarFactura={setOpenGenerarFactura}
        clienteId={cliente.id}
        getClienteDetails={getClienteDetails}
      />

      <GenerateFacturas
        openGenerateFacturas={openGenerateFacturas}
        setOpenGenerateFacturas={setOpenGenerateFacturas}
        clienteId={cliente.id}
        getClienteDetails={getClienteDetails}
      />

      <Dialog open={openDeleteFactura} onOpenChange={setOpenDeleteFactura}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Está seguro que desea eliminar esta factura? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                El saldo y estado del cliente se verán afectados en función de
                su saldo actual y su relacion con sus facturas.
              </AlertDescription>
            </Alert>
            <div className="pt-2">
              <Textarea
                className=""
                onChange={(e) => {
                  setMotivo(e.target.value);
                }}
                placeholder="Describa el motivo por el cual se procede a eliminar (OPCIONAL)"
                value={motivo}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteFactura(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteFactura}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCreateContrato} onOpenChange={setOpenCreateContrato}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Crear Nuevo Contrato</DialogTitle>
            <DialogDescription>
              Complete la información para generar un nuevo contrato para el
              cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateContrato}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInstalacionProgramada">
                    Fecha de Instalación
                  </Label>
                  <Input
                    id="fechaInstalacionProgramada"
                    name="fechaInstalacionProgramada"
                    type="date"
                    value={dataContrato.fechaInstalacionProgramada}
                    onChange={handleInputChangeContrato}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaPago">Fecha de Pago</Label>
                  <Input
                    id="fechaPago"
                    name="fechaPago"
                    type="date"
                    value={dataContrato.fechaPago}
                    onChange={handleInputChangeContrato}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="costoInstalacion">Costo de Instalación</Label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="costoInstalacion"
                    name="costoInstalacion"
                    type="number"
                    className="pl-6"
                    placeholder="0.00"
                    value={dataContrato.costoInstalacion}
                    onChange={handleInputChangeContrato}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  placeholder="Observaciones adicionales sobre el contrato..."
                  rows={3}
                  value={dataContrato.observaciones}
                  onChange={handleInputChangeContrato}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateContrato(false)}
              >
                Cancelar
              </Button>
              <Button disabled={isLoading} type="submit">
                Crear Contrato
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
