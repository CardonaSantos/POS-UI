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

type ActionContractWarningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
};

export function ActionContractWarningDialog({
  open,
  onOpenChange,
  title,
  description,
}: ActionContractWarningDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>{title}</AppDialogTitle>
          <AppDialogDescription>
            Falta información necesaria para ejecutar esta acción.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            <AppAlert tone="warning" title="Contrato incompleto" size="xs">
              {description}
            </AppAlert>

            <AppInline justify="end" fullWidth>
              <AppButton
                size="sm"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cerrar
              </AppButton>
            </AppInline>
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
