"use client";

import { Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { MapPin, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

interface Ubicacion {
  lat: number;
  lng: number;
}

interface PersonaCampo {
  id: number;
  nombreCompleto: string;
  location: Ubicacion;
}

interface Props {
  personas: PersonaCampo[]; // técnicos / cobradores
  markerSize?: "sm" | "md" | "lg";
}
// 15.6856374,-91.7258307,9655
// 15.693597981941389, -91.75146089854971
const DEFAULT_CENTER: Ubicacion = {
  lat: 15.680725671712013,
  lng: -91.74167906942935,

  // 15.686623347194244, -91.74914015069805

  // 15.680725671712013, -91.74167906942935
};

const LocationsMaps = ({ personas, markerSize = "md" }: Props) => {
  const [selected, setSelected] = useState<PersonaCampo | null>(null);

  const isValidLocation = (location: Ubicacion) =>
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    !isNaN(location.lat) &&
    !isNaN(location.lng) &&
    Math.abs(location.lat) <= 90 &&
    Math.abs(location.lng) <= 180;

  const validPersonas = useMemo(
    () => personas.filter((p) => isValidLocation(p.location)),
    [personas]
  );

  // Centro inicial: primero válido o centro por defecto
  const initialCenter: Ubicacion = DEFAULT_CENTER;

  const markerSizeClass =
    markerSize === "lg"
      ? "w-9 h-9"
      : markerSize === "sm"
      ? "w-5 h-5"
      : "w-7 h-7";

  const CustomMarker = ({ persona }: { persona: PersonaCampo }) => (
    <div className="relative group">
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center rounded-full bg-sky-500 text-white shadow-md ${markerSizeClass}`}
        >
          <UserRound className="w-3 h-3" />
        </div>
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-sky-500 -mt-[1px]" />
      </div>

      {/* Tooltip con el nombre */}
      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        {persona.nombreCompleto}
      </div>
    </div>
  );

  const InfoContent = ({ persona }: { persona: PersonaCampo }) => (
    <div className="bg-white text-slate-900 rounded-md shadow-md border border-slate-200 p-2 text-xs w-[220px]">
      <p className="font-semibold text-sm mb-1">{persona.nombreCompleto}</p>

      <div className="flex items-center gap-1 text-slate-600 mb-1">
        <MapPin className="w-3 h-3" />
        <span>
          {persona.location.lat.toFixed(5)}, {persona.location.lng.toFixed(5)}
        </span>
      </div>

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${persona.location.lat},${persona.location.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-sky-600 hover:text-sky-700 underline"
      >
        Ver en Google Maps
      </a>
    </div>
  );

  return (
    <Map
      mapId="e209b83095802909"
      defaultZoom={12}
      defaultCenter={initialCenter}
      className="w-full h-56 lg:h-full rounded-lg overflow-hidden"
      // Interacción
      gestureHandling="greedy" // permite mover y hacer zoom con scroll/pinch
      scrollwheel={true}
      // Controles de UI
      disableDefaultUI={true} // apaga todos los controles por defecto
      zoomControl={false} // sin botones +/-
      streetViewControl={false} // sin hombrecito amarillo
      mapTypeControl={false} // sin botón para cambiar tipo de mapa
      fullscreenControl={true} // dejamos solo pantalla completa
      // Tipo de mapa inicial: satélite
      // mapTypeId="hybrid"
      mapTypeId="hybrid"
    >
      {validPersonas.map((persona) => (
        <AdvancedMarker
          key={persona.id}
          position={persona.location}
          onClick={() => setSelected(persona)}
        >
          <CustomMarker persona={persona} />
        </AdvancedMarker>
      ))}

      {selected && (
        <InfoWindow
          position={selected.location}
          onCloseClick={() => setSelected(null)}
        >
          <InfoContent persona={selected} />
        </InfoWindow>
      )}
    </Map>
  );
};

export default LocationsMaps;
