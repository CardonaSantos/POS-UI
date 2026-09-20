import { AutorizacionDesinstalacionActionRequest } from "../actions/autorizacion-action.types";
import { AprobarAutorizacionDesinstalacionDialog } from "./aprobar-autorizacion-dialog";
import { RechazarAutorizacionDesinstalacionDialog } from "./rechazar-autorizacion-dialog";

type Props = {
  request: AutorizacionDesinstalacionActionRequest | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void;
};

export function AutorizacionDesinstalacionActionHost({
  request,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  if (!request) {
    return null;
  }

  const item = request.item;

  const clienteNombre = [
    item.desinstalacion.cliente.nombre,

    item.desinstalacion.cliente.apellidos,
  ]
    .filter(Boolean)
    .join(" ");

  const common = {
    autorizacionId: item.autorizacion.id,

    desinstalacionId: item.desinstalacion.id,

    clienteNombre,

    open,

    onOpenChange,

    onCompleted,
  };

  if (request.action === "aprobar") {
    return <AprobarAutorizacionDesinstalacionDialog {...common} />;
  }

  return <RechazarAutorizacionDesinstalacionDialog {...common} />;
}
