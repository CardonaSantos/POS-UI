import { ArrowLeft, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { EstadoCuentaPppoe } from "@/Crm/features/instalaciones/enums";

import type { PppoeCuentaDetalle } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

type PppoeCuentaDetailHeaderProps = {
  cuenta: PppoeCuentaDetalle;
};

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function getEstadoCuentaTone(estado: EstadoCuentaPppoe): AppBadgeTone {
  switch (estado) {
    case EstadoCuentaPppoe.ACTIVA:
      return "success";

    case EstadoCuentaPppoe.SUSPENDIDA:
      return "warning";

    case EstadoCuentaPppoe.ERROR:
      return "danger";

    case EstadoCuentaPppoe.PENDIENTE_CREACION:
    case EstadoCuentaPppoe.PENDIENTE_ACTIVACION:
      return "info";

    case EstadoCuentaPppoe.EN_INSTALACION:
    case EstadoCuentaPppoe.EN_ACTIVACION:
      return "primary";

    case EstadoCuentaPppoe.EN_SUSPENSION:
    case EstadoCuentaPppoe.EN_DESINSTALACION:
      return "warning";

    case EstadoCuentaPppoe.ELIMINADA:
    case EstadoCuentaPppoe.CANCELADA:
    default:
      return "neutral";
  }
}

function getClienteNombre(cuenta: PppoeCuentaDetalle): string {
  return [cuenta.cliente.nombre, cuenta.cliente.apellidos]
    .filter(Boolean)
    .join(" ");
}

export function PppoeCuentaDetailHeader({
  cuenta,
}: PppoeCuentaDetailHeaderProps) {
  const clienteNombre = getClienteNombre(cuenta);

  return (
    <AppStack gap="sm">
      <AppInline
        justify="between"
        align="start"
        collapseBelow="sm"
        gap="sm"
        fullWidth
      >
        <AppStack gap="xs">
          <div className="min-w-0 pl-8 sm:pl-0">
            <p className="truncate text-sm font-medium">
              {clienteNombre || "Cliente sin nombre"}
            </p>

            <p className={`truncate text-xs ${mutedTextClass}`}>
              Usuario PPPoE:{" "}
              <span className="font-medium tabular-nums">{cuenta.usuario}</span>
              {cuenta.servicioInternet
                ? ` · ${cuenta.servicioInternet.nombre}`
                : ""}
              {cuenta.router ? ` · ${cuenta.router.nombre}` : ""}
            </p>
          </div>
        </AppStack>

        <AppInline gap="xs" wrap>
          <AppButton
            asChild
            variant="outline"
            size="sm"
            leftIcon={<UserRound size={14} aria-hidden="true" />}
          >
            <Link to={`/crm/cliente/${cuenta.cliente.id}/?tab=resumen`}>
              Ver cliente
            </Link>
          </AppButton>
        </AppInline>
      </AppInline>
    </AppStack>
  );
}
