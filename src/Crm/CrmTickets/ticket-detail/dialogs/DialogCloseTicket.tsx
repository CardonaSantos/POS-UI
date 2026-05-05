import { Loader2 } from "lucide-react";
import SelectComponent, { SingleValue } from "react-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { SolucionTicketItem, SelectOption } from "../ticket-detail.types";

/** Schema type — mirrors what the parent defines via zod */
export interface TicketResumenSchemaType {
  ticketId: number;
  solucionId: number | null;
  resueltoComo: string | null;
  notasInternas: string | null;
}

interface DialogCloseTicketProps {
  open: boolean;
  ticketId: number;
  soluciones: SolucionTicketItem[];
  form: UseFormReturn<TicketResumenSchemaType>;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TicketResumenSchemaType) => void;
}

const compactSelectStyles = {
  control: (base: object) => ({
    ...base,
    minHeight: "30px",
    fontSize: "12px",
    borderRadius: "6px",
  }),
  dropdownIndicator: (base: object) => ({ ...base, padding: "2px 4px" }),
  clearIndicator: (base: object) => ({ ...base, padding: "2px 4px" }),
  valueContainer: (base: object) => ({ ...base, padding: "0 6px" }),
  option: (base: object) => ({ ...base, fontSize: "12px", padding: "5px 10px" }),
  menuPortal: (base: object) => ({ ...base, zIndex: 9999 }),
};

export function DialogCloseTicket({
  open,
  ticketId,
  soluciones,
  form,
  isPending,
  onOpenChange,
  onSubmit,
}: DialogCloseTicketProps) {
  const optionsSoluciones: SelectOption[] = soluciones.map((s) => ({
    label: s.solucion,
    value: s.id.toString(),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Cerrar Ticket #{ticketId}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-1">
            <input type="hidden" {...form.register("ticketId", { valueAsNumber: true })} />

            {/* Tipo de solución */}
            <FormField
              control={form.control}
              name="solucionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-400 uppercase">
                    Tipo de Solución
                  </FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Selecciona una solución…"
                      options={optionsSoluciones}
                      isClearable
                      value={
                        field.value
                          ? (optionsSoluciones.find(
                              (o) => Number(o.value) === field.value,
                            ) ?? null)
                          : null
                      }
                      onChange={(opt: SingleValue<SelectOption>) =>
                        field.onChange(opt ? Number(opt.value) : null)
                      }
                      styles={compactSelectStyles}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Resumen de solución */}
            <FormField
              control={form.control}
              name="resueltoComo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-400 uppercase">
                    Resumen de Solución
                    <span className="normal-case font-normal text-gray-300 ml-1">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      rows={3}
                      placeholder="Ej: Se reinició el router y se validó la IP…"
                      className="w-full resize-none text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] text-gray-400">
                    Visible en el reporte final.
                  </FormDescription>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Notas internas */}
            <FormField
              control={form.control}
              name="notasInternas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-400 uppercase">
                    Notas Internas
                    <span className="normal-case font-normal text-gray-300 ml-1">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      rows={2}
                      placeholder="Detalles técnicos solo para el equipo…"
                      className="w-full resize-none text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="h-7 text-xs px-3"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-7 text-xs px-4 bg-emerald-600 hover:bg-emerald-700"
              >
                {isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                Confirmar Cierre
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
