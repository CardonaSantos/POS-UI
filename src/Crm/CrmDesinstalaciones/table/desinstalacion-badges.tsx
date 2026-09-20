import { memo } from "react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import {
  EstadoAutorizacionDesinstalacion,
  EstadoDesinstalacionCliente,
  EstadoOperacionPppoe,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";
import {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
} from "@/Crm/features/instalaciones/enums";

type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function humanizeEnum(value: string) {
  const normalized = value.replace("_", " ").toLocaleLowerCase("es-GT");

  return normalized.charAt(0).toLocaleUpperCase("es-GT") + normalized.slice(1);
}

function getEstadoDesinstalacionTone(
  estado: EstadoDesinstalacionCliente,
): BadgeTone {
  switch (estado) {
    case EstadoDesinstalacionCliente.PROGRAMADA:
      return "info";

    case EstadoDesinstalacionCliente.EN_PROCESO:
      return "warning";

    case EstadoDesinstalacionCliente.COMPLETADA:
      return "success";

    case EstadoDesinstalacionCliente.CANCELADA:
      return "neutral";

    case EstadoDesinstalacionCliente.FALLIDA:
      return "danger";
  }
}

function getAutorizacionTone(
  estado: EstadoAutorizacionDesinstalacion,
): BadgeTone {
  switch (estado) {
    case EstadoAutorizacionDesinstalacion.PENDIENTE:
      return "warning";

    case EstadoAutorizacionDesinstalacion.APROBADA:
      return "success";

    case EstadoAutorizacionDesinstalacion.RECHAZADA:
      return "danger";

    case EstadoAutorizacionDesinstalacion.ANULADA:
      return "neutral";
  }
}

function getCuentaPppoeTone(estado: EstadoCuentaPppoe): BadgeTone {
  switch (estado) {
    case EstadoCuentaPppoe.ACTIVA:
      return "success";

    case EstadoCuentaPppoe.SUSPENDIDA:
      return "warning";

    case EstadoCuentaPppoe.ELIMINADA:
    case EstadoCuentaPppoe.CANCELADA:
      return "neutral";

    case EstadoCuentaPppoe.ERROR:
      return "danger";

    case EstadoCuentaPppoe.EN_SUSPENSION:
    case EstadoCuentaPppoe.EN_DESINSTALACION:
    case EstadoCuentaPppoe.EN_ACTIVACION:
    case EstadoCuentaPppoe.EN_INSTALACION:
      return "info";

    default:
      return "neutral";
  }
}

function getAccesoTone(estado: EstadoAccesoInternet): BadgeTone {
  switch (estado) {
    case EstadoAccesoInternet.ACTIVO:
      return "success";

    case EstadoAccesoInternet.SUSPENDIDO:
      return "warning";

    case EstadoAccesoInternet.BAJA:
      return "neutral";

    case EstadoAccesoInternet.CONFIGURANDO:
      return "info";

    default:
      return "neutral";
  }
}

function getOperacionTone(estado: EstadoOperacionPppoe): BadgeTone {
  switch (estado) {
    case EstadoOperacionPppoe.EXITOSA:
      return "success";

    case EstadoOperacionPppoe.EJECUTANDO:
    case EstadoOperacionPppoe.AUTORIZADA:
      return "info";

    case EstadoOperacionPppoe.PENDIENTE:
    case EstadoOperacionPppoe.PARCIAL:
      return "warning";

    case EstadoOperacionPppoe.FALLIDA:
      return "danger";

    case EstadoOperacionPppoe.CANCELADA:
      return "neutral";
  }
}

export const DesinstalacionEstadoBadge = memo(
  function DesinstalacionEstadoBadge({
    estado,
  }: {
    estado: EstadoDesinstalacionCliente;
  }) {
    return (
      <AppBadge
        tone={getEstadoDesinstalacionTone(estado)}
        appearance="soft"
        size="xs"
        radius="full"
      >
        {humanizeEnum(estado)}
      </AppBadge>
    );
  },
);

export const DesinstalacionAutorizacionBadge = memo(
  function DesinstalacionAutorizacionBadge({
    estado,
  }: {
    estado: EstadoAutorizacionDesinstalacion;
  }) {
    return (
      <AppBadge
        tone={getAutorizacionTone(estado)}
        appearance="soft"
        size="xs"
        radius="full"
      >
        {humanizeEnum(estado)}
      </AppBadge>
    );
  },
);

export const DesinstalacionCuentaPppoeBadge = memo(
  function DesinstalacionCuentaPppoeBadge({
    estado,
  }: {
    estado: EstadoCuentaPppoe;
  }) {
    return (
      <AppBadge
        tone={getCuentaPppoeTone(estado)}
        appearance="soft"
        size="xs"
        radius="full"
      >
        {humanizeEnum(estado)}
      </AppBadge>
    );
  },
);

export const DesinstalacionAccesoBadge = memo(
  function DesinstalacionAccesoBadge({
    estado,
  }: {
    estado: EstadoAccesoInternet;
  }) {
    return (
      <AppBadge
        tone={getAccesoTone(estado)}
        appearance="soft"
        size="xs"
        radius="full"
      >
        {humanizeEnum(estado)}
      </AppBadge>
    );
  },
);

export const DesinstalacionOperacionBadge = memo(
  function DesinstalacionOperacionBadge({
    estado,
  }: {
    estado: EstadoOperacionPppoe;
  }) {
    return (
      <AppBadge
        tone={getOperacionTone(estado)}
        appearance="soft"
        size="xs"
        radius="full"
      >
        {humanizeEnum(estado)}
      </AppBadge>
    );
  },
);
