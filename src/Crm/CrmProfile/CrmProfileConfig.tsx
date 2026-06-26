"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Loader2, Palette, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTabs, type AppTabItem } from "@/components/app/primitives/app-tabs";
import { AppThemeColorPicker } from "@/components/app/config/app-theme-color-picker";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import ImagesCropper from "@/Crm/Helpers/CutterImages/ImageCropper";

import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { getUserProfile, updateUserProfile } from "./ProfileConfig.api";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { RolUsuario } from "../features/users/users-rol";

import { ProfileHeaderImages } from "./components/profile-header";
import {
  ProfileBasicInfo,
  type ProfileFormData,
} from "./components/profile-basic-info";

type ProfileSettingsTab = "perfil" | "apariencia";

export default function CrmProfileConfig() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string | null>(null);

  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [openCropper, setOpenCropper] = useState(false);
  const [cropTarget, setCropTarget] = useState<"avatar" | "portada" | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
          bio: data.perfil?.bio ?? "",
          notificarWhatsApp: data.perfil?.notificarWhatsApp ?? false,
          notificarPush: data.perfil?.notificarPush ?? false,
          notificarSonido: data.perfil?.notificarSonido ?? false,
        });

        if (data.perfil?.avatar?.url) {
          setAvatarPreview(data.perfil.avatar.url);
        }

        if (data.perfil?.portada?.url) {
          setPortadaPreview(data.perfil.portada.url);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al cargar perfil");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleFieldChange = (
    field: keyof ProfileFormData,
    value: string | boolean | RolUsuario,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "portada",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCropTarget(type);
    setRawFiles([file]);
    setOpenCropper(true);

    event.target.value = "";
  };

  const handleCropDone = (croppedFiles: File[]) => {
    const file = croppedFiles[0];
    if (!file || !cropTarget) return;

    const previewUrl = URL.createObjectURL(file);

    if (cropTarget === "avatar") {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    } else {
      setPortadaFile(file);
      setPortadaPreview(previewUrl);
    }

    setRawFiles([]);
    setCropTarget(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return;

    setUpdating(true);

    try {
      const finalData = new FormData();

      finalData.append("nombre", formData.nombre);
      finalData.append("correo", formData.correo);
      finalData.append("telefono", formData.telefono);
      finalData.append("rol", formData.rol);
      finalData.append("activo", String(formData.activo));

      if (formData.contrasena.trim()) {
        finalData.append("contrasena", formData.contrasena.trim());
      }

      finalData.append("bio", formData.bio ?? "");
      finalData.append("notificarWhatsApp", String(formData.notificarWhatsApp));
      finalData.append("notificarPush", String(formData.notificarPush));
      finalData.append("notificarSonido", String(formData.notificarSonido));

      if (avatarFile) finalData.append("avatar", avatarFile);
      if (portadaFile) finalData.append("portada", portadaFile);

      const updatePromise = updateUserProfile(userId, finalData);

      toast.promise(updatePromise, {
        loading: "Guardando perfil...",
        success: "Perfil actualizado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      await updatePromise;

      if (formData.contrasena.trim()) {
        localStorage.removeItem("tokenAuthCRM");
        toast.info("Contraseña actualizada. Cerrando sesión...");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los cambios");
    } finally {
      setUpdating(false);
    }
  };

  const profileTabs: AppTabItem<ProfileSettingsTab>[] = [
    {
      value: "perfil",
      label: "Perfil",
      icon: <UserRound className="h-3.5 w-3.5" />,
      content: (
        <form onSubmit={handleSubmit} className="min-w-0">
          <AppStack gap="sm" className="min-w-0">
            <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-card-bg,var(--card)))] p-2">
              <ProfileHeaderImages
                avatarPreview={avatarPreview}
                portadaPreview={portadaPreview}
                onImageSelected={handleImageSelected}
              />
            </div>

            <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-card-bg,var(--card)))] px-3 py-3">
              <ProfileBasicInfo
                formData={formData}
                onChange={handleFieldChange}
              />
            </div>

            <AppInline
              gap="xs"
              align="center"
              justify="end"
              className="border-t border-[hsl(var(--app-border,var(--border)))] pt-2"
            >
              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                width="auto"
                onClick={() => window.history.back()}
              >
                Cancelar
              </AppButton>

              <AppButton
                type="submit"
                size="xs"
                width="auto"
                disabled={updating}
                loading={updating}
                loadingText="Guardando..."
                leftIcon={
                  !updating ? <Save className="h-3.5 w-3.5" /> : undefined
                }
              >
                Guardar cambios
              </AppButton>
            </AppInline>
          </AppStack>
        </form>
      ),
    },
    {
      value: "apariencia",
      label: "Apariencia",
      icon: <Palette className="h-3.5 w-3.5" />,
      content: (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <AppCard variant="outline" size="sm" radius="md" className="min-w-0">
            <AppStack gap="xs" className="min-w-0">
              <AppInline gap="xs" align="center" className="min-w-0 p-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-primary,var(--primary))/0.12)] text-[hsl(var(--app-primary,var(--primary)))]">
                  <Palette className="h-4 w-4" />
                </span>

                <div className="min-w-0 p-2">
                  <h3 className="truncate text-[13px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
                    Tema del CRM
                  </h3>

                  <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                    Cambia el color principal, modo claro/oscuro y acentos
                    visuales sin tocar el CSS base.
                  </p>
                </div>
              </AppInline>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 p-2">
                <ThemePreviewChip label="Botones" />
                <ThemePreviewChip label="Badges" />
                <ThemePreviewChip label="Tablas" />
                <ThemePreviewChip label="Selects" />
              </div>
            </AppStack>
          </AppCard>

          <AppCard variant="outline" size="xs" radius="md" className="min-w-0">
            <AppThemeColorPicker />
          </AppCard>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-sm text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-[hsl(var(--app-primary,var(--primary)))]" />
        Cargando perfil...
      </div>
    );
  }

  return (
    <PageTransitionCrm titleHeader="Mi Perfil" subtitle="" variant="fade-pure">
      <div className="mx-auto w-full max-w-5xl px-2 sm:px-3">
        <AppCard
          variant="outline"
          size="xs"
          radius="md"
          className="min-w-0 overflow-hidden"
        >
          <div className="border-b border-[hsl(var(--app-border,var(--border)))] px-3 py-2">
            <h2 className="truncate text-[15px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
              Configuración de cuenta
            </h2>

            <p className="mt-1 truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Administra tu perfil, preferencias y apariencia del CRM.
            </p>
          </div>

          <div className="px-3 py-2">
            <AppTabs<ProfileSettingsTab>
              tabs={profileTabs}
              defaultValue="perfil"
              size="sm"
              variant="default"
              align="start"
              fullWidth
              fullWidthTriggers={false}
              hideIconsOnMobile={false}
              listClassName="mb-3"
              contentClassName="min-w-0"
            />
          </div>
        </AppCard>
      </div>

      <ImagesCropper
        open={openCropper}
        onOpenChange={setOpenCropper}
        files={rawFiles}
        onDone={handleCropDone}
      />
    </PageTransitionCrm>
  );
}

function ThemePreviewChip({ label }: { label: string }) {
  return (
    <div
      className={[
        "flex h-8 items-center justify-center rounded-[var(--app-radius-sm)] border px-2",
        "border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-primary,var(--primary))/0.10)]",
        "text-[11px] font-medium",
        "text-[hsl(var(--app-primary,var(--primary)))]",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
