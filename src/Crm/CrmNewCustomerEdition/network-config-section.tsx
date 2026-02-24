"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network, AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";
import type { NetworkConfigSectionProps } from "./customer-form-types";
import { Button } from "@/components/ui/button";

/**
 * Sección de configuración de red (IP + Mikrotik)
 */
export function NetworkConfigSection({
  formData,
  onChangeForm,
  setOpenUpdNet,
  setOpenAuth,
  isInstalation,
  isCreation,
}: NetworkConfigSectionProps) {
  return (
    <section aria-labelledby="section-network" className="space-y-4">
      {/* HEADER */}
      <h3
        id="section-network"
        className="font-medium flex items-center gap-2 text-sm border-b pb-2"
      >
        <Network className="h-4 w-4 " />
        Configuración de Red
        {/* Indicador de Alerta sutil alineado a la derecha */}
        <span className="ml-auto" title="Verificar configuración">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        </span>
      </h3>

      {/* BLOQUE DE IPs */}
      <div>
        <h4 className="text-xs font-medium mb-2 uppercase tracking-wider">
          Direccionamiento IP
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* IP Address */}
          <div className="space-y-1">
            <Label htmlFor="ip" className="text-xs">
              Dirección IP <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ip"
              name="ip"
              value={formData.ip}
              onChange={onChangeForm}
              placeholder="192.168.1.100"
              required
              className="h-8 text-xs font-mono" // font-mono ayuda a leer mejor los números
            />
          </div>

          {/* Gateway */}
          <div className="space-y-1">
            <Label htmlFor="gateway" className="text-xs">
              Puerta de Enlace (Gateway)
            </Label>
            <Input
              id="gateway"
              name="gateway"
              value={formData.gateway}
              onChange={onChangeForm}
              placeholder="192.168.1.1"
              className="h-8 text-xs font-mono"
            />
          </div>

          {/* Subnet Mask */}
          <div className="space-y-1">
            <Label htmlFor="mascara" className="text-xs">
              Máscara de Subred
            </Label>
            <Input
              id="mascara"
              name="mascara"
              value={formData.mascara}
              onChange={onChangeForm}
              placeholder="255.255.255.0"
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t mt-2">
        <Button
          onClick={setOpenUpdNet}
          size="sm"
          variant="outline"
          type="button"
          className="h-8 text-xs gap-2"
          disabled={isCreation}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Actualizar Red
        </Button>

        <Button
          disabled={!isInstalation}
          onClick={setOpenAuth}
          size="sm"
          variant="default" // Cambiado a default para resaltar la acción de autorizar
          type="button"
          className="h-8 text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Autorizar OLT
        </Button>
      </div>
    </section>
  );
}
