// ProductImagesCropper.tsx
"use client";

import * as React from "react";
import type { Crop, PercentCrop } from "react-image-crop";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ImageDown,
  Images,
  Maximize2,
  RefreshCcw,
  X,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  exportPercentCropToBlob,
  ImageCropper,
  type ImageCropperHandle,
  type Output,
} from "./Cropper";

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  files: File[];
  onDone: (croppedFiles: File[]) => void;
  size?: number;
};

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function toCrop(percentCrop: PercentCrop | null | undefined): Crop | undefined {
  return percentCrop ? ({ ...percentCrop, unit: "%" } as Crop) : undefined;
}

function getExportOptions(file: File): Output {
  return {
    mode: "native",
    mime: file.type === "image/png" ? "image/png" : "image/jpeg",
    quality: file.type === "image/jpeg" ? 0.98 : undefined,
  };
}

function getCroppedFileName(file: File) {
  const name = file.name.replace(/\.[^.]+$/, "");
  const ext = file.type === "image/png" ? "png" : "jpg";

  return `${name}_crop.${ext}`;
}

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    image.src = url;
  });
}

function getStatusData({
  omitted,
  result,
  crop,
}: {
  omitted: boolean;
  result: File | null;
  crop: PercentCrop | null;
}): {
  label: string;
  tone: AppBadgeTone;
} {
  if (omitted) {
    return {
      label: "Excluida",
      tone: "neutral",
    };
  }

  if (result) {
    return {
      label: "Recortada",
      tone: "success",
    };
  }

  if (crop) {
    return {
      label: "Pendiente",
      tone: "warning",
    };
  }

  return {
    label: "Original",
    tone: "info",
  };
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <AppInline align="center" justify="between" gap="sm">
      <span className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {label}
      </span>

      <span className="max-w-[150px] truncate text-right text-[11px] font-medium tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value}
      </span>
    </AppInline>
  );
}

function ToolbarButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "secondary",
  vertical,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  vertical?: boolean;
}) {
  return (
    <AppButton
      type="button"
      variant={variant}
      size="xs"
      width={vertical ? "full" : "auto"}
      leftIcon={vertical ? icon : undefined}
      disabled={disabled}
      aria-label={label}
      title={label}
      onClick={() => void onClick()}
      className={vertical ? "justify-start" : "h-8 px-2"}
    >
      {vertical ? label : icon}
    </AppButton>
  );
}

function ToolbarNav({
  onPrev,
  onNext,
  onApply,
  onReset,
  onToggleOmit,
  onUseOriginal,
  canPrev,
  canNext,
  canApply,
  canReset,
  omitted,
  vertical = false,
}: {
  onPrev: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
  onApply: () => void | Promise<void>;
  onReset: () => void;
  onToggleOmit: () => void;
  onUseOriginal: () => void | Promise<void>;
  canPrev: boolean;
  canNext: boolean;
  canApply: boolean;
  canReset: boolean;
  omitted: boolean;
  vertical?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex",
        vertical ? "w-full flex-col items-stretch gap-2" : "items-center gap-1",
      ].join(" ")}
    >
      <ToolbarButton
        label="Anterior"
        icon={<ChevronLeft size={14} />}
        onClick={onPrev}
        disabled={!canPrev}
        vertical={vertical}
      />

      <ToolbarButton
        label="Aplicar recorte"
        icon={<CheckCircle2 size={14} />}
        onClick={onApply}
        disabled={!canApply}
        variant="primary"
        vertical={vertical}
      />

      <ToolbarButton
        label="Siguiente"
        icon={<ChevronRight size={14} />}
        onClick={onNext}
        disabled={!canNext}
        vertical={vertical}
      />

      <div
        className={
          vertical
            ? "h-px w-full bg-[hsl(var(--app-border,var(--border)))]"
            : "mx-1 h-6 w-px bg-[hsl(var(--app-border,var(--border)))]"
        }
        aria-hidden="true"
      />

      <ToolbarButton
        label="Rehacer recorte"
        icon={<RefreshCcw size={14} />}
        onClick={onReset}
        disabled={!canReset}
        vertical={vertical}
      />

      <ToolbarButton
        label={omitted ? "Incluir en lote" : "Excluir del lote"}
        icon={omitted ? <Eye size={14} /> : <EyeOff size={14} />}
        onClick={onToggleOmit}
        variant={omitted ? "primary" : "secondary"}
        vertical={vertical}
      />

      <ToolbarButton
        label="Usar imagen completa"
        icon={<Maximize2 size={14} />}
        onClick={onUseOriginal}
        vertical={vertical}
      />
    </div>
  );
}

