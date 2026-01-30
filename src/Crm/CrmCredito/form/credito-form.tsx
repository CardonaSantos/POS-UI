"use client";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  PercentIcon,
  HashIcon,
  ClockIcon,
  UserIcon,
  FileTextIcon,
  Coins,
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
import { CreditoFormValues } from "./schema.zod";
import {
  FrecuenciaPago,
  OrigenCreditoArray,
} from "@/Crm/features/credito/credito-interfaces";
import { CuotasPreview } from "./cuotas-preview";
import ReactSelectComponent from "react-select";
import { useEffect } from "react";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";

interface CreditoFormProps {
  onSubmit: (data: CreditoFormValues) => void;
  defaultValues?: Partial<CreditoFormValues>;
  form: UseFormReturn<CreditoFormValues>;
  handleSubmitVerifyCustomer: () => void;
  isButtonAvaliable: boolean;
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
  clientes,
  // usuarios,
  form,
  handleSubmitVerifyCustomer,
  isButtonAvaliable,
}: CreditoFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cuotasCustom",
  });

  const tipoGeneracion = form.watch("tipoGeneracionCuotas");
  const engancheMonto = form.watch("engancheMonto");

  const tipoGeneracionCuotas = form.watch("tipoGeneracionCuotas");

  const watchedValues = form.watch();
  const handleSubmit = form.handleSubmit(onSubmit);

  useEffect(() => {
    if (tipoGeneracionCuotas === "AUTOMATICA") {
      form.setValue("cuotasCustom", []);
    }
  }, []);

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
          </div>

          {/* Monto e Interés */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="montoCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <Coins className="size-3.5" />
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
                    Interés
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
              name="interesMoraPorcentaje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm">
                    <PercentIcon className="size-3.5" />
                    Interés mora
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
                    <Coins className="size-3.5" />
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
            <div className="rounded-md border border-border bg-muted/30 p-3 space-y-3">
              {/* Encabezado y Botón Agregar */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cuotas manuales</span>
                <Button
                  type="button"
                  variant="ghost" // Ghost es menos invasivo visualmente
                  size="sm"
                  className="h-7 px-2"
                  onClick={() =>
                    append({
                      numeroCuota: fields.length + 1,
                      fechaVencimiento: new Date(),
                      montoCapital: "",
                      montoInteres: "",
                    })
                  }
                >
                  <PlusIcon className="mr-1 size-3.5" />
                  Agregar
                </Button>
              </div>

              {/* Mensaje vacío */}
              {fields.length === 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground border-dashed border rounded-md">
                  No hay cuotas definidas
                </div>
              )}

              {/* Lista de campos */}
              {fields.length > 0 && (
                <div className="space-y-1">
                  {/* Fila de Encabezados (Para no repetir labels) */}
                  <div className="grid grid-cols-12 gap-2 px-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    <div className="col-span-2 text-center">No.</div>
                    <div className="col-span-4">Vencimiento</div>
                    <div className="col-span-5">Capital</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Filas */}
                  {fields.map((cuotaField, index) => (
                    <div
                      key={cuotaField.id}
                      className="grid grid-cols-12 gap-2 items-start"
                    >
                      {/* Campo: Número */}
                      <FormField
                        control={form.control}
                        name={`cuotasCustom.${index}.numeroCuota`}
                        render={({ field }) => (
                          <div className="col-span-2">
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  type="number"
                                  className="h-8 text-center text-xs shadow-none px-1"
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          </div>
                        )}
                      />

                      {/* Campo: Fecha */}
                      <FormField
                        control={form.control}
                        name={`cuotasCustom.${index}.fechaVencimiento`}
                        render={({ field }) => (
                          <div className="col-span-4">
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  type="date"
                                  className="h-8 text-xs shadow-none px-2 block w-full"
                                  value={
                                    field.value
                                      ? typeof field.value === "string"
                                        ? field.value
                                        : field.value.toISOString().slice(0, 10)
                                      : ""
                                  }
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          </div>
                        )}
                      />

                      {/* Campo: Monto Capital */}
                      <FormField
                        control={form.control}
                        name={`cuotasCustom.${index}.montoCapital`}
                        render={({ field }) => (
                          <div className="col-span-5">
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="h-8 text-xs shadow-none text-right"
                                />
                              </FormControl>
                            </FormItem>
                          </div>
                        )}
                      />

                      {/* Botón: Eliminar */}
                      <div className="col-span-1 flex justify-center pt-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => remove(index)}
                        >
                          <TrashIcon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {form.formState.errors.cuotasCustom?.message && (
                <p className="text-xs text-destructive mt-2">
                  {form.formState.errors.cuotasCustom.message}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              disabled={isButtonAvaliable}
              onClick={handleSubmitVerifyCustomer}
              type="button"
              className="shadow-none"
            >
              Verificar Cliente
            </Button>

            <Button type="submit">Crear crédito</Button>
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
