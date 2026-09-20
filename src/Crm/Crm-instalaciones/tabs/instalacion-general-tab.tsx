import type { ReactNode } from "react";
import { MapPin } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

import type { ClienteInstalacionUsuarioResumen } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { InstalacionUserAvatar } from "../details/instalacion-user-avatar";
import {
  formatAuditDate,
  formatBusinessDate,
  getClienteNombre,
  getGoogleMapsUrl,
  getTotalCostos,
  humanizeEnum,
} from "../details/instalacion-utils.utils";
import { InstalacionDetailViewProps } from "../instalacion-detail.types";
import { InstalacionEvidenceGallery } from "../details/instalacion-evidence";
import { InstalacionEvidenciasUploadPage } from "../evidencia/payload-evidencias";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

// import { InstalacionEvidenciasUploadPage } from "../../evidencia/payload-evidencias";
// import { InstalacionEvidenceGallery } from "../instalacion-evidence";
// import { InstalacionUserAvatar } from "../instalacion-user-avatar";
// import {
//   formatAuditDate,
//   formatBusinessDate,
//   getClienteNombre,
//   getGoogleMapsUrl,
//   getTotalCostos,
//   humanizeEnum,
// } from "../instalacion-utils.utils";

// import type { InstalacionDetailViewProps } from "../instalacion-detail.types";

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
          <h2 className="text-sm font-semibold leading-tight">{title}</h2>
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

function EmptyValue({ label = "Sin registrar" }: { label?: string }) {
  return (
    <span className={`text-xs font-normal italic ${mutedTextClass}`}>
      {label}
    </span>
  );
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <dt className={`text-[11px] leading-tight ${mutedTextClass}`}>{label}</dt>
      <dd className="mt-0.5 break-words text-xs font-medium leading-snug">
        {value ?? <EmptyValue />}
      </dd>
    </div>
  );
}

