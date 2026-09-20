import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AtSign, Eye, EyeOff, Lock, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/components/app/form";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import { useRegister } from "../CrmHooks/hooks/use-auth/useAuth";

import { RolUsuario, ROL_USUARIO_OPTIONS } from "../features/users/users-rol";

const registerSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  correo: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Ingrese un correo electrónico válido"),

  contrasena: z.string().min(1, "La contraseña es obligatoria"),

  rol: z.nativeEnum(RolUsuario),

  empresaId: z.number().int().positive(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const REGISTER_DEFAULTS: RegisterFormValues = {
  nombre: "",
  correo: "",
  contrasena: "",
  rol: RolUsuario.TECNICO,
  empresaId: 1,
};

export default function CrmRegist() {
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_DEFAULTS,
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    const payload = {
      ...values,
      nombre: values.nombre.trim(),
      correo: values.correo.trim().toLowerCase(),
    };

    try {
      await toast.promise(registerMutation.mutateAsync(payload), {
        loading: "Registrando usuario...",
        success: "Usuario registrado correctamente",
        error: (error) => getApiErrorMessageAxios(error),
      });

      form.reset(REGISTER_DEFAULTS);
    } catch {
      // El toast ya presenta el error.
      // Conservamos el formulario para que el usuario pueda corregirlo.
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <AppContainer
        size="sm"
        paddingX="sm"
        paddingY="md"
        fullHeight
        className="flex items-center justify-center"
      >
        <AppCard variant="outline" size="md" radius="lg" className="w-full">
          <AppStack gap="md" className="p-4 sm:p-5">
            {/* HEADER */}

            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                Registrar usuario
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Cree una nueva cuenta y asigne su función dentro del CRM.
              </p>
            </div>

            {/* FORMULARIO */}

            <AppForm form={form} onSubmit={onSubmit}>
              <AppStack gap="sm">
                <AppFormInput<RegisterFormValues>
                  name="nombre"
                  label="Nombre"
                  placeholder="Nombre completo"
                  autoComplete="name"
                  leftIcon={<User size={16} aria-hidden="true" />}
                  required
                  clearable
                />

                <AppFormInput<RegisterFormValues>
                  name="correo"
                  type="email"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  spellCheck={false}
                  leftIcon={<AtSign size={16} aria-hidden="true" />}
                  required
                  clearable
                />

                <div className="relative">
                  <AppFormInput<RegisterFormValues>
                    name="contrasena"
                    type={showPassword ? "text" : "password"}
                    label="Contraseña"
                    placeholder="Ingrese una contraseña"
                    autoComplete="new-password"
                    leftIcon={<Lock size={16} aria-hidden="true" />}
                    required
                  />

                  <AppButton
                    type="button"
                    variant="ghost"
                    size="xs"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-2 top-7"
                  >
                    {showPassword ? (
                      <EyeOff size={15} aria-hidden="true" />
                    ) : (
                      <Eye size={15} aria-hidden="true" />
                    )}
                  </AppButton>
                </div>

                <AppFormSingleSelect<RegisterFormValues, RolUsuario>
                  name="rol"
                  label="Rol"
                  options={ROL_USUARIO_OPTIONS}
                  placeholder="Seleccione un rol"
                  density="compact"
                  isSearchable={false}
                  isClearable={false}
                  required
                />

                <AppFormSubmit<RegisterFormValues>
                  variant="primary"
                  width="full"
                  leftIcon={<UserPlus size={16} aria-hidden="true" />}
                  loadingText="Registrando..."
                  disableWhenInvalid
                >
                  Registrar usuario
                </AppFormSubmit>
              </AppStack>
            </AppForm>

            <p className="text-center text-xs text-muted-foreground">
              Sistema de gestión CRM © {new Date().getFullYear()}
            </p>
          </AppStack>
        </AppCard>
      </AppContainer>
    </main>
  );
}
