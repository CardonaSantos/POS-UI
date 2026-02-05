import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";
import { Power, PowerOff, Router, Signal, Network } from "lucide-react";
import {
  useMikrotikActivar,
  useMikrotikSuspend,
} from "@/Crm/CrmHooks/hooks/mikrotik-actions/useMikrotikActions";
import { suspendCustomerDto } from "@/Crm/features/mikrotik-actions-interfaces/mikrotik-actions.dto";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

interface CustomerNetworkControlProps {
  cliente: ClienteDetailsDto;
}

function CustomerNetworkControl({ cliente }: CustomerNetworkControlProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const [password, setPassword] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const suspendCustomer = useMikrotikSuspend(cliente.id);
  const activateCustomer = useMikrotikActivar(cliente.id);
  // DERIVADOS
  const estadoMk = cliente.estadoServicioMikrotik;
  const hasMikrotik = !!cliente.mikrotik;
  const hasIp = !!cliente.IP?.direccion;
  const isActivo = estadoMk === "ACTIVO";
  const isSuspendido = estadoMk === "SUSPENDIDO";
  const isPendiente = estadoMk === "PENDIENTE_APLICAR";
  const isError = estadoMk === "ERROR";
  const isSinMk = estadoMk === "SIN_MIKROTIK";

  const getNextAction = (): NextAction => {
    if (isActivo) return "SUSPENDER";
    if (isSuspendido) return "ACTIVAR";
    return null;
  };

  const nextAction = getNextAction();

  const handleConfirmAction = async () => {
    if (!nextAction) return;

    const dto: suspendCustomerDto = {
      clienteId: cliente.id,
      password,
      userId,
    };

    const action =
      nextAction === "SUSPENDER" ? suspendCustomer : activateCustomer;

    const successMessage =
      nextAction === "SUSPENDER"
        ? "Cliente suspendido exitosamente"
        : "Cliente activado exitosamente";

    await toast.promise(action.mutateAsync(dto), {
      loading:
        nextAction === "SUSPENDER"
          ? "Suspendiendo servicio..."
          : "Activando servicio...",
      success: () => {
        setPassword("");
        setOpenConfirm(false);
        return successMessage;
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const handleToggleRequest = () => {
    if (!nextAction) {
      toast.error("El estado actual no permite esta acción");
      return;
    }
    setOpenConfirm(true);
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    setPassword("");
  };

  const statusLabel = isSinMk
    ? "Sin Mikrotik asignado"
    : isPendiente
      ? "Aplicando cambios"
      : isError
        ? "Error de sincronización"
        : isActivo
          ? "Servicio activo"
          : "Servicio suspendido";

  type NextAction = "SUSPENDER" | "ACTIVAR" | null;

  const dialogTitle =
    nextAction === "SUSPENDER"
      ? "Suspensión de servicio"
      : nextAction === "ACTIVAR"
        ? "Activación de servicio"
        : "";
  const dialogDescription =
    nextAction === "SUSPENDER"
      ? "¿Está seguro de suspender el servicio de este cliente?"
      : nextAction === "ACTIVAR"
        ? "¿Está seguro de activar el servicio de este cliente?"
        : "";
  const loadingText =
    nextAction === "SUSPENDER"
      ? "Suspendiendo servicio..."
      : "Activando servicio...";

  const statusIcon = !hasMikrotik ? (
    <Router className="h-4 w-4 text-muted-foreground" />
  ) : isPendiente ? (
    <Power className="h-4 w-4 text-muted-foreground animate-pulse" />
  ) : isError ? (
    <PowerOff className="h-4 w-4 text-orange-500" />
  ) : isActivo ? (
    <Power className="h-4 w-4 text-emerald-500" />
  ) : (
    <PowerOff className="h-4 w-4 text-destructive" />
  );

  return (
    <div className="space-y-4">
      {/* GRID RESPONSIVO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna izquierda: estado + acciones rápidas */}
        <div className="space-y-4">
          <div className="space-y-2 rounded-md border bg-muted/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  {statusIcon}
                  {statusLabel}
                </Label>
              </div>
              <Switch
                disabled={
                  !hasMikrotik ||
                  !hasIp ||
                  isPendiente ||
                  isError ||
                  suspendCustomer.isPending ||
                  activateCustomer.isPending
                }
                checked={isActivo}
                onCheckedChange={handleToggleRequest}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/40 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Herramientas rápidas de diagnóstico
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 justify-start sm:justify-center"
              >
                <Signal className="h-4 w-4 mr-2" />
                Ping a IP del cliente
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 justify-start sm:justify-center"
                // onClick={() => ...}
              >
                <Network className="h-4 w-4 mr-2" />
                Ping a gateway
              </Button>
            </div>
          </div>
        </div>

        {/* Columna derecha: info Mikrotik / queue */}
        <div className="space-y-4">
          <div className="space-y-2 rounded-md border bg-muted/40 p-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Router className="h-4 w-4" />
              Router / Mikrotik asignado
            </Label>
            <Select disabled>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue
                  placeholder={cliente.mikrotik?.nombre ?? "NO ASIGNADO"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mikrotiks disponibles</SelectLabel>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* DIALOGO DE CONFIRMACIÓN */}
      <AdvancedDialogCRM
        type="warning"
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={dialogTitle}
        description={dialogDescription}
        confirmButton={{
          label: "Sí, continuar",
          onClick: handleConfirmAction,
          loadingText,
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: handleCancel,
        }}
      >
        <div className="space-y-2">
          <Label className="text-xs">
            Por seguridad, ingrese su contraseña de usuario para continuar.
          </Label>
          <Input
            type="password"
            placeholder="Contraseña de usuario"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </AdvancedDialogCRM>
    </div>
  );
}

export default CustomerNetworkControl;
