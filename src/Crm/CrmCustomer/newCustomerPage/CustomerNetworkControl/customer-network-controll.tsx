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
// import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { Power, PowerOff, Router, Signal, Network } from "lucide-react";

interface CustomerNetworkControlProps {
  cliente: ClienteDetailsDto;
}

function CustomerNetworkControl({ cliente }: CustomerNetworkControlProps) {
  // const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const [password, setPassword] = useState("");
  // Estado real del servicio
  const [isServiceActive, setIsServiceActive] = useState<boolean>(true);
  // Estado solicitado (hasta que confirme)
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleToggleRequest = (checked: boolean) => {
    // NO cambiamos el estado real, solo guardamos lo solicitado y abrimos el diálogo
    setPendingState(checked);
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingState === null) return;

    // Aquí luego llamarás a tu API / servicio Mikrotik, usando:
    // cliente.id, userId, pendingState, password, etc.
    // Por ahora solo actualizamos el estado local.
    setIsServiceActive(pendingState);
    setPassword("");
    setPendingState(null);
    setOpenConfirm(false);
  };

  const handleCancel = () => {
    setPendingState(null);
    setOpenConfirm(false);
  };

  const isSuspension = pendingState === false;
  const dialogTitle = isSuspension
    ? "Suspensión de servicio"
    : "Activación de servicio";

  const dialogDescription = isSuspension
    ? "¿Está seguro de suspender el servicio de este cliente? "
    : "¿Está seguro de activar el servicio de este cliente?";

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
                  {isServiceActive ? "Servicio activo" : "Servicio suspendido"}
                  {isServiceActive ? (
                    <Power className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <PowerOff className="h-4 w-4 text-destructive" />
                  )}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isServiceActive ? "Suspender" : "Activar"} el servicio
                </p>
              </div>

              <Switch
                checked={isServiceActive}
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
                // onClick={() => ...}
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
          onClick: handleConfirm,
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
