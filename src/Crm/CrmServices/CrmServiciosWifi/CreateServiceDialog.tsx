"use client";

import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import ServicioForm from "./ServicioForm";
import type { CreateServicioDialogProps } from "./servicio-internet.types";

export default function CreateServicioDialog({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
  empresaId,
}: CreateServicioDialogProps) {
  return (
    <AppDialog open={isOpen} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[520px]">
        <AppDialogHeader>
          <AppDialogTitle>Nuevo plan de internet</AppDialogTitle>
          <AppDialogDescription>
            Complete los datos para crear un nuevo plan.
          </AppDialogDescription>
        </AppDialogHeader>

        <ServicioForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isEditing={false}
          empresaId={empresaId}
          onCancel={() => onOpenChange(false)}
        />
      </AppDialogContent>
    </AppDialog>
  );
}
