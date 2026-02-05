"use client";

import { Users, Plus, Trash2, Phone, User, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ReferenciaDto, createEmptyReferencia } from "./expedientes-types";

const RELACIONES = [
  "Familiar",
  "Amigo",
  "Vecino",
  "Compañero de trabajo",
  "Conocido",
  "Otro",
];

interface ReferenciasFormProps {
  referencias: ReferenciaDto[];
  onChange: (referencias: ReferenciaDto[]) => void;
}

export function ReferenciasForm({
  referencias,
  onChange,
}: ReferenciasFormProps) {
  const addReferencia = () => {
    onChange([...referencias, createEmptyReferencia()]);
  };

  const removeReferencia = (uid: string) => {
    onChange(referencias.filter((r) => r.uid !== uid));
  };

  const updateReferencia = (
    uid: string,
    field: keyof ReferenciaDto,
    value: string,
  ) => {
    onChange(
      referencias.map((r) => (r.uid === uid ? { ...r, [field]: value } : r)),
    );
  };

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Referencias Personales</h3>
          <span className="text-xs text-muted-foreground">
            ({referencias.length})
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addReferencia}
          className="h-7 text-xs gap-1 bg-transparent"
        >
          <Plus className="w-3 h-3" />
          Agregar
        </Button>
      </div>

      {referencias.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No hay referencias agregadas
        </p>
      ) : (
        <div className="space-y-3">
          {referencias.map((ref, index) => (
            <div
              key={ref.uid}
              className="border rounded p-3 space-y-3 bg-muted/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Referencia #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReferencia(ref.uid)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Nombre */}
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Nombre
                  </Label>
                  <Input
                    value={ref.nombre}
                    onChange={(e) =>
                      updateReferencia(ref.uid, "nombre", e.target.value)
                    }
                    placeholder="Nombre completo"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Teléfono
                  </Label>
                  <Input
                    value={ref.telefono}
                    onChange={(e) =>
                      updateReferencia(ref.uid, "telefono", e.target.value)
                    }
                    placeholder="00000000"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Relación */}
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Relación
                  </Label>
                  <Select
                    value={ref.relacion}
                    onValueChange={(value) =>
                      updateReferencia(ref.uid, "relacion", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELACIONES.map((rel) => (
                        <SelectItem key={rel} value={rel} className="text-sm">
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
