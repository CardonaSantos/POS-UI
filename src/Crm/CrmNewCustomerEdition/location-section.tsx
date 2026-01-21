"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Map } from "lucide-react";
import ReactSelectComponent from "react-select";
import { LocationSectionProps } from "./customer-form-types";

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
  return (
    <div className="space-y-3">
      <h3 className="font-medium flex items-center gap-2 text-sm">
        <Map className="h-4 w-4 text-primary dark:text-white" />
        Ubicación y Contacto
      </h3>

      <div className="space-y-2 text-sm">
        <div className="space-y-1">
          <Label htmlFor="coordenadas">Ubicación Maps</Label>
          <Input
            id="coordenadas"
            name="coordenadas"
            value={formData.coordenadas}
            onChange={onChangeForm}
            placeholder="Coordenadas"
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="departamentoId-all">Departamento</Label>
          <ReactSelectComponent
            options={optionsDepartamentos}
            value={
              depaSelected !== null
                ? {
                    value: depaSelected,
                    label:
                      secureDepartamentos.find((d) => d.id === depaSelected)
                        ?.nombre || "",
                  }
                : null
            }
            onChange={onSelectDepartamento}
            className="text-sm text-black"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="municipioId-all">Municipio</Label>
          <ReactSelectComponent
            options={optionsMunis}
            onChange={onSelectMunicipio}
            value={
              muniSelected !== null
                ? {
                    value: muniSelected,
                    label:
                      secureMunicipios.find((m) => m.id === muniSelected)
                        ?.nombre || "",
                  }
                : null
            }
            className="text-sm text-black"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="sectorId-all">Sectores</Label>
          <ReactSelectComponent
            isClearable
            options={optionsSectores}
            onChange={onSelectSector}
            value={
              sectorSelected !== null
                ? {
                    value: sectorSelected,
                    label:
                      secureSectores.find(
                        (sector) => sector.id === sectorSelected
                      )?.nombre || "",
                  }
                : null
            }
            className="text-xs text-black"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactoReferenciaNombre-all">
            Nombre Referencia
          </Label>
          <Input
            id="contactoReferenciaNombre-all"
            name="contactoReferenciaNombre"
            value={formData.contactoReferenciaNombre}
            onChange={onChangeForm}
            placeholder="Nombre referencia"
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactoReferenciaTelefono-all">
            Teléfono Referencia
          </Label>
          <Input
            id="contactoReferenciaTelefono-all"
            name="contactoReferenciaTelefono"
            value={formData.contactoReferenciaTelefono}
            onChange={onChangeForm}
            placeholder="Teléfono referencia"
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}
