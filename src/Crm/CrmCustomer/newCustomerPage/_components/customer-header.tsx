"use client";

import {
  FilePenLine,
  FilePlus,
  Printer,
  Ticket,
  User,
  UserCog,
} from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuSeparator,
  AppDropdownMenuTrigger,
} from "@/components/app/primitives/app-dropdown-menu";
import { AppInline } from "@/components/app/primitives/app-inline";
import {
  ClienteDetailsDto,
  EstadoCliente,
  EstadoCobranzaCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import {
  getEstadoTone,
  getEstadoToneCobranza,
} from "@/Crm/CrmCustomers/_components/customer-table.columns";
import {
  ESTADO_CLIENTE_COBRANZA_LABELS,
  ESTADO_CLIENTE_LABELS,
} from "@/Crm/CrmCustomers/customer-table.constants";

interface PlantillasInterface {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
}

interface CustomerHeaderProps {
  cliente: ClienteDetailsDto;
  plantillas: PlantillasInterface[];
  setOpenCreateContrato: (open: boolean) => void;
}

export function CustomerHeader({
  cliente,
  plantillas,
  setOpenCreateContrato,
}: CustomerHeaderProps) {
  const nombreCompleto = `${cliente.nombre ?? ""} ${
    cliente.apellidos ?? ""
  }`.trim();

  const estadoOperativo = cliente.estadoCliente as EstadoCliente;
  const estadoCobranza = cliente.estadoCobranza as EstadoCobranzaCliente;
  const hasContrato = Boolean(cliente.contratoServicioInternet?.id);

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="overflow-visible"
    >
      <div
        className={cn(
          "flex w-full min-w-0 flex-col gap-2 px-1 py-1",
          "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <AppInline gap="xs" align="center" className="min-w-0">
          <User size={16} className="shrink-0" />

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold leading-tight">
              {nombreCompleto || "Cliente sin nombre"}
            </h2>

            <AppInline gap="xs" align="center" wrap>
              <span className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
                #{cliente.id}
              </span>

              <AppBadge
                tone={getEstadoToneCobranza(estadoCobranza)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {ESTADO_CLIENTE_COBRANZA_LABELS[estadoCobranza] ??
                  estadoCobranza}
              </AppBadge>

              <AppBadge
                tone={getEstadoTone(estadoOperativo)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {ESTADO_CLIENTE_LABELS[estadoOperativo] ?? estadoOperativo}
              </AppBadge>
            </AppInline>
          </div>
        </AppInline>

        <div
          className={cn(
            "flex shrink-0 flex-wrap items-center justify-start gap-3",
            "sm:justify-end",
            "rounded-[var(--app-radius-md)]",
            "border border-[hsl(var(--app-border))]",
            "bg-[hsl(var(--app-muted)/0.22)]",
            "px-1.5 py-1",
          )}
        >
          {hasContrato ? (
            <AppDropdownMenu>
              <AppDropdownMenuTrigger asChild>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  width="auto"
                  leftIcon={<FilePenLine size={13} />}
                  className="h-7"
                >
                  Contrato
                </AppButton>
              </AppDropdownMenuTrigger>

              <AppDropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                width="md"
                size="xs"
                className="z-[120]"
              >
                {plantillas.length ? (
                  <>
                    <AppDropdownMenuSeparator />

                    {plantillas.map((plantilla) => (
                      <AppDropdownMenuItem key={plantilla.id}>
                        <Link
                          to={`/crm/contrato/${
                            cliente.contratoServicioInternet!.id
                          }/vista?plantilla=${plantilla.id}`}
                          className="flex w-full items-center gap-2"
                        >
                          <Printer size={13} className="shrink-0" />
                          <span className="truncate">{plantilla.nombre}</span>
                        </Link>
                      </AppDropdownMenuItem>
                    ))}
                  </>
                ) : (
                  <div className="px-2 py-1.5 text-xs italic text-[hsl(var(--app-muted-foreground))]">
                    Sin plantillas disponibles
                  </div>
                )}
              </AppDropdownMenuContent>
            </AppDropdownMenu>
          ) : (
            <AppButton
              type="button"
              variant="ghost"
              size="xs"
              width="auto"
              leftIcon={<FilePlus size={13} />}
              className="h-7"
              onClick={() => setOpenCreateContrato(true)}
            >
              Contrato
            </AppButton>
          )}

          <AppButton
            asChild
            type="button"
            variant="ghost"
            size="xs"
            width="auto"
            leftIcon={<Ticket size={13} />}
            className="h-7"
          >
            <Link to="/crm/tickets">Ticket</Link>
          </AppButton>

          <AppButton
            asChild
            type="button"
            variant="ghost"
            size="xs"
            width="auto"
            leftIcon={<UserCog size={13} />}
            className="h-7"
          >
            <Link to={`/crm/cliente-edicion/${cliente.id}`}>Editar</Link>
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
