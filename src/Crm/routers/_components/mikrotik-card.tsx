import type { ReactNode } from "react";

import {
  Cable,
  CalendarClock,
  Edit,
  Globe,
  Network,
  PowerOff,
  RotateCcw,
  Server,
  Terminal,
  User,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";

import { AppButton } from "@/components/app/primitives/app-button";

import { AppCard } from "@/components/app/primitives/app-card";

import { AppGrid } from "@/components/app/primitives/app-grid";

import { AppInline } from "@/components/app/primitives/app-inline";

import { AppStack } from "@/components/app/primitives/app-stack";

import type { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";

import { formattShortFecha } from "@/utils/formattFechas";

interface MkProps {
  mk: MikrotikRoutersResponse;

  handleSelectToEdit: (mk: MikrotikRoutersResponse) => void;

  handleOpenStatusChange: (mk: MikrotikRoutersResponse) => void;
}

interface RouterInfoProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  mono?: boolean;
}

function RouterInfo({ label, value, icon, mono = false }: RouterInfoProps) {
  return (
    <div className="min-w-0">
      <AppInline align="center" gap="xs" wrap={false}>
        {icon ? (
          <span
            aria-hidden="true"
            className="shrink-0 text-[hsl(var(--app-muted-foreground))]"
          >
            {icon}
          </span>
        ) : null}

        <span className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
          {label}
        </span>
      </AppInline>

      <div
        className={
          mono
            ? "mt-1 truncate font-mono text-xs font-medium"
            : "mt-1 truncate text-xs font-medium"
        }
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function MikroTikCard({
  mk,
  handleSelectToEdit,
  handleOpenStatusChange,
}: MkProps) {
  const createdAt = mk.creadoEn
    ? formattShortFecha(mk.creadoEn)
    : "Sin registrar";

  const updatedAt = mk.actualizadoEn
    ? formattShortFecha(mk.actualizadoEn)
    : "Sin registrar";

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      shadow="xs"
      title={mk.nombre || `Router MikroTik #${mk.id}`}
      description={mk.descripcion?.trim() || "Sin descripción administrativa."}
      icon={<Server aria-hidden="true" />}
      action={
        <AppBadge
          tone={mk.activo ? "success" : "danger"}
          appearance="soft"
          size="xs"
          radius="full"
          dot
          dotPulse={mk.activo}
        >
          {mk.activo ? "Activo" : "Retirado"}
        </AppBadge>
      }
      headerDivider
      footerDivider
      footerAlign="right"
      footer={
        <AppInline justify="end" align="center" gap="xs" wrap fullWidth>
          <AppButton
            type="button"
            variant="outline"
            size="xs"
            leftIcon={
              mk.activo ? (
                <PowerOff size={13} aria-hidden="true" />
              ) : (
                <RotateCcw size={13} aria-hidden="true" />
              )
            }
            onClick={() => handleOpenStatusChange(mk)}
          >
            {mk.activo ? "Retirar" : "Reactivar"}
          </AppButton>

          <AppButton
            type="button"
            size="xs"
            variant={mk.activo ? "primary" : "outline"}
            leftIcon={<Edit size={13} aria-hidden="true" />}
            disabled={!mk.activo}
            onClick={() => handleSelectToEdit(mk)}
            title={
              mk.activo
                ? "Editar router"
                : "Reactiva el router antes de editarlo"
            }
          >
            Editar
          </AppButton>
        </AppInline>
      }
    >
      <AppStack gap="sm">
        {/* ============================== */}
        {/* CONEXIÓN */}
        {/* ============================== */}

        <section>
          <AppInline align="center" gap="xs" wrap={false}>
            <Network size={14} aria-hidden="true" />

            <p className="text-xs font-semibold">Conexión</p>
          </AppInline>

          <AppGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            gap="sm"
            className="mt-3"
          >
            <RouterInfo
              label="Host"
              value={mk.host || "Sin configurar"}
              icon={<Globe size={13} />}
              mono
            />

            <RouterInfo
              label="Puerto SSH"
              value={mk.sshPort}
              icon={<Terminal size={13} />}
              mono
            />

            <RouterInfo
              label="Usuario SSH"
              value="*****"
              icon={<User size={13} />}
              mono
            />

            <RouterInfo
              label="OLT asignada"
              value={mk.oltId ? `OLT #${mk.oltId}` : "Sin asignar"}
              icon={<Cable size={13} />}
            />
          </AppGrid>
        </section>

        {/* ============================== */}
        {/* METADATOS */}
        {/* ============================== */}

        <section className="border-t border-[hsl(var(--app-border))] pt-3">
          <AppInline align="center" gap="xs" wrap={false}>
            <CalendarClock size={14} aria-hidden="true" />

            <p className="text-xs font-semibold">Registro</p>
          </AppInline>

          <AppGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            gap="sm"
            className="mt-3"
          >
            <RouterInfo label="Creado" value={createdAt} />

            <RouterInfo label="Última actualización" value={updatedAt} />
          </AppGrid>
        </section>

        <AppInline
          justify="between"
          align="center"
          gap="xs"
          wrap
          fullWidth
          className="border-t border-[hsl(var(--app-border))] pt-3"
        >
          <span className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
            Router #{mk.id}
          </span>

          <AppBadge
            tone={mk.activo ? "neutral" : "danger"}
            appearance="outline"
            size="xs"
            radius="full"
          >
            {mk.activo ? "SSH" : "FUERA DE SERVICIO"}
          </AppBadge>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

export default MikroTikCard;
