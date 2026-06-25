import { AppBadge } from "@/components/app/primitives/app-badge";
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
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { TicketMedia } from "@/Crm/features/dashboard/dashboard-tickets";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  ImageIcon,
  Maximize2,
  MessageCircle,
  Phone,
} from "lucide-react";
import React from "react";

export function ContactActionBlock({
  label,
  phone,
  disabled,
  compact = false,
  onWhatsapp,
  onCall,
  onCopy,
}: {
  label: string;
  phone?: string | null;
  disabled: boolean;
  compact?: boolean;
  onWhatsapp: () => void;
  onCall: () => void;
  onCopy: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.18)]",
        compact ? "px-2 py-1.5" : "px-2 py-2",
      )}
    >
      <AppInline gap="xs" align="center" justify="between" className="mb-1.5">
        <div className="min-w-0">
          <p className="truncate text-[11px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {label}
          </p>

          <p className="truncate text-sm font-medium leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]">
            {phone || "Sin teléfono"}
          </p>
        </div>

        {!disabled ? (
          <AppBadge size="xs" tone="success" appearance="soft">
            Disponible
          </AppBadge>
        ) : null}
      </AppInline>

      <AppGrid cols={3} gap="xs">
        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          width="full"
          disabled={disabled}
          leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
          onClick={onWhatsapp}
          className="h-8"
        >
          WA
        </AppButton>

        <AppButton
          type="button"
          size="xs"
          variant="ghost"
          width="full"
          disabled={disabled}
          leftIcon={<Phone className="h-3.5 w-3.5" />}
          onClick={onCall}
          className="h-8"
        >
          Llamar
        </AppButton>

        <AppButton
          type="button"
          size="xs"
          variant="ghost"
          width="full"
          disabled={disabled}
          leftIcon={<ClipboardCopy className="h-3.5 w-3.5" />}
          onClick={onCopy}
          className="h-8"
        >
          Copiar
        </AppButton>
      </AppGrid>
    </div>
  );
}

export function TicketMediaStrip({ medias }: { medias: TicketMedia[] }) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const visibleMedias = medias.slice(0, 4);
  const extraCount = Math.max(0, medias.length - visibleMedias.length);

  const selectedMedia =
    selectedIndex !== null ? (medias[selectedIndex] ?? null) : null;

  const isOpen = selectedIndex !== null;

  const closePreview = () => {
    setSelectedIndex(null);
  };

  const openPreview = (index: number) => {
    setSelectedIndex(index);
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
      <div
        className={[
          "rounded-[var(--app-radius-md)]",
          "border border-[hsl(var(--app-border,var(--border)))]",
          "bg-[hsl(var(--app-card-bg,var(--card)))]",
          "p-1.5",
        ].join(" ")}
      >
        <AppInline gap="xs" align="center" justify="between" className="mb-1.5">
          <AppInline gap="xs" align="center" className="min-w-0">
            <ImageIcon className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />

            <span className="truncate text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Adjuntos
            </span>
          </AppInline>

          <AppBadge size="xs" tone="info" appearance="soft">
            {medias.length}
          </AppBadge>
        </AppInline>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {visibleMedias.map((media, index) => (
            <button
              key={media.id}
              type="button"
              onClick={() => openPreview(index)}
              className={[
                "group relative h-14 w-14 shrink-0 overflow-hidden",
                "rounded-[var(--app-radius-md)]",
                "border border-[hsl(var(--app-border,var(--border)))]",
                "bg-[hsl(var(--app-muted,var(--muted))/0.35)]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
              ].join(" ")}
              aria-label={`Ver adjunto ${index + 1}`}
            >
              <img
                src={media.cdnUrl}
                alt={media.titulo || `Adjunto ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-active:scale-[0.98]"
              />

              <span
                className={[
                  "absolute inset-0 flex items-center justify-center",
                  "bg-black/0 text-white opacity-0",
                  "transition group-hover:bg-black/25 group-hover:opacity-100",
                  "group-focus-visible:bg-black/25 group-focus-visible:opacity-100",
                ].join(" ")}
              >
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
          ))}

          {extraCount > 0 ? (
            <button
              type="button"
              onClick={() => openPreview(visibleMedias.length)}
              className={[
                "flex h-14 w-14 shrink-0 items-center justify-center",
                "rounded-[var(--app-radius-md)] border border-dashed",
                "border-[hsl(var(--app-border,var(--border)))]",
                "bg-[hsl(var(--app-muted,var(--muted))/0.25)]",
                "text-xs font-semibold text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
              ].join(" ")}
              aria-label={`Ver ${extraCount} adjuntos adicionales`}
            >
              +{extraCount}
            </button>
          ) : null}
        </div>
      </div>

      <AppDialog open={isOpen} onOpenChange={(open) => !open && closePreview()}>
        <AppDialogContent
          size="2xl"
          viewport="default"
          padding="none"
          showCloseButton
          className="max-h-[92dvh] overflow-hidden"
        >
          <AppDialogHeader divider className="px-3 py-2">
            <AppDialogTitle className="text-sm">
              Adjuntos del ticket
            </AppDialogTitle>

            <AppDialogDescription className="text-xs">
              {selectedIndex !== null
                ? `Imagen ${selectedIndex + 1} de ${medias.length}`
                : "Vista previa del adjunto"}
            </AppDialogDescription>
          </AppDialogHeader>

          <AppDialogBody padding="none" className="bg-black">
            <div className="flex min-h-[52dvh] max-h-[68dvh] items-center justify-center">
              {selectedMedia ? (
                <img
                  src={selectedMedia.cdnUrl}
                  alt={
                    selectedMedia.titulo ||
                    `Adjunto ${(selectedIndex ?? 0) + 1}`
                  }
                  className="max-h-[68dvh] w-full object-contain"
                />
              ) : (
                <div className="p-6 text-center text-xs text-white/70">
                  No se pudo cargar el adjunto.
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
