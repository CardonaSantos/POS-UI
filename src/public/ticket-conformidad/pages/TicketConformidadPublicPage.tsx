import { useParams } from "react-router-dom";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppCard } from "@/components/app/primitives/app-card";

import { TicketConformidadPublicShell } from "../components/TicketConformidadPublicShell";
import { PublicContent } from "../components/PublicContent";

import { useTicketConformidadPublica } from "../hooks/tickets-conformidad/use-ticket-conformidad-public";

import { TicketConformidadPublicResultado } from "../types/conformidad-types.public";

export default function TicketConformidadPublicPage() {
  const { token } = useParams<{
    token: string;
  }>();

  const query = useTicketConformidadPublica(token);

  if (!token) {
    return (
      <TicketConformidadPublicShell>
        <AppAlert tone="danger" title="Enlace no válido">
          El enlace utilizado no contiene una solicitud de conformidad válida.
        </AppAlert>
      </TicketConformidadPublicShell>
    );
  }

  if (query.isLoading) {
    return (
      <TicketConformidadPublicShell>
        <AppCard>
          <div
            className="py-8 text-center text-sm text-muted-foreground"
            role="status"
          >
            Validando enlace...
          </div>
        </AppCard>
      </TicketConformidadPublicShell>
    );
  }

  if (query.isError || !query.data) {
    return (
      <TicketConformidadPublicShell>
        <AppAlert tone="danger" title="Enlace no disponible">
          Este enlace pudo haber expirado, sido utilizado o dejado de estar
          disponible. Solicite uno nuevo al personal encargado.
        </AppAlert>
      </TicketConformidadPublicShell>
    );
  }

  const data = query.data;

  if (
    data.conformidad.resultado !== TicketConformidadPublicResultado.PENDIENTE
  ) {
    return (
      <TicketConformidadPublicShell>
        <AppAlert tone="info" title="Esta solicitud ya fue respondida">
          No es necesario realizar ninguna acción adicional.
        </AppAlert>
      </TicketConformidadPublicShell>
    );
  }

  return <PublicContent token={token} data={data} />;
}
