"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  DollarSignIcon,
  PercentIcon,
  HashIcon,
  ClockIcon,
  UserIcon,
  FileTextIcon,
  CreditCardIcon,
} from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { creditoFormSchema, CreditoFormValues } from "./schema.zod";
import {
  FrecuenciaPago,
  InteresTipo,
  OrigenCreditoArray,
} from "@/Crm/features/credito/credito-interfaces";
import { CuotasPreview } from "./cuotas-preview";
import ReactSelectComponent from "react-select";

interface CreditoFormProps {
  onSubmit: (data: CreditoFormValues) => void;
  // clientes?: { id: number; nombre: string }[];
  // usuarios?: { id: number; nombre: string }[];
  defaultValues?: Partial<CreditoFormValues>;

  clientes: {
    value: number;
    label: string;
  }[];

  usuarios: {
    value: number;
    label: string;
  }[];
}

export function CreditoForm({
  onSubmit,
  defaultValues,
  clientes,
  usuarios,
}: CreditoFormProps) {
  const form = useForm<CreditoFormValues>({
    resolver: zodResolver(creditoFormSchema),
    defaultValues: {
      clienteId: undefined,
      creadoPorId: undefined,
      montoCapital: "",
      interesPorcentaje: "",
      tipoGeneracionCuotas: "AUTOMATICA",
      interesTipo: InteresTipo.FIJO,
      frecuencia: FrecuenciaPago.MENSUAL,
      intervaloDias: 30,
      plazoCuotas: 12,
      fechaInicio: new Date(),
      engancheMonto: "",
      engancheFecha: undefined,
      origenCredito: undefined,
      observaciones: "",
      cuotasCustom: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cuotasCustom",
  });

  const tipoGeneracion = form.watch("tipoGeneracionCuotas");
  const engancheMonto = form.watch("engancheMonto");

  // Watch values for cuotas preview
  const watchedValues = form.watch();

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          {/* Cliente y Usuario */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <UserIcon className="size-3.5" />
                    Cliente
                  </FormLabel>
                  <FormControl>
                    <ReactSelectComponent
                      options={clientes}
                      // Buscamos el objeto completo basado en el ID actual del form para mostrarlo seleccionado
                      value={clientes.find((c) => c.value === field.value)}
                      // Al cambiar, extraemos solo el ID (value) o undefined si se limpia
                      onChange={(option) => field.onChange(option?.value)}
                      placeholder="Buscar cliente..."
                      isClearable
                      isSearchable
                      className="text-sm text-black"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "hsl(var(--input))",
                          borderRadius: "calc(var(--radius) - 2px)",
                          minHeight: "38px", // Similar al input de Shadcn
                          boxShadow: "none",
                          ":hover": {
                            borderColor: "hsl(var(--ring))",
                          },
                        }),
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creadoPorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <UserIcon className="size-3.5" />
                    Creado por
                  </FormLabel>
                  <FormControl>
                    <ReactSelectComponent
                      options={usuarios}
                      value={usuarios.find((u) => u.value === field.value)}
                      onChange={(option) => field.onChange(option?.value)}
                      placeholder="Seleccionar usuario..."
                      isClearable
                      isSearchable
                      className="text-sm text-black"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "hsl(var(--input))",
                          borderRadius: "calc(var(--radius) - 2px)",
                          minHeight: "38px",
                          boxShadow: "none",
                          ":hover": {
                            borderColor: "hsl(var(--ring))",
                          },
                        }),
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Monto e Interés */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="montoCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <DollarSignIcon className="size-3.5" />
                    Capital
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interesPorcentaje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <PercentIcon className="size-3.5" />
                    Interés %
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Plazo, Frecuencia, Intervalo */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="plazoCuotas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <HashIcon className="size-3.5" />
                    Cuotas
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      placeholder="12"
                      className="shadow-none"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frecuencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <ClockIcon className="size-3.5" />
                    Frecuencia
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full shadow-none">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={FrecuenciaPago.SEMANAL}>
                        Semanal
                      </SelectItem>
                      <SelectItem value={FrecuenciaPago.QUINCENAL}>
                        Quincenal
                      </SelectItem>
                      <SelectItem value={FrecuenciaPago.MENSUAL}>
                        Mensual
                      </SelectItem>
                      <SelectItem value={FrecuenciaPago.CUSTOM}>
                        Custom
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intervaloDias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <ClockIcon className="size-3.5" />
                    Días
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      placeholder="30"
                      className="shadow-none"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fecha Inicio y Tipo Generación */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fechaInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <CalendarIcon className="size-3.5" />
                    Fecha inicio
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      // 1. El input date nativo REQUIERE el formato yyyy-MM-dd
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          field.onChange(undefined);
                          return;
                        }
                        // 2. TRUCO IMPORTANTE:
                        // Al agregar "T00:00:00", forzamos a JS a crear la fecha en tu ZONA HORARIA LOCAL.
                        // Si usas new Date("2024-01-20"), JS asume UTC y al convertirlo a tu hora local
                        // podría marcar el día anterior (ej: 19 de Enero a las 18:00).
                        const fechaLocal = new Date(`${val}T00:00:00`);
                        field.onChange(fechaLocal);
                      }}
                      className="shadow-none block w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoGeneracionCuotas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <FileTextIcon className="size-3.5" />
                    Generación
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full shadow-none">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AUTOMATICA">Automática</SelectItem>
                      <SelectItem value="CUSTOM">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Enganche (Opcional) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="engancheMonto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <DollarSignIcon className="size-3.5" />
                    Enganche
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      step="0.01"
                      placeholder="Opcional"
                      className="shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="engancheFecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <CalendarIcon className="size-3.5" />
                    Fecha enganche
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      // Mantenemos la lógica: si no hay monto, no deja poner fecha
                      disabled={!engancheMonto}
                      // Formatear Date -> String (yyyy-MM-dd) para el input
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          field.onChange(undefined);
                          return;
                        }
                        const fechaLocal = new Date(`${val}T00:00:00`);
                        field.onChange(fechaLocal);
                      }}
                      className="shadow-none w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Origen y Observaciones */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="origenCredito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <FileTextIcon className="size-3.5" />
                    Origen
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full shadow-none">
                        <SelectValue placeholder="Opcional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OrigenCreditoArray.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o.charAt(0) + o.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <FileTextIcon className="size-3.5" />
                    Observaciones
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Notas adicionales..."
                      className="min-h-9 resize-none shadow-none"
                      rows={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cuotas Custom */}
          {tipoGeneracion === "CUSTOM" && (
            <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cuotas manuales</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shadow-none bg-transparent"
                  onClick={() =>
                    append({
                      numeroCuota: fields.length + 1,
                      fechaVencimiento: new Date(),
                      montoCapital: "",
                      montoInteres: "",
                    })
                  }
                >
                  <PlusIcon className="size-3.5" />
                  Agregar
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay cuotas definidas
                </p>
              )}

              <div className="space-y-2">
                {fields.map((cuotaField, index) => (
                  <div
                    key={cuotaField.id}
                    className="grid grid-cols-2 gap-2 rounded border border-border bg-background p-2 sm:grid-cols-5"
                  >
                    <FormField
                      control={form.control}
                      name={`cuotasCustom.${index}.numeroCuota`}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              type="number"
                              placeholder="#"
                              className="h-8 text-sm shadow-none"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`cuotasCustom.${index}.fechaVencimiento`}
                      render={({ field }) => (
                        <FormItem className="col-span-1 sm:col-span-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "h-8 w-full justify-start text-xs shadow-none bg-transparent",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? format(field.value, "dd/MM/yy")
                                    : "Fecha"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`cuotasCustom.${index}.montoCapital`}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              type="number"
                              step="0.01"
                              placeholder="Capital"
                              className="h-8 text-sm shadow-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`cuotasCustom.${index}.montoInteres`}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              type="number"
                              step="0.01"
                              placeholder="Interés"
                              className="h-8 text-sm shadow-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-2 flex items-center justify-end sm:col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {form.formState.errors.cuotasCustom?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.cuotasCustom.message}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button type="submit" className="shadow-none">
              Crear crédito
            </Button>
          </div>
        </form>
      </Form>

      {/* Preview de cuotas */}
      <div className="lg:col-span-1">
        <CuotasPreview formValues={watchedValues} />
      </div>
    </div>
  );
}
