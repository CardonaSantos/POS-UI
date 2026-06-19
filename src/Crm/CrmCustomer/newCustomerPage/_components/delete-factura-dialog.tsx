"use client";
import { AlertCircle, Trash2, X } from "lucide-react";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

export interface FacturaToDeleter {
  id: number;
  estado: string;
  fechaEmision: string;
  fechaVencimiento: string;
}

interface DeleteFacturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facturaAction: FacturaToDeleter | null;
  motivo: string;
  setMotivo: (motivo: string) => void;
  isLoading: boolean;
  onDelete: () => void;
}

export function DeleteFacturaDialog({
  open,
  onOpenChange,
  facturaAction,
  motivo,
  setMotivo,
  isLoading,
  onDelete,
}: DeleteFacturaDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="md" viewport="default" padding="sm">
        <AppDialogHeader divider>
          <AppDialogTitle className="flex items-center gap-2">
            <Trash2 size={16} />
            Confirmar eliminación
          </AppDialogTitle>

          <AppDialogDescription>
            Esta acción eliminará la factura seleccionada y puede afectar el
            saldo del cliente.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody padding="sm">
          <AppStack gap="sm">
            <AppAlert
              tone="danger"
              size="sm"
              icon={<AlertCircle size={15} />}
              title="Advertencia"
            >
              El saldo y estado del cliente se recalcularán según su historial
              de facturas y pagos.
            </AppAlert>

            {facturaAction ? (
              <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-3 py-2 text-xs">
                <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
                  <div>
                    <span className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                      Factura
                    </span>
                    <p className="font-semibold">#{facturaAction.id}</p>
                  </div>

                  <div>
                    <span className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                      Estado
                    </span>
                    <p className="font-semibold">{facturaAction.estado}</p>
                  </div>
                </AppGrid>
              </div>
            ) : null}

            <AppField
              label="Motivo"
              description="Opcional. Explique por qué se elimina esta factura."
            >
              {(field) => (
                <AppTextarea
                  id={field.id}
                  value={motivo}
                  onChange={(event) => setMotivo(event.target.value)}
                  placeholder="Describa el motivo de eliminación..."
                  rows={3}
                  size="sm"
                  fieldWidth="full"
                  invalid={field.invalid}
                  aria-invalid={field.invalid}
                  aria-describedby={field.describedBy}
                />
              )}
            </AppField>
          </AppStack>
        </AppDialogBody>

        <AppDialogFooter divider>
          <AppInline gap="xs" justify="end" className="w-full">
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              width="auto"
              leftIcon={<X size={14} />}
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </AppButton>

            <AppButton
              type="button"
              variant="danger"
              size="sm"
              width="auto"
              leftIcon={<Trash2 size={14} />}
              loading={isLoading}
              loadingText="Eliminando..."
              onClick={onDelete}
            >
              Eliminar
            </AppButton>
          </AppInline>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
