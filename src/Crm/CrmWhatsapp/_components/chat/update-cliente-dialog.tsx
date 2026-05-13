"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UpdateClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  cliente: {
    id: number;
    nombre: string | null;
  };

  onUpdate: (payload: { id: number; nombre: string }) => Promise<void>;
}

export function UpdateClienteDialog({
  open,
  onOpenChange,
  cliente,
  onUpdate,
}: UpdateClienteDialogProps) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNombre(cliente?.nombre ?? "");
    }
  }, [open, cliente]);

  const handleSubmit = async () => {
    if (!nombre.trim()) return;

    try {
      setLoading(true);

      await onUpdate({
        id: cliente.id,
        nombre: nombre.trim(),
      });

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 flex flex-col">
        {/* HEADER */}
        <div className="px-4 py-3 border-b text-sm font-medium">
          Actualizar cliente
        </div>

        {/* BODY */}
        <div className="px-4 py-4 space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Nombre</label>

            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            size="sm"
            className="h-8 px-3"
            onClick={handleSubmit}
            disabled={loading || !nombre.trim()}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
