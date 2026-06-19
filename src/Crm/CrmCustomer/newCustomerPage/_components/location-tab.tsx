"use client";

import * as React from "react";
import {
  ExternalLink,
  LandPlot,
  Map,
  MapPin,
  Navigation,
  Pin,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

interface LocationTabProps {
  cliente: ClienteDetailsDto;
}

function buildMapsSearchUrl(
  latitud: number | string,
  longitud: number | string,
) {
  const query = encodeURIComponent(`${latitud},${longitud}`);

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function buildMapsDirectionsUrl(
  latitud: number | string,
  longitud: number | string,
) {
  const destination = encodeURIComponent(`${latitud},${longitud}`);

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

function buildGoogleMapsEmbedUrl(
  latitud: number | string,
  longitud: number | string,
) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;

  if (!apiKey) return null;

  const query = encodeURIComponent(`${latitud},${longitud}`);

  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;
}

function isValidCoordinate(value: unknown) {
  if (value === null || value === undefined || value === "") return false;

  const parsed = Number(value);

  return Number.isFinite(parsed);
}

function LocationInfoBox({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))] bg-[hsl(var(--app-muted)/0.18)] px-3 py-2">
      <AppInline gap="xs" align="center" className="mb-1">
        {icon ? (
          <span className="text-[hsl(var(--app-muted-foreground))]">
            {icon}
          </span>
        ) : null}

        <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground))]">
          {label}
        </span>
      </AppInline>

      <p
        className={
          mono
            ? "font-mono text-xs text-[hsl(var(--app-foreground))]"
            : "text-xs text-[hsl(var(--app-foreground))]"
        }
      >
        {value || (
          <span className="italic text-[hsl(var(--app-muted-foreground))]">
            No especificado
          </span>
        )}
      </p>
    </div>
  );
}

export function LocationTab({ cliente }: LocationTabProps) {
  const latitud = cliente.ubicacion?.latitud;
  const longitud = cliente.ubicacion?.longitud;

  const hasLocation = isValidCoordinate(latitud) && isValidCoordinate(longitud);

  const mapsSearchUrl = React.useMemo(() => {
    if (!hasLocation || latitud === undefined || longitud === undefined) {
      return null;
    }

    return buildMapsSearchUrl(latitud, longitud);
  }, [hasLocation, latitud, longitud]);

  const mapsDirectionsUrl = React.useMemo(() => {
    if (!hasLocation || latitud === undefined || longitud === undefined) {
      return null;
    }

    return buildMapsDirectionsUrl(latitud, longitud);
  }, [hasLocation, latitud, longitud]);

  const embedUrl = React.useMemo(() => {
    if (!hasLocation || latitud === undefined || longitud === undefined) {
      return null;
    }

    return buildGoogleMapsEmbedUrl(latitud, longitud);
  }, [hasLocation, latitud, longitud]);

  const handleOpenGoogleMaps = React.useCallback(() => {
    if (!mapsSearchUrl) return;

    window.open(mapsSearchUrl, "_blank", "noopener,noreferrer");
  }, [mapsSearchUrl]);

  const handleStartRoute = React.useCallback(() => {
    if (!mapsDirectionsUrl) return;

    window.open(mapsDirectionsUrl, "_blank", "noopener,noreferrer");
  }, [mapsDirectionsUrl]);

  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="md"
      className="overflow-hidden p-2"
    >
      <AppStack gap="sm">
        <AppInline justify="between" align="start" gap="sm" wrap>
          <AppInline gap="xs" align="start" className="min-w-0">
            <Map size={17} className="mt-0.5 shrink-0" />

            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-tight">
                Ubicación del cliente
              </h2>

              <p className="mt-1 line-clamp-2 text-xs text-[hsl(var(--app-muted-foreground))]">
                {cliente.direccion || "Dirección no especificada"}
              </p>
            </div>
          </AppInline>

          {hasLocation ? (
            <AppInline gap="xs" align="center" justify="end" wrap>
              <AppBadge
                tone="success"
                appearance="soft"
                size="xs"
                radius="full"
              >
                Coordenadas disponibles
              </AppBadge>

              <AppButton
                type="button"
                variant="primary"
                size="xs"
                leftIcon={<ExternalLink size={14} />}
                onClick={handleOpenGoogleMaps}
              >
                Ver en Maps
              </AppButton>

              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                leftIcon={<Navigation size={14} />}
                onClick={handleStartRoute}
              >
                Iniciar ruta
              </AppButton>
            </AppInline>
          ) : null}
        </AppInline>

        <AppGrid cols={{ base: 1, md: 3 }} gap="sm">
          <LocationInfoBox
            label="Dirección"
            value={cliente.direccion}
            icon={<MapPin size={14} />}
          />

          <LocationInfoBox
            label="Sector"
            value={cliente.sector?.nombre}
            icon={<LandPlot size={14} />}
          />

          <LocationInfoBox
            label="Coordenadas"
            value={
              cliente.ubicacion
                ? `${cliente.ubicacion.latitud}, ${cliente.ubicacion.longitud}`
                : null
            }
            icon={<Pin size={14} />}
            mono
          />
        </AppGrid>

        {hasLocation ? (
          <AppStack gap="sm">
            <div className="h-[220px] w-full overflow-hidden rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border))] sm:h-[280px]">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del cliente"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[hsl(var(--app-muted)/0.2)] px-4 text-center">
                  <AppStack gap="xs" className="items-center">
                    <Map
                      size={28}
                      className="text-[hsl(var(--app-muted-foreground))]"
                    />
                    <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                      Falta configurar VITE_GOOGLE_MAPS_EMBED_API_KEY para
                      mostrar el mapa embebido.
                    </p>
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="xs"
                      leftIcon={<ExternalLink size={14} />}
                      onClick={handleOpenGoogleMaps}
                    >
                      Abrir ubicación
                    </AppButton>
                  </AppStack>
                </div>
              )}
            </div>

            <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
              <LocationInfoBox
                label="Latitud"
                value={latitud}
                icon={<MapPin size={14} />}
                mono
              />

              <LocationInfoBox
                label="Longitud"
                value={longitud}
                icon={<MapPin size={14} />}
                mono
              />
            </AppGrid>
          </AppStack>
        ) : (
          <AppAlert
            tone="warning"
            size="sm"
            icon={<Map size={16} />}
            title="Sin ubicación registrada"
          >
            No hay coordenadas disponibles para este cliente. Registra latitud y
            longitud para habilitar mapa y rutas.
          </AppAlert>
        )}
      </AppStack>
    </AppCard>
  );
}
