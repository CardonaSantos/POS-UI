"use client";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Banknote,
  Calendar,
  CreditCard,
  FileText,
  Hash,
  Percent,
  User,
  Wallet,
} from "lucide-react";
import {
  CreditoCuotaResponse,
  CreditoResponse,
  EstadoCredito,
  FrecuenciaPago,
} from "@/Crm/features/credito/credito-interfaces";
import { formattShortFecha } from "@/utils/formattFechas";
import { CuotaRow } from "./cuota-row";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { InfoItem } from "./info-icon";
import React, { Dispatch, SetStateAction, useState } from "react";
import CuotaCreditoDetail from "./cuota-credito-detail";
import PagoCuotaDialog from "./regist-cuota-credito-payment";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import {
  CreateCuotaPagoDto,
  DeletePagoDto,
  useCreatePagoCuota,
  useDeletePayment,
} from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import PagoHistorialItem from "./pago-historial-item";

interface CreditoDetailsProps {
  credito: CreditoResponse;
  creditoCuota: CreditoCuotaResponse | null;
  openCuota: boolean;
  setOpenCuota: Dispatch<SetStateAction<boolean>>;
  setCreditoCuota: Dispatch<SetStateAction<CreditoCuotaResponse | null>>;
}

const frecuenciaLabels: Record<FrecuenciaPago, string> = {
  [FrecuenciaPago.SEMANAL]: "Semanal",
  [FrecuenciaPago.QUINCENAL]: "Quincenal",
  [FrecuenciaPago.MENSUAL]: "Mensual",
  [FrecuenciaPago.CUSTOM]: "Personalizado",
};

const estadoCreditoConfig: Record<
  EstadoCredito,
  { label: string; className: string }
> = {
  ACTIVO: { label: "Activo", className: "bg-emerald-100 text-emerald-700" },
  COMPLETADO: { label: "Pagado", className: "bg-blue-100 text-blue-700" },
  EN_MORA: { label: "Vencido", className: "bg-red-100 text-red-700" },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-neutral-100 text-neutral-700",
  },
};

