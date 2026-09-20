import { Play } from "lucide-react";
import { toast } from "sonner";

import { usePostIniciarInstalacionTecnica } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";

import { AppButton } from "@/components/app/primitives/app-button";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import { AppStack } from "@/components/app/primitives/app-stack";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { InstalacionActionDialogProps } from "./action-dialog.types";

export function IniciarInstalacionDialog({
  instalacionId,
  open,
  onOpenChange,
  onCompleted,
}: InstalacionActionDialogProps) {
  const mutation = usePostIniciarInstalacionTecnica(instalacionId);

  const handleIniciar = async () => {
    try {
      await toast.promise(mutation.mutateAsync({}), {
        loading: "Iniciando trabajo...",

        success: "Trabajo de instalación iniciado",

        error: (error) => getApiErrorMessageAxios(error),
      });

      await onCompleted();
    } catch {
      // El toast ya muestra el error.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm" padding="md">
        <AppDialogHeader>
          <AppDialogTitle className="mb-2 text-center">
            Iniciar trabajo de instalación
          </AppDialogTitle>

          <AppDialogDescription className="mb-2 text-center">
            Registra el tiempo del trabajo técnico.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            <AppButton
              type="button"
              size="sm"
              variant="primary"
              width="full"
              loading={mutation.isPending}
              loadingText="Iniciando trabajo..."
              onClick={() => {
                void handleIniciar();
              }}
            >
              <Play aria-hidden="true" />
              Iniciar
            </AppButton>
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
