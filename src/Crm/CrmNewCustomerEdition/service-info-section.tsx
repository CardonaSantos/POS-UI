"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wifi } from "lucide-react";
import ReactSelectComponent from "react-select";
import type { ServiceInfoSectionProps } from "./customer-form-types";

export function ServiceInfoSection({
  formData,
  serviceSelected,
  serviceWifiSelected,
  optionsServices,
  optionsServicesWifi,
  secureServiciosWifi,
  onChangeForm,
  onSelectService,
  onSelectServiceWifi,
}: ServiceInfoSectionProps) {
  const compactSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "32px",
      fontSize: "12px",
      borderRadius: "var(--radius)",
      borderColor: "hsl(var(--input))",
      boxShadow: "none",
      "&:hover": { borderColor: "hsl(var(--ring))" },
    }),
    valueContainer: (base: any) => ({ ...base, padding: "0 8px" }),
    input: (base: any) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base: any) => ({ ...base, height: "30px" }),
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2 text-sm text-foreground/90 border-b pb-2">
        <Wifi className="h-4 w-4 " />
        Información del Servicio
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Plan de Internet */}
        <div className="space-y-1">
          <Label htmlFor="servicioWifiId-all" className="text-xs">
            Plan de Internet <span className="text-destructive">*</span>
          </Label>
          <ReactSelectComponent
            options={optionsServicesWifi}
            onChange={onSelectServiceWifi}
            value={
              serviceWifiSelected !== null
                ? {
                    value: serviceWifiSelected,
                    label:
                      secureServiciosWifi.find(
                        (s) => s.id === serviceWifiSelected,
                      )?.nombre || "",
                  }
                : null
            }
            placeholder="Seleccionar plan..."
            className="text-xs text-black"
            styles={compactSelectStyles}
          />
        </div>

        {/* Otros Servicios (Multi) */}
        <div className="space-y-1">
          <Label htmlFor="servicioId-all" className="text-xs">
            Servicios Adicionales <span className="text-destructive">*</span>
          </Label>
          <ReactSelectComponent
            isMulti
            options={optionsServices}
            onChange={onSelectService}
            value={optionsServices.filter((option) =>
              serviceSelected.includes(option.value),
            )}
            placeholder="Seleccionar..."
            className="text-xs text-black"
            styles={compactSelectStyles}
          />
        </div>

        {/* Contraseña WiFi */}
        <div className="space-y-1">
          <Label htmlFor="contrasenaWifi-all" className="text-xs">
            Contraseña Router <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contrasenaWifi-all"
            name="contrasenaWifi"
            value={formData.contrasenaWifi}
            onChange={onChangeForm}
            placeholder="Clave WPA2/WPA3"
            required
            className="h-8 text-xs"
          />
        </div>

        {/* SSID */}
        <div className="space-y-1">
          <Label htmlFor="ssidRouter-all" className="text-xs">
            Nombre Red (SSID)
          </Label>
          <Input
            id="ssidRouter-all"
            name="ssidRouter"
            value={formData.ssidRouter}
            onChange={onChangeForm}
            placeholder="Nombre de la red WiFi"
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
