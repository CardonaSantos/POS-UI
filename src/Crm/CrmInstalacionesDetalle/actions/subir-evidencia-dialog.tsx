import { memo, useCallback, useEffect, useRef, useState } from "react";

import { ImagePlus, Images, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";
import { usePostEvidenciaInstalacion } from "@/Crm/CrmHooks/hooks/instalaciones/instalaciones-hook";
import { EvidenciaDraftCard } from "./EvidenciaDraftCard";

type Props = {
  instalacionId: number;

  empresaId: number;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onCompleted: () => void;
};

export type UploadStatus = "pending" | "uploading" | "success" | "error";

export type EvidenciaDraft = {
  id: string;

  file: File;

  previewUrl: string;

  descripcion: string;

  status: UploadStatus;
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const SubirEvidenciaInstalacionDialog = memo(
  function SubirEvidenciaInstalacionDialog({
    instalacionId,
    empresaId,
    open,
    onOpenChange,
    onCompleted,
  }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const evidenciasRef = useRef<EvidenciaDraft[]>([]);

    const [evidencias, setEvidencias] = useState<EvidenciaDraft[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [progress, setProgress] = useState({
      current: 0,
      total: 0,
    });

    const uploadMutation = usePostEvidenciaInstalacion(
      instalacionId,
      empresaId,
    );

    useEffect(() => {
      evidenciasRef.current = evidencias;
    }, [evidencias]);

    useEffect(() => {
      return () => {
        evidenciasRef.current.forEach((evidencia) => {
          URL.revokeObjectURL(evidencia.previewUrl);
        });
      };
    }, []);

    const clearEvidencias = useCallback(() => {
      setEvidencias((current) => {
        current.forEach((evidencia) => {
          URL.revokeObjectURL(evidencia.previewUrl);
        });

        return [];
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }, []);

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (isSubmitting && !nextOpen) {
          return;
        }

        if (!nextOpen) {
          clearEvidencias();

          setProgress({
            current: 0,
            total: 0,
          });
        }

        onOpenChange(nextOpen);
      },
      [clearEvidencias, isSubmitting, onOpenChange],
    );

    const handleSelectFiles = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files ?? []);

        event.target.value = "";

        if (selected.length === 0) {
          return;
        }

        const valid = selected.filter((file) =>
          IMAGE_TYPES.includes(file.type),
        );

        const invalidCount = selected.length - valid.length;

        if (invalidCount > 0) {
          toast.warning(
            `${invalidCount} archivo(s) fueron omitidos. Usa JPG, PNG o WEBP.`,
          );
        }

        if (valid.length === 0) {
          return;
        }

        setEvidencias((current) => [
          ...current,

          ...valid.map(
            (file): EvidenciaDraft => ({
              id: crypto.randomUUID(),

              file,

              previewUrl: URL.createObjectURL(file),

              descripcion: "",

              status: "pending",
            }),
          ),
        ]);
      },
      [],
    );

    const handleDescriptionChange = useCallback(
      (id: string, descripcion: string) => {
        setEvidencias((current) =>
          current.map((evidencia) =>
            evidencia.id === id
              ? {
                  ...evidencia,

                  descripcion,

                  status:
                    evidencia.status === "error" ? "pending" : evidencia.status,
                }
              : evidencia,
          ),
        );
      },
      [],
    );

    const handleRemove = useCallback((id: string) => {
      setEvidencias((current) => {
        const target = current.find((evidencia) => evidencia.id === id);

        if (target) {
          URL.revokeObjectURL(target.previewUrl);
        }

        return current.filter((evidencia) => evidencia.id !== id);
      });
    }, []);

    const handleSubmit = useCallback(async () => {
      if (evidencias.length === 0) {
        toast.error("Selecciona al menos una imagen.");

        return;
      }

      setIsSubmitting(true);

      setProgress({
        current: 0,
        total: evidencias.length,
      });

      const uploadedIds = new Set<string>();

      const failedIds = new Set<string>();

      for (let index = 0; index < evidencias.length; index += 1) {
        const evidencia = evidencias[index];

        setProgress({
          current: index + 1,
          total: evidencias.length,
        });

        setEvidencias((current) =>
          current.map((item) =>
            item.id === evidencia.id
              ? {
                  ...item,
                  status: "uploading",
                }
              : item,
          ),
        );

        const body = new FormData();

        body.append("file", evidencia.file);

        /**
         * El técnico no tiene que
         * seleccionar el tipo.
         *
         * Para el contrato actual
         * enviamos OTRO.
         */
        body.append("tipo", TipoEvidenciaClienteOperacion.OTRO);

        const descripcion = evidencia.descripcion.trim();

        if (descripcion) {
          body.append("descripcion", descripcion);
        }

        /**
         * Orden automático según
         * posición en el batch.
         */
        body.append("orden", String(index));

        try {
          await uploadMutation.mutateAsync(body);

          uploadedIds.add(evidencia.id);

          setEvidencias((current) =>
            current.map((item) =>
              item.id === evidencia.id
                ? {
                    ...item,
                    status: "success",
                  }
                : item,
            ),
          );
        } catch (error) {
          console.error(error);

          failedIds.add(evidencia.id);

          setEvidencias((current) =>
            current.map((item) =>
              item.id === evidencia.id
                ? {
                    ...item,
                    status: "error",
                  }
                : item,
            ),
          );
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

      setIsSubmitting(false);

      setProgress({
        current: 0,
        total: 0,
      });

      if (failedIds.size === 0) {
        toast.success(
          uploadedIds.size === 1
            ? "Evidencia subida correctamente."
            : `${uploadedIds.size} evidencias subidas correctamente.`,
        );

        clearEvidencias();

        onCompleted();

        return;
      }

      if (uploadedIds.size === 0) {
        toast.error(
          "No fue posible subir las evidencias. Las imágenes permanecen disponibles para reintentar.",
        );

        return;
      }

      toast.warning(
        `Se subieron ${uploadedIds.size} de ${evidencias.length} evidencias. Las fallidas permanecen disponibles para reintentar.`,
      );
    }, [clearEvidencias, evidencias, onCompleted, uploadMutation]);

    const canSubmit = evidencias.length > 0 && !isSubmitting;

    return (
      <AppDialog open={open} onOpenChange={handleOpenChange}>
        <AppDialogContent size="lg" viewport="compact">
          <AppDialogHeader>
            <AppDialogTitle>Subir evidencias</AppDialogTitle>

            <AppDialogDescription>
              Seleccione una o varias imágenes y agregue una descripción cuando
              sea necesario.
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody>
            <AppStack gap="sm">
              {/* Selector */}
              <input
                ref={inputRef}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                multiple
                className="hidden"
                onChange={handleSelectFiles}
              />

              <AppCard variant="outline" size="xs" radius="md">
                <AppInline
                  align="center"
                  justify="between"
                  gap="sm"
                  wrap
                  fullWidth
                >
                  <AppInline align="center" gap="xs">
                    <Images
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Imágenes
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        JPG, PNG o WEBP
                      </p>
                    </div>
                  </AppInline>

                  <AppInline gap="xs" align="center">
                    <AppBadge
                      tone={evidencias.length > 0 ? "info" : "neutral"}
                      appearance="soft"
                      size="xs"
                    >
                      {evidencias.length} imagen
                      {evidencias.length === 1 ? "" : "es"}
                    </AppBadge>

                    <AppButton
                      type="button"
                      size="xs"
                      variant="secondary"
                      leftIcon={<ImagePlus size={13} />}
                      disabled={isSubmitting}
                      onClick={() => inputRef.current?.click()}
                    >
                      Seleccionar
                    </AppButton>

                    {evidencias.length > 0 ? (
                      <AppButton
                        type="button"
                        size="xs"
                        variant="ghost"
                        leftIcon={<Trash2 size={13} />}
                        disabled={isSubmitting}
                        onClick={clearEvidencias}
                      >
                        Limpiar
                      </AppButton>
                    ) : null}
                  </AppInline>
                </AppInline>
              </AppCard>

              {/* Lista */}
              {evidencias.length === 0 ? (
                <AppEmptyState
                  preset="empty"
                  variant="plain"
                  size="sm"
                  align="center"
                  icon={<Images size={30} strokeWidth={1.5} />}
                  title="Sin imágenes seleccionadas"
                  description="Puede seleccionar varias fotografías en una sola operación."
                />
              ) : (
                <AppStack gap="xs">
                  {evidencias.map((evidencia, index) => (
                    <EvidenciaDraftCard
                      key={evidencia.id}
                      evidencia={evidencia}
                      index={index}
                      disabled={isSubmitting}
                      onDescriptionChange={handleDescriptionChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </AppStack>
              )}

              <AppInline
                align="center"
                justify="between"
                gap="sm"
                wrap
                fullWidth
              >
                <div>
                  {isSubmitting ? (
                    <AppBadge tone="info" appearance="soft" size="xs">
                      Subiendo {progress.current} de {progress.total}
                    </AppBadge>
                  ) : null}
                </div>

                <AppInline gap="xs" align="center">
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleOpenChange(false)}
                  >
                    Cerrar
                  </AppButton>

                  <AppButton
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<UploadCloud size={15} />}
                    loading={isSubmitting}
                    loadingText="Subiendo..."
                    disabled={!canSubmit}
                    onClick={() => void handleSubmit()}
                  >
                    Subir evidencias
                  </AppButton>
                </AppInline>
              </AppInline>
            </AppStack>
          </AppDialogBody>
        </AppDialogContent>
      </AppDialog>
    );
  },
);
