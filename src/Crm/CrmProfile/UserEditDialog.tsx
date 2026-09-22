import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type { UsersProfile } from "./interfacesProfile";
import type { UpdateOneUserPayload } from "./ProfileConfig.types";
import {
  ROL_USUARIO_OPTIONS,
  RolUsuario,
} from "../features/users/users-rol";

const editUserSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa un nombre válido"),
  correo: z.string().trim().email("Ingresa un correo válido"),
  telefono: z.string().trim().max(30, "Máximo 30 caracteres"),
  rol: z.nativeEnum(RolUsuario),
  activo: z.boolean(),
  contrasena: z
    .string()
    .refine((value) => value.length === 0 || value.length >= 8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UsersProfile | null;
  onSave: (payload: UpdateOneUserPayload) => Promise<void>;
  isSaving?: boolean;
  canChangeRole?: boolean;
}

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSave,
  isSaving = false,
  canChangeRole = false,
}: UserEditDialogProps) {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      telefono: "",
      rol: RolUsuario.OFICINA,
      activo: true,
      contrasena: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono ?? "",
      rol: user.rol,
      activo: user.activo,
      contrasena: "",
    });
  }, [user, form]);

  const submit = form.handleSubmit(async (values) => {
    const payload: UpdateOneUserPayload = {
      nombre: values.nombre.trim(),
      correo: values.correo.trim().toLowerCase(),
      telefono: values.telefono.trim() || null,
      activo: values.activo,
    };

    if (canChangeRole) {
      payload.rol = values.rol;
    }

    if (values.contrasena.trim()) {
      payload.contrasena = values.contrasena;
    }

    await onSave(payload);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Actualiza los datos de acceso, rol y estado del usuario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" {...form.register("nombre")} />
              {form.formState.errors.nombre && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.nombre.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" type="email" {...form.register("correo")} />
              {form.formState.errors.correo && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.correo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" {...form.register("telefono")} />
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <Controller
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as RolUsuario)}
                    disabled={!canChangeRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROL_USUARIO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contrasena">Nueva contraseña</Label>
              <Input
                id="contrasena"
                type="password"
                autoComplete="new-password"
                placeholder="Déjala vacía para conservar la actual"
                {...form.register("contrasena")}
              />
              {form.formState.errors.contrasena && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.contrasena.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-md border p-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">Usuario activo</p>
                <p className="text-xs text-muted-foreground">
                  Los usuarios inactivos no deben poder iniciar sesión.
                </p>
              </div>

              <Controller
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
