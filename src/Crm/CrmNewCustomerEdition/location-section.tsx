"use client";

import * as React from "react";
import { MapIcon, MapPin, Navigation, Phone, UserRound } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import { UniversalMap } from "../CrmMapsUtils/MapUtils.utils";
import type { LocationSectionProps } from "./customer-form-types";

type MapItem = {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
};

function parseCoordinates(value?: string | null) {
  if (!value) return null;

  const parts = value.split(",");

  if (parts.length !== 2) return null;

  const lat = Number.parseFloat(parts[0].trim());
  const lng = Number.parseFloat(parts[1].trim());

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return { lat, lng };
}

function buildMapItems(coordinates?: string | null): MapItem[] {
  const parsed = parseCoordinates(coordinates);

  if (!parsed) return [];

  return [
    {
      id: "ubicacion-actual",
      location: parsed,
    },
  ];
}

function normalizeOptions(
  options: LocationSectionProps["optionsDepartamentos"],
): Array<AppSelectOption<number>> {
  return options.map((option) => ({
    value: Number(option.value),
    label: option.label,
  }));
}

function LocationSectionHeader() {
  return (
    <AppInline
      align="center"
      gap="xs"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <MapIcon size={15} className="text-[hsl(var(--app-primary))]" />

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          Ubicación y contacto
        </h3>
        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Coordenadas, sector y contacto de referencia.
        </p>
      </div>
    </AppInline>
  );
}

function CustomerMapMarker() {
  return (
    <div className="relative -ml-3 -mt-6 animate-bounce">
      <MapPin className="h-8 w-8 fill-[hsl(var(--app-danger)/0.12)] text-[hsl(var(--app-danger))] drop-shadow-md" />
      <div className="mx-auto mt-[-5px] h-2 w-2 rounded-full bg-black/45 blur-[2px]" />
    </div>
  );
}

function ContactReferenceFields({
  formData,
  onChange,
}: {
  formData: LocationSectionProps["formData"];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.14)] p-3">
      <AppStack gap="sm">
        <AppInline align="center" gap="xs">
          <UserRound size={14} className="text-[hsl(var(--app-primary))]" />

          <div className="min-w-0">
            <h4 className="truncate text-xs font-semibold uppercase tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
              Contacto de referencia
            </h4>
            <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Persona alternativa para validar ubicación o comunicación.
            </p>
          </div>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
          <AppField label="Nombre del contacto">
            {(field) => (
              <AppInput
                id={field.id}
                name="contactoReferenciaNombre"
                value={formData.contactoReferenciaNombre}
                onChange={onChange}
                placeholder="Nombre del contacto"
                size="xs"
                fieldWidth="full"
                leftIcon={<UserRound size={13} />}
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                autoComplete="name"
              />
            )}
          </AppField>

          <AppField label="Teléfono del contacto">
            {(field) => (
              <AppInput
                id={field.id}
                name="contactoReferenciaTelefono"
                value={formData.contactoReferenciaTelefono}
                onChange={onChange}
                placeholder="Teléfono del contacto"
                type="tel"
                size="xs"
                fieldWidth="full"
                leftIcon={<Phone size={13} />}
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                autoComplete="tel"
              />
            )}
          </AppField>
        </AppGrid>
      </AppStack>
    </div>
  );
}

export function LocationSection({
  formData,
  depaSelected,
  muniSelected,
  sectorSelected,
  optionsDepartamentos,
  optionsMunis,
  optionsSectores,
  onChangeForm,
  onSelectDepartamento,
  onSelectMunicipio,
  onSelectSector,
}: LocationSectionProps) {
  const mapItems = React.useMemo(
    () => buildMapItems(formData.coordenadas),
    [formData.coordenadas],
  );

  const departamentoOptions = React.useMemo(
    () => normalizeOptions(optionsDepartamentos),
    [optionsDepartamentos],
  );

  const municipioOptions = React.useMemo(
    () => normalizeOptions(optionsMunis),
    [optionsMunis],
  );

  const sectorOptions = React.useMemo(
    () => normalizeOptions(optionsSectores),
    [optionsSectores],
  );

  const hasValidCoordinates = mapItems.length > 0;

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeForm(event);
    },
    [onChangeForm],
  );

  const handleDepartamentoChange = React.useCallback(
    (_value: number | null, option: AppSelectOption<number> | null) => {
      onSelectDepartamento(option ? { ...option } : null);
    },
    [onSelectDepartamento],
  );

  const handleMunicipioChange = React.useCallback(
    (_value: number | null, option: AppSelectOption<number> | null) => {
      onSelectMunicipio(option ? { ...option } : null);
    },
    [onSelectMunicipio],
  );

  const handleSectorChange = React.useCallback(
    (_value: number | null, option: AppSelectOption<number> | null) => {
      onSelectSector(option ? { ...option } : null);
    },
    [onSelectSector],
  );

  return (
    <AppStack gap="sm">
      <LocationSectionHeader />

      <AppCard variant="outline" size="xs" className="overflow-hidden p-2">
        <AppStack gap="sm">
          <div className="relative h-[200px] w-full overflow-hidden rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.25)]">
            <UniversalMap
              items={mapItems}
              mapType="hybrid"
              enableRouting={false}
              fitBoundsToMarkers={true}
              defaultZoom={15}
              className="h-full w-full"
              renderMarker={() => <CustomerMapMarker />}
            />

            {!hasValidCoordinates ? (
              <div className="absolute inset-x-3 bottom-3 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background))/0.92)] px-3 py-2 text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] backdrop-blur">
                Pegue coordenadas válidas para visualizar la ubicación.
              </div>
            ) : null}
          </div>

          <AppField
            label="Coordenadas"
            description="Formato recomendado: 15.6600, -91.7000"
          >
            {(field) => (
              <AppInput
                id={field.id}
                name="coordenadas"
                value={formData.coordenadas}
                onChange={handleInputChange}
                placeholder="Pegar coordenadas"
                size="xs"
                fieldWidth="full"
                leftIcon={<Navigation size={13} />}
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
              />
            )}
          </AppField>
        </AppStack>
      </AppCard>

      <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
        <AppField label="Departamento">
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={depaSelected}
              options={departamentoOptions}
              onChange={handleDepartamentoChange}
              placeholder="Seleccionar departamento..."
              isClearable
              isSearchable
              size="xs"
              density="compact"
              fieldWidth="full"
              invalid={field.invalid}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          )}
        </AppField>

        <AppField label="Municipio">
          {(field) => (
            <AppSingleSelect<number>
              inputId={field.id}
              value={muniSelected}
              options={municipioOptions}
              onChange={handleMunicipioChange}
              placeholder="Seleccionar municipio..."
              isClearable
              isSearchable
              isDisabled={!depaSelected}
              size="xs"
              density="compact"
              fieldWidth="full"
              invalid={field.invalid}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          )}
        </AppField>

        <div className="sm:col-span-2">
          <AppField label="Sector / Aldea">
            {(field) => (
              <AppSingleSelect<number>
                inputId={field.id}
                value={sectorSelected}
                options={sectorOptions}
                onChange={handleSectorChange}
                placeholder="Buscar sector..."
                isClearable
                isSearchable
                isDisabled={!muniSelected}
                size="xs"
                density="compact"
                fieldWidth="full"
                invalid={field.invalid}
                portalToBody
                menuPosition="fixed"
                menuPlacement="auto"
                menuShouldScrollIntoView={false}
              />
            )}
          </AppField>
        </div>
      </AppGrid>

      <ContactReferenceFields
        formData={formData}
        onChange={handleInputChange}
      />
    </AppStack>
  );
}
