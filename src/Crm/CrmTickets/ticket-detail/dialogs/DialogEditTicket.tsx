import React from "react";
import SelectComponent, { MultiValue, SingleValue } from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Ticket, SelectOption } from "../ticket-detail.types";

interface DialogEditTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
  optionsLabels: SelectOption[];
  optionsTecs: SelectOption[];
  optionsCustomers: SelectOption[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onChangeCustomer: (opt: SingleValue<SelectOption>) => void;
  onChangeTec: (opt: SingleValue<SelectOption>) => void;
  onChangeCompanions: (opts: MultiValue<SelectOption>) => void;
  onChangeLabels: (opts: MultiValue<SelectOption>) => void;
  isPending?: boolean;
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

export function DialogEditTicket({
  open,
  onOpenChange,
  ticket,
  optionsLabels,
  optionsTecs,
  optionsCustomers,
  onSubmit,
  onChange,
  onSelectChange,
  onChangeCustomer,
  onChangeTec,
  onChangeCompanions,
  onChangeLabels,
  isPending,
}: DialogEditTicketProps) {
  const companionOptions =
    ticket.companios?.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] p-0 overflow-y-auto max-h-[90vh] flex flex-col">
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-sm">Editar Ticket #{ticket.id}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Title + fixed */}
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Título
                </Label>
                <Input
                  name="title"
                  value={ticket.title ?? ""}
                  onChange={onChange}
                  className="h-7 text-xs"
                  placeholder="Resumen del problema"
                />
              </div>
              <div className="space-y-1 shrink-0">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Fijar
                </Label>
                <div className="flex items-center gap-1.5 border rounded px-2 h-7 bg-gray-50 text-xs">
                  <Switch
                    checked={ticket.fixed}
                    onCheckedChange={(v) =>
                      onSelectChange("fixed", String(v))
                    }
                    className="scale-75 origin-left"
                  />
                  <span className="text-[10px] text-gray-500">
                    {ticket.fixed ? "Fijado" : "Normal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                Descripción
              </Label>
              <textarea
                name="description"
                value={ticket.description ?? ""}
                onChange={onChange}
                rows={3}
                className="w-full resize-y text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-gray-400 placeholder:text-gray-300"
                placeholder="Detalles del requerimiento…"
              />
            </div>

            {/* Customer + Priority + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Cliente
                </Label>
                <SelectComponent
                  placeholder="Buscar cliente…"
                  isClearable
                  options={optionsCustomers}
                  value={
                    ticket.customer
                      ? optionsCustomers.find(
                          (c) => c.value === ticket.customer!.id.toString(),
                        ) ?? null
                      : null
                  }
                  onChange={onChangeCustomer}
                  styles={compactSelectStyles}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Prioridad
                </Label>
                <Select
                  value={ticket.priority}
                  onValueChange={(v) => onSelectChange("priority", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAJA" className="text-xs">Baja</SelectItem>
                    <SelectItem value="MEDIA" className="text-xs">Media</SelectItem>
                    <SelectItem value="ALTA" className="text-xs">Alta</SelectItem>
                    <SelectItem value="URGENTE" className="text-xs">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Estado
                </Label>
                <Select
                  value={ticket.status}
                  onValueChange={(v) => onSelectChange("status", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NUEVO" className="text-xs">Nuevo</SelectItem>
                    <SelectItem value="ABIERTA" className="text-xs">Abierta</SelectItem>
                    <SelectItem value="EN_PROCESO" className="text-xs">En Proceso</SelectItem>
                    <SelectItem value="PENDIENTE" className="text-xs">Pendiente</SelectItem>
                    <SelectItem value="RESUELTA" className="text-xs">Resuelta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Tecnico + Acompañantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Técnico
                </Label>
                <SelectComponent
                  placeholder="Asignar técnico…"
                  isClearable
                  options={optionsTecs}
                  value={
                    ticket.assignee
                      ? optionsTecs.find(
                          (t) => t.value === ticket.assignee!.id.toString(),
                        ) ?? null
                      : null
                  }
                  onChange={onChangeTec}
                  styles={compactSelectStyles}
                  menuPlacement="top"
                  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                  Acompañantes
                </Label>
                <SelectComponent
                  placeholder="Agregar…"
                  isClearable
                  isMulti
                  options={optionsTecs.filter(
                    (t) => t.value !== ticket.assignee?.id.toString(),
                  )}
                  value={companionOptions}
                  onChange={onChangeCompanions}
                  styles={compactSelectStyles}
                  menuPlacement="top"
                  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-gray-400 uppercase">
                Etiquetas
              </Label>
              <SelectComponent
                placeholder="Etiquetar ticket…"
                options={optionsLabels}
                isMulti
                value={ticket.tags ?? []}
                onChange={onChangeLabels}
                styles={compactSelectStyles}
                menuPlacement="top"
                menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              />
            </div>
          </div>

          <DialogFooter className="px-4 py-2.5 border-t bg-gray-50 gap-2 shrink-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-7 text-xs px-3"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-7 text-xs px-4"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
