import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { TicketMedia } from "@/Crm/features/dashboard/dashboard-tickets";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import React from "react";

export function TicketMediaSection({ medias }: { medias: TicketMedia[] }) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const hasMedias = medias.length > 0;
  const selectedMedia =
    selectedIndex !== null ? (medias[selectedIndex] ?? null) : null;

  const closePreview = () => {
    setSelectedIndex(null);
  };

  const goPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return current <= 0 ? medias.length - 1 : current - 1;
    });
  };

  const goNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return current >= medias.length - 1 ? 0 : current + 1;
    });
  };

  return (
    <>
      <AppCard
        title={
          <AppInline gap="xs" align="center">
            <ImageIcon className="h-4 w-4" />
            <span>Evidencia</span>
          </AppInline>
        }
        action={
          <AppBadge
            size="xs"
            tone={hasMedias ? "info" : "neutral"}
            appearance="soft"
          >
            {medias.length}
          </AppBadge>
        }
        variant="outline"
        size="sm"
        radius="lg"
      >
        {hasMedias ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {medias.map((media, index) => (
              <button
                key={media.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={[
                  "group relative aspect-square overflow-hidden",
                  "rounded-[var(--app-radius-md)]",
                  "border border-[hsl(var(--app-border,var(--border)))]",
                  "bg-[hsl(var(--app-muted,var(--muted))/0.35)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
                ].join(" ")}
                aria-label={`Ver evidencia ${index + 1}`}
              >
                <img
                  src={media.cdnUrl}
                  alt={media.titulo || `Evidencia ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-active:scale-[0.98]"
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Este ticket no tiene evidencia multimedia adjunta.
          </p>
        )}
      </AppCard>

      <AppDialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) closePreview();
        }}
      >
        <AppDialogContent
          size="2xl"
          viewport="default"
          padding="none"
          showCloseButton
          className="max-h-[92dvh] overflow-hidden"
        >
          <AppDialogHeader divider className="px-3 py-2">
            <AppDialogTitle className="text-sm">
              Evidencia del ticket
            </AppDialogTitle>

            <AppDialogDescription className="text-xs">
              {selectedIndex !== null
                ? `Imagen ${selectedIndex + 1} de ${medias.length}`
                : "Vista previa"}
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody padding="none" className="bg-black">
            <div className="flex min-h-[55dvh] max-h-[68dvh] items-center justify-center">
              {selectedMedia ? (
                <img
                  src={selectedMedia.cdnUrl}
                  alt={
                    selectedMedia.titulo ||
                    `Evidencia ${(selectedIndex ?? 0) + 1}`
                  }
                  className="max-h-[68dvh] w-full object-contain"
                />
              ) : (
                <div className="p-6 text-center text-xs text-white/70">
                  No se pudo cargar la imagen.
                </div>
              )}
            </div>
          </AppDialogBody>

          <AppDialogFooter
            divider
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2"
          >
            <AppButton
              type="button"
              size="xs"
              variant="secondary"
              width="full"
              disabled={medias.length <= 1}
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
              onClick={goPrevious}
            >
              Anterior
            </AppButton>

            <span className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {selectedIndex !== null ? selectedIndex + 1 : 0}/{medias.length}
            </span>

            <AppButton
              type="button"
              size="xs"
              variant="secondary"
              width="full"
              disabled={medias.length <= 1}
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
              onClick={goNext}
            >
              Siguiente
            </AppButton>
          </AppDialogFooter>
        </AppDialogContent>
      </AppDialog>
    </>
  );
}
