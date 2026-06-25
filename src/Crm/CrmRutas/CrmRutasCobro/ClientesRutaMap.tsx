"use client";

import * as React from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { ClienteRutaMapItem } from "./_components/ruta-cobro.helpers";

interface PropsClientes {
  clientes: ClienteRutaMapItem[];
  selectedClientId?: number | null;
  onSelectClient?: (clienteId: number | null) => void;
}

const DEFAULT_CENTER = {
  lat: 15.666148,
  lng: -91.709069,
};

function isValidLocation(location?: { lat: number; lng: number } | null) {
  return (
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng) &&
    Math.abs(location.lat) <= 90 &&
    Math.abs(location.lng) <= 180
  );
}

function hasPendingInvoices(cliente: ClienteRutaMapItem) {
  return cliente.facturas.some((factura) => factura.estadoFactura !== "PAGADA");
}

function getClienteStatus(cliente: ClienteRutaMapItem) {
  if (!cliente.facturas.length) {
    return {
      label: "Sin facturas",
      tone: "neutral" as const,
      markerClass:
        "bg-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
    };
  }

  if (hasPendingInvoices(cliente)) {
    return {
      label: "Pendiente",
      tone: "danger" as const,
      markerClass: "bg-[hsl(var(--app-danger,var(--destructive)))]",
    };
  }

  return {
    label: "Pagado",
    tone: "success" as const,
    markerClass: "bg-[hsl(var(--app-success))]",
  };
}

function getRouteStrokeColor() {
  if (typeof window === "undefined") return "#2563eb";

  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue("--app-primary")
    .trim();

  return primary ? `hsl(${primary})` : "#2563eb";
}

function RouteDirections({ clientes }: { clientes: ClienteRutaMapItem[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (!map || clientes.length < 2) return;

    const service = new google.maps.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      suppressInfoWindows: true,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: getRouteStrokeColor(),
        strokeWeight: 4,
        strokeOpacity: 0.78,
      },
      map,
    });

    const waypoints = clientes.slice(1, -1).map((cliente) => ({
      location: cliente.location,
      stopover: true,
    }));

    service.route(
      {
        origin: clientes[0].location,
        destination: clientes[clientes.length - 1].location,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          renderer.setDirections(result);
          return;
        }

        console.warn("No se pudo dibujar la ruta en Google Maps:", status);
      },
    );

    return () => renderer.setMap(null);
  }, [map, clientes]);

  return null;
}

function MapSelectionSync({ cliente }: { cliente: ClienteRutaMapItem | null }) {
  const map = useMap();

  React.useEffect(() => {
    if (!map || !cliente) return;

    map.panTo(cliente.location);

    const currentZoom = map.getZoom() ?? 16;
    if (currentZoom < 17) {
      map.setZoom(17);
    }
  }, [map, cliente]);

  return null;
}

function ClienteMarker({
  cliente,
  selected,
  onSelect,
}: {
  cliente: ClienteRutaMapItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const status = getClienteStatus(cliente);

  return (
    <button
      type="button"
      aria-label={`Seleccionar cliente ${cliente.nombreCompleto}`}
      aria-pressed={selected}
      onClick={onSelect}
      className="group relative flex flex-col items-center outline-none"
    >
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition-transform group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
          status.markerClass,
          selected ? "scale-110" : "",
        ].join(" ")}
      >
        <UserRound size={13} />
      </span>

      <span
        className={[
          "mt-[-1px] h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent",
          status.markerClass.replace("bg-", "border-t-"),
        ].join(" ")}
      />

      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 max-w-[220px] -translate-x-1/2 truncate rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-popover,var(--popover)))] px-2 py-1 text-[11px] font-medium text-[hsl(var(--app-popover-foreground,var(--popover-foreground)))] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {cliente.nombreCompleto}
      </span>
    </button>
  );
}