function UserRow({
  label,
  user,
}: {
  label: string;
  user: ClienteInstalacionUsuarioResumen | null;
}) {
  return (
    <div className="min-w-0 rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2">
      <p
        className={`truncate text-[10px] font-medium uppercase tracking-wide ${mutedTextClass}`}
      >
        {label}
      </p>
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
            <p className={`truncate text-[11px] ${mutedTextClass}`}>
              {user.telefono || user.correo || "Sin contacto"}
            </p>
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

export function InstalacionGeneralTab({
  instalacion,
  empresaId,
  onOpenEvidence,
}: InstalacionDetailViewProps) {
  const clienteNombre = getClienteNombre(instalacion);
  const hasCoordinates =
    instalacion.ubicacion.latitud != null &&
    instalacion.ubicacion.longitud != null;

  return (
    <AppStack gap="sm">
      <AppGrid cols={{ base: 1, xl: 3 }} gap="sm">
        <AppStack gap="sm" className="xl:col-span-2">
          <DetailSection
            title="Trabajo solicitado"
            description="Descripción, motivo y resultado de la instalación."
          >
            <dl>
              <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
                <DetailItem
                  label="Descripción"
                  value={instalacion.descripcion || <EmptyValue />}
                />
                <DetailItem
                  label="Motivo"
                  value={instalacion.motivo || <EmptyValue />}
                />
                <DetailItem
                  label="Observaciones"
                  value={instalacion.observaciones || <EmptyValue />}
                />
                <DetailItem
                  label="Resultado"
                  value={
                    instalacion.resultado || <EmptyValue label="Pendiente" />
                  }
                />
              </AppGrid>
            </dl>
          </DetailSection>

          <DetailSection
            title="Programación y seguimiento"
            description="Fechas operativas asociadas al registro."
          >
            <dl>
              <AppGrid cols={{ base: 2, lg: 3 }} gap="sm">
                <DetailItem
                  label="Programada"
                  value={formattFechaWithMinutes(instalacion.fechaProgramada)}
                />
                <DetailItem
                  label="Inicio"
                  value={formattFechaWithMinutes(instalacion.fechaInicio)}
                />
                <DetailItem
                  label="Finalización"
                  value={formattFechaWithMinutes(instalacion.fechaFinalizacion)}
                />
                <DetailItem
                  label="Cancelación"
                  value={formatBusinessDate(instalacion.fechaCancelacion)}
                />
                <DetailItem
                  label="Activación del servicio"
                  value={formatBusinessDate(
                    instalacion.fechaActivacionServicio,
                  )}
                />
              </AppGrid>
            </dl>
          </DetailSection>

          <DetailSection
            title="Ubicación"
            description="Dirección, referencia y coordenadas registradas."
          >
            <AppStack gap="sm">
              <dl>
                <AppGrid cols={{ base: 1, md: 2 }} gap="sm">
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
                    value={instalacion.ubicacion.latitud ?? <EmptyValue />}
                  />
                  <DetailItem
                    label="Longitud"
                    value={instalacion.ubicacion.longitud ?? <EmptyValue />}
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
                <AppGrid cols={{ base: 2, lg: 3 }} gap="sm">
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
                    label="Otros"
                    value={formattMonedaGT(instalacion.costos.costoOtros)}
                  />
                  <DetailItem
                    label="Costo interno total"
                    value={formattMonedaGT(getTotalCostos(instalacion))}
                  />
                  <DetailItem
                    label="Cobrado al cliente"
                    value={formattMonedaGT(
                      instalacion.costos.montoCobradoCliente,
                    )}
                  />
                </AppGrid>
              </dl>
              <div>
                <p className={`text-[11px] ${mutedTextClass}`}>
                  Notas de costos
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-xs">
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

        <AppStack gap="sm">
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
                <span className={`shrink-0 text-[11px] ${mutedTextClass}`}>
                  #{instalacion.cliente.id}
                </span>
              </AppInline>
              <dl>
                <AppGrid cols={{ base: 2 }} gap="xs">
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
                </AppGrid>
                <div className="mt-2">
                  <DetailItem
                    label="Dirección"
                    value={instalacion.cliente.direccion || <EmptyValue />}
                  />
                </div>
              </dl>
            </AppStack>
          </DetailSection>

          <DetailSection title="Servicio">
            {instalacion.servicioInternet ? (
              <dl>
                <AppGrid cols={{ base: 2 }} gap="xs">
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
                  <DetailItem
                    label="Velocidad"
                    value={
                      instalacion.servicioInternet.velocidad || <EmptyValue />
                    }
                  />
                </AppGrid>
              </dl>
            ) : (
              <EmptyValue label="Sin servicio asignado" />
            )}
          </DetailSection>

          <DetailSection title="Ticket relacionado">
            {instalacion.ticket ? (
              <dl>
                <AppStack gap="xs">
                  <AppInline
                    justify="between"
                    align="center"
                    gap="xs"
                    fullWidth
                  >
                    <span className="text-xs font-semibold">
                      #{instalacion.ticket.id}
                    </span>
                    <AppBadge
                      tone="warning"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {humanizeEnum(instalacion.ticket.prioridad)}
                    </AppBadge>
                  </AppInline>
                  <DetailItem
                    label="Título"
                    value={instalacion.ticket.titulo || <EmptyValue />}
                  />
                  <AppGrid cols={{ base: 2 }} gap="xs">
                    <DetailItem
                      label="Estado"
                      value={humanizeEnum(instalacion.ticket.estado)}
                    />
                    <DetailItem
                      label="Apertura"
                      value={formatAuditDate(instalacion.ticket.fechaApertura)}
                    />
                  </AppGrid>
                </AppStack>
              </dl>
            ) : (
              <EmptyValue label="Sin ticket relacionado" />
            )}
          </DetailSection>

          <DetailSection title="Participantes">
            <AppGrid cols={{ base: 1, sm: 2 }} gap="xs" align="start">
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

          <DetailSection
            title="Técnicos"
            description={`${instalacion.conteos.tecnicos} asignados`}
          >
            {instalacion.tecnicos.length === 0 ? (
              <EmptyValue label="Sin técnicos asignados" />
            ) : (
              <AppGrid cols={{ base: 1, sm: 2 }} gap="xs" align="start">
                {instalacion.tecnicos.map((asignacion) => {
                  const tecnico = asignacion.tecnico;
                  const nombre =
                    tecnico?.nombre ??
                    asignacion.tecnicoNombreSnapshot ??
                    "Técnico no disponible";

                  return (
                    <article
                      key={asignacion.id}
                      className="min-w-0 rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2"
                    >
                      <AppInline align="start" gap="xs" wrap={false} fullWidth>
                        <InstalacionUserAvatar user={tecnico} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-xs font-semibold"
                            title={nombre}
                          >
                            {nombre}
                          </p>
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
                          {asignacion.tiempoMinutos != null ? (
                            <p className={`mt-1 text-[11px] ${mutedTextClass}`}>
                              {asignacion.tiempoMinutos} min registrados
                            </p>
                          ) : null}
                          {asignacion.observaciones ? (
                            <p
                              className={`mt-1 line-clamp-2 text-[11px] ${mutedTextClass}`}
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

          <DetailSection title="Registro">
            <dl>
              <AppGrid cols={{ base: 2 }} gap="xs">
                <DetailItem
                  label="Creado"
                  value={formatAuditDate(instalacion.creadoEn)}
                />
                <DetailItem
                  label="Actualizado"
                  value={formatAuditDate(instalacion.actualizadoEn)}
                />
              </AppGrid>
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
