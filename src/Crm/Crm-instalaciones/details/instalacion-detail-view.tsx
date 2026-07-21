import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import type {
  ClienteInstalacionDetalle,
  ClienteInstalacionUsuarioResumen,
} from "@/Crm/features/instalaciones/instalaciones.interfaces";

import { InstalacionUserAvatar } from "./instalacion-user-avatar";
import {
  getClienteNombre,
  getEstadoToneInstalacion,
  getGoogleMapsUrl,
  getTotalCostos,
  humanizeEnum,
} from "./instalacion-utils.utils";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";
import { InstalacionEvidenceGallery } from "./instalacion-evidence";
import { InstalacionEvidenciasUploadPage } from "../evidencia/payload-evidencias";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

type InstalacionDetailViewProps = {
  instalacion: ClienteInstalacionDetalle;
  onOpenEvidence: (index: number) => void;
};

type DetailSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

type DetailItemProps = {
  label: string;
  value: ReactNode;
};

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

const linkTextClass = "text-[hsl(var(--app-primary))] hover:underline";

function DetailSection({ title, description, children }: DetailSectionProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppStack gap="xs">
        <div className="px-1 pt-1">
          <p className="text-sm font-semibold leading-tight">{title}</p>

          {description ? (
            <p className={`mt-0.5 text-xs leading-snug ${mutedTextClass}`}>
              {description}
            </p>
          ) : null}
        </div>

        <AppSeparator size="xs" spacing="xs" />

        <div className="px-1 pb-1">{children}</div>
      </AppStack>
    </AppCard>
  );
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <dt className={`text-[11px] leading-tight ${mutedTextClass}`}>{label}</dt>

      <dd className="mt-0.5 break-words text-xs font-medium leading-snug">
        {value ?? "Sin registrar"}
      </dd>
    </div>
  );
}

function EmptyValue() {
  return (
    <span className={`text-xs font-normal italic ${mutedTextClass}`}>
      Sin registrar
    </span>
  );
}

type MetricCardProps = {
  label: string;
  value: ReactNode;
  description: string;
};

function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="p-2"
      title={description}
    >
      <AppInline
        justify="between"
        align="center"
        gap="xs"
        wrap={false}
        fullWidth
      >
        <div className="min-w-0 px-1">
          <span
            className={`block truncate text-[11px] leading-tight ${mutedTextClass}`}
          >
            {label}
          </span>

          <span
            className={`mt-0.5 hidden truncate text-[10px] leading-tight sm:block ${mutedTextClass}`}
          >
            {description}
          </span>
        </div>

        <strong className="shrink-0 whitespace-nowrap px-1 text-base font-semibold leading-none tabular-nums">
          {value}
        </strong>
      </AppInline>
    </AppCard>
  );
}

type UserRowProps = {
  label: string;
  user: ClienteInstalacionUsuarioResumen | null;
};

