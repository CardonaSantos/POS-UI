import type { ReactNode } from "react";
import {
  Activity,
  CircleUserRound,
  Network,
  Router,
  ServerCog,
} from "lucide-react";
import { Link } from "react-router-dom";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { PppoeCuentaDetalle } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

type PppoeCuentaDetailOverviewProps = {
  cuenta: PppoeCuentaDetalle;
};

type DetailSectionProps = {
  title: string;

  description?: string;

  icon?: ReactNode;

  children: ReactNode;
};

type DetailItemProps = {
  label: string;

  value: ReactNode;
};

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

const linkTextClass = "text-[hsl(var(--app-primary))] hover:underline";

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
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

function DetailSection({
  title,
  description,
  icon,
  children,
}: DetailSectionProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppStack gap="xs">
        <div className="px-1 pt-1">
          <AppInline align="center" gap="xs" wrap={false}>
            {icon ? (
              <span className={mutedTextClass} aria-hidden="true">
                {icon}
              </span>
            ) : null}

            <h2 className="text-sm font-semibold leading-tight">{title}</h2>
          </AppInline>

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

function getStatusTone(value: string): AppBadgeTone {
  const normalized = value.toUpperCase();

  if (normalized === "ACTIVO" || normalized === "ACTIVA") {
    return "success";
  }

  if (
    normalized === "SUSPENDIDO" ||
    normalized === "SUSPENDIDA" ||
    normalized === "MOROSO" ||
    normalized === "ATRASADO"
  ) {
    return "warning";
  }

  if (
    normalized === "ERROR" ||
    normalized === "CANCELADO" ||
    normalized === "CANCELADA"
  ) {
    return "danger";
  }

  if (normalized.includes("PENDIENTE")) {
    return "info";
  }

  return "neutral";
}

function StatusBadge({ value }: { value: string }) {
  return (
    <AppBadge
      tone={getStatusTone(value)}
      appearance="soft"
      size="xs"
      radius="full"
    >
      {humanizeEnum(value)}
    </AppBadge>
  );
}

function getClienteNombre(cuenta: PppoeCuentaDetalle) {
  return [cuenta.cliente.nombre, cuenta.cliente.apellidos]
    .filter(Boolean)
    .join(" ");
}

export function PppoeCuentaDetailOverview({
  cuenta,
}: PppoeCuentaDetailOverviewProps) {
  const clienteNombre = getClienteNombre(cuenta);

  const servicio = cuenta.servicioInternet;

  const ultimaOperacion = cuenta.ultimaOperacion;

  return (
    <AppStack gap="sm">
      <AppGrid
        cols={{
          base: 1,
          xl: 3,
        }}
        gap="sm"
      >
        {/* ============================================= */}
        {/* COLUMNA PRINCIPAL                             */}
        {/* ============================================= */}

        <AppStack gap="sm" className="xl:col-span-2">
          <DetailSection
            title="Cuenta y acceso"
            description="Estado operativo actual de la identidad PPPoE y su acceso a internet."
            icon={<Network size={14} />}
          >
            <dl>
              <AppGrid
                cols={{
                  base: 2,
                  md: 3,
                }}
                gap="sm"
              >
                <DetailItem
                  label="Usuario PPPoE"
                  value={<span className="tabular-nums">{cuenta.usuario}</span>}
                />

                <DetailItem
                  label="Estado de cuenta"
                  value={<StatusBadge value={cuenta.estadoCuenta} />}
                />

                <DetailItem
                  label="Estado de acceso"
                  value={<StatusBadge value={cuenta.accesoInternet.estado} />}
                />

                <DetailItem
                  label="Tecnología"
                  value={humanizeEnum(cuenta.accesoInternet.tecnologia)}
                />

                <DetailItem
                  label="Autenticación"
                  value={humanizeEnum(
                    cuenta.accesoInternet.metodoAutenticacion,
                  )}
                />

                <DetailItem
                  label="Origen"
                  value={
                    <AppBadge
                      tone={
                        cuenta.origen === "ALTA_MANUAL" ? "primary" : "info"
                      }
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {cuenta.origen === "ALTA_MANUAL"
                        ? "Alta manual"
                        : "Instalación"}
                    </AppBadge>
                  }
                />

                <DetailItem
                  label="ID cuenta"
                  value={`#${cuenta.cuentaPppoeId}`}
                />

                <DetailItem
                  label="ID acceso"
                  value={`#${cuenta.accesoInternetId}`}
                />

                <DetailItem
                  label="ID homologación"
                  value={`#${cuenta.perfilHomologacionId}`}
                />
              </AppGrid>
            </dl>
          </DetailSection>

          <DetailSection
            title="Ciclo de vida"
            description="Fechas operativas registradas para la cuenta PPPoE."
            icon={<Activity size={14} />}
          >
            <dl>
              <AppGrid
                cols={{
                  base: 2,
                  md: 3,
                }}
                gap="sm"
              >
                <DetailItem
                  label="Generada"
                  value={formattFechaWithMinutes(cuenta.generadoEn)}
                />

                <DetailItem
                  label="Secret creado"
                  value={
                    cuenta.secretCreadoEn ? (
                      formattFechaWithMinutes(cuenta.secretCreadoEn)
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <DetailItem
                  label="Activada"
                  value={
                    cuenta.activadoEn ? (
                      formattFechaWithMinutes(cuenta.activadoEn)
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <DetailItem
                  label="Última suspensión"
                  value={
                    cuenta.suspendidoEn ? (
                      formattFechaWithMinutes(cuenta.suspendidoEn)
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <DetailItem
                  label="Eliminada"
                  value={
                    cuenta.eliminadoEn ? (
                      formattFechaWithMinutes(cuenta.eliminadoEn)
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <DetailItem
                  label="Última sincronización"
                  value={
                    cuenta.ultimaSincronizacionEn ? (
                      formattFechaWithMinutes(cuenta.ultimaSincronizacionEn)
                    ) : (
                      <EmptyValue label="Sin sincronización" />
                    )
                  }
                />

                <DetailItem
                  label="Última actualización"
                  value={formattFechaWithMinutes(cuenta.actualizadoEn)}
                />
              </AppGrid>
            </dl>

            {cuenta.ultimoError ? (
              <div className="mt-3 rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-danger)/0.35)] p-2">
                <p className="text-[11px] font-medium text-[hsl(var(--app-danger))]">
                  Último error registrado
                </p>

                <p className="mt-1 whitespace-pre-wrap text-xs">
                  {cuenta.ultimoError}
                </p>
              </div>
            ) : null}
          </DetailSection>

          <DetailSection
            title="Última operación"
            description="Último evento operativo registrado para esta cuenta."
            icon={<ServerCog size={14} />}
          >
            {ultimaOperacion ? (
              <AppStack gap="sm">
                <dl>
                  <AppGrid
                    cols={{
                      base: 2,
                      md: 3,
                    }}
                    gap="sm"
                  >
                    <DetailItem
                      label="Operación"
                      value={humanizeEnum(ultimaOperacion.tipo)}
                    />

                    <DetailItem
                      label="Estado"
                      value={<StatusBadge value={ultimaOperacion.estado} />}
                    />

                    <DetailItem
                      label="Intento"
                      value={`#${ultimaOperacion.numeroIntento}`}
                    />

                    <DetailItem
                      label="Iniciada"
                      value={
                        ultimaOperacion.iniciadoEn ? (
                          formattFechaWithMinutes(ultimaOperacion.iniciadoEn)
                        ) : (
                          <EmptyValue />
                        )
                      }
                    />

                    <DetailItem
                      label="Finalizada"
                      value={
                        ultimaOperacion.finalizadoEn ? (
                          formattFechaWithMinutes(ultimaOperacion.finalizadoEn)
                        ) : (
                          <EmptyValue />
                        )
                      }
                    />

                    <DetailItem
                      label="Ejecutada por"
                      value={
                        ultimaOperacion.iniciadoPor?.nombre ?? <EmptyValue />
                      }
                    />
                  </AppGrid>
                </dl>

                {ultimaOperacion.motivo ? (
                  <div>
                    <p className={`text-[11px] ${mutedTextClass}`}>Motivo</p>

                    <p className="mt-0.5 whitespace-pre-wrap text-xs">
                      {ultimaOperacion.motivo}
                    </p>
                  </div>
                ) : null}

                {ultimaOperacion.errorMensaje ? (
                  <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-danger)/0.35)] p-2">
                    <p className="text-[11px] font-medium text-[hsl(var(--app-danger))]">
                      Error
                    </p>

                    <p className="mt-1 text-xs">
                      {ultimaOperacion.errorMensaje}
                    </p>
                  </div>
                ) : null}
              </AppStack>
            ) : (
              <EmptyValue label="Sin operaciones registradas" />
            )}
          </DetailSection>
        </AppStack>

        {/* ============================================= */}
        {/* COLUMNA LATERAL                               */}
        {/* ============================================= */}

        <AppStack gap="sm">
          <DetailSection title="Cliente" icon={<CircleUserRound size={14} />}>
            <AppStack gap="sm">
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
                  {clienteNombre || "Cliente sin nombre"}
                </p>

                <span className={`shrink-0 text-[11px] ${mutedTextClass}`}>
                  #{cuenta.cliente.id}
                </span>
              </AppInline>

              <dl>
                <AppGrid
                  cols={{
                    base: 2,
                  }}
                  gap="xs"
                >
                  <DetailItem
                    label="Teléfono"
                    value={
                      cuenta.cliente.telefono ? (
                        <a
                          href={`tel:${cuenta.cliente.telefono}`}
                          className={linkTextClass}
                        >
                          {cuenta.cliente.telefono}
                        </a>
                      ) : (
                        <EmptyValue />
                      )
                    }
                  />

                  <DetailItem
                    label="DPI"
                    value={cuenta.cliente.dpi || <EmptyValue />}
                  />

                  <DetailItem
                    label="Estado"
                    value={<StatusBadge value={cuenta.cliente.estadoCliente} />}
                  />

                  <DetailItem
                    label="Cobranza"
                    value={
                      <StatusBadge value={cuenta.cliente.estadoCobranza} />
                    }
                  />
                </AppGrid>

                <div className="mt-2">
                  <DetailItem
                    label="Dirección"
                    value={cuenta.cliente.direccion || <EmptyValue />}
                  />
                </div>
              </dl>

              <AppInline justify="end" fullWidth>
                <AppButton asChild variant="outline" size="xs">
                  <Link to={`/crm/cliente/${cuenta.cliente.id}/?tab=resumen`}>
                    Ver perfil
                  </Link>
                </AppButton>
              </AppInline>
            </AppStack>
          </DetailSection>

          <DetailSection title="Servicio" icon={<Network size={14} />}>
            {servicio ? (
              <dl>
                <AppGrid
                  cols={{
                    base: 2,
                  }}
                  gap="xs"
                >
                  <DetailItem label="Plan" value={servicio.nombre} />

                  <DetailItem
                    label="Velocidad"
                    value={servicio.velocidad || <EmptyValue />}
                  />

                  <DetailItem
                    label="Precio"
                    value={formattMonedaGT(servicio.precio)}
                  />

                  <DetailItem
                    label="Estado"
                    value={<StatusBadge value={servicio.estado} />}
                  />
                </AppGrid>
              </dl>
            ) : (
              <EmptyValue label="Sin servicio relacionado" />
            )}
          </DetailSection>

          <DetailSection
            title="Infraestructura"
            description="Router MikroTik y perfil homologado."
            icon={<Router size={14} />}
          >
            <AppStack gap="sm">
              <dl>
                <AppGrid
                  cols={{
                    base: 2,
                  }}
                  gap="xs"
                >
                  <DetailItem label="Router" value={cuenta.router.nombre} />

                  <DetailItem
                    label="Perfil"
                    value={cuenta.perfilHomologacion.codigoPerfil}
                  />

                  <DetailItem
                    label="Router activo"
                    value={
                      <StatusBadge
                        value={cuenta.router.activo ? "ACTIVO" : "INACTIVO"}
                      />
                    }
                  />

                  <DetailItem
                    label="Homologación"
                    value={
                      <StatusBadge
                        value={
                          cuenta.perfilHomologacion.activo
                            ? "ACTIVO"
                            : "INACTIVO"
                        }
                      />
                    }
                  />
                </AppGrid>
              </dl>

              {cuenta.router.descripcion ? (
                <div>
                  <p className={`text-[11px] ${mutedTextClass}`}>Descripción</p>

                  <p className="mt-0.5 whitespace-pre-wrap text-xs">
                    {cuenta.router.descripcion}
                  </p>
                </div>
              ) : null}
            </AppStack>
          </DetailSection>

          <DetailSection
            title="Registro"
            description="Responsabilidad y conteos relacionados."
          >
            <AppStack gap="sm">
              <dl>
                <AppGrid
                  cols={{
                    base: 2,
                  }}
                  gap="xs"
                >
                  <DetailItem
                    label="Generada por"
                    value={cuenta.generadoPor?.nombre ?? <EmptyValue />}
                  />

                  <DetailItem
                    label="Operaciones"
                    value={cuenta.conteos.operaciones}
                  />

                  <DetailItem
                    label="Instalaciones"
                    value={cuenta.conteos.instalaciones}
                  />

                  <DetailItem
                    label="Auditorías"
                    value={cuenta.conteos.auditorias}
                  />
                </AppGrid>
              </dl>

              {cuenta.instalaciones.length > 0 ? (
                <AppStack gap="xs">
                  <p className={`text-[11px] ${mutedTextClass}`}>
                    Instalaciones relacionadas
                  </p>

                  {cuenta.instalaciones.map((item) => (
                    <Link
                      key={item.vinculoId}
                      to={`/crm/instalacion/${item.instalacion.id}`}
                      className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2 transition-colors hover:bg-[hsl(var(--app-muted)/0.35)]"
                    >
                      <AppInline
                        justify="between"
                        align="center"
                        gap="xs"
                        fullWidth
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            Instalación #{item.instalacion.id}
                          </p>

                          <p
                            className={`truncate text-[11px] ${mutedTextClass}`}
                          >
                            {humanizeEnum(item.instalacion.tipo)}
                          </p>
                        </div>

                        <StatusBadge value={item.instalacion.estado} />
                      </AppInline>
                    </Link>
                  ))}
                </AppStack>
              ) : (
                <EmptyValue label="Alta manual sin instalación relacionada" />
              )}
            </AppStack>
          </DetailSection>
        </AppStack>
      </AppGrid>
    </AppStack>
  );
}
