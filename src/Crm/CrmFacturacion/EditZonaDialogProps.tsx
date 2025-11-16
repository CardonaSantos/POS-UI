"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ZonaForm from "./ZonaForm";
import type { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";

interface EditZonaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  zona: FacturacionZona | null;
  onSave: (updatedZona: FacturacionZona) => Promise<void>;
  isLoading: boolean;
}

const EditZonaDialog: React.FC<EditZonaDialogProps> = ({
  isOpen,
  onOpenChange,
  zona,
  onSave,
  isLoading,
}) => {
  if (!zona) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Zona de Facturación</DialogTitle>
          <DialogDescription>
            Modifique los parámetros de la zona de facturación
          </DialogDescription>
        </DialogHeader>
        <ZonaForm
          initialData={zona}
          onSubmit={onSave}
          isLoading={isLoading}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditZonaDialog;
