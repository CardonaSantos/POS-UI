"use client";

import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import ServicioForm from "./ServicioForm";
import type { EditServicioDialogProps } from "./servicio-internet.types";

export default function EditServicioDialog({
  isOpen,
  onOpenChange,
  servicio,
  onSave,
  isLoading,
}: EditServicioDialogProps) {
  if (!servicio) return null;

  return (
    <AppDialog open={isOpen} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[520px]">
        <AppDialogHeader>
          <AppDialogTitle>Editar plan de internet</AppDialogTitle>
          <AppDialogDescription>
            Modifique los datos del plan y guarde los cambios.
          </AppDialogDescription>
        </AppDialogHeader>

        <ServicioForm
          initialData={servicio}
          onSubmit={(data) => {
            if ("id" in data && "creadoEn" in data && "actualizadoEn" in data) {
              return onSave(data);
            }

            return Promise.reject(new Error("Invalid data type"));
          }}
          isLoading={isLoading}
          isEditing
          empresaId={servicio.empresaId}
          onCancel={() => onOpenChange(false)}
        />
      </AppDialogContent>
    </AppDialog>
  );
}
