"use client";

import * as React from "react";
import { Trash } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Share from "yet-another-react-lightbox/plugins/share";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { toast } from "sonner";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppGrid } from "@/components/app/primitives/app-grid";
import {
  useAppConfirmHandler,
  useAppDisclosure,
} from "@/components/app/handlers";
import { CustomerImage } from "@/Crm/features/customer-galery/customer-galery.interfaces";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import { useDeleteImage } from "./API/functions";

interface CustomerImagesGalleryProps {
  images: CustomerImage[];
  customerId: number;
  manageable?: boolean;
}

interface MediaSelected {
  mediaId: number;
  customerId: number;
}

export function CustomerImagesGallery({
  images,
  customerId,
  manageable = false,
}: CustomerImagesGalleryProps) {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const lightbox = useAppDisclosure();
  const deleteDialog = useAppConfirmHandler<MediaSelected>();

  const [index, setIndex] = React.useState(0);

  const selectedMediaId = deleteDialog.target?.mediaId ?? 0;

  const deleteImage = useDeleteImage(selectedMediaId, empresaId, customerId);

  const slides = React.useMemo(
    () =>
      images.map((img) => ({
        src: img.cdnUrl,
        title: img.titulo ?? "",
        description: img.descripcion ?? "",
        type: "image" as const,
        download: `${img.cdnUrl}?download`,
      })),
    [images],
  );

  const handleOpenImage = React.useCallback(
    (imageIndex: number) => {
      setIndex(imageIndex);
      lightbox.open();
    },
    [lightbox],
  );

  const handleDeleteOpenChange = React.useCallback(
    (open: boolean) => {
      deleteDialog.setOpen(open);

      if (!open) {
        deleteDialog.clearTarget();
      }
    },
    [deleteDialog],
  );

  const handleDeleteMedia = React.useCallback(async () => {
    const target = deleteDialog.target;

    if (!target?.mediaId || !target.customerId) {
      toast.warning("Datos no válidos");
      return;
    }

    await toast.promise(deleteImage.mutateAsync(), {
      success: "Recurso eliminado",
      loading: "Eliminando...",
      error: (error) => getApiErrorMessageAxios(error),
    });

    deleteDialog.close();
    deleteDialog.clearTarget();
  }, [deleteDialog, deleteImage]);

  if (!images.length) return null;

  return (
    <>
      <AppGrid cols={{ base: 3, sm: 4, md: 5 }} gap="xs">
        {images.map((img, imageIndex) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.28)]"
          >
            <button
              type="button"
              className="block h-full w-full overflow-hidden"
              onClick={() => handleOpenImage(imageIndex)}
            >
              <img
                src={img.cdnUrl}
                alt={img.titulo ?? "Imagen del cliente"}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />

              <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>

            {manageable ? (
              <AppButton
                type="button"
                variant="danger"
                size="xs"
                width="auto"
                aria-label="Eliminar recurso"
                className="absolute bottom-2 right-2 h-7 w-7 rounded-full p-0 opacity-95"
                onClick={() =>
                  deleteDialog.open({
                    customerId,
                    mediaId: img.id,
                  })
                }
              >
                <Trash size={14} />
              </AppButton>
            ) : null}
          </div>
        ))}
      </AppGrid>

      <Lightbox
        plugins={[Captions, Counter, Download, Fullscreen, Share, Zoom]}
        open={lightbox.isOpen}
        close={lightbox.close}
        index={index}
        slides={slides}
      />

      <AppConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={handleDeleteOpenChange}
        preset="delete"
        tone="danger"
        title="Eliminar recurso"
        description="¿Está seguro de eliminar este recurso? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={deleteImage.isPending}
        preventClose={deleteImage.isPending}
        onConfirm={handleDeleteMedia}
      />
    </>
  );
}
