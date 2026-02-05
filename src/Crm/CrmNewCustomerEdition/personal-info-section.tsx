"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import type { PersonalInfoSectionProps } from "./customer-form-types";

export function PersonalInfoSection({
  formData,
  onChangeForm,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2 text-sm text-foreground/90 border-b pb-2">
        <User className="h-4 w-4 " />
        Información Personal
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nombres y Apellidos */}
        <div className="space-y-1">
          <Label htmlFor="nombre-all" className="text-xs">
            Nombres <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nombre-all"
            name="nombre"
            value={formData.nombre}
            onChange={onChangeForm}
            placeholder="Nombres"
            required
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="apellidos-all" className="text-xs">
            Apellidos <span className="text-destructive">*</span>
          </Label>
          <Input
            id="apellidos-all"
            name="apellidos"
            value={formData.apellidos}
            onChange={onChangeForm}
            placeholder="Apellidos"
            required
            className="h-8 text-xs"
          />
        </div>

        {/* Teléfono y DPI */}
        <div className="space-y-1">
          <Label htmlFor="telefono-all" className="text-xs">
            Teléfono
          </Label>
          <Input
            id="telefono-all"
            name="telefono"
            value={formData.telefono}
            onChange={onChangeForm}
            placeholder="Teléfono"
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dpi-all" className="text-xs">
            DPI
          </Label>
          <Input
            id="dpi-all"
            name="dpi"
            value={formData.dpi}
            onChange={onChangeForm}
            placeholder="DPI"
            className="h-8 text-xs"
          />
        </div>

        {/* Dirección (Full Width) */}
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="direccion-all" className="text-xs">
            Dirección
          </Label>
          <Textarea
            id="direccion-all"
            name="direccion"
            value={formData.direccion}
            onChange={onChangeForm}
            placeholder="Dirección completa"
            rows={2}
            className="text-xs min-h-[60px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
