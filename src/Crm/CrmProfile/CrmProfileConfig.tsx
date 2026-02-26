"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RolUsuario } from "./interfacesProfile";
import { getUserProfile, updateUserProfile } from "./ProfileConfig.api";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { toast } from "sonner";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

// Importaciones de los subcomponentes
import ImagesCropper from "@/Crm/Helpers/CutterImages/ImageCropper";
import { ProfileHeaderImages } from "./components/profile-header";
import {
  ProfileBasicInfo,
  ProfileFormData,
} from "./components/profile-basic-info";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

export default function CrmProfileConfig() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  // Estado del formulario de texto
  // Estado del formulario de texto
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: "",
    correo: "",
    telefono: "",
    contrasena: "",
    rol: RolUsuario.TECNICO,
    activo: true,
    bio: "",
    notificarWhatsApp: false,
    notificarPush: false,
    notificarSonido: false,
  });

  // Estado para los archivos e imágenes finales
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string | null>(null);

  // Estados para el Cropper
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [openCropper, setOpenCropper] = useState(false);
  const [cropTarget, setCropTarget] = useState<"avatar" | "portada" | null>(
    null,
  );

  // Estados de carga
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch Inicial
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getUserProfile(userId)
      .then((data: any) => {
        setFormData({
          nombre: data.nombre ?? "",
          correo: data.correo ?? "",
          telefono: data.telefono ?? "",
          contrasena: "",
          rol: data.rol ?? RolUsuario.TECNICO,
          activo: data.activo ?? true,
          // Mapeamos los datos del perfil si existen
          bio: data.perfil?.bio ?? "",
          notificarWhatsApp: data.perfil?.notificarWhatsApp ?? false,
          notificarPush: data.perfil?.notificarPush ?? false,
          notificarSonido: data.perfil?.notificarSonido ?? false,
        });

        // Si tu backend retorna la URL completa, puedes asignarla aquí:
        if (data.perfil?.avatar?.url) setAvatarPreview(data.perfil.avatar.url);
        if (data.perfil?.portada?.url)
          setPortadaPreview(data.perfil.portada.url);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al cargar perfil");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string | boolean | RolUsuario,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 1. Cuando el usuario selecciona una imagen del input file
  const handleImageSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "portada",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropTarget(type);
    setRawFiles([file]);
    setOpenCropper(true); // Abre tu componente ImagesCropper

    // Limpiamos el input para que permita volver a seleccionar la misma imagen si el usuario cancela
    e.target.value = "";
  };

  // 2. Cuando el usuario hace clic en "Guardar lote" en tu ImagesCropper
  const handleCropDone = (croppedFiles: File[]) => {
    const file = croppedFiles[0];
    if (!file || !cropTarget) return;

    const previewUrl = URL.createObjectURL(file);

    // Asignamos el archivo procesado al estado correcto
    if (cropTarget === "avatar") {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    } else {
      setPortadaFile(file);
      setPortadaPreview(previewUrl);
    }

    // Limpiamos la memoria temporal del cropper
    setRawFiles([]);
    setCropTarget(null);
  };

  // Envio final del formulario a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setUpdating(true);

    try {
      const finalData = new FormData();

      // Datos Base
      finalData.append("nombre", formData.nombre);
      finalData.append("correo", formData.correo);
      finalData.append("telefono", formData.telefono);
      finalData.append("rol", formData.rol);
      finalData.append("activo", String(formData.activo));

      if (formData.contrasena.trim()) {
        finalData.append("contrasena", formData.contrasena.trim());
      }

      // ===== NUEVO: Datos del Perfil (Bio y Notificaciones) =====
      // Agregamos la bio (si es vacía, mandamos string vacío para que el backend la borre si así lo desea)
      finalData.append("bio", formData.bio ?? "");

      // Convertimos los booleanos a string explícitamente para el FormData
      finalData.append("notificarWhatsApp", String(formData.notificarWhatsApp));
      finalData.append("notificarPush", String(formData.notificarPush));
      finalData.append("notificarSonido", String(formData.notificarSonido));

      // Añadir los archivos binarios que salieron del cropper
      if (avatarFile) finalData.append("avatar", avatarFile);
      if (portadaFile) finalData.append("portada", portadaFile);

      toast.promise(updateUserProfile(userId, finalData), {
        loading: "Cargando datos...",
        success: "Actualizado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      if (formData.contrasena.trim()) {
        localStorage.removeItem("tokenAuthCRM");
        toast.info("Contraseña actualizada. Cerrando sesión...");
        window.location.reload();
      } else {
        toast.success("Perfil actualizado correctamente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los cambios");
    } finally {
      setUpdating(false);
    }
  };
  console.log("el formulario es: ", formData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
      </div>
    );
  }

  return (
    <PageTransitionCrm titleHeader="Mi Perfil" subtitle="" variant="fade-pure">
      <Card className="w-full max-w-2xl mx-auto border shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">Configuración de Cuenta</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-4 pb-2">
            <ProfileHeaderImages
              avatarPreview={avatarPreview}
              portadaPreview={portadaPreview}
              onImageSelected={handleImageSelected}
            />

            <ProfileBasicInfo
              formData={formData}
              onChange={handleFieldChange}
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-4 pb-4 border-t mt-4">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={updating}>
              {updating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Cambios
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* INTEGRAMOS TU CROPPER AQUÍ */}
      <ImagesCropper
        open={openCropper}
        onOpenChange={setOpenCropper}
        files={rawFiles}
        onDone={handleCropDone}
      />
    </PageTransitionCrm>
  );
}