function ThumbnailStrip({
  urls,
  results,
  omit,
  currentIndex,
  onGo,
}: {
  urls: string[];
  results: Array<File | null>;
  omit: boolean[];
  currentIndex: number;
  onGo: (index: number) => void | Promise<void>;
}) {
  if (urls.length <= 1) return null;

  return (
    <>
      <AppSeparator spacing="none" />

      <div className="overflow-x-auto bg-[hsl(var(--app-background,var(--background)))/0.72] p-2 [scrollbar-width:thin] [scrollbar-color:hsl(var(--app-border,var(--border)))_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--app-border,var(--border)))]">
        <div className="flex gap-2">
          {urls.map((url, index) => {
            const active = index === currentIndex;

            return (
              <button
                key={`${url}-${index}`}
                type="button"
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={active}
                onClick={() => void onGo(index)}
                className={[
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--app-radius-md)] border transition sm:h-16 sm:w-16",
                  active
                    ? "border-[hsl(var(--app-primary))] ring-2 ring-[hsl(var(--app-primary)/0.25)]"
                    : "border-[hsl(var(--app-border,var(--border)))] hover:border-[hsl(var(--app-primary)/0.55)]",
                ].join(" ")}
              >
                <img
                  src={url}
                  alt={`Miniatura ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {omit[index] ? (
                  <span className="absolute right-1 top-1 rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-warning))] px-1 text-[9px] font-semibold text-[hsl(var(--app-warning-foreground,var(--background)))]">
                    omit
                  </span>
                ) : null}

                {results[index] && !omit[index] ? (
                  <span className="absolute right-1 top-1 rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-success))] px-1 text-[9px] font-semibold text-white">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function ImagesCropper({
  open,
  onOpenChange,
  files,
  onDone,
}: Props) {
  const [idx, setIdx] = React.useState(0);
  const [urls, setUrls] = React.useState<string[]>([]);
  const [crops, setCrops] = React.useState<Array<PercentCrop | null>>([]);
  const [results, setResults] = React.useState<Array<File | null>>([]);
  const [omit, setOmit] = React.useState<boolean[]>([]);

  const cropperRef = React.useRef<ImageCropperHandle>(null);

  const currentFile = files[idx] ?? null;
  const currentUrl = urls[idx] ?? null;
  const currentCrop = crops[idx] ?? null;
  const currentResult = results[idx] ?? null;
  const currentOmitted = omit[idx] ?? false;

  React.useEffect(() => {
    const nextUrls = files.map((file) => URL.createObjectURL(file));

    setUrls(nextUrls);
    setCrops((previous) =>
      Array.from(
        { length: files.length },
        (_, index) => previous[index] ?? null,
      ),
    );
    setResults((previous) =>
      Array.from(
        { length: files.length },
        (_, index) => previous[index] ?? null,
      ),
    );
    setOmit((previous) =>
      Array.from(
        { length: files.length },
        (_, index) => previous[index] ?? false,
      ),
    );
    setIdx(0);

    return () => {
      nextUrls.forEach(URL.revokeObjectURL);
    };
  }, [files]);

  const status = getStatusData({
    omitted: currentOmitted,
    result: currentResult,
    crop: currentCrop,
  });

  const hasFiles = files.length > 0;
  const hasIncludedFiles = files.some((_, index) => !omit[index]);

  const updateCropAtIndex = React.useCallback(
    (index: number, percentCrop: PercentCrop | null) => {
      setCrops((previous) => {
        const copy = [...previous];
        copy[index] = percentCrop;
        return copy;
      });
    },
    [],
  );

  const updateResultAtIndex = React.useCallback(
    (index: number, file: File | null) => {
      setResults((previous) => {
        const copy = [...previous];
        copy[index] = file;
        return copy;
      });
    },
    [],
  );

  const exportCropToFile = React.useCallback(
    async (
      index: number,
      percentCrop: PercentCrop,
      imageElement?: HTMLImageElement | null,
    ) => {
      const file = files[index];
      const url = urls[index];

      if (!file || !url) return null;

      const imageEl = imageElement ?? (await loadImageFromUrl(url));
      const result = await exportPercentCropToBlob(
        imageEl,
        percentCrop,
        getExportOptions(file),
      );

      return new File([result.blob], getCroppedFileName(file), {
        type: result.blob.type,
      });
    },
    [files, urls],
  );

  const commitCurrent = React.useCallback(
    async (overridePercent?: PercentCrop) => {
      const percentCrop = overridePercent ?? crops[idx];
      const imageEl = cropperRef.current?.getImageEl();

      if (!percentCrop) return;

      const file = await exportCropToFile(idx, percentCrop, imageEl);

      if (!file) return;

      updateResultAtIndex(idx, file);
    },
    [crops, exportCropToFile, idx, updateResultAtIndex],
  );

  const useOriginal = React.useCallback(async () => {
    const fullCrop: PercentCrop = {
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

    updateCropAtIndex(idx, fullCrop);

    const imageEl = cropperRef.current?.getImageEl();
    const file = await exportCropToFile(idx, fullCrop, imageEl);

    if (file) {
      updateResultAtIndex(idx, file);
    }
  }, [exportCropToFile, idx, updateCropAtIndex, updateResultAtIndex]);

  const go = React.useCallback(
    async (nextIndex: number) => {
      if (nextIndex === idx) return;

      if (crops[idx] && !results[idx] && !omit[idx]) {
        try {
          await commitCurrent();
        } catch {
          // no bloquea navegación
        }
      }

      setIdx(nextIndex);
    },
    [commitCurrent, crops, idx, omit, results],
  );

  const goPrev = React.useCallback(() => go(Math.max(0, idx - 1)), [go, idx]);

  const goNext = React.useCallback(
    () => go(Math.min(files.length - 1, idx + 1)),
    [files.length, go, idx],
  );

  const resetCurrent = React.useCallback(() => {
    updateResultAtIndex(idx, null);
  }, [idx, updateResultAtIndex]);

  const toggleOmit = React.useCallback(() => {
    setOmit((previous) => {
      const copy = [...previous];
      copy[idx] = !copy[idx];
      return copy;
    });
  }, [idx]);

  const confirmAll = React.useCallback(async () => {
    if (!hasFiles) return;

    const finalResults = [...results];

    for (let index = 0; index < files.length; index += 1) {
      if (omit[index]) continue;

      if (!finalResults[index] && crops[index]) {
        try {
          const croppedFile = await exportCropToFile(index, crops[index]!);

          if (croppedFile) {
            finalResults[index] = croppedFile;
          }
        } catch {
          finalResults[index] = null;
        }
      }
    }

    const finalFiles = files.reduce<File[]>((acc, file, index) => {
      if (omit[index]) return acc;

      acc.push(finalResults[index] ?? file);
      return acc;
    }, []);

    onDone(finalFiles);
    onOpenChange(false);
  }, [
    crops,
    exportCropToFile,
    files,
    hasFiles,
    omit,
    onDone,
    onOpenChange,
    results,
  ]);

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[92dvh] overflow-hidden p-0 sm:max-w-[1040px]">
        <div className="flex max-h-[92dvh] min-h-[72dvh] flex-col">
          <AppDialogHeader className="border-b border-[hsl(var(--app-border,var(--border)))] px-4 py-3">
            <AppInline align="center" justify="between" gap="sm">
              <div className="min-w-0">
                <AppDialogTitle>
                  <AppInline align="center" gap="xs" className="min-w-0">
                    <Images size={16} />
                    <span className="truncate">
                      Imágenes {hasFiles ? `(${idx + 1}/${files.length})` : ""}
                    </span>
                  </AppInline>
                </AppDialogTitle>

                <AppDialogDescription>
                  Recorta, omite o conserva las imágenes antes de subirlas.
                </AppDialogDescription>
              </div>

              <AppBadge tone={status.tone} appearance="soft" size="xs">
                {status.label}
              </AppBadge>
            </AppInline>
          </AppDialogHeader>

          {!hasFiles ? (
            <div className="flex min-h-0 flex-1 items-center justify-center p-6">
              <AppEmptyState
                preset="empty"
                variant="plain"
                size="sm"
                align="center"
                icon={<Images size={34} strokeWidth={1.5} />}
                title="Sin imágenes"
                description="Selecciona al menos una imagen para iniciar el recorte."
              />
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_280px] md:grid-rows-1">
              <div className="flex min-h-0 flex-col bg-[hsl(var(--app-muted,var(--muted)))/0.24]">
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-4 [scrollbar-width:thin] [scrollbar-color:hsl(var(--app-border,var(--border)))_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--app-border,var(--border)))]">
                  {currentUrl ? (
                    <ImageCropper
                      ref={cropperRef}
                      src={currentUrl}
                      aspect={1}
                      minWidth={120}
                      minHeight={120}
                      initial={toCrop(currentCrop)}
                      className="max-h-[58dvh] max-w-full object-contain md:max-h-[66dvh]"
                      onChange={(_px, percent) => {
                        updateCropAtIndex(idx, percent);

                        if (results[idx]) {
                          updateResultAtIndex(idx, null);
                        }
                      }}
                      onComplete={(_px, percent) => {
                        updateCropAtIndex(idx, percent);
                      }}
                    />
                  ) : null}
                </div>

                <ThumbnailStrip
                  urls={urls}
                  results={results}
                  omit={omit}
                  currentIndex={idx}
                  onGo={go}
                />

                <div className="border-t border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))/0.88] px-3 py-2 backdrop-blur md:hidden">
                  <AppInline align="center" justify="between" gap="xs">
                    <ToolbarNav
                      onPrev={goPrev}
                      onNext={goNext}
                      onApply={commitCurrent}
                      onReset={resetCurrent}
                      onToggleOmit={toggleOmit}
                      onUseOriginal={useOriginal}
                      canPrev={idx > 0}
                      canNext={idx < files.length - 1}
                      canApply={Boolean(currentCrop) && !currentOmitted}
                      canReset={Boolean(currentResult)}
                      omitted={currentOmitted}
                    />

                    <AppInline gap="xs" align="center">
                      <AppButton
                        type="button"
                        variant="primary"
                        size="xs"
                        width="auto"
                        leftIcon={<ImageDown size={13} />}
                        onClick={() => void confirmAll()}
                        disabled={!hasIncludedFiles}
                      >
                        Guardar
                      </AppButton>

                      <AppButton
                        type="button"
                        variant="ghost"
                        size="xs"
                        width="auto"
                        aria-label="Cancelar"
                        onClick={() => onOpenChange(false)}
                        className="h-8 px-2"
                      >
                        <X size={13} />
                      </AppButton>
                    </AppInline>
                  </AppInline>
                </div>
              </div>

              <aside className="hidden min-h-0 flex-col border-l border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))] md:flex">
                <AppStack gap="md" className="min-h-0 flex-1 p-4">
                  <ToolbarNav
                    vertical
                    onPrev={goPrev}
                    onNext={goNext}
                    onApply={commitCurrent}
                    onReset={resetCurrent}
                    onToggleOmit={toggleOmit}
                    onUseOriginal={useOriginal}
                    canPrev={idx > 0}
                    canNext={idx < files.length - 1}
                    canApply={Boolean(currentCrop) && !currentOmitted}
                    canReset={Boolean(currentResult)}
                    omitted={currentOmitted}
                  />

                  <AppSeparator spacing="xs" />

                  <AppStack gap="xs">
                    <MetaRow
                      label="Índice"
                      value={`${idx + 1} / ${files.length}`}
                    />
                    <MetaRow
                      label="Omitida"
                      value={currentOmitted ? "Sí" : "No"}
                    />
                    <MetaRow label="Estado" value={status.label} />
                    <MetaRow
                      label="Formato"
                      value={
                        currentFile?.type
                          ?.replace("image/", "")
                          .toUpperCase() ?? "—"
                      }
                    />
                    <MetaRow label="Archivo" value={currentFile?.name ?? "—"} />
                  </AppStack>
                </AppStack>

                <div className="border-t border-[hsl(var(--app-border,var(--border)))] p-4">
                  <AppInline align="center" justify="end" gap="xs">
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="xs"
                      width="auto"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancelar
                    </AppButton>

                    <AppButton
                      type="button"
                      variant="primary"
                      size="xs"
                      width="auto"
                      leftIcon={<ImageDown size={13} />}
                      onClick={() => void confirmAll()}
                      disabled={!hasIncludedFiles}
                    >
                      Guardar lote
                    </AppButton>
                  </AppInline>
                </div>
              </aside>
            </div>
          )}
        </div>
      </AppDialogContent>
    </AppDialog>
  );
}
