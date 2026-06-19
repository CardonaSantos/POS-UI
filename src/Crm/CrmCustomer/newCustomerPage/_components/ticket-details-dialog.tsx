"use client";

import * as React from "react";
import { Calendar, Hash, MessageSquare, Tag, User, Wrench } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { TicketSoporte } from "@/Crm/features/cliente-interfaces/cliente-types";

import {
  formatTicketDate,
  TicketEstadoBadge,
  TicketPrioridadBadge,
} from "./helpers-tickets";

interface TicketDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TicketSoporte | null;
}

function hasValue(value: React.ReactNode) {
  return value !== null && value !== undefined && value !== "";
}

function DetailItem({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-[var(--app-radius-md)]",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.18)]",
        "px-3 py-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AppInline gap="xs" align="center" className="mb-1">
        {icon ? (
          <span className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {icon}
          </span>
        ) : null}

        <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </AppInline>

      <div className="min-w-0 break-words text-xs font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
        {hasValue(value) ? (
          value
        ) : (
          <span className="italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            N/A
          </span>
        )}
      </div>
    </div>
  );
}

function BadgeList({
  items,
  tone = "neutral",
}: {
  items: Array<{ id: number; nombre: string }>;
  tone?: React.ComponentProps<typeof AppBadge>["tone"];
}) {
  if (!items.length) return null;

  return (
    <AppInline gap="xs" align="center" wrap>
      {items.map((item) => (
        <AppBadge
          key={item.id}
          tone={tone}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {item.nombre}
        </AppBadge>
      ))}
    </AppInline>
  );
}

export function TicketDetailsDialog({
  isOpen,
  onOpenChange,
  ticket,
}: TicketDetailsDialogProps) {
  return (
    <AppDialog open={isOpen} onOpenChange={onOpenChange}>
      <AppDialogContent
        size="5xl"
        viewport="tall"
        padding="sm"
        // overlayTone=""
        // overlayBlur="sm"
      >
        {!ticket ? null : (
          <>
            <AppDialogHeader divider>
              <AppDialogTitle className="flex items-center gap-2">
                <Hash size={15} />
                Ticket #{ticket.id}
              </AppDialogTitle>

              <AppDialogDescription>
                Detalles del ticket de soporte registrado para este cliente.
              </AppDialogDescription>
            </AppDialogHeader>

            <AppDialogBody padding="sm">
              <AppStack gap="sm">
                <AppInline gap="xs" align="center" wrap>
                  <TicketEstadoBadge estado={ticket.estado} />
                  <TicketPrioridadBadge prioridad={ticket.prioridad} />

                  {ticket.resumen?.reabierto ? (
                    <AppBadge
                      tone="warning"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      Reabierto
                    </AppBadge>
                  ) : null}
                </AppInline>

                <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
                  <AppStack gap="sm">
                    <DetailItem
                      label="Título"
                      value={ticket.titulo}
                      icon={<Hash size={14} />}
                    />

                    <DetailItem
                      label="Descripción"
                      className="min-h-[96px]"
                      value={
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {ticket.descripcion || "No hay descripción."}
                        </p>
                      }
                      icon={<MessageSquare size={14} />}
                    />

                    {ticket.etiquetas?.length ? (
                      <DetailItem
                        label="Etiquetas"
                        icon={<Tag size={14} />}
                        value={
                          <BadgeList items={ticket.etiquetas} tone="info" />
                        }
                      />
                    ) : null}

                    {ticket.resumen?.notasInternas ? (
                      <DetailItem
                        label="Notas internas"
                        value={
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {ticket.resumen.notasInternas}
                          </p>
                        }
                        icon={<MessageSquare size={14} />}
                      />
                    ) : null}
                  </AppStack>

                  <AppStack gap="sm">
                    <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                      <DetailItem
                        label="Fecha de apertura"
                        value={formatTicketDate(ticket.fechaApertura, true)}
                        icon={<Calendar size={14} />}
                      />

                      <DetailItem
                        label="Fecha de cierre"
                        value={formatTicketDate(ticket.fechaCierre, true)}
                        icon={<Calendar size={14} />}
                      />

                      <DetailItem
                        label="Inicio atención"
                        value={formatTicketDate(
                          ticket.fechaInicioAtencion,
                          true,
                        )}
                        icon={<Calendar size={14} />}
                      />

                      <DetailItem
                        label="Resolución técnico"
                        value={formatTicketDate(
                          ticket.fechaResolucionTecnico,
                          true,
                        )}
                        icon={<Calendar size={14} />}
                      />
                    </AppGrid>

                    <AppSeparator />

                    <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                      <DetailItem
                        label="Creado por"
                        value={ticket.creadoPro?.nombre}
                        icon={<User size={14} />}
                      />

                      <DetailItem
                        label="Técnico asignado"
                        value={ticket.tecnico?.nombre}
                        icon={<Wrench size={14} />}
                      />
                    </AppGrid>

                    {ticket.acompanantes?.length ? (
                      <DetailItem
                        label="Acompañantes"
                        icon={<User size={14} />}
                        value={
                          <BadgeList
                            items={ticket.acompanantes}
                            tone="neutral"
                          />
                        }
                      />
                    ) : null}

                    {ticket.resumen ? (
                      <>
                        <AppSeparator />

                        <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                          <DetailItem
                            label="Tiempo técnico"
                            value={
                              ticket.resumen.tiempoTecnicoMinutos !== null &&
                              ticket.resumen.tiempoTecnicoMinutos !== undefined
                                ? `${ticket.resumen.tiempoTecnicoMinutos} min`
                                : null
                            }
                          />

                          <DetailItem
                            label="Tiempo total"
                            value={
                              ticket.resumen.tiempoTotalMinutos !== null &&
                              ticket.resumen.tiempoTotalMinutos !== undefined
                                ? `${ticket.resumen.tiempoTotalMinutos} min`
                                : null
                            }
                          />

                          <DetailItem
                            label="Resuelto como"
                            value={ticket.resumen.resueltoComo}
                          />

                          <DetailItem
                            label="Reaperturas"
                            value={ticket.resumen.numeroReaperturas}
                          />
                        </AppGrid>
                      </>
                    ) : null}
                  </AppStack>
                </AppGrid>
              </AppStack>
            </AppDialogBody>
          </>
        )}
      </AppDialogContent>
    </AppDialog>
  );
}
