import {
  Calendar,
  Info,
  MapPinned,
  Phone,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { formattShortFecha } from "@/utils/formattFechas";
import { EstadoRuta, Ruta } from "@/Crm/features/rutas/rutas.interfaces";
import { ESTADO_RUTA_LABELS } from "./rutas_list_consts_";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import MiniPerfilClienteCard from "../../_subcomponents/MiniPerfilClienteCard";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function getEstadoRutaTone(estado?: EstadoRuta | string): AppBadgeTone {
  if (estado === EstadoRuta.ACTIVO) return "success";
  if (estado === EstadoRuta.ASIGNADA) return "info";
  if (estado === EstadoRuta.EN_CURSO) return "primary";
  if (estado === EstadoRuta.PENDIENTE) return "warning";
  if (estado === EstadoRuta.CERRADO) return "neutral";
  if (estado === EstadoRuta.COMPLETADO) return "success";
  if (estado === EstadoRuta.INACTIVO) return "neutral";

  return "neutral";
}

interface Props {
  open: boolean;
  ruta: Ruta | null;
  onOpenChange: (open: boolean) => void;
}

function DetailSection({
  title,
  description,
  icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className={className}>
      <AppStack gap="sm">
        <AppInline align="center" gap="xs">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            {icon}
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]">
              {title}
            </h3>

            {description ? (
              <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {description}
              </p>
            ) : null}
          </div>
        </AppInline>

        {children}
      </AppStack>
    </AppCard>
  );
}

function AmountRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "success";
}) {
  return (
    <AppInline justify="between" align="center" gap="sm">
      <span className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {label}
      </span>

      <span
        className={
          tone === "success"
            ? "text-xs font-semibold tabular-nums text-[hsl(var(--app-success))]"
            : "text-xs font-semibold tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]"
        }
      >
        {value}
      </span>
    </AppInline>
  );
}

function DateRow({
  label,
  value,
}: {
  label: string;
  value?: string | Date | null;
}) {
  return (
    <AppInline gap="xs" align="center">
      <Calendar
        size={13}
        className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />

      <span className="min-w-0 truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {label}: {value ? formattShortFecha(value) : "—"}
      </span>
    </AppInline>
  );
}

export function RutasDetailDialog({ open, ruta, onOpenChange }: Props) {
  if (!ruta) return null;

  const clientes = ruta.clientes ?? [];
  const estadoLabel = ESTADO_RUTA_LABELS[ruta.estadoRuta] ?? ruta.estadoRuta;

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-[1080px]">
        <AppDialogHeader>
          <AppDialogTitle>
            <AppInline gap="xs" align="center">
              <MapPinned size={17} />
              <span className="py-2">
                {ruta.nombreRuta ?? "Detalle de ruta"}
              </span>
            </AppInline>
          </AppDialogTitle>
        </AppDialogHeader>

        <AppStack gap="md">
          <AppGrid cols={{ base: 1, lg: 12 }} gap="sm">
            <AppStack gap="sm" className="lg:col-span-5 ">
              <DetailSection
                title="Resumen de ruta"
                description="Estado, fechas y montos generales."
                icon={<Info size={13} />}
                className="p-2"
              >
                <AppStack gap="sm">
                  <AppInline gap="xs" align="center" wrap>
                    <AppBadge
                      tone={getEstadoRutaTone(ruta.estadoRuta)}
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {estadoLabel}
                    </AppBadge>

                    <AppBadge tone="info" appearance="soft" size="xs">
                      <Users size={12} />
                      {clientes.length} clientes
                    </AppBadge>
                  </AppInline>

                  <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
                    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.25] p-2">
                      <DateRow label="Creada" value={ruta.fechaCreacion} />
                    </div>

                    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.25] p-2">
                      <DateRow
                        label="Actualizada"
                        value={ruta.fechaActualizacion}
                      />
                    </div>
                  </AppGrid>

                  <AppCard
                    variant="outline"
                    size="xs"
                    radius="md"
                    className="p-2"
                  >
                    <AppStack gap="xs">
                      <AppInline gap="xs" align="center">
                        <Wallet
                          size={13}
                          className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                        />
                        <span className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                          Totales
                        </span>
                      </AppInline>

                      <AmountRow
                        label="Total a cobrar"
                        value={formattMonedaGT(ruta.totalACobrar)}
                      />

                      <AmountRow
                        label="Total cobrado"
                        value={formattMonedaGT(ruta.totalCobrado)}
                        tone="success"
                      />
                    </AppStack>
                  </AppCard>
                </AppStack>
              </DetailSection>

              <DetailSection
                title="Cobrador asignado"
                description="Usuario responsable de la ruta."
                icon={<UserCheck size={13} />}
                className="p-2"
              >
                {ruta.cobrador ? (
                  <AppStack gap="xs">
                    <AppInline gap="xs" align="center">
                      <UserCheck
                        size={13}
                        className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                      />
                      <span className="truncate text-xs font-medium">
                        {ruta.cobrador.nombre} {ruta.cobrador.apellidos ?? ""}
                      </span>
                    </AppInline>

                    {ruta.cobrador.telefono ? (
                      <AppInline gap="xs" align="center">
                        <Phone
                          size={13}
                          className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                        />
                        <span className="truncate text-xs">
                          {ruta.cobrador.telefono}
                        </span>
                      </AppInline>
                    ) : null}

                    {ruta.cobrador.email ? (
                      <AppInline gap="xs" align="center">
                        <Info
                          size={13}
                          className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                        />
                        <span className="truncate text-xs">
                          {ruta.cobrador.email}
                        </span>
                      </AppInline>
                    ) : null}
                  </AppStack>
                ) : (
                  <p className="text-xs italic text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    No hay cobrador asignado.
                  </p>
                )}
              </DetailSection>

              <DetailSection
                title="Observaciones"
                description="Notas registradas para esta ruta."
                icon={<Info size={13} />}
                className="p-2"
              >
                <div className="rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted)))/0.35] p-3 text-xs leading-5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  {ruta.observaciones || "Sin observaciones registradas."}
                </div>
              </DetailSection>
            </AppStack>

            <DetailSection
              title="Clientes de la ruta"
              description="Clientes incluidos en esta ruta de cobro."
              icon={<Users size={13} />}
              className="lg:col-span-7 p-2"
            >
              <div className="max-h-[62dvh] overflow-y-auto pr-1">
                {clientes.length ? (
                  <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                    {clientes.map((cliente, index) => (
                      <MiniPerfilClienteCard cliente={cliente} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-8 text-center text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    No hay clientes en esta ruta.
                  </div>
                )}
              </div>
            </DetailSection>
          </AppGrid>

          <AppInline align="center" justify="end">
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </AppButton>
          </AppInline>
        </AppStack>
      </AppDialogContent>
    </AppDialog>
  );
}
