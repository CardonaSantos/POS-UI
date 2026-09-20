import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { usePostReintentarPrealtaPppoe } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { InstalacionActionDialogProps } from "./action-dialog.types";

type ReintentarPrealtaDialogProps = InstalacionActionDialogProps & {
  accesoInternetId: number;
  mikrotikRouterId: number;
};

export function ReintentarPrealtaDialog({
  instalacionId,
  accesoInternetId,
  mikrotikRouterId,
  open,
  onOpenChange,
  onCompleted,
}: ReintentarPrealtaDialogProps) {
  const mutation = usePostReintentarPrealtaPppoe(
    instalacionId,
    accesoInternetId,
  );

  const handleRetry = async () => {
    try {
      await toast.promise(
        mutation.mutateAsync({ mikrotikRouterId }),
        {
          loading: "Preparando cuenta PPPoE...",
          success: "Prealta preparada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      await onCompleted();
    } catch {
      // El diálogo permanece abierto para reintentar.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Reintentar prealta</AppDialogTitle>
          <AppDialogDescription>
            Vuelve a preparar la cuenta PPPoE antes de iniciar el trabajo.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            <AppAlert tone="info" size="xs" variant="soft">
              Se utilizará el MikroTik #{mikrotikRouterId} para el acceso #
              {accesoInternetId}.
            </AppAlert>

            <AppInline justify="end" gap="xs" fullWidth>
              <AppButton
                type="button"
                variant="secondary"
                size="sm"
                disabled={mutation.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cerrar
              </AppButton>

              <AppButton
                type="button"
                size="sm"
                loading={mutation.isPending}
                loadingText="Reintentando..."
                onClick={handleRetry}
              >
                <RefreshCcw aria-hidden="true" />
                Reintentar
              </AppButton>
            </AppInline>
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
