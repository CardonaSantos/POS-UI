"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClienteExpedienteDto } from "@/Crm/features/expediente-cliente/expediente.interface";
import { formattShortFecha } from "@/utils/formattFechas";
import {
  ChevronDown,
  FileText,
  Trash2,
  User,
  Phone,
  ImageIcon,
} from "lucide-react";
import { useState } from "react";

interface ExpedienteItemProps {
  expediente: ClienteExpedienteDto;
  handleSelectToDelete: (id: number) => void;
}

export function ExpedienteItem({
  expediente,
  handleSelectToDelete,
}: ExpedienteItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pl-5">
                {expediente.archivos.map((archivo) => (
                  <button
                    key={archivo.id}
                    type="button"
                    onClick={() => setSelectedImage(archivo.url)}
                    className="group relative border rounded-lg overflow-hidden hover:border-primary transition-all hover:shadow-md"
                  >
                    {/* Image Thumbnail */}
                    <div className="aspect-square w-full bg-muted relative">
                      <img
                        src={archivo.url || "/placeholder.svg"}
                        alt={archivo.descripcion || archivo.tipo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-2 space-y-0.5 text-left">
                      <p className="text-xs font-medium">{archivo.tipo}</p>
                      {archivo.descripcion && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {archivo.descripcion}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formattShortFecha(archivo.creadoEn)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Imagen Ajustada */}
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Vista ampliada"
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Botón Abrir Original */}
          <a
            href={selectedImage}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Abrir original
          </a>
        </div>
      )}
    </Card>
  );
}
