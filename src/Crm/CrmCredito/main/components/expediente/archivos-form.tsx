"use client";

import React from "react";

import { useRef } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
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
import {
  type ArchivoItem,
  TipoArchivoCliente,
  TipoArchivoClienteArray,
} from "./expedientes-types";

interface ArchivosFormProps {
  archivos: ArchivoItem[];
  onChange: (archivos: ArchivoItem[]) => void;
  onFilesSelected: (files: File[]) => void;
}

export function ArchivosForm({
  archivos,
  onChange,
  onFilesSelected,
}: ArchivosFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    onFilesSelected(files);
    e.target.value = "";
  };

  const handleRemoveItem = (uid: string) => {
    onChange(archivos.filter((item) => item.uid !== uid));
  };

  const updateItem = (uid: string, field: keyof ArchivoItem, value: string) => {
    onChange(
      archivos.map((item) =>
        item.uid === uid ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Archivos del Expediente</h3>
        <span className="text-xs text-muted-foreground">
          ({archivos.length})
        </span>
      </div>

      {/* Zona de Carga */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md hover:bg-muted/30 transition-colors">
        <div className="text-center space-y-2">
          <div className="bg-background p-2 rounded-full inline-flex border">
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium">
              Sube las evidencias del crédito
            </p>
            <p className="text-[10px] text-muted-foreground">
              Soporta JPG, PNG
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs"
          >
            Seleccionar Imágenes
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesSelected}
          />
        </div>
      </div>

      {/* Galería de Previsualización */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">
            Archivos listos para subir:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {archivos.map((item) => (
              <div
                key={item.uid}
                className="relative group border rounded overflow-hidden bg-background"
              >
                {/* Preview */}
                <div className="aspect-video bg-muted">
                  <img
                    src={URL.createObjectURL(item.file) || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-2 space-y-2">
                  {/* Descripción */}
                  <div className="space-y-0.5">
                    <Label className="text-[10px] uppercase font-medium text-muted-foreground">
                      Descripción
                    </Label>
                    <Input
                      value={item.descripcion}
                      onChange={(e) =>
                        updateItem(item.uid, "descripcion", e.target.value)
                      }
                      placeholder="Ej. Fachada frontal..."
                      className="h-7 text-xs"
                    />
                  </div>

                  {/* Tipo */}
                  <div className="space-y-0.5">
                    <Label className="text-[10px] uppercase font-medium text-muted-foreground">
                      Tipo de Documento
                    </Label>
                    <Select
                      value={item.tipo}
                      onValueChange={(val) =>
                        updateItem(item.uid, "tipo", val as TipoArchivoCliente)
                      }
                    >
                      <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TipoArchivoClienteArray.map((t) => (
                          <SelectItem key={t} value={t} className="text-xs">
                            {t.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveItem(item.uid)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </Button>

                {/* File name */}
                <div className="px-2 py-1 text-[10px] truncate text-muted-foreground bg-muted/30 italic">
                  {item.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
