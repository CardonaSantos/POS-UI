import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ban, FileText, Save, Tag, Building2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { KnowledgeDocumentType } from "@/Crm/features/bot/knowledge/knowledge";
import type { KnowledgeCreateType } from "./schema-knowledge";

interface PropsFormKnowledge {
  form: ReturnType<typeof useForm<KnowledgeCreateType>>;
  isToEdit?: boolean; // por si luego lo reutilizas
  handleCancel?: () => void;
  handleOpen: () => void; // abrir modal de confirmación
  isEditingK: boolean;
  handleCancelUpdateOrCreate: () => void;

  handleOpenUpdate: () => void;
  handleDeleteK: () => Promise<void>;
  handleOpenDeleteK: () => void;
}

const typeLabels: Record<KnowledgeDocumentType, string> = {
  [KnowledgeDocumentType.FAQ]: "FAQ",
  [KnowledgeDocumentType.DOCUMENTO]: "Documento",
  [KnowledgeDocumentType.CONTRATO]: "Contrato",
  [KnowledgeDocumentType.PLAN]: "Plan",
  [KnowledgeDocumentType.TICKET]: "Ticket",
  [KnowledgeDocumentType.COBRO]: "Cobro",
  [KnowledgeDocumentType.OTRO]: "Otro",
};

function FormKnowledgeCreate({
  form,
  isToEdit = false,
  handleOpen,
  isEditingK,
  handleCancelUpdateOrCreate,
  handleOpenUpdate,
  // handleDeleteK,
  handleOpenDeleteK,
}: PropsFormKnowledge) {
  const truncateDelete = isEditingK ? false : true;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log("Crear/actualizar knowledge:", data);
          if (isEditingK) {
            handleOpenUpdate();
          } else {
            handleOpen();
          }
        })}
        className="space-y-4"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {isToEdit ? "Editar conocimiento" : "Nuevo conocimiento"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* empresaId (normalmente solo lectura) */}
          <FormField
            control={form.control}
            name="empresaId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Empresa ID</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? 0}
                    disabled
                    className="h-8 text-xs"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Tipo */}
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Tipo de conocimiento</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) =>
                      field.onChange(val as KnowledgeDocumentType)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(KnowledgeDocumentType).map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {typeLabels[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        {/* Título */}
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>Título</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ej: Política de facturación de internet"
                  className="h-8 text-xs"
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        {/* Descripción + Origen + Idioma */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem className="space-y-1 md:col-span-3">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Descripción breve</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Resumen o intención de este conocimiento (opcional)"
                    className="text-xs h-16"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        {/* Texto largo */}
        <FormField
          control={form.control}
          name="textoLargo"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>Contenido</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Texto completo que el bot usará como base de conocimiento..."
                  className="text-xs h-40"
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Button
            disabled={truncateDelete}
            variant="destructive"
            type="button"
            onClick={handleOpenDeleteK}
            className="h-8 px-3 text-xs"
          >
            <Ban className="mr-1.5 h-3.5 w-3.5" />
            Eliminar
          </Button>

          <Button
            variant="destructive"
            type="button"
            onClick={handleCancelUpdateOrCreate}
            className="h-8 px-3 text-xs"
          >
            <Ban className="mr-1.5 h-3.5 w-3.5" />
            Cancelar
          </Button>

          <Button type="submit" className="h-8 px-3 text-xs">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isEditingK ? "Actualizar conocimiento" : "Crear conocimiento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FormKnowledgeCreate;
