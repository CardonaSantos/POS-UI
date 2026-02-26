import { MapControl, ControlPosition, useMap } from "@vis.gl/react-google-maps";
import { Plus, Minus, Layers, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomMapControls = () => {
  const map = useMap();

  if (!map) return null;

  const handleZoomIn = () => map.setZoom((map.getZoom() || 12) + 1);
  const handleZoomOut = () => map.setZoom((map.getZoom() || 12) - 1);
  const toggleMapType = () => {
    const currentType = map.getMapTypeId();
    map.setMapTypeId(currentType === "hybrid" ? "roadmap" : "hybrid");
  };

  const handleFullscreen = () => {
    // Obtenemos el contenedor HTML del mapa
    const mapDiv = map.getDiv();

    if (mapDiv) {
      if (!document.fullscreenElement) {
        mapDiv
          .requestFullscreen()
          .catch((err) =>
            console.error("Error al poner pantalla completa:", err),
          );
      } else {
        document.exitFullscreen();
      }
    }
  };
  return (
    // Colocamos los controles arriba a la derecha
    <MapControl position={ControlPosition.RIGHT_TOP}>
      {/* Contenedor con fondo semi-transparente y efecto blur */}
      <div className="flex flex-col gap-0.5 m-2 p-0.5 bg-white/60 dark:bg-slate-900/60 opacity-60 hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm rounded-md shadow-sm border border-slate-200/50 dark:border-slate-700/50">
        {/* Botón Cambiar Capa (Satélite/Mapa) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-slate-200/70 dark:hover:bg-slate-800/70"
          onClick={toggleMapType}
          title="Cambiar vista"
        >
          <Layers className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
        </Button>

        {/* Botón Pantalla Completa */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-slate-200/70 dark:hover:bg-slate-800/70"
          onClick={handleFullscreen}
          title="Pantalla Completa"
        >
          <Maximize className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
        </Button>

        <div className="h-px w-full bg-slate-300/50 dark:bg-slate-600/50 my-0.5" />

        {/* Botón Zoom In */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-slate-200/70 dark:hover:bg-slate-800/70"
          onClick={handleZoomIn}
          title="Acercar"
        >
          <Plus className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
        </Button>

        {/* Botón Zoom Out */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-slate-200/70 dark:hover:bg-slate-800/70"
          onClick={handleZoomOut}
          title="Alejar"
        >
          <Minus className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
        </Button>
      </div>
    </MapControl>
  );
};