function UserRow({ label, user }: UserRowProps) {
  return (
    <div
      className={[
        "min-w-0",
        "rounded-[var(--app-radius-sm)]",
        "border border-[hsl(var(--app-border))]",
        "p-2",
      ].join(" ")}
    >
      <AppInline
        justify="between"
        align="center"
        gap="xs"
        wrap={false}
        fullWidth
      >
        <p
          className={`min-w-0 truncate text-[10px] font-medium uppercase tracking-wide ${mutedTextClass}`}
          title={label}
        >
          {label}
        </p>
      </AppInline>

      {user ? (
        <AppInline
          align="center"
          gap="xs"
          wrap={false}
          fullWidth
          className="mt-1"
        >
          <InstalacionUserAvatar user={user} size="sm" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold" title={user.nombre}>
              {user.nombre}
            </p>

            {!user.telefono && !user.correo ? (
              <p className={`text-[11px] ${mutedTextClass}`}>
                Sin información de contacto
              </p>
            ) : null}
          </div>
        </AppInline>
      ) : (
        <div className="pt-1">
          <EmptyValue />
        </div>
      )}
    </div>
  );
}
export function InstalacionDetailView({
  instalacion,
  onOpenEvidence,
}: InstalacionDetailViewProps) {
  const clienteNombre = getClienteNombre(instalacion);

  const hasCoordinates =
    instalacion.ubicacion.latitud != null &&
    instalacion.ubicacion.longitud != null;

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  return (
    <AppStack gap="md">
      <AppInline
        justify="between"
        align="start"
        collapseBelow="sm"
        gap="sm"
        fullWidth
      >
        <AppInline align="start" gap="sm" wrap={false}>
          <div className="min-w-0">
            <AppInline align="center" gap="xs" wrap>
              <p>Instalación #{instalacion.id}</p>

              <AppBadge
                tone={getEstadoToneInstalacion(instalacion.estado)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizeEnum(instalacion.estado)}
              </AppBadge>

              <AppBadge
                tone="neutral"
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizeEnum(instalacion.tipo)}
              </AppBadge>
            </AppInline>

            <p className={`truncate text-sm ${mutedTextClass}`}>
              {clienteNombre}
            </p>
          </div>
        </AppInline>

        <AppButton variant="outline" size="sm">
          <Link to={`/crm/cliente/${instalacion.cliente.id}/?tab=resumen`}>
            Ver cliente
          </Link>
        </AppButton>
      </AppInline>

      {/* Métricas disponibles */}

      <AppGrid
        cols={{
          base: 2,
          lg: 4,
        }}
        gap="xs"
      >
        <MetricCard
          label="Costos registrados"
          value={formattMonedaGT(getTotalCostos(instalacion))}
          description="Instalación, materiales y mano de obra"
        />

        <MetricCard
          label="Saldo pendiente"
          value={formattMonedaGT(instalacion.costos.saldoPendiente)}
          description="Saldo registrado en la instalación"
        />

        <MetricCard
          label="Técnicos"
          value={instalacion.conteos.tecnicos}
          description="Asignaciones registradas"
        />

        <MetricCard
          label="Evidencias"
          value={instalacion.conteos.evidencias}
          description="Archivos relacionados"
        />
      </AppGrid>

      {/* Contenido */}

      <AppGrid
        cols={{
          base: 1,
          xl: 3,
        }}
        gap="sm"
      >
        <AppStack gap="sm" className="xl:col-span-2">
          <DetailSection
            title="Información de la instalación"
            description="Motivo, observaciones y resultado operativo."
          >
            <dl>
              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="xs"
              >
                <DetailItem
                  label="Motivo"
                  value={instalacion.motivo || <EmptyValue />}
                />

                <DetailItem
                  label="Ticket relacionado"
                  value={
                    instalacion.ticketId != null ? (
                      `#${instalacion.ticketId}`
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <DetailItem
                  label="Observaciones"
                  value={instalacion.observaciones || <EmptyValue />}
                />

                <DetailItem
                  label="Resultado"
                  value={instalacion.resultado || <EmptyValue />}
                />

                <DetailItem
                  label="Registro migrado"
                  value={instalacion.esMigrada ? "Sí" : "No"}
                />

                <DetailItem
                  label="SSID"
                  value={instalacion.wifi.ssid || <EmptyValue />}
                />
              </AppGrid>
            </dl>
          </DetailSection>

          <DetailSection
            title="Programación y seguimiento"
            description="Fechas operativas asociadas con el registro."
          >
            <dl>
              <AppGrid
                cols={{
                  base: 2,
                  lg: 3,
                }}
                gap="sm"
              >
                <DetailItem
                  label="Fecha programada"
                  value={formattShortFecha(instalacion.fechaProgramada)}
                />

                <DetailItem
                  label="Fecha de inicio"
                  value={formattShortFecha(instalacion.fechaInicio)}
                />

                <DetailItem
                  label="Fecha de finalización"
                  value={formattShortFecha(instalacion.fechaFinalizacion)}
                />

                <DetailItem
                  label="Fecha de cancelación"
                  value={formattShortFecha(instalacion.fechaCancelacion)}
                />

                <DetailItem
                  label="Activación del servicio"
                  value={formattShortFecha(instalacion.fechaActivacionServicio)}
                />
              </AppGrid>
            </dl>
          </DetailSection>

          <DetailSection
            title="Ubicación"
            description="Dirección registrada y coordenadas de la instalación."
          >
            <AppStack gap="sm">
              <dl>
                <AppGrid
                  cols={{
                    base: 1,
                    md: 2,
                  }}
                  gap="sm"
                >
                  <DetailItem
                    label="Dirección"
                    value={instalacion.ubicacion.direccion || <EmptyValue />}
                  />

                  <DetailItem
                    label="Referencia"
                    value={instalacion.ubicacion.referencia || <EmptyValue />}
                  />

                  <DetailItem
                    label="Latitud"
                    value={
                      instalacion.ubicacion.latitud != null ? (
                        instalacion.ubicacion.latitud
                      ) : (
                        <EmptyValue />
                      )
                    }
                  />

                  <DetailItem
                    label="Longitud"
                    value={
                      instalacion.ubicacion.longitud != null ? (
                        instalacion.ubicacion.longitud
                      ) : (
                        <EmptyValue />
                      )
                    }
                  />
                </AppGrid>
              </dl>

              {hasCoordinates ? (
                <AppInline justify="end" fullWidth>
                  <AppButton asChild variant="outline" size="xs">
                    <a
                      href={getGoogleMapsUrl(
                        instalacion.ubicacion.latitud!,
                        instalacion.ubicacion.longitud!,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin size={14} aria-hidden="true" />
                      Abrir en Maps
                    </a>
                  </AppButton>
                </AppInline>
              ) : null}
            </AppStack>
          </DetailSection>

          <DetailSection
            title="Costos"
            description="Distribución de costos y cobros registrados."
          >
            <AppStack gap="sm">
              <dl>
                <AppGrid
                  cols={{
                    base: 2,
                    lg: 3,
                  }}
                  gap="sm"
                >
                  <DetailItem
                    label="Instalación"
                    value={formattMonedaGT(instalacion.costos.costoInstalacion)}
                  />

                  <DetailItem
                    label="Materiales"
                    value={formattMonedaGT(instalacion.costos.costoMateriales)}
                  />

                  <DetailItem
                    label="Mano de obra"
                    value={formattMonedaGT(instalacion.costos.costoManoObra)}
                  />

                  <DetailItem
                    label="Otros costos"
                    value={formattMonedaGT(instalacion.costos.costoOtros)}
                  />

                  <DetailItem
                    label="Cobrado al cliente"
                    value={formattMonedaGT(
                      instalacion.costos.montoCobradoCliente,
                    )}
                  />

                  <DetailItem
                    label="Saldo pendiente"
                    value={formattMonedaGT(instalacion.costos.saldoPendiente)}
                  />
                </AppGrid>
              </dl>

              <div>
                <p className={`text-xs ${mutedTextClass}`}>Notas de costos</p>

                <p className="mt-0.5 whitespace-pre-wrap text-sm">
                  {instalacion.costos.notas || "Sin notas registradas"}
                </p>
              </div>
            </AppStack>
          </DetailSection>

          <InstalacionEvidenceGallery
            evidencias={instalacion.evidencias}
            onOpenEvidence={onOpenEvidence}
          />
        </AppStack>

        {/* Columna lateral */}
        <AppStack gap="xs">
          {/* Cliente */}

          <DetailSection title="Cliente">
            <AppStack gap="xs">
              <AppInline
                justify="between"
                align="start"
                gap="xs"
                wrap={false}
                fullWidth
              >
                <p
                  className="min-w-0 flex-1 truncate text-xs font-semibold"
                  title={clienteNombre}
                >
                  {clienteNombre}
                </p>

                <span
                  className={`shrink-0 whitespace-nowrap text-[11px] ${mutedTextClass}`}
                >
                  #{instalacion.cliente.id}
                </span>
              </AppInline>

              <dl>
                <AppStack gap="xs">
                  <AppInline align="start" gap="md" wrap fullWidth>
                    <DetailItem
                      label="Teléfono"
                      value={
                        instalacion.cliente.telefono ? (
                          <a
                            href={`tel:${instalacion.cliente.telefono}`}
                            className={linkTextClass}
                          >
                            {instalacion.cliente.telefono}
                          </a>
                        ) : (
                          <EmptyValue />
                        )
                      }
                    />

                    <DetailItem
                      label="DPI"
                      value={instalacion.cliente.dpi || <EmptyValue />}
                    />
                  </AppInline>

                  <DetailItem
                    label="Dirección"
                    value={instalacion.cliente.direccion || <EmptyValue />}
                  />
                </AppStack>
              </dl>
            </AppStack>
          </DetailSection>

          {/* Servicio */}

          <DetailSection title="Servicio">
            {instalacion.servicioInternet ? (
              <dl>
                <AppStack gap="xs">
                  <AppInline
                    align="start"
                    justify="between"
                    gap="md"
                    wrap
                    fullWidth
                  >
                    <DetailItem
                      label="Plan"
                      value={instalacion.servicioInternet.nombre}
                    />

                    <DetailItem
                      label="Precio"
                      value={
                        instalacion.servicioInternet.precio != null ? (
                          formattMonedaGT(instalacion.servicioInternet.precio)
                        ) : (
                          <EmptyValue />
                        )
                      }
                    />
                  </AppInline>

                  <DetailItem
                    label="Velocidad"
                    value={
                      instalacion.servicioInternet.velocidad || <EmptyValue />
                    }
                  />
                </AppStack>
              </dl>
            ) : (
              <EmptyValue />
            )}
          </DetailSection>

          {/* Participantes en grid */}

          <DetailSection title="Participantes">
            <AppGrid
              cols={{
                base: 1,
                sm: 2,
              }}
              gap="xs"
              align="start"
            >
              <UserRow label="Asesor" user={instalacion.participantes.asesor} />

              <UserRow
                label="Creado por"
                user={instalacion.participantes.creadoPor}
              />

              <UserRow
                label="Completado por"
                user={instalacion.participantes.completadoPor}
              />
            </AppGrid>
          </DetailSection>

          {/* Técnicos en grid */}

          <DetailSection
            title="Técnicos"
            description={`${instalacion.conteos.tecnicos} asignados`}
          >
            {instalacion.tecnicos.length === 0 ? (
              <EmptyValue />
            ) : (
              <AppGrid
                cols={{
                  base: 1,
                  sm: 2,
                }}
                gap="xs"
                align="start"
              >
                {instalacion.tecnicos.map((asignacion) => {
                  const tecnico = asignacion.tecnico;

                  const tecnicoNombre =
                    tecnico?.nombre ??
                    asignacion.tecnicoNombreSnapshot ??
                    "Técnico no disponible";

                  return (
                    <article
                      key={asignacion.id}
                      className={[
                        "min-w-0",
                        "rounded-[var(--app-radius-sm)]",
                        "border border-[hsl(var(--app-border))]",
                        "p-2",
                      ].join(" ")}
                    >
                      <AppInline align="start" gap="xs" wrap={false} fullWidth>
                        <InstalacionUserAvatar user={tecnico} size="sm" />

                        <div className="min-w-0 flex-1">
                          <AppInline
                            justify="between"
                            align="center"
                            gap="xs"
                            wrap={false}
                            fullWidth
                          >
                            <p
                              className="min-w-0 flex-1 truncate text-xs font-semibold"
                              title={tecnicoNombre}
                            >
                              {tecnicoNombre}
                            </p>
                          </AppInline>
                          <AppBadge
                            tone={
                              asignacion.esResponsable ? "primary" : "neutral"
                            }
                            appearance="soft"
                            size="xs"
                            radius="full"
                          >
                            {humanizeEnum(asignacion.rol)}
                          </AppBadge>
                          {asignacion.observaciones ? (
                            <p
                              className={`mt-0.5 line-clamp-1 text-[11px] ${mutedTextClass}`}
                              title={asignacion.observaciones}
                            >
                              {asignacion.observaciones}
                            </p>
                          ) : null}
                        </div>
                      </AppInline>
                    </article>
                  );
                })}
              </AppGrid>
            )}
          </DetailSection>

          {/* Auditoría compacta */}

          <DetailSection title="Fechas">
            <dl>
              <AppInline
                align="start"
                justify="between"
                gap="md"
                wrap
                fullWidth
              >
                <DetailItem
                  label="Creado"
                  value={formattShortFecha(instalacion.creadoEn)}
                />

                <DetailItem
                  label="Actualizado"
                  value={formattShortFecha(instalacion.actualizadoEn)}
                />
              </AppInline>
            </dl>
          </DetailSection>
        </AppStack>
      </AppGrid>

      <InstalacionEvidenciasUploadPage
        instalacionId={instalacion.id}
        empresaId={empresaId}
      />
    </AppStack>
  );
}
