"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
  //   MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

// --- Tipos Genéricos ---

export interface GeoLocation {
  lat: number;
  lng: number;
}

// Interfaz base que deben tener los items para ser mostrados
export interface MapItem {
  id: string | number;
  location: GeoLocation;
  [key: string]: any; // Permite propiedades extra
}

interface UniversalMapProps<T extends MapItem> {
  // Datos
  items: T[];

  // Configuración Visual
  mapId?: string; // ID de estilo de Google Maps Console
  className?: string;
  defaultZoom?: number;
  defaultCenter?: GeoLocation;

  // Comportamiento
  enableRouting?: boolean; // ¿Dibujar línea entre puntos?
  fitBoundsToMarkers?: boolean; // ¿Auto-zoom para ver todos los marcadores?

  // Render Props (Personalización de UI)
  renderMarker?: (item: T, isSelected: boolean) => React.ReactNode;
  renderInfoContent?: (item: T, onClose: () => void) => React.ReactNode;

  // Eventos
  onMarkerClick?: (item: T) => void;
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
}

export const UniversalMap = <T extends MapItem>({
  items,
  mapId = "e209b83095802909", // Tu ID por defecto
  className = "w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-sm",
  defaultZoom = 12,
  defaultCenter = { lat: 15.666148, lng: -91.709069 },
  enableRouting = false,
  fitBoundsToMarkers = true,
  renderMarker,
  renderInfoContent,
  onMarkerClick,
  mapType,
}: UniversalMapProps<T>) => {
  const map = useMap();
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  // 1. Filtrar ubicaciones inválidas para evitar errores de Google Maps
  const validItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.location && !isNaN(item.location.lat) && !isNaN(item.location.lng),
    );
  }, [items]);

  // 2. Efecto: Auto-Zoom (Fit Bounds)
  useEffect(() => {
    if (!map || !fitBoundsToMarkers || validItems.length === 0) return;

    if (validItems.length === 1) {
      // Si solo hay uno, centrar y hacer zoom
      map.setCenter(validItems[0].location);
      map.setZoom(16);
    } else {
      // Si hay varios, crear un cuadro delimitador (Bounds)
      const bounds = new google.maps.LatLngBounds();
      validItems.forEach((item) => bounds.extend(item.location));
      map.fitBounds(bounds);
    }
  }, [map, validItems, fitBoundsToMarkers]);

  // 3. Efecto: Rutas (Directions Service)
  useEffect(() => {
    if (!map || !enableRouting || validItems.length < 2) return;

    const service = new google.maps.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      suppressInfoWindows: true,
      preserveViewport: true, // Importante: no pelear con el fitBounds manual
      polylineOptions: {
        strokeColor: "#2563eb", // Tailwind Blue-600
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
      map,
    });

    const waypoints = validItems.slice(1, -1).map((item) => ({
      location: item.location,
      stopover: true,
    }));

    service.route(
      {
        origin: validItems[0].location,
        destination: validItems[validItems.length - 1].location,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          renderer.setDirections(result);
        } else {
          console.warn("No se pudo trazar la ruta:", status);
        }
      },
    );

    return () => {
      renderer.setMap(null);
    };
  }, [map, validItems, enableRouting]);

  const handleMarkerClick = useCallback(
    (item: T) => {
      setSelectedItem(item);
      if (onMarkerClick) onMarkerClick(item);
    },
    [onMarkerClick],
  );

  return (
    <div className={className}>
      <Map
        mapId={mapId}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        className="w-full h-full"
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        mapTypeId={mapType}
      >
        {validItems.map((item) => (
          <AdvancedMarker
            key={item.id}
            position={item.location}
            onClick={() => handleMarkerClick(item)}
            className="z-10 hover:z-20"
          >
            {renderMarker ? (
              renderMarker(item, selectedItem?.id === item.id)
            ) : (
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md" />
            )}
          </AdvancedMarker>
        ))}

        {selectedItem && renderInfoContent && (
          <InfoWindow
            position={selectedItem.location}
            onCloseClick={() => setSelectedItem(null)}
            maxWidth={350}
          >
            {renderInfoContent(selectedItem, () => setSelectedItem(null))}
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};
