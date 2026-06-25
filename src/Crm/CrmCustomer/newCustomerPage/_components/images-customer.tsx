"use client";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Cloud, ImagePlus, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { buildMediaFormData } from "@/Crm/Helpers/media.utils";
import ImagesCropper from "@/Crm/Helpers/CutterImages/ImageCropper";
import { customerQkeys } from "@/Crm/CrmHooks/hooks/Client/Qk";
import {
  MediaUploadItem,
  SubirMediaBatchPayload,
} from "../../API/payload.interfaces";
import { useUploadMediaBatch } from "../../API/customer-profile.queries";
import { CustomerImage } from "@/Crm/features/customer-galery/customer-galery.interfaces";
import { CustomerImagesGallery } from "../CrmCustomerGalery/CustomerGaleryMain";

interface Props {
  clienteId: number;
  empresaId: number;
  imagenesCliente: CustomerImage[];
}

type ImagesCustomerState = {
  rawFiles: File[];
  items: MediaUploadItem[];
};

function createUploadItems(files: File[]): MediaUploadItem[] {
  return files.map((file) => ({
    file,
    titulo: "",
    descripcion: "",
    etiqueta: "",
    custom_Id: crypto.randomUUID(),
  }));
}

function UploadDropzone({
  disabled,
  hasItems,
  inputRef,
  onFilesSelected,
  onOpenFilePicker,
}: {
  disabled?: boolean;
  hasItems: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onFilesSelected: React.ChangeEventHandler<HTMLInputElement>;
  onOpenFilePicker: () => void;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="border-dashed">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label="Seleccionar imágenes del cliente"
        onChange={onFilesSelected}
        disabled={disabled}
      />

      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<Cloud size={34} strokeWidth={1.5} />}
        title={hasItems ? "Agregar más imágenes" : "Cargar imágenes"}
        description="Selecciona imágenes, recórtalas si es necesario y luego sube el lote al perfil del cliente."
        action={
          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<ImagePlus size={13} />}
            onClick={onOpenFilePicker}
            disabled={disabled}
          >
            Seleccionar imágenes
          </AppButton>
        }
      />
    </AppCard>
  );
}

