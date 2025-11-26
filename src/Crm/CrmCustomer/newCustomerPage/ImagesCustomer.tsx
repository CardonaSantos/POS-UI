// src/Crm/features/CrmCustomer/components/ImagesCustomer.tsx
import { useRef, useState } from "react";
import { toast } from "sonner";
import { buildMediaFormData } from "@/Crm/Helpers/media.utils";
import ImagesCropper from "@/Crm/Helpers/CutterImages/ImageCropper";
import {
  MediaUploadItem,
  SubirMediaBatchPayload,
} from "../API/payload.interfaces";
import { useUploadMediaBatch } from "../API/customer-profile.queries";
import { Button } from "@/components/ui/button";
import { Cloud, X } from "lucide-react";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { CustomerImagesGallery } from "./CrmCustomerGalery/CustomerGaleryMain";
import { CustomerImage } from "@/Crm/features/customer-galery/customer-galery.interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { customerQkeys } from "@/Crm/CrmHooks/hooks/Client/Qk";

interface Props {
  clienteId: number;
  empresaId: number;
  imagenesCliente: CustomerImage[];
}

function ImagesCustomer({ clienteId, empresaId, imagenesCliente }: Props) {
  const query = useQueryClient();
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [items, setItems] = useState<MediaUploadItem[]>([]);
  const [openCropper, setOpenCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const uploadMediaBatch = useUploadMediaBatch(clienteId);
  const handleDeletFromItems = (item: MediaUploadItem) => {
    setItems((previa) =>
      previa.filter((it) => it.custom_Id !== item.custom_Id)
    );
  };
  // cuando el usuario selecciona imágenes desde un input
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setRawFiles(files);
    setOpenCropper(true);
    e.target.value = "";
  };

  // cuando el cropper termina y entrega los archivos finales
  const handleCropDone = (croppedFiles: File[]) => {
    const newItems: MediaUploadItem[] = croppedFiles.map((file) => ({
      file,
      titulo: "",
      descripcion: "",
      etiqueta: "",
      custom_Id: crypto.randomUUID(),
    }));
    //combinar arrays
    setItems((previa) => [...previa, ...newItems]);
    setRawFiles([]);
  };

  const updateItem = (index: number, partial: Partial<MediaUploadItem>) => {
    setItems((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], ...partial };
      return clone;
    });
  };

  const handleUploadMedia = async () => {
    if (!items.length) {
      toast.error("No hay imágenes para subir");
      return;
    }

    const payload: SubirMediaBatchPayload = {
      empresaId,
      clienteId,
      categoria: "CLIENTE_GENERAL", // ajusta al enum que uses
      basePrefix: "crm/clientes/imagenes",
      publico: true,
      items,
    };

    const formData = buildMediaFormData(payload);

    await toast.promise(uploadMediaBatch.mutateAsync(formData), {
      loading: "Subiendo archivos...",
      success: "¡Archivos subidos!",
      error: "Error al subir los archivos",
    });
    query.invalidateQueries({
      queryKey: customerQkeys.specificCustomer(clienteId),
    });

    setItems([]);
    setRawFiles([]);
    setOpenConfirm(false);
  };

  return (
    <div className="container mx-auto space-y-4">
      {/* Input para seleccionar imágenes */}
      <div>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Cloud />
            </EmptyMedia>
            <EmptyTitle>Cargar Imágenes</EmptyTitle>
            <EmptyDescription>
              Sube tus archivos a tu almacenamiento en la nube para acceder a
              ellos desde cualquier lugar.{" "}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Label className="block text-sm font-medium mb-1">
              Seleccionar imágenes
            </Label>
            <Button variant="outline" size="sm">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
              />
            </Button>
          </EmptyContent>
        </Empty>
      </div>

      {/* Cropper modal */}
      <ImagesCropper
        open={openCropper}
        onOpenChange={setOpenCropper}
        files={rawFiles}
        onDone={handleCropDone}
      />

      {/* Lista de imágenes con sus metadatos */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 border rounded-md bg-muted/30"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                <img
                  src={URL.createObjectURL(item.file)}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Título"
                  value={item.titulo ?? ""}
                  onChange={(e) => updateItem(i, { titulo: e.target.value })}
                />
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Descripción"
                  value={item.descripcion ?? ""}
                  onChange={(e) =>
                    updateItem(i, { descripcion: e.target.value })
                  }
                />
                <Button
                  onClick={() => handleDeletFromItems(item)}
                  className="w-8 h-8 p-0"
                  variant="destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <button
          onClick={() => setOpenConfirm(true)}
          disabled={!items.length || uploadMediaBatch.isPending}
          className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
        >
          {uploadMediaBatch.isPending ? "Subiendo..." : "Subir imágenes"}
        </button>
      </div>

      <AdvancedDialogCRM
        type="info"
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Carga de imágenes"
        description="¿Está seguro de subir estos datos?"
        confirmButton={{
          label: "Cargar",
          loadingText: "Subiendo imágenes",
          loading: uploadMediaBatch.isPending,
          disabled: uploadMediaBatch.isPending,
          onClick: handleUploadMedia,
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: uploadMediaBatch.isPending,
        }}
      />

      <div className="">
        <h2 className="font-semibold text-center text-lg">Imágenes en línea</h2>
        <CustomerImagesGallery
          customerId={clienteId}
          manageable={true}
          images={imagenesCliente}
        />
      </div>
    </div>
  );
}

export default ImagesCustomer;
