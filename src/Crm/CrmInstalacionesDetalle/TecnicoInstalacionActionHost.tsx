import { memo } from "react";

import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";

import type { InstalacionDetalleActionRequest } from "./tecnico-instalacion-detalle.utils";

import { ActionContractWarningDialog } from "./actions/action-contract-warning-dialog";
import { CancelarInstalacionDialog } from "./actions/cancelar-instalacion-dialog";
import { CompletarInstalacionDialog } from "./actions/completar-instalacion-dialog";
import { IniciarInstalacionDialog } from "./actions/iniciar-instalacion-dialog";
import { ReintentarPrealtaDialog } from "./actions/reintentar-prealta-dialog";
import { ReprogramarInstalacionDialog } from "./actions/reprogramar-instalacion-dialog";
import { SubirEvidenciaInstalacionDialog } from "./actions/subir-evidencia-dialog";

type TecnicoInstalacionActionHostProps = {
  detalle: DetalleInstalacionTecnicaResponse;

  request: InstalacionDetalleActionRequest | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void | Promise<void>;
};

export const TecnicoInstalacionActionHost = memo(
  function TecnicoInstalacionActionHost({
    detalle,
    request,
    open,
    onOpenChange,
    onCompleted,
  }: TecnicoInstalacionActionHostProps) {
    if (!request || !open) {
      return null;
    }

    const common = {
      instalacionId: request.instalacionId,

      open,

      onOpenChange,

      onCompleted,
    };

    switch (request.action) {
      case "reprogramar":
        return <ReprogramarInstalacionDialog {...common} />;

      case "iniciar":
        return <IniciarInstalacionDialog {...common} />;

      case "completar":
        return <CompletarInstalacionDialog {...common} />;

      case "cancelar":
        return <CancelarInstalacionDialog {...common} />;

      case "subirEvidencia":
        return (
          <SubirEvidenciaInstalacionDialog
            {...common}
            empresaId={detalle.empresaId}
          />
        );

      /**
       * La prealta pertenece todavía al flujo
       * operativo de la instalación.
       *
       * Puede fallar antes de que exista una
       * ClientePppoeCuenta, por lo que no puede
       * delegarse siempre al detalle de cuenta.
       */
      case "reintentarPrealta": {
        if (!request.accesoInternetId) {
          return (
            <ActionContractWarningDialog
              open={open}
              onOpenChange={onOpenChange}
              title="No se puede reintentar"
              description="La acción no recibió el acceso de internet que debe recuperarse."
            />
          );
        }

        const acceso = detalle.accesos.find(
          (item) => item.accesoInternetId === request.accesoInternetId,
        );

        const mikrotikRouterId = acceso?.cuentaPppoe?.mikrotikRouterId ?? null;

        if (!mikrotikRouterId) {
          return (
            <ActionContractWarningDialog
              open={open}
              onOpenChange={onOpenChange}
              title="Router no disponible"
              description="El detalle no devuelve un MikroTik para este acceso. El presenter debe incluirlo aun cuando la cuenta PPPoE todavía no exista."
            />
          );
        }

        return (
          <ReintentarPrealtaDialog
            {...common}
            accesoInternetId={request.accesoInternetId}
            mikrotikRouterId={mikrotikRouterId}
          />
        );
      }

      default:
        return null;
    }
  },
);
