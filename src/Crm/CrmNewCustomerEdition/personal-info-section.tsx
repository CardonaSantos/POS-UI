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
    <div className="space-y-3">
      <h3 className="font-medium flex items-center gap-2 text-sm">
        <User className="h-4 w-4 text-primary dark:text-white" />
        Información Personal
      </h3>

      <div className="space-y-2 text-sm">
        <div className="space-y-1">
          <Label htmlFor="nombre-all">
            Nombres <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nombre-all"
            name="nombre"
            value={formData.nombre}
            onChange={onChangeForm}
            placeholder="Nombre completo"
            required
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="apellidos-all">
            Apellidos <span className="text-destructive">*</span>
          </Label>
          <Input
            id="apellidos-all"
            name="apellidos"
            value={formData.apellidos}
            onChange={onChangeForm}
            placeholder="Apellidos"
            required
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="telefono-all">Teléfono</Label>
          <Input
            id="telefono-all"
            name="telefono"
            value={formData.telefono}
            onChange={onChangeForm}
            placeholder="Teléfono"
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dpi-all">DPI</Label>
          <Input
            id="dpi-all"
            name="dpi"
            value={formData.dpi}
            onChange={onChangeForm}
            placeholder="DPI"
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="direccion-all">Dirección</Label>
          <Textarea
            id="direccion-all"
            name="direccion"
            value={formData.direccion}
            onChange={onChangeForm}
            placeholder="Dirección"
            rows={3}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