function MapInfoWindowContent({
  cliente,
  onClose,
}: {
  cliente: ClienteRutaMapItem;
  onClose: () => void;
}) {
  const status = getClienteStatus(cliente);
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${cliente.location.lat},${cliente.location.lng}`;

  return (
    <div className="w-[300px] overflow-hidden rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-popover,var(--popover)))] text-[hsl(var(--app-popover-foreground,var(--popover-foreground)))] shadow-sm">
      <AppStack gap="sm" className="p-3">
        <AppInline align="start" justify="between" gap="sm">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold leading-5">
              {cliente.nombreCompleto}
            </h2>

            <p className="line-clamp-2 text-[11px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {cliente.direccion || "Sin dirección registrada"}
            </p>
          </div>

          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            width="auto"
            aria-label="Cerrar detalle del cliente"
            onClick={onClose}
            className="h-7 px-2"
          >
            <X size={13} />
          </AppButton>
        </AppInline>

        <AppInline align="center" gap="xs" wrap>
          <AppBadge tone={status.tone} appearance="soft" size="xs">
            {status.label}
          </AppBadge>

          <AppBadge tone="info" appearance="soft" size="xs">
            {cliente.facturas.length} factura
            {cliente.facturas.length === 1 ? "" : "s"}
          </AppBadge>
        </AppInline>

        <div className="rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted)))/0.35] p-2">
          <AppStack gap="xs">
            <AppInline align="center" gap="xs" className="min-w-0">
              <Phone
                size={13}
                className="shrink-0 text-[hsl(var(--app-primary))]"
              />
              <span className="truncate text-xs">
                {cliente.telefono || "Sin teléfono registrado"}
              </span>
            </AppInline>

            <AppInline align="center" gap="xs" className="min-w-0">
              <Phone
                size={13}
                className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
              />
              <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Ref:{" "}
                {cliente.contactoReferencia?.telefono ||
                  "Referencia no registrada"}
              </span>
            </AppInline>
          </AppStack>
        </div>

        <AppInline align="center" gap="xs" className="min-w-0">
          <MapPin
            size={13}
            className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          />

          <span className="truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {cliente.location.lat.toFixed(5)}, {cliente.location.lng.toFixed(5)}
          </span>
        </AppInline>

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="full"
          asChild
        >
          <a href={mapsHref} target="_blank" rel="noopener noreferrer">
            <Navigation size={13} />
            Iniciar ruta en Maps
            <ExternalLink size={12} />
          </a>
        </AppButton>
      </AppStack>
    </div>
  );
}

export default function Maps({
  clientes,
  selectedClientId,
  onSelectClient,
}: PropsClientes) {
  const [internalSelectedClientId, setInternalSelectedClientId] =
    React.useState<number | null>(null);

  const validClientes = React.useMemo(
    () => clientes.filter((cliente) => isValidLocation(cliente.location)),
    [clientes],
  );

  const activeClientId = selectedClientId ?? internalSelectedClientId;

  const selectedClient = React.useMemo(
    () =>
      validClientes.find((cliente) => cliente.id === activeClientId) ?? null,
    [activeClientId, validClientes],
  );

  const handleSelectClient = React.useCallback(
    (clienteId: number | null) => {
      setInternalSelectedClientId(clienteId);
      onSelectClient?.(clienteId);
    },
    [onSelectClient],
  );

  const defaultCenter = validClientes[0]?.location ?? DEFAULT_CENTER;

  return (
    <GoogleMap
      mapId="e209b83095802909"
      defaultZoom={16}
      defaultCenter={defaultCenter}
      mapTypeId="satellite"
      gestureHandling="greedy"
      streetViewControl={false}
      fullscreenControl
      mapTypeControl
      className="h-full w-full"
    >
      <RouteDirections clientes={validClientes} />

      <MapSelectionSync cliente={selectedClient} />

      {validClientes.map((cliente) => (
        <AdvancedMarker
          key={cliente.id}
          position={cliente.location}
          onClick={() => handleSelectClient(cliente.id)}
        >
          <ClienteMarker
            cliente={cliente}
            selected={cliente.id === activeClientId}
            onSelect={() => handleSelectClient(cliente.id)}
          />
        </AdvancedMarker>
      ))}

      {selectedClient ? (
        <InfoWindow
          position={selectedClient.location}
          onCloseClick={() => handleSelectClient(null)}
        >
          <MapInfoWindowContent
            cliente={selectedClient}
            onClose={() => handleSelectClient(null)}
          />
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
}
