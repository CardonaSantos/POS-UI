"use client";
import { useState } from "react";
import {
  ChevronDown,
  Trash2,
  FileText,
  User,
  Phone,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClienteExpedienteDto } from "@/Crm/features/expediente-cliente/expediente.interface";
import { formattShortFecha } from "@/utils/formattFechas";

interface ExpedienteItemProps {
  expediente: ClienteExpedienteDto;
  handleSelectToDelete: (id: number) => void;
}

export function ExpedienteItem({
  expediente,
  handleSelectToDelete,
}: ExpedienteItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <FileText className="h-4 w-4" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              Expediente #{expediente.id}
            </p>
            <p className="text-xs text-muted-foreground">
              Creado: {formattShortFecha(expediente.creadoEn)}
            </p>
          </div>
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSelectToDelete(expediente.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* Info Financiera */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Información Financiera
            </h4>
            <div className="space-y-1 text-sm pl-5">
              <p>
                <span className="text-muted-foreground">Fuente Ingresos:</span>{" "}
                {expediente.fuenteIngresos || "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Tiene Deudas:</span>{" "}
                {expediente.tieneDeudas ? "Sí" : "No"}
              </p>
              {expediente.tieneDeudas && expediente.detalleDeudas && (
                <p>
                  <span className="text-muted-foreground">Detalle:</span>{" "}
                  {expediente.detalleDeudas}
                </p>
              )}
            </div>
          </div>

          {/* Referencias */}
          {expediente.referencias.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Referencias ({expediente.referencias.length})
              </h4>
              <div className="space-y-2 pl-5">
                {expediente.referencias.map((ref) => (
                  <div
                    key={ref.id}
                    className="text-sm border-l-2 pl-2 space-y-0.5"
                  >
                    <p className="font-medium">{ref.nombre}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {ref.telefono}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ref.relacion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Archivos */}
          {expediente.archivos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5" />
                Archivos ({expediente.archivos.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                {expediente.archivos.map((archivo) => (
                  <a
                    key={archivo.id}
                    href={archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded p-2 hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-medium">{archivo.tipo}</p>
                      {archivo.descripcion && (
                        <p className="text-xs text-muted-foreground truncate">
                          {archivo.descripcion}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formattShortFecha(archivo.creadoEn)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
