"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight, Crop } from "lucide-react";

interface ImagesCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  onDone: (croppedFiles: File[]) => void;
}

// Componente simplificado - en producción usarías react-image-crop o similar
export function ImagesCropper({
  open,
  onOpenChange,
  files,
  onDone,
}: ImagesCropperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDone = () => {
    // En producción aquí procesarías las imágenes con crop real
    // Por ahora solo devolvemos los archivos originales
    onDone(files);
    onOpenChange(false);
    setCurrentIndex(0);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCurrentIndex(0);
  };

  const goNext = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (files.length === 0) return null;

  const currentFile = files[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Crop className="w-4 h-4" />
            Recortar Imágenes ({currentIndex + 1} / {files.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Image Preview */}
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={URL.createObjectURL(currentFile) || "/placeholder.svg"}
              alt={`Preview ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation */}
          {files.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="h-7 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentFile.name}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goNext}
                disabled={currentIndex === files.length - 1}
                className="h-7 bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="gap-1 bg-transparent"
          >
            <X className="w-3 h-3" />
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleDone}
            className="gap-1"
          >
            <Check className="w-3 h-3" />
            Confirmar ({files.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
