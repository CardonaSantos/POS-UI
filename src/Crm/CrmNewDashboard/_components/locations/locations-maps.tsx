"use client";
import { RealTimeLocationRaw } from "@/Crm/features/real-time-location/real-time-location";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import {
  MapPin,
  ExternalLink,
  Phone,
  Ticket,
  Cog,
  MessageCircle,
  Gauge,
  Clock,
  Battery,
  X,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { CustomMapControls } from "./custom-maps-control";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleCall, handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";
import dayjs from "dayjs";

interface Props {
  personas: RealTimeLocationRaw[];
  markerSize?: "sm" | "md" | "lg";
}
const MarkerIcon = ({
  sizeClass,
  isHovered,
  name,
  avatarUrl,
  rol,
}: {
  sizeClass: string;
  isHovered: boolean;
  name: string;
  avatarUrl?: string;
  rol?: string;
}) => {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  let theme = {
    border: "border-rose-600",
    bg: "bg-rose-600",
    triangle: "border-t-rose-600",
  };

  if (rol === "ADMIN") {
    theme = {
      border: "border-emerald-600",
      bg: "bg-emerald-600",
      triangle: "border-t-emerald-600",
    };
  } else if (rol === "COBRADOR") {
    theme = {
      border: "border-purple-600",
      bg: "bg-purple-600",
      triangle: "border-t-purple-600",
    };
  }

  return (
    <div className="relative flex flex-col items-center transition-transform duration-200 hover:scale-110 cursor-pointer">
      <div
        // 1. CAMBIO: Reemplazamos "bg-white" por theme.bg
        className={`flex items-center justify-center rounded-full border-[3px] ${theme.border} shadow-lg ${sizeClass} ${
          isHovered ? "z-50 scale-110" : theme.bg
        } text-white transition-all overflow-hidden`}
      >
        <Avatar className="h-full w-full border-none">
          {/* 2. CAMBIO: Añadimos object-cover y tamaño full a la imagen */}
          <AvatarImage src={avatarUrl} className="object-cover w-full h-full" />

          <AvatarFallback
            className={`${theme.bg} text-white font-bold text-xs`}
          >
            {initial || "X"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div
        className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent -mt-[1px] ${theme.triangle}`}
      />
    </div>
  );
};
export const PersonaInfoWindow = ({
  location,
}: {
  location: RealTimeLocationRaw;
}) => {
  if (!location) return null;

  const fechaActualizacion = new Date(location.actualizadoEn);
  const horaFormateada = dayjs(fechaActualizacion).fromNow();

  const batteryColor =
    location.bateria !== undefined && location.bateria > 20
      ? "text-emerald-500"
      : "text-rose-500";

  const roleStyle =
    location.usuario.rol === "ADMIN"
      ? "bg-rose-100 text-rose-700"
      : "bg-blue-100 text-blue-700";

  return (
    // Reducido a 180px de ancho y gap-1 para que sea ultra compacto
    <div className="flex flex-col gap-1 w-[180px] font-sans">
      {/* 1. Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col max-w-[125px]">
          <h3 className="font-bold text-slate-800 text-[11px] leading-tight truncate">
            {location.usuario.nombre}
          </h3>
          <span className="text-slate-500 text-[9px] flex items-center gap-0.5 mt-0.5 truncate">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">
              {location.latitud.toFixed(4)}, {location.longitud.toFixed(4)}
            </span>
          </span>
        </div>
        <span
          className={`text-[8px] px-1 py-0.5 rounded font-bold tracking-wider shrink-0 ${roleStyle}`}
        >
          {location.usuario.rol}
        </span>
      </div>

      {/* 2. Estadísticas */}
      <div className="grid grid-cols-3 gap-0.5 bg-slate-50 border border-slate-100 p-1 rounded text-[9px] text-slate-600">
        <div className="flex flex-col items-center justify-center text-center">
          <Battery className={`w-3 h-3 mb-0.5 ${batteryColor}`} />
          <span className="font-medium">{location.bateria}%</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
          <Gauge className="w-3 h-3 mb-0.5 text-sky-500" />
          <span className="font-medium">{location.velocidad} km/h</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Clock className="w-3 h-3 mb-0.5 text-amber-500" />
          <span className="font-medium">{horaFormateada}</span>
        </div>
      </div>

      {/* 3. Tickets */}
      {location.ticketsEnProceso && location.ticketsEnProceso.length > 0 && (
        <div className="border border-slate-200 rounded overflow-hidden bg-white">
          <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 text-slate-700 border-b border-slate-100">
            <Ticket className="w-2.5 h-2.5 text-indigo-500" />
            <span className="text-[9px] font-bold">
              Tickets ({location.ticketsEnProceso.length})
            </span>
          </div>
          <div className="flex flex-col max-h-[50px] overflow-y-auto custom-scrollbar p-0.5 gap-0.5">
            {location.ticketsEnProceso.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-slate-50/50 px-1 py-0.5 rounded text-[9px]"
              >
                <span className="truncate pr-1 text-slate-700 font-medium">
                  {t.titulo}
                </span>
                <Cog className="w-2.5 h-2.5 animate-spin text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Acciones */}
      <div className="flex flex-col gap-1 mt-0.5">
        <div className="grid grid-cols-2 gap-1">
          <a
            href={handleOpenWhatsapp(location.usuario?.telefono ?? "40017273")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-[9px] font-medium bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5] rounded py-1 border border-[#a7f3d0] transition-colors"
          >
            <MessageCircle className="w-3 h-3 shrink-0" />
            <span>WhatsApp</span>
          </a>

          <a
            href={handleCall(location.usuario?.telefono ?? "40017273")}
            className="flex items-center justify-center gap-1 text-[9px] font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 rounded py-1 border border-sky-200 transition-colors"
          >
            <Phone className="w-3 h-3 shrink-0" />
            <span>Llamar</span>
          </a>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${location.latitud},${location.longitud}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-[10px] font-semibold text-white bg-slate-800 hover:bg-slate-700 py-1 rounded transition-colors w-full shadow-sm"
        >
          <span>Abrir en Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

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
        return "w-9 h-9";
    }
  }, [markerSize]);

  const defaultCenter = { lat: 15.679026415483003, lng: -91.74822125438106 };

  return (
    <div className="w-ful  h-full rounded-xl overflow-hidden shadow-inner border border-slate-200 relative bg-slate-100">
      <Map
        mapId="e209b83095802909"
        defaultZoom={12}
        defaultCenter={defaultCenter}
        onClick={() => setSelected(null)}
        className="w-full h-full min-h-[250px]"
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapTypeId="hybrid"
      >
        <MapBoundsHandler personas={validPersonas} />
        <CustomMapControls />
        <MapSelectionPanner selected={selected} />

        {/* Marcadores */}
        {validPersonas.map((persona) => (
          <AdvancedMarker
            key={persona.usuarioId}
            position={{ lat: persona.latitud, lng: persona.longitud }}
            // Usamos e.stop() para evitar que el click llegue al mapa y cierre el popup instantáneamente
            onClick={(e) => {
              e.stop();
              setSelected(persona);
            }}
            zIndex={selected?.usuarioId === persona.usuarioId ? 50 : 1}
          >
            <div
              onMouseEnter={() => setHoveredId(persona.usuarioId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <MarkerIcon
                rol={persona.usuario.rol}
                avatarUrl={persona.usuario.avatarUrl}
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

        {/* Popup Customizado */}
        {selected && (
          <AdvancedMarker
            position={{ lat: selected.latitud, lng: selected.longitud }}
            zIndex={100}
          >
            <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-2 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(null);
                  }}
                  className="absolute top-1 right-1 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
                >
                  <X className="w-3 h-3" />
                </button>

                <PersonaInfoWindow location={selected} />
              </div>
              {/* Triángulo indicador */}
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-white drop-shadow-sm -mt-[1px]" />
            </div>
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
};

const MapSelectionPanner = ({
  selected,
}: {
  selected: RealTimeLocationRaw | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !selected) return;

    const currentZoom = map.getZoom() || 14;

    // ¿Cuántos píxeles queremos "empujar" el marcador hacia abajo?
    // 150px es un buen tamaño para cubrir la altura de tu popup ultra compacto
    const PIXELS_TO_OFFSET = 100;

    // Fórmula para convertir píxeles de pantalla a grados de latitud según el zoom actual.
    // (Matemática pura basada en la proyección Web Mercator de Google Maps)
    const latOffset =
      (PIXELS_TO_OFFSET / 256) * (360 / Math.pow(2, currentZoom));

    // Hacemos el paneo suave
    map.panTo({
      // Al SUMAR el offset a la latitud, la cámara del mapa se mueve hacia el Norte.
      // Visualmente, esto empuja el marcador hacia el Sur (abajo), dejando espacio arriba.
      lat: Number(selected.latitud) + latOffset,
      lng: Number(selected.longitud),
    });
  }, [map, selected]);

  return null;
};

export default LocationsMaps;
