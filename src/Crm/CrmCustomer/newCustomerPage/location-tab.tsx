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
        "_blank"
      );
    }
  };

  const iniciarRuta = () => {
    if (cliente.ubicacion) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`,
        "_blank"
      );
    }
  };

  return (
    <div className="space-y-4 p-4">
      {" "}
      {/* Añadido padding general */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          {" "}
          {/* Ajustado padding-bottom */}
          <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
            {" "}
            {/* Título más grande y con color */}
            <Map className="h-4 w-4 mr-2 text-primary dark:text-white" />
            Ubicación del Cliente
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {" "}
            {/* Tamaño de texto y color */}
            Dirección: {cliente.direccion || "Dirección no especificada"}
          </CardDescription>
          <CardDescription className="text-sm text-muted-foreground">
            {" "}
            {/* Tamaño de texto y color */}
            Sector: {cliente.sector?.nombre || "Sector no especificado"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cliente.ubicacion ? (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                {" "}
                {/* Borde más claro */}
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
              <div className="flex flex-col sm:flex-row gap-3">
                {" "}
                {/* Espaciado entre botones */}
                <Button
                  onClick={abrirGoogleMaps}
                  className="flex-1 text-sm"
                  size="sm" // Tamaño de botón consistente
                >
                  <ExternalLink className="h-4 w-4 mr-2" />{" "}
                  {/* Icono más grande */}
                  Ver en Maps
                </Button>
                <Button
                  onClick={iniciarRuta}
                  variant="outline"
                  className="flex-1 text-sm bg-transparent"
                  size="sm" // Tamaño de botón consistente
                >
                  <Navigation className="h-4 w-4 mr-2" />{" "}
                  {/* Icono más grande */}
                  Iniciar Ruta
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {" "}
                {/* Espaciado y tamaño de texto */}
                <div>
                  <p className="font-medium text-muted-foreground">Latitud</p>
                  <p className="font-mono text-gray-900 dark:text-gray-50">
                    {cliente.ubicacion.latitud}
                  </p>{" "}
                  {/* Color de texto */}
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Longitud</p>
                  <p className="font-mono text-gray-900 dark:text-gray-50">
                    {cliente.ubicacion.longitud}
                  </p>{" "}
                  {/* Color de texto */}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Map className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />{" "}
              {/* Icono más grande y margen */}
              <p className="mt-2 text-base text-muted-foreground">
                No hay información de ubicación disponible.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
