import { Calendar, Info, MapPinned, Phone, UserCheck } from "lucide-react";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
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

export function RutasDetailDialog({ open, ruta, onOpenChange }: Props) {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      preset="info"
      tone="info"
      title={
        <AppInline gap="xs" align="center">
          <MapPinned size={17} />
          <span>{ruta?.nombreRuta ?? "Detalle de ruta"}</span>
        </AppInline>
      }
      description="Detalle general de la ruta de cobro."
      confirmText="Cerrar"
      cancelText="Cerrar"
      size="lg"
      maxWidth="lg"
      footerClassName="hidden"
      contentCard={false}
      showCloseButton
    >
      {ruta ? (
        <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
          <AppStack gap="sm">
            <AppCard variant="outline" size="xs" radius="md">
              <AppStack gap="xs">
                <AppInline gap="xs" align="center" wrap>
                  <AppBadge
                    tone={getEstadoRutaTone(ruta.estadoRuta)}
                    appearance="soft"
                    size="xs"
                    radius="full"
                  >
                    {ESTADO_RUTA_LABELS[ruta.estadoRuta] ?? ruta.estadoRuta}
                  </AppBadge>

                  <AppBadge tone="info" appearance="soft" size="xs">
                    {ruta.clientes?.length ?? 0} clientes
                  </AppBadge>
                </AppInline>

                <AppInline gap="xs" align="center">
                  <Calendar size={14} />
                  <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Creada: {formattShortFecha(ruta.fechaCreacion)}
                  </span>
                </AppInline>

                <AppInline gap="xs" align="center">
                  <Calendar size={14} />
                  <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Actualizada: {formattShortFecha(ruta.fechaActualizacion)}
                  </span>
                </AppInline>

                <AppInline justify="between" align="center">
                  <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Total a cobrar
                  </span>
                  <span className="text-xs font-semibold">
                    {formattMonedaGT(ruta.totalACobrar)}
                  </span>
                </AppInline>

                <AppInline justify="between" align="center">
                  <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
                    Total cobrado
                  </span>
                  <span className="text-xs font-semibold text-[hsl(var(--app-success))]">
                    {formattMonedaGT(ruta.totalCobrado)}
                  </span>
                </AppInline>
              </AppStack>
            </AppCard>

            <AppCard variant="outline" size="xs" radius="md">
              <AppStack gap="xs">
                <h3 className="text-xs font-semibold text-[hsl(var(--app-muted-foreground))]">
                  Cobrador asignado
                </h3>

                {ruta.cobrador ? (
                  <>
                    <AppInline gap="xs" align="center">
                      <UserCheck size={14} />
                      <span className="text-xs">
                        {ruta.cobrador.nombre} {ruta.cobrador.apellidos ?? ""}
                      </span>
                    </AppInline>

                    {ruta.cobrador.telefono ? (
                      <AppInline gap="xs" align="center">
                        <Phone size={14} />
                        <span className="text-xs">
                          {ruta.cobrador.telefono}
                        </span>
                      </AppInline>
                    ) : null}

                    <AppInline gap="xs" align="center">
                      <Info size={14} />
                      <span className="truncate text-xs">
                        {ruta.cobrador.email}
                      </span>
                    </AppInline>
                  </>
                ) : (
                  <p className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
                    No hay cobrador asignado.
                  </p>
                )}
              </AppStack>
            </AppCard>

            {ruta.observaciones ? (
              <AppCard variant="outline" size="xs" radius="md">
                <AppStack gap="xs">
                  <h3 className="text-xs font-semibold text-[hsl(var(--app-muted-foreground))]">
                    Observaciones
                  </h3>
                  <p className="text-xs text-[hsl(var(--app-foreground))]">
                    {ruta.observaciones}
                  </p>
                </AppStack>
              </AppCard>
            ) : null}
          </AppStack>

          <AppCard variant="outline" size="xs" radius="md">
            <AppStack gap="xs">
              <h3 className="text-xs font-semibold text-[hsl(var(--app-muted-foreground))]">
                Clientes de la ruta
              </h3>

              <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                {ruta.clientes?.length ? (
                  ruta.clientes.map((cliente, index) => (
                    <MiniPerfilClienteCard cliente={cliente} key={index} />
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-[hsl(var(--app-muted-foreground))]">
                    No hay clientes en esta ruta.
                  </p>
                )}
              </div>
            </AppStack>
          </AppCard>
        </AppGrid>
      ) : null}
    </AppConfirmDialog>
  );
}
