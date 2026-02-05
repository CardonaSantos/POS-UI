"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapIcon, MapPin } from "lucide-react";
import ReactSelectComponent from "react-select";
import { LocationSectionProps } from "./customer-form-types";
import { UniversalMap } from "../CrmMapsUtils/MapUtils.utils";
import { useMemo } from "react";

export function LocationSection({
  formData,
  depaSelected,
  muniSelected,
  sectorSelected,
  optionsDepartamentos,
  optionsMunis,
  optionsSectores,
  secureDepartamentos,
  secureMunicipios,
  secureSectores,
  onChangeForm,
  onSelectDepartamento,
  onSelectMunicipio,
  onSelectSector,
}: LocationSectionProps) {
  const mapItems = useMemo(() => {
    if (!formData.coordenadas) return [];

    // Intentamos separar por coma (ej: "15.5, -90.2")
    const parts = formData.coordenadas.split(",");

    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());

      // Validamos que sean números reales
      if (!isNaN(lat) && !isNaN(lng)) {
        return [
          {
            id: "ubicacion-actual", // ID temporal requerido por UniversalMap
            location: { lat, lng },
          },
        ];
      }
    }
    return []; // Si no es válido, retornamos array vacío
  }, [formData.coordenadas]);

  return (
    <div className="space-y-4">
      {/* HEADER: Sin opacidad, negro estándar */}
      <h3 className="font-medium flex items-center gap-2 text-sm border-b pb-2">
        <MapIcon className="h-4 w-4" />
        Ubicación y Contacto
      </h3>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="h-[200px] w-full relative">
          <UniversalMap
            items={mapItems}
            mapType="hybrid"
            enableRouting={false}
            fitBoundsToMarkers={true}
            defaultZoom={15}
            className="w-full h-full"
            renderMarker={() => (
              <div className="relative -mt-6 -ml-3 animate-bounce">
                <MapPin className="w-8 h-8 text-red-600 drop-shadow-md fill-red-100" />
                <div className="w-2 h-2 bg-black/50 rounded-full blur-[2px] mx-auto mt-[-5px]" />
              </div>
            )}
          />
        </div>

        {/* FOOTER MAPA: Sin fondo gris (bg-muted/20 eliminado) */}
        <div className="p-3 border-t flex gap-2 items-center">
          <MapPin className="h-4 w-4 shrink-0" />
          <Input
            id="coordenadas"
            name="coordenadas"
            value={formData.coordenadas}
            onChange={onChangeForm}
            placeholder="Pegar coordenadas (Ej: 15.66, -91.70)"
            className="h-8 text-xs bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {/* Departamento */}
        <div className="space-y-1">
          {/* LABEL: Eliminado text-muted-foreground */}
          <Label htmlFor="departamento" className="text-xs">
            Departamento
          </Label>
          <ReactSelectComponent
            options={optionsDepartamentos}
            value={
              depaSelected
                ? {
                    value: depaSelected,
                    label:
                      secureDepartamentos.find((d) => d.id === depaSelected)
                        ?.nombre || "",
                  }
                : null
            }
            onChange={onSelectDepartamento}
            className="text-xs text-black"
            placeholder="Seleccionar..."
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "32px",
                fontSize: "12px",
              }),
            }}
          />
        </div>

        {/* Municipio */}
        <div className="space-y-1">
          <Label htmlFor="municipio" className="text-xs">
            Municipio
          </Label>
          <ReactSelectComponent
            options={optionsMunis}
            value={
              muniSelected
                ? {
                    value: muniSelected,
                    label:
                      secureMunicipios.find((m) => m.id === muniSelected)
                        ?.nombre || "",
                  }
                : null
            }
            onChange={onSelectMunicipio}
            className="text-xs text-black"
            placeholder="Seleccionar..."
            isDisabled={!depaSelected}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "32px",
                fontSize: "12px",
              }),
            }}
          />
        </div>

        {/* Sector */}
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="sector" className="text-xs">
            Sector / Aldea
          </Label>
          <ReactSelectComponent
            isClearable
            options={optionsSectores}
            value={
              sectorSelected
                ? {
                    value: sectorSelected,
                    label:
                      secureSectores.find((s) => s.id === sectorSelected)
                        ?.nombre || "",
                  }
                : null
            }
            onChange={onSelectSector}
            className="text-xs text-black"
            placeholder="Buscar sector..."
            isDisabled={!muniSelected}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "32px",
                fontSize: "12px",
              }),
            }}
          />
        </div>
      </div>

      {/* BLOQUE 3: REFERENCIA */}
      <div className="pt-2 border-t mt-2">
        {/* TITULO: Eliminado text-muted-foreground */}
        <h4 className="text-xs font-medium mb-2 uppercase tracking-wider">
          Contacto de Referencia
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="ref-nombre" className="sr-only">
              Nombre
            </Label>
            <Input
              id="ref-nombre"
              name="contactoReferenciaNombre"
              value={formData.contactoReferenciaNombre}
              onChange={onChangeForm}
              placeholder="Nombre del contacto"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ref-telefono" className="sr-only">
              Teléfono
            </Label>
            <Input
              id="ref-telefono"
              name="contactoReferenciaTelefono"
              value={formData.contactoReferenciaTelefono}
              onChange={onChangeForm}
              placeholder="Teléfono del contacto"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