function UploadItemPreview({
  item,
  index,
  disabled,
  onUpdate,
  onDelete,
}: {
  item: MediaUploadItem;
  index: number;
  disabled?: boolean;
  onUpdate: (index: number, partial: Partial<MediaUploadItem>) => void;
  onDelete: (item: MediaUploadItem) => void;
}) {
  const previewUrl = React.useMemo(
    () => URL.createObjectURL(item.file),
    [item.file],
  );

  React.useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppGrid cols={{ base: 1, md: 12 }} gap="xs" className="items-center">
        <div className="md:col-span-2">
          <div className="h-20 w-full overflow-hidden rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.35] md:h-16">
            <img
              src={previewUrl}
              alt={item.titulo || `Imagen seleccionada ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <AppField label="Título">
            {(field) => (
              <AppInput
                id={field.id}
                value={item.titulo ?? ""}
                onChange={(event) =>
                  onUpdate(index, { titulo: event.target.value })
                }
                placeholder="Título"
                size="xs"
                fieldWidth="full"
                disabled={disabled}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
              />
            )}
          </AppField>
        </div>

        <div className="md:col-span-4">
          <AppField label="Descripción">
            {(field) => (
              <AppInput
                id={field.id}
                value={item.descripcion ?? ""}
                onChange={(event) =>
                  onUpdate(index, { descripcion: event.target.value })
                }
                placeholder="Descripción"
                size="xs"
                fieldWidth="full"
                disabled={disabled}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
              />
            )}
          </AppField>
        </div>

        <div className="md:col-span-2">
          <AppField label="Etiqueta">
            {(field) => (
              <AppInput
                id={field.id}
                value={item.etiqueta ?? ""}
                onChange={(event) =>
                  onUpdate(index, { etiqueta: event.target.value })
                }
                placeholder="Etiqueta"
                size="xs"
                fieldWidth="full"
                disabled={disabled}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
              />
            )}
          </AppField>
        </div>

        <div className="md:col-span-1">
          <AppButton
            type="button"
            variant="danger"
            size="xs"
            width="full"
            aria-label={`Quitar imagen ${index + 1}`}
            onClick={() => onDelete(item)}
            disabled={disabled}
            className="md:h-8 md:px-2"
          >
            <Trash2 size={13} />
          </AppButton>
        </div>
      </AppGrid>
    </AppCard>
  );
}

function PendingImagesList({
  items,
  disabled,
  onUpdate,
  onDelete,
}: {
  items: MediaUploadItem[];
  disabled?: boolean;
  onUpdate: (index: number, partial: Partial<MediaUploadItem>) => void;
  onDelete: (item: MediaUploadItem) => void;
}) {
  if (!items.length) return null;

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      title="Imágenes preparadas"
      description="Revisa los metadatos antes de subir el lote."
      action={
        <AppBadge tone="info" appearance="soft" size="xs">
          {items.length} imagen{items.length === 1 ? "" : "es"}
        </AppBadge>
      }
    >
      <AppStack gap="xs">
        {items.map((item, index) => (
          <UploadItemPreview
            key={item.custom_Id}
            item={item}
            index={index}
            disabled={disabled}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </AppStack>
    </AppCard>
  );
}

export default function ImagesCustomer({
  clienteId,
  empresaId,
  imagenesCliente,
}: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const cropperDialog = useAppDisclosure();
  const confirmDialog = useAppDisclosure();

  const media = useAppStateHandlers<ImagesCustomerState>({
    rawFiles: [],
    items: [],
  });

  const uploadMediaBatch = useUploadMediaBatch(clienteId);
  const isUploading = uploadMediaBatch.isPending;

  const handleFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    media.patch({
      rawFiles: files,
    });

    cropperDialog.open();
    event.target.value = "";
  };

  const handleCropDone = (croppedFiles: File[]) => {
    const newItems = createUploadItems(croppedFiles);

    media.patch({
      items: [...media.state.items, ...newItems],
      rawFiles: [],
    });
  };

  const handleDeleteFromItems = (item: MediaUploadItem) => {
    media.setField(
      "items",
      media.state.items.filter(
        (current) => current.custom_Id !== item.custom_Id,
      ),
    );
  };

  const updateItem = (index: number, partial: Partial<MediaUploadItem>) => {
    const nextItems = [...media.state.items];

    nextItems[index] = {
      ...nextItems[index],
      ...partial,
    };

    media.setField("items", nextItems);
  };

  const handleUploadMedia = async (): Promise<void> => {
    if (!media.state.items.length) {
      toast.error("No hay imágenes para subir");
      return;
    }

    const payload: SubirMediaBatchPayload = {
      empresaId,
      clienteId,
      categoria: "CLIENTE_GENERAL",
      basePrefix: "crm/clientes/imagenes",
      publico: true,
      items: media.state.items,
    };

    const formData = buildMediaFormData(payload);

    await toast.promise(uploadMediaBatch.mutateAsync(formData), {
      loading: "Subiendo archivos...",
      success: "Archivos subidos correctamente",
      error: "Error al subir los archivos",
    });

    await queryClient.invalidateQueries({
      queryKey: customerQkeys.specificCustomer(clienteId),
    });

    media.patch({
      items: [],
      rawFiles: [],
    });

    confirmDialog.close();
  };

  return (
    <AppStack gap="md" className="w-full">
      <UploadDropzone
        inputRef={fileInputRef}
        disabled={isUploading}
        hasItems={media.state.items.length > 0}
        onFilesSelected={handleFilesSelected}
        onOpenFilePicker={() => fileInputRef.current?.click()}
      />

      <ImagesCropper
        open={cropperDialog.isOpen}
        onOpenChange={cropperDialog.setOpen}
        files={media.state.rawFiles}
        onDone={handleCropDone}
      />

      <PendingImagesList
        items={media.state.items}
        disabled={isUploading}
        onUpdate={updateItem}
        onDelete={handleDeleteFromItems}
      />

      <AppInline align="center" justify="end" gap="xs" wrap>
        {media.state.items.length > 0 ? (
          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            width="auto"
            leftIcon={<X size={13} />}
            disabled={isUploading}
            onClick={() =>
              media.patch({
                items: [],
                rawFiles: [],
              })
            }
          >
            Limpiar lote
          </AppButton>
        ) : null}

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="auto"
          leftIcon={<UploadCloud size={13} />}
          loading={isUploading}
          loadingText="Subiendo..."
          disabled={!media.state.items.length || isUploading}
          onClick={confirmDialog.open}
        >
          Subir imágenes
        </AppButton>
      </AppInline>

      <AppConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.setOpen}
        preset="send"
        tone="info"
        size="sm"
        title="Carga de imágenes"
        description={`Se subirán ${media.state.items.length} imagen${
          media.state.items.length === 1 ? "" : "es"
        } al perfil del cliente.`}
        confirmText="Subir imágenes"
        cancelText="Cancelar"
        loadingText="Subiendo imágenes..."
        isLoading={isUploading}
        preventClose={isUploading}
        closeOnConfirm={false}
        footerAlign="between"
        onConfirm={handleUploadMedia}
      />

      <AppSeparator spacing="xs" />

      <AppCard
        variant="outline"
        size="xs"
        radius="md"
        title="Imágenes en línea"
        description={`${imagenesCliente.length} imagen${
          imagenesCliente.length === 1 ? "" : "es"
        } registrada${imagenesCliente.length === 1 ? "" : "s"} para este cliente.`}
      >
        <CustomerImagesGallery
          customerId={clienteId}
          manageable
          images={imagenesCliente}
        />
      </AppCard>
    </AppStack>
  );
}
