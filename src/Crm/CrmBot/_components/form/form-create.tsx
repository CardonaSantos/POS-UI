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
import { Button } from "@/components/ui/button";
import {
  Ban,
  FileText,
  Globe,
  Save,
  Server,
  SlidersHorizontal,
} from "lucide-react";
import { BotType } from "./schema";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PropsForm {
  form: ReturnType<typeof useForm<BotType>>;
  handleCancelEdit: () => void;
  isToEdit: boolean;
  handleOpen: () => void; // si lo usas para abrir modal/toast/etc
}
const getNumber = (val: unknown, fallback: number) =>
  typeof val === "number" && !Number.isNaN(val) ? val : fallback;

function FormBotEdit({
  form,
  handleCancelEdit,
  isToEdit,
  handleOpen,
}: //   handleSubmitUpdate,
PropsForm) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log("Actualizar bot:", data);
          handleOpen();
        })}
        className="space-y-4"
      >
        {/* Encabezado compacto */}

        {/* Básico */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Server className="h-3.5 w-3.5" />
                  <span>Nombre</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Bot Soporte Nova Sistemas"
                    {...field}
                    className="h-8 text-xs"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Slug</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ej: nova-sistemas-bot"
                    {...field}
                    className="h-8 text-xs"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem className="space-y-1 md:col-span-2">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Descripción</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Descripción breve del bot"
                    className="text-xs h-16"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        <div className="">
          <h2 className="text-base font-semibold underline">
            Parámetros de generación del modelo
          </h2>
        </div>

        {/* Parámetros numéricos compactos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Max tokens */}
          <FormField
            control={form.control}
            name="maxCompletionTokens"
            render={({ field }) => {
              const value = getNumber(field.value, 500); // default Prisma

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Tokens máx.</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {Math.round(value)}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Slider
                      value={[value]}
                      min={300}
                      max={1500}
                      step={100}
                      className={cn("w-full")}
                      onValueChange={(vals) => {
                        const v = vals[0] ?? 500;
                        field.onChange(v);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />

          {/* Temperatura */}
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => {
              const value = getNumber(field.value, 0.7);

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Temperatura</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {value.toFixed(2)}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Slider
                      value={[value]}
                      min={0}
                      max={2}
                      step={0.1}
                      className={cn("w-full")}
                      onValueChange={(vals) => {
                        const v = vals[0] ?? 0.7;
                        field.onChange(v);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />

          {/* Top P */}
          <FormField
            control={form.control}
            name="topP"
            render={({ field }) => {
              const value = getNumber(field.value, 0.9);

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Top P</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {value.toFixed(2)}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Slider
                      value={[value]}
                      min={0}
                      max={1}
                      step={0.1}
                      className={cn("w-full")}
                      onValueChange={(vals) => {
                        const v = vals[0] ?? 0.9;
                        field.onChange(v);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />

          {/* Historial máx. */}
          <FormField
            control={form.control}
            name="maxHistoryMessages"
            render={({ field }) => {
              const value = getNumber(field.value, 15);

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Historial máx.</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {Math.round(value)}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Slider
                      value={[value]}
                      min={1}
                      max={25}
                      step={1}
                      className={cn("w-full")}
                      onValueChange={(vals) => {
                        const v = vals[0] ?? 15;
                        field.onChange(v);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />

          {/* Presencia de penalización */}
          <FormField
            control={form.control}
            name="presencePenalty"
            render={({ field }) => {
              const value = getNumber(field.value, 0.0);

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Presencia (penalización)</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {value.toFixed(2)}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Slider
                      value={[value]}
                      min={-2}
                      max={2}
                      step={0.1}
                      className={cn("w-full")}
                      onValueChange={(vals) => {
                        const v = vals[0] ?? 0.0;
                        field.onChange(v);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />

          {/* Frecuencia de penalización */}
          <FormField
            control={form.control}
            name="frequencyPenalty"
            render={({ field }) => {
              const value = getNumber(field.value, 0.2);

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Frecuencia (penalización)</span>
                    </span>
                    <span className="text-[11px] font-mono">
                      {value.toFixed(2)}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Slider
                      value={[value]}
                      min={-2}
                      max={2}
                      step={0.1}
                      className={cn("w-full")}
                      onValueChange={(vals) => {
                        const v = vals[0] ?? 0.2;
                        field.onChange(v);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Prompts (compactos pero claros) */}
        <div className="space-y-3">
          {/* System Prompt */}
          <FormField
            control={form.control}
            name="systemPrompt"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>System prompt</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Eres el asistente de soporte de Nova Sistemas..."
                    {...field}
                    className="text-xs h-24"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Context Prompt */}
          <FormField
            control={form.control}
            name="contextPrompt"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Context prompt (RAG)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Te daré contexto de base de conocimiento: {{context}} ..."
                    {...field}
                    value={field.value ?? ""}
                    className="text-xs h-20"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* History Prompt */}
          <FormField
            control={form.control}
            name="historyPrompt"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>History prompt</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A continuación tienes el historial reciente: {{history}} ..."
                    {...field}
                    value={field.value ?? ""}
                    className="text-xs h-20"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Output Style */}
          <FormField
            control={form.control}
            name="outputStyle"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Estilo de salida</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Responde como mensaje de WhatsApp: sin tablas, solo texto plano, negritas con *...* y emojis."
                    className="text-xs h-20"
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          {isToEdit && (
            <Button
              variant="destructive"
              onClick={handleCancelEdit}
              type="button"
              className="h-8 px-3 text-xs"
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              Cancelar
            </Button>
          )}

          <Button
            onClick={handleOpen}
            type="button"
            className="h-8 px-3 text-xs"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isToEdit ? "Actualizar bot" : "Guardar bot"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FormBotEdit;
