"use client";

import { Map, ExternalLink, Navigation } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

interface LocationTabProps {
  cliente: ClienteDetailsDto;
}

export function LocationTab({ cliente }: LocationTabProps) {
  const abrirGoogleMaps = () => {
    if (cliente.ubicacion) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`,
        "_blank",
      );
    }
  };

  const iniciarRuta = () => {
    if (cliente.ubicacion) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`,
        "_blank",
      );
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <Map className="h-4 w-4 mr-2 text-primary dark:text-white" />
          Ubicación del Cliente
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground">
          Dirección: {cliente.direccion || "Dirección no especificada"}
        </CardDescription>
        <CardDescription className="text-xs text-muted-foreground">
          Sector: {cliente.sector?.nombre || "Sector no especificado"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {cliente.ubicacion ? (
          <div className="space-y-3">
            {/* MAPA COMPACTO */}
            <div
              className="
              w-full
              overflow-hidden
              rounded-md
              border border-gray-200 dark:border-gray-700
              h-[220px] sm:h-[260px]   
            "
            >
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD_hzrV-YS5EaHDm-UK3jL0ny6gsJoj_18&q=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del cliente"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={abrirGoogleMaps}
                className="flex-1 text-xs"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Ver en Maps
              </Button>
              <Button
                onClick={iniciarRuta}
                variant="outline"
                className="flex-1 text-xs"
                size="sm"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Iniciar Ruta
              </Button>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-medium text-muted-foreground">Latitud</p>
                <p className="font-mono text-gray-900 dark:text-gray-50">
                  {cliente.ubicacion.latitud}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Longitud</p>
                <p className="font-mono text-gray-900 dark:text-gray-50">
                  {cliente.ubicacion.longitud}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Map className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No hay información de ubicación disponible.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
