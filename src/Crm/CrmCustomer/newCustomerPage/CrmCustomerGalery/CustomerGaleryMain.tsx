import { CustomerImage } from "@/Crm/features/customer-galery/customer-galery.interfaces";
import { useState } from "react";
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
import { Trash } from "lucide-react";
import { useDeleteImage } from "./API/functions";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mediaSelected, setMediaSelected] = useState<MediaSelected>({
    customerId: customerId,
    mediaId: 0,
  });
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const deleteImage = useDeleteImage(
    mediaSelected.mediaId,
    empresaId,
    customerId
  );

  const handleDeleteMedia = async () => {
    if (!mediaSelected.mediaId || !mediaSelected.customerId) {
      toast.warning("Datos no válidos");
      return;
    }

    await toast.promise(deleteImage.mutateAsync(), {
      success: "Recurso eliminado",
      loading: "Eliminando...",
      error: (error) => getApiErrorMessageAxios(error),
    });

    setOpenDelete(false);
    setMediaSelected({
      customerId: 0,
      mediaId: customerId,
    });
  };

  if (!images.length) return null;
  console.log("El media selected es:", mediaSelected);

  return (
    <>
      {/* Grid compacta */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {images.map((img, i) => (
          <div className="">
            <button
              key={img.id}
              type="button"
              className="relative aspect-square overflow-hidden rounded-md border bg-muted"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            >
              <img
                src={img.cdnUrl}
                alt={img.titulo ?? "Imagen del cliente"}
                className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              />

              {manageable ? (
                <button
                  type="button"
                  className="absolute bottom-2 right-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 hover:bg-rose-600"
                  onClick={(e) => {
                    e.stopPropagation(); // evita que abra el modal al hacer click
                    setMediaSelected({
                      customerId: customerId,
                      mediaId: img.id,
                    });
                    setOpenDelete(true);
                  }}
                >
                  <Trash className="h-4 w-4 " />
                </button>
              ) : null}
            </button>
          </div>
        ))}
      </div>
      {/* Lightbox fullscreen */}
      <Lightbox
        plugins={[Captions, Counter, Download, Fullscreen, Share, Zoom]}
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({
          src: img.cdnUrl,
          title: img.titulo ?? "",
          description: img.descripcion ?? "",
          type: "image",
          download: `${img.cdnUrl}?download`,
        }))}
      />
      <AdvancedDialogCRM
        type="warning"
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminación de Media"
        description="¿Estás seguro de eliminar este recurso? Esta acción no se puede deshacer"
        confirmButton={{
          label: "Si, continuar y eliminar",
          onClick: handleDeleteMedia,
          loading: deleteImage.isPending,
          loadingText: "Eliminando...",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: deleteImage.isPending,
          onClick: () => {
            setOpenDelete(false);
          },
        }}
      />
    </>
  );
}
