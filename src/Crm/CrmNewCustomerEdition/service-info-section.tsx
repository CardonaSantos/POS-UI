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
  return (
    <div className="space-y-3">
      <h3 className="font-medium flex items-center gap-2 text-sm">
        <Wifi className="h-4 w-4 text-primary dark:text-white" />
        Información del Servicio
      </h3>

      <div className="space-y-2 text-sm">
        <div className="space-y-1">
          <Label htmlFor="servicioWifiId-all">
            Servicio Wifi <span className="text-destructive">*</span>
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
                        (s) => s.id === serviceWifiSelected
                      )?.nombre || "",
                  }
                : null
            }
            className="text-sm text-black"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="servicioId-all">
            Otros Servicios <span className="text-destructive">*</span>
          </Label>
          <ReactSelectComponent
            isMulti
            options={optionsServices}
            onChange={onSelectService}
            value={optionsServices.filter((option) =>
              serviceSelected.includes(option.value)
            )}
            className="text-sm text-black"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contrasenaWifi-all">
            Contraseña WiFi <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contrasenaWifi-all"
            name="contrasenaWifi"
            value={formData.contrasenaWifi}
            onChange={onChangeForm}
            placeholder="Contraseña WiFi"
            required
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ssidRouter-all">SSID</Label>
          <Input
            id="ssidRouter-all"
            name="ssidRouter"
            value={formData.ssidRouter}
            onChange={onChangeForm}
            placeholder="SSID"
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}
