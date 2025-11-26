import { useForm } from "react-hook-form";
import { RouterMkType } from "./zformRouter";
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
import {
  Ban,
  FileText,
  Globe,
  KeyRound,
  Save,
  Server,
  Terminal,
  User,
} from "lucide-react";
interface PropsForm {
  form: ReturnType<typeof useForm<RouterMkType>>;
  handleCancelEdit: () => void;
  isToEdit: boolean;
  handleOpen: () => void;
}

function FormCreateRouter({
  form,
  handleCancelEdit,
  isToEdit,
  handleOpen,
}: PropsForm) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-6"
      >
        {/* Título / encabezado opcional */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold leading-tight">
                Nuevo router Mikrotik
              </h2>
            </div>
          </div>
        </div>

        {/* Grid del formulario */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Server className="h-3.5 w-3.5" />
                  <span>Nombre</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: MKT Principal"
                    {...field}
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
                  <Globe className="h-3.5 w-3.5" />
                  <span>Host (IP)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="192.168.88.1"
                    {...field}
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
                  <User className="h-3.5 w-3.5" />
                  <span>Usuario</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin"
                    {...field}
                    className="h-9 text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* SSH Port */}
          <FormField
            control={form.control}
            name="sshPort"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Puerto SSH</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="22"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : +e.target.value
                      )
                    }
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
              <FormItem className="md:col-span-2 space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Contraseña</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Contraseña de acceso"
                    {...field}
                    className="h-9 text-sm max-w-md"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem className="md:col-span-2 space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Descripción</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notas, ubicación física, propósito, etc."
                    {...field}
                    className="text-sm h-24 max-w-2xl mx-auto block"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Botón */}
        <div className="flex justify-end gap-4">
          {isToEdit ? (
            <Button
              variant={"destructive"}
              onClick={handleCancelEdit}
              type="submit"
              className="h-9 px-4 text-xs sm:text-sm"
            >
              <Ban className="mr-2 h-3.5 w-3.5" />
              Cancelar
            </Button>
          ) : null}

          <Button
            onClick={handleOpen}
            type="submit"
            className="h-9 px-4 text-xs sm:text-sm"
          >
            <Save className="mr-2 h-3.5 w-3.5" />
            {`${isToEdit ? "Actualizar Router" : "Guardar"}`}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FormCreateRouter;
