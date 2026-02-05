"use client";

import { Banknote, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { InfoFinanciera } from "./expedientes-types";

interface InfoFinancieraFormProps {
  data: InfoFinanciera;
  onChange: (data: InfoFinanciera) => void;
}

export function InfoFinancieraForm({
  data,
  onChange,
}: InfoFinancieraFormProps) {
  const updateField = <K extends keyof InfoFinanciera>(
    field: K,
    value: InfoFinanciera[K],
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Banknote className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Información Financiera</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fuente de Ingresos */}
        <div className="space-y-1.5">
          <Label htmlFor="fuenteIngresos" className="text-xs">
            Fuente de Ingresos
          </Label>
          <Input
            id="fuenteIngresos"
            value={data.fuenteIngresos}
            onChange={(e) => updateField("fuenteIngresos", e.target.value)}
            placeholder="Ej. Negocio propio, Empleado..."
            className="h-8 text-sm"
          />
        </div>

        {/* Tiene Deudas */}
        <div className="space-y-1.5">
          <Label className="text-xs">¿Tiene deudas actualmente?</Label>
          <div className="flex items-center gap-2 h-8">
            <Switch
              id="tieneDeudas"
              checked={data.tieneDeudas}
              onCheckedChange={(checked) => updateField("tieneDeudas", checked)}
            />
            <Label
              htmlFor="tieneDeudas"
              className="text-xs text-muted-foreground"
            >
              {data.tieneDeudas ? "Sí" : "No"}
            </Label>
          </div>
        </div>
      </div>

      {/* Detalle de Deudas - Solo visible si tiene deudas */}
      {data.tieneDeudas && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-muted-foreground" />
            <Label htmlFor="detalleDeudas" className="text-xs">
              Detalle de las deudas
            </Label>
          </div>
          <Textarea
            id="detalleDeudas"
            value={data.detalleDeudas}
            onChange={(e) => updateField("detalleDeudas", e.target.value)}
            placeholder="Describa las deudas actuales..."
            className="text-sm min-h-[60px] resize-none"
          />
        </div>
      )}
    </div>
  );
}
