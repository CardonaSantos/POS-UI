"use client";

import * as React from "react";
import { ImagePlus, Images, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import { useAppDisclosure } from "@/components/app/handlers";

import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";
import { usePostEvidenciaInstalacion } from "@/Crm/CrmHooks/hooks/instalaciones/instalaciones-hook";
import ImagesCropper from "@/Crm/Helpers/CutterImages/ImageCropper";

import {
  buildEvidenciaInstalacionFormData,
  type EvidenciaInstalacionDraft,
  type EvidenciaUploadStatus,
} from "./evidencias-payload";

type Props = {
  instalacionId: number;
  empresaId: number;
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatEnumLabel(value: string) {
  const normalized = value.toLowerCase().replace(/_/g, " ");

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusData(status: EvidenciaUploadStatus): {
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

type EvidenciaCardProps = {
  evidencia: EvidenciaInstalacionDraft;
  tipoOptions: Array<{
    value: TipoEvidenciaClienteOperacion;
    label: string;
  }>;
  disabled?: boolean;

  onChange: (patch: Partial<EvidenciaInstalacionDraft>) => void;

  onRemove: () => void;
};

function EvidenciaInstalacionCard({
  evidencia,
  tipoOptions,
  disabled,
  onChange,
  onRemove,
}: EvidenciaCardProps) {
  const status = getStatusData(evidencia.status);

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="overflow-visible p-2"
    >
      <AppGrid cols={{ base: 1, md: 12 }} gap="xs" className="items-start">
        <div className="md:col-span-3">
          <div className="relative overflow-hidden rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.24]">
            <img
              src={evidencia.previewUrl}
              alt={`Evidencia ${evidencia.file.name}`}
              className="aspect-[4/3] w-full object-cover"
            />

            <div className="absolute right-1 top-1">
              <AppBadge tone={status.tone} appearance="soft" size="xs">
                {status.label}
              </AppBadge>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-white">
              <p className="truncate text-[10px]">{evidencia.file.name}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-9">
          <AppGrid cols={{ base: 1, md: 12 }} gap="xs" className="items-end">
            <div className="md:col-span-7">
              <AppField label="Tipo de evidencia" required>
                <AppSingleSelect<TipoEvidenciaClienteOperacion>
                  value={evidencia.tipo}
                  options={tipoOptions}
                  onChange={(value) =>
                    onChange({
                      tipo: value ?? null,
                      status:
                        evidencia.status === "error"
                          ? "pending"
                          : evidencia.status,
                    })
                  }
                  placeholder="Seleccionar tipo..."
                  size="xs"
                  density="compact"
                  fieldWidth="full"
                  isClearable
                  isDisabled={disabled}
                  portalToBody
                  menuPosition="fixed"
                  menuPlacement="auto"
                  menuShouldScrollIntoView={false}
                />
              </AppField>
            </div>

            <div className="md:col-span-3">
              <AppField label="Orden">
                <AppInput
                  type="number"
                  min={0}
                  value={evidencia.orden}
                  onChange={(event) =>
                    onChange({
                      orden: Math.max(0, Number(event.target.value) || 0),
                    })
                  }
                  size="xs"
                  fieldWidth="full"
                  disabled={disabled}
                />
              </AppField>
            </div>

            <div className="md:col-span-2">
              <AppField label="Acción">
                <AppButton
                  type="button"
                  variant="danger"
                  size="xs"
                  width="full"
                  leftIcon={<Trash2 size={13} />}
                  disabled={disabled}
                  onClick={onRemove}
                >
                  Quitar
                </AppButton>
              </AppField>
            </div>

            <div className="md:col-span-12">
              <AppField label="Descripción">
                <AppTextarea
                  value={evidencia.descripcion}
                  onChange={(event) =>
                    onChange({
                      descripcion: event.target.value,
                    })
                  }
                  placeholder="Descripción particular de esta imagen..."
                  rows={2}
                  size="xs"
                  fieldWidth="full"
                  disabled={disabled}
                  className="min-h-[52px] resize-y"
                />
              </AppField>
            </div>
          </AppGrid>
        </div>
      </AppGrid>
    </AppCard>
  );
}

export function InstalacionEvidenciasUploadPage({
  instalacionId,
  empresaId,
}: Props) {
  const cropDialog = useAppDisclosure();

  const uploadMutation = usePostEvidenciaInstalacion(instalacionId, empresaId);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const evidenciasRef = React.useRef<EvidenciaInstalacionDraft[]>([]);

  const [cropCandidates, setCropCandidates] = React.useState<File[]>([]);

  const [evidencias, setEvidencias] = React.useState<
    EvidenciaInstalacionDraft[]
  >([]);

  const [isSubmittingBatch, setIsSubmittingBatch] = React.useState(false);

  const [uploadProgress, setUploadProgress] = React.useState({
    current: 0,
    total: 0,
  });

  React.useEffect(() => {
    evidenciasRef.current = evidencias;
  }, [evidencias]);

  React.useEffect(() => {
    return () => {
      evidenciasRef.current.forEach((evidencia) => {
        URL.revokeObjectURL(evidencia.previewUrl);
      });
    };
  }, []);

  const tipoOptions = React.useMemo(
    () =>
      Object.values(TipoEvidenciaClienteOperacion).map((value) => ({
        value,
        label: formatEnumLabel(value),
      })),
    [],
  );

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    const validFiles = selectedFiles.filter((file) =>
      IMAGE_TYPES.includes(file.type),
    );

    const invalidCount = selectedFiles.length - validFiles.length;

    if (invalidCount > 0) {
      toast.warning(
        `${invalidCount} archivo(s) fueron omitidos. Usa JPG, PNG o WEBP.`,
      );
    }

    event.target.value = "";

    if (validFiles.length === 0) {
      return;
    }

    setCropCandidates(validFiles);
    cropDialog.open();
  };

  const handleCropDone = (croppedFiles: File[]) => {
    setEvidencias((current) => {
      const nuevasEvidencias = croppedFiles.map(
        (file, index): EvidenciaInstalacionDraft => ({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),

          tipo: null,
          descripcion: "",
          orden: current.length + index,

          status: "pending",
        }),
      );

      return [...current, ...nuevasEvidencias];
    });

    setCropCandidates([]);
  };

  const handleUpdateEvidencia = React.useCallback(
    (id: string, patch: Partial<EvidenciaInstalacionDraft>) => {
      setEvidencias((current) =>
        current.map((evidencia) =>
          evidencia.id === id
            ? {
                ...evidencia,
                ...patch,
              }
            : evidencia,
        ),
      );
    },
    [],
  );

  const handleRemoveEvidencia = React.useCallback((id: string) => {
    setEvidencias((current) => {
      const target = current.find((evidencia) => evidencia.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((evidencia) => evidencia.id !== id);
    });
  }, []);

  const handleClearEvidencias = React.useCallback(() => {
    setEvidencias((current) => {
      current.forEach((evidencia) => {
        URL.revokeObjectURL(evidencia.previewUrl);
      });

      return [];
    });

    setCropCandidates([]);
  }, []);

  const handleSubmit = async () => {
    if (evidencias.length === 0) {
      toast.error("Selecciona al menos una imagen.");
      return;
    }

    const evidenciasSinTipo = evidencias.filter((evidencia) => !evidencia.tipo);

    if (evidenciasSinTipo.length > 0) {
      toast.error("Todas las imágenes deben tener un tipo de evidencia.");
      return;
    }

    const failedIds = new Set<string>();
    const uploadedIds = new Set<string>();

    setIsSubmittingBatch(true);
    setUploadProgress({
      current: 0,
      total: evidencias.length,
    });

    for (let index = 0; index < evidencias.length; index += 1) {
      const evidencia = evidencias[index];

      handleUpdateEvidencia(evidencia.id, {
        status: "uploading",
      });

      setUploadProgress({
        current: index + 1,
        total: evidencias.length,
      });

      try {
        const body = buildEvidenciaInstalacionFormData({
          file: evidencia.file,
          tipo: evidencia.tipo!,
          descripcion: evidencia.descripcion.trim() || undefined,
          orden: evidencia.orden,
        });

        await uploadMutation.mutateAsync(body);

        uploadedIds.add(evidencia.id);

        handleUpdateEvidencia(evidencia.id, {
          status: "success",
        });
      } catch (error) {
        console.error(error);

        failedIds.add(evidencia.id);

        handleUpdateEvidencia(evidencia.id, {
          status: "error",
        });
      }
    }

    setEvidencias((current) => {
      current.forEach((evidencia) => {
        if (uploadedIds.has(evidencia.id)) {
          URL.revokeObjectURL(evidencia.previewUrl);
        }
      });

      return current
        .filter((evidencia) => failedIds.has(evidencia.id))
        .map((evidencia) => ({
          ...evidencia,
          status: "error",
        }));
    });

    setIsSubmittingBatch(false);
    setUploadProgress({
      current: 0,
      total: 0,
    });

    if (failedIds.size === 0) {
      toast.success(
        uploadedIds.size === 1
          ? "Evidencia subida correctamente."
          : `${uploadedIds.size} evidencias subidas correctamente.`,
      );

      return;
    }

    if (uploadedIds.size === 0) {
      toast.error(
        "No fue posible subir las evidencias. Las imágenes permanecen disponibles para reintentar.",
      );

      return;
    }

    toast.warning(
      `Se subieron ${uploadedIds.size} de ${evidencias.length} evidencias. Las imágenes fallidas permanecen en el formulario.`,
    );
  };

  const canSubmit =
    evidencias.length > 0 &&
    evidencias.every((evidencia) => evidencia.tipo !== null) &&
    !isSubmittingBatch;

  return (
    <>
      <AppContainer size="full" paddingX="none" paddingY="none">
        <AppStack gap="sm">
          <AppCard
            variant="outline"
            size="xs"
            radius="md"
            className="overflow-visible px-2 py-2"
          >
            <AppInline align="center" justify="between" gap="sm" wrap>
              <AppInline align="center" gap="xs">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
                  <Images size={15} />
                </span>

                <div className="min-w-0">
                  <h2 className="truncate text-xs font-semibold">
                    Evidencias de instalación
                  </h2>

                  <p className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    Cada imagen puede tener su propio tipo, descripción y orden.
                  </p>
                </div>
              </AppInline>

              <AppInline align="center" gap="xs">
                <AppBadge
                  tone={evidencias.length > 0 ? "info" : "neutral"}
                  appearance="soft"
                  size="xs"
                >
                  {evidencias.length} imagen
                  {evidencias.length === 1 ? "" : "es"}
                </AppBadge>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={IMAGE_TYPES.join(",")}
                  onChange={handleSelectFiles}
                  className="hidden"
                />

                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  leftIcon={<ImagePlus size={13} />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmittingBatch}
                >
                  Seleccionar
                </AppButton>

                {evidencias.length > 0 ? (
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2 size={13} />}
                    onClick={handleClearEvidencias}
                    disabled={isSubmittingBatch}
                  >
                    Limpiar
                  </AppButton>
                ) : null}
              </AppInline>
            </AppInline>
          </AppCard>

          {evidencias.length === 0 ? (
            <AppCard
              variant="outline"
              size="xs"
              radius="md"
              className="px-2 py-2"
            >
              <AppEmptyState
                preset="empty"
                variant="plain"
                size="sm"
                align="center"
                icon={<Images size={32} strokeWidth={1.5} />}
                title="Sin imágenes seleccionadas"
                description="Selecciona fotografías para recortarlas y configurar sus datos."
              />
            </AppCard>
          ) : (
            <AppStack gap="xs">
              {evidencias.map((evidencia) => (
                <EvidenciaInstalacionCard
                  key={evidencia.id}
                  evidencia={evidencia}
                  tipoOptions={tipoOptions}
                  disabled={isSubmittingBatch}
                  onChange={(patch) =>
                    handleUpdateEvidencia(evidencia.id, patch)
                  }
                  onRemove={() => handleRemoveEvidencia(evidencia.id)}
                />
              ))}
            </AppStack>
          )}

          <AppInline align="center" justify="end" gap="xs" wrap>
            {isSubmittingBatch ? (
              <AppBadge tone="info" appearance="soft" size="xs">
                Subiendo {uploadProgress.current} de {uploadProgress.total}
              </AppBadge>
            ) : null}

            <AppButton
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<UploadCloud size={15} />}
              loading={isSubmittingBatch}
              loadingText="Subiendo..."
              disabled={!canSubmit}
              onClick={() => void handleSubmit()}
            >
              Subir evidencias
            </AppButton>
          </AppInline>
        </AppStack>
      </AppContainer>

      <ImagesCropper
        open={cropDialog.isOpen}
        onOpenChange={(open) => {
          cropDialog.setOpen(open);

          if (!open) {
            setCropCandidates([]);
          }
        }}
        files={cropCandidates}
        onDone={handleCropDone}
      />
    </>
  );
}
