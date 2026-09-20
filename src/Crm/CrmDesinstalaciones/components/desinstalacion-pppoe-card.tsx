import { memo } from "react";

import { CheckCircle2, Circle, XCircle } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";

import type { ClienteDesinstalacionDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";

import { DetailItem, DetailSection } from "./desinstalacion-detail-ui";

function humanize(value: string) {
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

export const DesinstalacionAccesoPppoeCard = memo(
  function DesinstalacionAccesoPppoeCard({
    detalle,
  }: {
    detalle: ClienteDesinstalacionDetalle;
  }) {
    const acceso = detalle.accesoInternet;

    const cuenta = acceso?.cuentaPppoe;

    const operacion = detalle.ultimaOperacionPppoe;

    if (!acceso) {
      return (
        <DetailSection title="Acceso de internet">
          <p className="text-xs text-muted-foreground">
            Esta desinstalación no tiene un acceso asociado.
          </p>
        </DetailSection>
      );
    }

    return (
      <DetailSection
        title="Acceso y PPPoE"
        description="Estado técnico del servicio asociado."
      >
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <DetailItem
            label="Acceso"
            value={
              <AppBadge
                tone={
                  acceso.estado === "ACTIVO"
                    ? "success"
                    : acceso.estado === "SUSPENDIDO"
                      ? "warning"
                      : "neutral"
                }
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanize(acceso.estado)}
              </AppBadge>
            }
          />

          <DetailItem label="Tecnología" value={humanize(acceso.tecnologia)} />

          <DetailItem
            label="Autenticación"
            value={humanize(acceso.metodoAutenticacion)}
          />

          <DetailItem
            label="Usuario PPPoE"
            value={cuenta?.usuario ?? "Sin cuenta"}
          />

          {cuenta ? (
            <>
              <DetailItem
                label="Cuenta"
                value={
                  <AppBadge
                    tone={
                      cuenta.estado === "ACTIVA"
                        ? "success"
                        : cuenta.estado === "ERROR"
                          ? "danger"
                          : cuenta.estado === "ELIMINADA"
                            ? "neutral"
                            : "info"
                    }
                    appearance="soft"
                    size="xs"
                    radius="full"
                  >
                    {humanize(cuenta.estado)}
                  </AppBadge>
                }
              />

              <DetailItem
                label="Perfil"
                value={`#${cuenta.perfilHomologacionId}`}
              />

              <DetailItem
                label="Último error"
                value={cuenta.ultimoError ?? "Sin errores"}
              />
            </>
          ) : null}
        </dl>

        {operacion ? (
          <div className="mt-2 border-t pt-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold">Última operación PPPoE</p>

                <p className="text-[11px] text-muted-foreground">
                  {humanize(operacion.tipo)}
                </p>
              </div>

              <AppBadge
                tone={
                  operacion.estado === "EXITOSA"
                    ? "success"
                    : operacion.estado === "FALLIDA"
                      ? "danger"
                      : "info"
                }
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanize(operacion.estado)}
              </AppBadge>
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2">
              {operacion.pasos.map((paso) => {
                const Icon =
                  paso.estado === "EXITOSO"
                    ? CheckCircle2
                    : paso.estado === "FALLIDO"
                      ? XCircle
                      : Circle;

                return (
                  <div
                    key={paso.id}
                    className="flex min-w-0 items-center gap-2 rounded-md border px-2.5 py-2"
                  >
                    <Icon
                      size={14}
                      className={
                        paso.estado === "EXITOSO"
                          ? "shrink-0 text-emerald-600"
                          : paso.estado === "FALLIDO"
                            ? "shrink-0 text-red-600"
                            : "shrink-0 text-muted-foreground"
                      }
                      aria-hidden="true"
                    />

                    <span className="truncate text-[11px]">
                      {humanize(paso.tipo)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </DetailSection>
    );
  },
);
