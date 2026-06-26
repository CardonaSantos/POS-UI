import { Bell, BellRing, Smartphone } from "lucide-react";

import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

import { RolUsuario } from "@/Crm/features/users/users-rol";

export interface ProfileFormData {
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
  rol: RolUsuario;
  activo: boolean;
  bio: string;
  notificarWhatsApp: boolean;
  notificarPush: boolean;
  notificarSonido: boolean;
}

interface ProfileBasicInfoProps {
  formData: ProfileFormData;
  onChange: (
    field: keyof ProfileFormData,
    value: string | boolean | RolUsuario,
  ) => void;
}

const rolOptions = [
  { value: RolUsuario.TECNICO, label: "Técnico" },
  { value: RolUsuario.OFICINA, label: "Oficina" },
  { value: RolUsuario.ADMIN, label: "Administrador" },
  { value: RolUsuario.COBRADOR, label: "Cobrador" },
];

export function ProfileBasicInfo({
  formData,
  onChange,
}: ProfileBasicInfoProps) {
  return (
    <AppStack gap="sm" className="mt-2 min-w-0">
      <AppGrid cols={{ base: 1, sm: 2 }} gap="sm" className="min-w-0">
        <AppField label="Nombre completo" required>
          {(field) => (
            <AppInput
              id={field.id}
              value={formData.nombre}
              onChange={(event) => onChange("nombre", event.target.value)}
              required
              size="sm"
              radius="sm"
              fieldWidth="full"
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
            />
          )}
        </AppField>

        <AppField label="Correo electrónico" required>
          {(field) => (
            <AppInput
              id={field.id}
              type="email"
              value={formData.correo}
              onChange={(event) => onChange("correo", event.target.value)}
              required
              size="sm"
              radius="sm"
              fieldWidth="full"
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
            />
          )}
        </AppField>

        <AppField label="Teléfono">
          {(field) => (
            <AppInput
              id={field.id}
              value={formData.telefono}
              onChange={(event) => onChange("telefono", event.target.value)}
              size="sm"
              radius="sm"
              fieldWidth="full"
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
            />
          )}
        </AppField>

        <AppField label="Contraseña" hint="Déjala en blanco para no cambiarla.">
          {(field) => (
            <AppInput
              id={field.id}
              type="password"
              value={formData.contrasena}
              onChange={(event) => onChange("contrasena", event.target.value)}
              placeholder="Nueva contraseña"
              size="sm"
              radius="sm"
              fieldWidth="full"
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
            />
          )}
        </AppField>

        <AppField label="Rol asignado" disabled>
          {(field) => (
            <AppSingleSelect<RolUsuario>
              inputId={field.id}
              value={formData.rol}
              options={rolOptions}
              onChange={(value) => {
                if (value) onChange("rol", value);
              }}
              isDisabled
              size="sm"
              fieldWidth="full"
              invalid={field.invalid}
              placeholder="Seleccione rol"
            />
          )}
        </AppField>

        <div
          className={[
            "flex min-h-[3.55rem] items-center justify-between gap-2 rounded-[var(--app-radius-sm)] border p-2",
            "border-[hsl(var(--app-border,var(--border)))]",
            "bg-[hsl(var(--app-muted,var(--muted))/0.18)]",
          ].join(" ")}
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              Estado activo
            </p>

            <p className="mt-0.5 truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Controlado por administración.
            </p>
          </div>

          <AppSwitch
            checked={formData.activo}
            onCheckedChange={(value) => onChange("activo", value)}
            disabled
            size="sm"
          />
        </div>
      </AppGrid>

      <div className="border-t border-[hsl(var(--app-border,var(--border)))] pt-3">
        <AppField label="Biografía / notas del perfil">
          {(field) => (
            <AppTextarea
              id={field.id}
              value={formData.bio}
              onChange={(event) => onChange("bio", event.target.value)}
              placeholder="Escribe algo sobre ti..."
              size="sm"
              radius="sm"
              fieldWidth="full"
              className="min-h-[5rem] resize-none"
              invalid={field.invalid}
              aria-invalid={field.invalid}
              aria-describedby={field.describedBy}
            />
          )}
        </AppField>
      </div>

      <AppStack gap="xs" className="min-w-0">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            Preferencias de notificación
          </h3>

          <p className="mt-0.5 text-[10px] leading-tight text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Configura cómo quieres recibir avisos del CRM.
          </p>
        </div>

        <AppGrid cols={{ base: 1, sm: 3 }} gap="xs" className="min-w-0">
          <NotificationPreferenceCard
            icon={<Smartphone className="h-3.5 w-3.5" />}
            label="WhatsApp"
            checked={formData.notificarWhatsApp}
            onCheckedChange={(value) => onChange("notificarWhatsApp", value)}
          />

          <NotificationPreferenceCard
            icon={<Bell className="h-3.5 w-3.5" />}
            label="Push"
            checked={formData.notificarPush}
            onCheckedChange={(value) => onChange("notificarPush", value)}
          />

          <NotificationPreferenceCard
            icon={<BellRing className="h-3.5 w-3.5" />}
            label="Sonidos"
            checked={formData.notificarSonido}
            onCheckedChange={(value) => onChange("notificarSonido", value)}
          />
        </AppGrid>
      </AppStack>
    </AppStack>
  );
}

function NotificationPreferenceCard({
  icon,
  label,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div
      className={[
        "flex min-w-0 items-center justify-between gap-2 rounded-[var(--app-radius-sm)] border p-2",
        "border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-card-bg,var(--card)))]",
      ].join(" ")}
    >
      <AppInline gap="xs" align="center" className="min-w-0">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-sm)] bg-[hsl(var(--app-primary,var(--primary))/0.12)] text-[hsl(var(--app-primary,var(--primary)))]">
          {icon}
        </span>

        <span className="truncate text-xs font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
          {label}
        </span>
      </AppInline>

      <AppSwitch
        checked={checked}
        onCheckedChange={onCheckedChange}
        size="sm"
      />
    </div>
  );
}