export function CreditoDetails({
  credito,
  openCuota,
  creditoCuota,
  setCreditoCuota,
  setOpenCuota,
}: CreditoDetailsProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const estadoConfig = estadoCreditoConfig[credito.estado];
  const totalPagado = credito.cuotas.reduce(
    (sum, c) => sum + Number.parseFloat(c.montoPagado),
    0,
  );
  const totalPendiente = Number.parseFloat(credito.montoTotal) - totalPagado;
  const progreso = (totalPagado / Number.parseFloat(credito.montoTotal)) * 100;

  const cuotasPagadas = credito.cuotas.filter(
    (c) => c.estado === "PAGADA",
  ).length;
  const cuotasVencidas = credito.cuotas.filter(
    (c) => c.estado === "VENCIDA",
  ).length;

  const initialObject: CreateCuotaPagoDto = {
    cuotaId: "",
    monto: "",
    creditoId: "",
    fechaPago: "",
    metodoPago: "",
    referencia: "",
    observacion: "",
    userId: userId.toString(),
  };

  //   helpers
  const handleSelectCuota = (cuota: CreditoCuotaResponse) => {
    if (!cuota) return;

    const pendienteAlMomento =
      (parseFloat(cuota.montoTotal) || 0) -
      (parseFloat(cuota.montoPagado) || 0);

    setCreditoCuota(cuota);
    setOpenCuota(true);

    setPayload((prev) => ({
      ...prev,
      monto: pendienteAlMomento.toFixed(2),
      creditoId: credito.id.toString(),
      cuotaId: cuota.id.toString(),
    }));
  };

  const handleDesSelectCuota = () => {};

  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [confirmPayment, setOpenConfirmPayment] = useState<boolean>(false);

  const handleOpenPayment = () => setOpenPayment(!openPayment);
  const handleConfirmPayment = () => setOpenConfirmPayment(!confirmPayment);

  const submitPayment = useCreatePagoCuota();
  const submitDeletePayment = useDeletePayment();
  const [payload, setPayload] = useState<CreateCuotaPagoDto>(initialObject);
  const [confirmDeletePayment, setOpenConfirmDeletePayment] =
    useState<boolean>(false);

  const [deletePayload, setDeletePayload] = useState<DeletePagoDto | null>(
    null,
  );

  const pagos = credito.pagos;

  const handleSelectPaymentToDelete = (pagoId: number) => {
    setDeletePayload({
      pagoCuotaId: pagoId,
      userId: userId,
    });
    setOpenConfirmDeletePayment(true);
  };

  const handleSubmitDeletPayment = () => {
    if (!deletePayload?.pagoCuotaId) return;

    try {
      toast.promise(submitDeletePayment.mutateAsync(deletePayload), {
        loading: "Eliminando registro de pago...",
        success: () => {
          setOpenConfirmDeletePayment(false);
          return "Registro eliminado correctamente";
        },
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.log(error);
    }
  };

  type PayloadKeys = keyof CreateCuotaPagoDto;

  const handleChangeProperty = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setPayload((prev) => ({
      ...prev,
      [name as PayloadKeys]: value,
    }));
  };

  const clearData = () => {
    setOpenConfirmPayment(false);
    setOpenCuota(false);
    setCreditoCuota(null);
    setPayload(initialObject);
  };

  const handleSubmitPayment = async () => {
    try {
      await toast.promise(submitPayment.mutateAsync(payload), {
        loading: "Registrando...",
        success: "Pago registrado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      clearData();
    } catch (error) {
      console.error("Error al procesar pago:", error);
    }
  };

  console.log("credito cuota es: ", creditoCuota);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Crédito #{credito.id}</h1>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  estadoConfig.className,
                )}
              >
                {estadoConfig.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {credito.clienteNombre}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">
            {formattMonedaGT(credito.montoTotal)}
          </p>
          <p className="text-xs text-muted-foreground">Monto total</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progreso de pago</span>
          <span className="font-medium">{progreso.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(progreso, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pagado: {formattMonedaGT(totalPagado)}</span>
          <span>Pendiente: {formattMonedaGT(totalPendiente)}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
        <InfoItem
          icon={Banknote}
          label="Capital"
          value={formattMonedaGT(credito.montoCapital)}
        />

        <InfoItem
          icon={Banknote}
          label="Restante"
          value={formattMonedaGT(totalPendiente)}
        />

        <InfoItem
          icon={Percent}
          label="Interés"
          value={`${credito.interesPorcentaje}% (${credito.interesTipo === "FIJO" ? "Fijo" : "Sobre saldo"})`}
        />
        <InfoItem
          icon={Percent}
          label="Mora"
          value={`${credito.interesMoraPorcentaje}%`}
        />
        <InfoItem
          icon={Hash}
          label="Cuotas"
          value={`${cuotasPagadas}/${credito.plazoCuotas} pagadas`}
        />
        <InfoItem
          icon={Calendar}
          label="Frecuencia"
          value={
            credito.frecuencia === FrecuenciaPago.CUSTOM
              ? `Cada ${credito.intervaloDias} días`
              : frecuenciaLabels[credito.frecuencia]
          }
        />
        <InfoItem
          icon={Wallet}
          label="Cuota"
          value={formattMonedaGT(credito.montoCuota)}
        />
        <InfoItem
          icon={Calendar}
          label="Inicio"
          value={formattShortFecha(credito.fechaInicio)}
        />
        <InfoItem
          icon={Calendar}
          label="Fin estimado"
          value={formattShortFecha(credito.fechaFinEstimada)}
        />
        <InfoItem icon={User} label="Gestor" value={credito.usuarioNombre} />

        {credito.engancheMonto && (
          <InfoItem
            icon={Banknote}
            label="Enganche"
            value={formattMonedaGT(credito.engancheMonto)}
          />
        )}
        {credito.origenCredito && (
          <InfoItem
            icon={FileText}
            label="Origen"
            value={credito.origenCredito}
          />
        )}
      </div>

      {credito.observaciones && (
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Observaciones
              </p>
              <p className="text-sm">{credito.observaciones}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cuotas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Cuotas</h2>
          {cuotasVencidas > 0 && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {cuotasVencidas} vencida{cuotasVencidas > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 md:gap-4 py-2 px-3 bg-muted/50 text-xs text-muted-foreground font-medium">
            <span className="w-6">#</span>
            <span>Vencimiento</span>
            <span className="text-right">Total</span>
            <span className="text-right hidden md:block">Pagado</span>
            <span className="text-right">Pendiente</span>
            <span>Estado</span>
          </div>

          {/* Rows */}
          <div className="max-h-64 overflow-y-auto hover:cursor-pointer">
            {credito.cuotas.map((cuota) => (
              <CuotaRow
                handleDesSelectCuota={handleDesSelectCuota}
                handleSelectCuota={handleSelectCuota}
                key={cuota.id}
                cuota={cuota}
              />
            ))}
          </div>
        </div>
      </div>

      {openCuota ? (
        <CuotaCreditoDetail
          handleSubmitDeletPayment={handleSubmitDeletPayment}
          handleOpenPayment={handleOpenPayment}
          cuota={creditoCuota}
        />
      ) : null}

      {/* Pagos Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        {pagos.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 text-center">
            <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay pagos registrados
            </p>
          </div>
        ) : (
          pagos.map((pago) => (
            <PagoHistorialItem
              key={pago.id}
              pago={pago}
              onDelete={handleSelectPaymentToDelete}
              isDeleting={submitDeletePayment.isPending}
            />
          ))
        )}
      </div>

      <PagoCuotaDialog
        payload={payload}
        handleChangeProperty={handleChangeProperty}
        handleConfirmPayment={handleConfirmPayment}
        cuota={creditoCuota}
        onConfirmPayment={() => console.log()}
        onOpenChange={handleOpenPayment}
        open={openPayment}
      />

      <AdvancedDialogCRM
        open={confirmPayment}
        onOpenChange={setOpenConfirmPayment}
        title={`Confirmar pago de cuota`}
        description={`Se procederá a pagar la siguiente cuota: #${creditoCuota?.id}`}
        type="confirmation"
        cancelButton={{
          label: "Cancelar",
          disabled: submitPayment.isPending,
          onClick: () => clearData(),
          variant: "destructive",
        }}
        confirmButton={{
          label: "Confirmar pago",
          disabled: submitPayment.isPending,
          onClick: handleSubmitPayment,
          loading: submitPayment.isPending,
          loadingText: "Registrando pago...",
        }}
      />

      <AdvancedDialogCRM
        open={confirmDeletePayment}
        onOpenChange={setOpenConfirmDeletePayment}
        title="Eliminar Pago"
        description="¿Estás seguro de que deseas eliminar este registro de pago? Esta acción revertirá el saldo de la cuota y no se puede deshacer."
        type="destructive"
        cancelButton={{
          label: "Cancelar",
          disabled: submitDeletePayment.isPending,
          onClick: () => setOpenConfirmDeletePayment(false),
          variant: "outline",
        }}
        confirmButton={{
          label: "Sí, eliminar pago",
          disabled: submitDeletePayment.isPending,
          onClick: handleSubmitDeletPayment,
          loading: submitDeletePayment.isPending,
          loadingText: "Eliminando...",
          variant: "destructive",
        }}
      />
    </div>
  );
}
export default CreditoDetails;
