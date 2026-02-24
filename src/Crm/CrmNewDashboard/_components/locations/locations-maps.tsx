"use client";

import { RealTimeLocationRaw } from "@/Crm/features/real-time-location/real-time-location";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin, ExternalLink, Phone, Ticket, Cog } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { CustomMapControls } from "./custom-maps-control";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleCall, handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";

interface Props {
  personas: RealTimeLocationRaw[];
  markerSize?: "sm" | "md" | "lg";
}

const MarkerIcon = ({
  sizeClass,
  isHovered,
  name,
}: {
  sizeClass: string;
  isHovered: boolean;
  name: string;
}) => {
  // Obtenemos la primera letra (o "?" si viniera vacío)
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative flex flex-col items-center transition-transform duration-200 hover:scale-110">
      <div
        className={`flex items-center justify-center rounded-full border-2 border-rose-600 shadow-lg ${sizeClass} ${
          isHovered ? " z-50" : ""
        } text-white transition-colors overflow-hidden`}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />

          <AvatarFallback className="bg-rose-600 text-white font-bold">
            {initial || "X"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Triángulo del marcador (Punta) */}
      <div
        className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent -mt-[1px] ${
          // CAMBIO: De sky a red para coincidir con el círculo
          isHovered ? "border-t-rose-600" : "border-t-rose-600"
        }`}
      />
    </div>
  );
};

const PersonaInfoWindow = ({ location }: { location: RealTimeLocationRaw }) => (
  <div className="px-1 py-1 max-w-[200px]">
    <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">
      {location.usuario.nombre}
    </h3>

    <div className="flex items-center gap-1.5 text-slate-500 mb-2 text-xs">
      <MapPin className="w-3 h-3 shrink-0" />
      <span>
        {location.latitud.toFixed(4)}, {location.longitud.toFixed(4)}
      </span>
    </div>

    <div className="flex items-center gap-1.5 text-slate-500 mb-2 text-xs">
      <Phone className="w-3 h-3 shrink-0" />
      <span>
        {handleOpenWhatsapp(location.usuario?.telefono ?? "40017273")}
      </span>
    </div>

    <div className="flex items-center gap-1.5 text-slate-500 mb-2 text-xs">
      <Phone className="w-3 h-3 shrink-0" />
      <span>{handleCall(location.usuario?.telefono ?? "40017273")}</span>
    </div>

    <div className="">
      <Ticket />
      <div className="">
        {location.ticketsEnProceso.length &&
          location.ticketsEnProceso.map((t) => (
            <div className="">
              <span className="text-xs text-black">{t.titulo}</span>
              <Cog className="animate-spin text-black" />
            </div>
          ))}
      </div>
    </div>

    <a
      href={`https://www.google.com/maps/search/?api=1&query=${location.latitud},${location.longitud}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded transition-colors w-full justify-center"
    >
      <span>Abrir en Maps</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  </div>
);

// --- Componente Lógico para Auto-Zoom ---
const MapBoundsHandler = ({
  personas,
}: {
  personas: RealTimeLocationRaw[];
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || personas.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    personas.forEach((p) => {
      if (typeof p.latitud === "number" && typeof p.longitud === "number") {
        bounds.extend({
          lat: p.latitud,
          lng: p.longitud,
        });
      }
    });

    map.fitBounds(bounds);

    if (personas.length === 1) {
      map.setZoom(14);
    }
  }, [map, personas]);

  return null;
};

// --- Componente Principal ---
const LocationsMaps = ({ personas, markerSize = "md" }: Props) => {
  const [selected, setSelected] = useState<RealTimeLocationRaw | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const validPersonas = useMemo(() => {
    return personas.filter(
      (p) =>
        typeof p.latitud === "number" &&
        typeof p.longitud === "number" &&
        !isNaN(p.latitud) &&
        !isNaN(p.longitud) &&
        Math.abs(p.latitud) <= 90,
    );
  }, [personas]);

  const markerSizeClass = useMemo(() => {
    switch (markerSize) {
      case "lg":
        return "w-10 h-10";
      case "sm":
        return "w-6 h-6";
      default:
        return "w-8 h-8";
    }
  }, [markerSize]);

  const defaultCenter = { lat: 15.679026415483003, lng: -91.74822125438106 };
  console.log("Los objetos validos son: ", validPersonas);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-slate-200 relative bg-slate-100">
      <Map
        mapId="e209b83095802909"
        defaultZoom={12}
        defaultCenter={defaultCenter}
        className="w-full h-full min-h-[250px]"
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapTypeId="hybrid"
      >
        <MapBoundsHandler personas={validPersonas} />
        <CustomMapControls />
        {validPersonas.map((persona) => (
          <AdvancedMarker
            key={persona.usuarioId}
            position={{
              lat: persona.latitud,
              lng: persona.longitud,
            }}
            onClick={() => setSelected(persona)}
            zIndex={hoveredId === persona.usuarioId ? 50 : 1}
          >
            <div
              onMouseEnter={() => setHoveredId(persona.usuarioId)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer group"
            >
              <MarkerIcon
                name={persona.usuario.nombre}
                sizeClass={markerSizeClass}
                isHovered={
                  hoveredId === persona.usuarioId ||
                  selected?.usuarioId === persona.usuarioId
                }
              />
            </div>
          </AdvancedMarker>
        ))}

        {selected && (
          <InfoWindow
            position={{
              lat: selected.latitud,
              lng: selected.longitud,
            }}
            onCloseClick={() => setSelected(null)}
            pixelOffset={[0, -35]}
            maxWidth={250}
          >
            <PersonaInfoWindow location={selected} />
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};

export default LocationsMaps;
