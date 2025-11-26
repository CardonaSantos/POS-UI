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
} from "@/Crm/CrmRutas/hooks/mikrotik-actions/useMikrotikActions";
import { suspendCustomerDto } from "@/Crm/features/mikrotik-actions-interfaces/mikrotik-actions.dto";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

interface CustomerNetworkControlProps {
  cliente: ClienteDetailsDto;
}

function CustomerNetworkControl({ cliente }: CustomerNetworkControlProps) {
  console.log("cliente es: ", cliente);
  const hasMikrotik = !!cliente.mikrotik; // hay router asignado
  const isServiceActive =
    hasMikrotik && cliente.estadoServicioMikrotik === "ACTIVO";

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const [password, setPassword] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const suspendCustomer = useMikrotikSuspend(cliente.id);
  const activateCustomer = useMikrotikActivar(cliente.id);

  const handleSuspender = async () => {
    const esSuspension = isServiceActive;
    const dto: suspendCustomerDto = {
      clienteId: cliente.id,
      password,
      userId,
    };

    const action = esSuspension ? suspendCustomer : activateCustomer;
    const successMessage = esSuspension
      ? "Cliente suspendido exitosamente"
      : "Cliente activado exitosamente";

    await toast.promise(action.mutateAsync(dto), {
      loading: esSuspension
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
    setOpenConfirm(true);
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    setPassword("");
  };

  const isSuspension = isServiceActive;
  const dialogTitle = isSuspension
    ? "Suspensión de servicio"
    : "Activación de servicio";

  const dialogDescription = isSuspension
    ? "¿Está seguro de suspender el servicio de este cliente? "
    : "¿Está seguro de activar el servicio de este cliente?";

  const switchDisabled =
    !hasMikrotik || suspendCustomer.isPending || activateCustomer.isPending;

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
                  {!hasMikrotik
                    ? "Sin Mikrotik asignado"
                    : isServiceActive
                    ? "Servicio activo"
                    : "Servicio suspendido"}

                  {!hasMikrotik ? (
                    <Router className="h-4 w-4 text-muted-foreground" />
                  ) : isServiceActive ? (
                    <Power className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <PowerOff className="h-4 w-4 text-destructive" />
                  )}
                </Label>

                <p className="text-xs text-muted-foreground">
                  {!hasMikrotik
                    ? "Asigne un Mikrotik para controlar el servicio."
                    : isServiceActive
                    ? "Suspender el servicio"
                    : "Activar el servicio"}
                </p>
              </div>
              <Switch
                disabled={switchDisabled}
                checked={isServiceActive} // SOLO servidor
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
          onClick: handleSuspender,
          loadingText: isSuspension ? "Suspendiendo..." : "Activando...",
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: handleCancel,
          loadingText: isSuspension ? "Suspendiendo..." : "Activando...",
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
