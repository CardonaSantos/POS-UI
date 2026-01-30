"use client";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Send, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  type InfoFinanciera,
  type ReferenciaDto,
  type ArchivoItem,
  TipoArchivoCliente,
  initialInfoFinanciera,
} from "./expedientes-types";
import ImagesCropper from "@/Crm/Helpers/CutterImages/ImageCropper";
import { InfoFinancieraForm } from "./info-financiera-form";
import { ReferenciasForm } from "./referencias-form";
import { ArchivosForm } from "./archivos-form";
import {
  CrearExpedientePayload,
  useCrearExpedienteCliente,
} from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

interface Props {
  clienteId: number;
}
function buildExpedienteFormData(payload: CrearExpedientePayload): FormData {
  console.log("BUILD called with:", payload);
  console.trace();

  if (!payload.archivos || payload.archivos.length === 0) {
    throw new Error("Debe enviar al menos un archivo");
  }

  const formData = new FormData();

  if (payload.fuenteIngresos) {
    formData.append("fuenteIngresos", payload.fuenteIngresos);
  }

  formData.append("tieneDeudas", String(payload.tieneDeudas));

  if (payload.detalleDeudas) {
    formData.append("detalleDeudas", payload.detalleDeudas);
  }

  if (payload.referencias?.length) {
    const referenciasLimpias = payload.referencias.map((ref) => ({
      nombre: ref.nombre,
      telefono: ref.telefono,
      relacion: ref.relacion,
    }));

    formData.append("referencias", JSON.stringify(referenciasLimpias));
  }

  payload.archivos.forEach((item) => {
    formData.append("files", item.file);
    formData.append("tipos", item.tipo);
    formData.append("descripciones", item.descripcion ?? "");
  });

  return formData;
}

export default function ExpedientePage({ clienteId }: Props) {
  const [infoFinanciera, setInfoFinanciera] = useState<InfoFinanciera>(
    initialInfoFinanciera,
  );
  const [referencias, setReferencias] = useState<ReferenciaDto[]>([]);
  const [archivos, setArchivos] = useState<ArchivoItem[]>([]);

  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [openCropper, setOpenCropper] = useState(false);

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const handleOpenConfirm = () => setOpenConfirm(!openConfirm);

  const handleFilesSelected = (files: File[]) => {
    setRawFiles(files);
    setOpenCropper(true);
  };

  // Cuando el cropper termina, convertimos a ArchivoItem[]
  const handleCropDone = (croppedFiles: File[]) => {
    const newItems: ArchivoItem[] = croppedFiles.map((file) => ({
      uid: crypto.randomUUID(),
      file: file,
      tipo: TipoArchivoCliente.OTRO,
      descripcion: "",
    }));
    setArchivos((prev) => [...prev, ...newItems]);
    setRawFiles([]);
  };

  // Limpiar todo el formulario
  const handleReset = () => {
    setInfoFinanciera(initialInfoFinanciera);
    setReferencias([]);
    setArchivos([]);
    setRawFiles([]);
  };

  // Validación básica
  const canSubmit = archivos.length > 0;

  // Construir y enviar el FormData
  const { mutateAsync: crearExpediente, isPending } =
    useCrearExpedienteCliente(clienteId);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const formData = buildExpedienteFormData({
        clienteId,
        fuenteIngresos: infoFinanciera.fuenteIngresos,
        tieneDeudas: infoFinanciera.tieneDeudas,
        detalleDeudas: infoFinanciera.detalleDeudas,
        referencias,
        archivos,
      });

      await toast.promise(crearExpediente(formData), {
        success: "Expediente registrado",
        error: (e) => getApiErrorMessageAxios(e),
        loading: "Registrando...",
      });

      // handleReset();
    } catch (e: any) {
      toast.error(e.message ?? "Error al enviar expediente");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-base font-semibold">Crear Expediente</h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar
          </Button>
        </div>

        {/* Formularios */}
        <div className="space-y-4">
          {/* 1. Información Financiera */}
          <InfoFinancieraForm
            data={infoFinanciera}
            onChange={setInfoFinanciera}
          />

          {/* 2. Referencias */}
          <ReferenciasForm
            referencias={referencias}
            onChange={setReferencias}
          />

          {/* 3. Archivos */}
          <ArchivosForm
            archivos={archivos}
            onChange={setArchivos}
            onFilesSelected={handleFilesSelected}
          />
        </div>

        {/* Footer - Botón de envío */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {archivos.length === 0
              ? "Debes agregar al menos un archivo"
              : `${archivos.length} archivo(s) listo(s)`}
          </p>
          <Button
            onClick={handleOpenConfirm}
            disabled={!canSubmit || isPending}
            size="sm"
            className="gap-1.5"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Enviar Expediente
          </Button>
        </div>
      </div>

      {/* Cropper Modal */}
      <ImagesCropper
        open={openCropper}
        onOpenChange={setOpenCropper}
        files={rawFiles}
        onDone={handleCropDone}
      />
      <AdvancedDialogCRM
        title="Cargar Expediente"
        description="¿Estás seguro de cargar este expediente con estos datos?"
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        cancelButton={{
          label: "Cancelar",
          onClick: handleOpenConfirm,
          disabled: isPending,
          variant: "destructive",
        }}
        confirmButton={{
          label: "Sí, confirmar",
          loadingText: "",
          disabled: isPending,
          variant: "outline",
          onClick: handleSubmit,
          loading: isPending,
        }}
        type="warning"
      />
    </main>
  );
}
