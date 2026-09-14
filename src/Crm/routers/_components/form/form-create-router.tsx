import type { UseFormReturn } from "react-hook-form";

import {
  FileText,
  Globe,
  KeyRound,
  Save,
  Server,
  Terminal,
  User,
  X,
} from "lucide-react";

import type { RouterMkType } from "./zformRouter";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RouterFormMode = "create" | "edit";

interface FormCreateRouterProps {
  form: UseFormReturn<RouterMkType>;

  mode: RouterFormMode;

  isSaving?: boolean;

  onCancel: () => void;

  onRequestSubmit: () => void;
}

function FormCreateRouter({
  form,
  mode,
  isSaving = false,
  onCancel,
  onRequestSubmit,
}: FormCreateRouterProps) {
  const isEdit = mode === "edit";

  const handleSubmit = form.handleSubmit(() => {
    onRequestSubmit();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* ================================= */}
        {/* ENCABEZADO */}
        {/* ================================= */}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" aria-hidden="true" />

            <h2 className="text-sm font-semibold leading-tight">
              {isEdit ? "Configuración del router" : "Datos del nuevo router"}
            </h2>
          </div>

          <p className="text-xs text-muted-foreground">
            {isEdit
              ? "Modifica únicamente los datos que necesites actualizar."
              : "Ingresa los datos de conexión del router MikroTik."}
          </p>
        </div>

        {/* ================================= */}
        {/* CAMPOS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Nombre */}

          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Server className="h-3.5 w-3.5" aria-hidden="true" />

                  <span>Nombre</span>
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: MikroTik Principal"
                    autoComplete="off"
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Host */}

          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />

                  <span>Host</span>
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="192.168.88.1"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Usuario */}

          <FormField
            control={form.control}
            name="usuario"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />

                  <span>Usuario SSH</span>
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="admin"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Puerto SSH */}

          <FormField
            control={form.control}
            name="sshPort"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" />

                  <span>Puerto SSH</span>
                </FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={65535}
                    inputMode="numeric"
                    placeholder="22"
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={isSaving}
                    onChange={(event) => {
                      const value = event.target.value;

                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    className="h-9 text-sm"
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Contraseña */}

          <FormField
            control={form.control}
            name="passwordEnc"
            render={({ field }) => (
              <FormItem className="space-y-1.5 md:col-span-2">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />

                  <span>Contraseña SSH</span>
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="password"
                    placeholder={
                      isEdit
                        ? "Dejar vacío para conservar la contraseña actual"
                        : "Contraseña de acceso SSH"
                    }
                    autoComplete="new-password"
                    disabled={isSaving}
                    className="h-9 max-w-md text-sm"
                  />
                </FormControl>

                {isEdit ? (
                  <p className="text-xs text-muted-foreground">
                    Si no deseas cambiar la credencial, deja este campo vacío.
                  </p>
                ) : null}

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Descripción */}

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem className="space-y-1.5 md:col-span-2">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />

                  <span>Descripción</span>
                </FormLabel>

                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Ubicación, función del router o información adicional."
                    disabled={isSaving}
                    className="min-h-24 resize-y text-sm"
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* ================================= */}
        {/* ACCIONES */}
        {/* ================================= */}

        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="h-9 px-4 text-xs sm:text-sm"
          >
            <X className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isSaving || !form.formState.isDirty}
            className="h-9 px-4 text-xs sm:text-sm"
          >
            <Save className="mr-2 h-3.5 w-3.5" aria-hidden="true" />

            {isSaving
              ? isEdit
                ? "Actualizando..."
                : "Guardando..."
              : isEdit
                ? "Actualizar router"
                : "Guardar router"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FormCreateRouter;
