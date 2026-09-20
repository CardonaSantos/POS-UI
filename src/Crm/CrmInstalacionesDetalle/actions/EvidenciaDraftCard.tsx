import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";
import { Trash2 } from "lucide-react";
import { memo } from "react";
import { EvidenciaDraft, UploadStatus } from "./subir-evidencia-dialog";

type EvidenciaDraftCardProps = {
  evidencia: EvidenciaDraft;

  index: number;

  disabled: boolean;

  onDescriptionChange: (id: string, descripcion: string) => void;

  onRemove: (id: string) => void;
};

export const EvidenciaDraftCard = memo(function EvidenciaDraftCard({
  evidencia,
  index,
  disabled,
  onDescriptionChange,
  onRemove,
}: EvidenciaDraftCardProps) {
  const status = getUploadStatusData(evidencia.status);

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppGrid
        cols={{
          base: 1,
          sm: 12,
        }}
        gap="xs"
        className="items-start"
      >
        <div className="sm:col-span-3">
          <div
            className="
                relative
                overflow-hidden
                rounded-[var(--app-radius-md)]
                border
                border-[hsl(var(--app-border,var(--border)))]
                bg-[hsl(var(--app-muted,var(--muted)))/0.24]
              "
          >
            <img
              src={evidencia.previewUrl}
              alt={`Evidencia ${index + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />

            <div className="absolute right-1 top-1">
              <AppBadge tone={status.tone} appearance="soft" size="xs">
                {status.label}
              </AppBadge>
            </div>
          </div>
        </div>

        <div className="min-w-0 sm:col-span-9">
          <AppStack gap="xs">
            <AppInline align="center" justify="between" gap="xs" fullWidth>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">
                  {evidencia.file.name}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  Evidencia #{index + 1}
                </p>
              </div>

              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                disabled={disabled}
                aria-label={`Quitar ${evidencia.file.name}`}
                onClick={() => onRemove(evidencia.id)}
              >
                <Trash2 size={13} aria-hidden="true" />
              </AppButton>
            </AppInline>

            <AppField label="Descripción">
              <AppTextarea
                value={evidencia.descripcion}
                placeholder="Qué muestra esta imagen..."
                rows={2}
                size="xs"
                fieldWidth="full"
                disabled={disabled}
                className="min-h-[52px] resize-y"
                onChange={(event) =>
                  onDescriptionChange(evidencia.id, event.target.value)
                }
              />
            </AppField>
          </AppStack>
        </div>
      </AppGrid>
    </AppCard>
  );
});

function getUploadStatusData(status: UploadStatus): {
  label: string;

  tone: "neutral" | "info" | "success" | "danger";
} {
  switch (status) {
    case "uploading":
      return {
        label: "Subiendo",
        tone: "info",
      };

    case "success":
      return {
        label: "Subida",
        tone: "success",
      };

    case "error":
      return {
        label: "Error",
        tone: "danger",
      };

    default:
      return {
        label: "Pendiente",
        tone: "neutral",
      };
  }
}
