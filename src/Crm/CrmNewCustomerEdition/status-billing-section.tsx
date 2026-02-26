"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, MessageSquare, Smartphone } from "lucide-react";
import ReactSelectComponent from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { type StatusBillingSectionProps } from "./customer-form-types";
import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";

export function StatusBillingSection({
  formData,
  fechaInstalacion,
  zonasFacturacionSelected,
  optionsZonasFacturacion,
  secureZonasFacturacion,
  onSelectEstadoCliente,
  onEnviarRecordatorioChange,
  onSelectZonaFacturacion,
  onChangeFechaInstalacion,
}: StatusBillingSectionProps) {
  const compactSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "32px",
      fontSize: "12px",
      borderRadius: "var(--radius)",
      borderColor: "hsl(var(--input))",
      boxShadow: "none",
      "&:hover": { borderColor: "hsl(var(--ring))" },
    }),
    valueContainer: (base: any) => ({ ...base, padding: "0 8px" }),
    input: (base: any) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base: any) => ({ ...base, height: "30px" }),
  };

  return (
    <section aria-labelledby="section-estado" className="space-y-4">
      {/* HEADER */}
      <h3
        id="section-estado"
        className="font-medium flex items-center gap-2 text-sm border-b pb-2"
      >
        <MessageSquare className="h-4 w-4 " />
        Estado, Notificaciones y Facturación
      </h3>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Estado del Cliente */}
        <div className="space-y-1">
          <Label htmlFor="estadoCliente" className="text-xs">
            Estado del cliente
          </Label>
          <Select
            value={formData.estado}
            onValueChange={(val) => onSelectEstadoCliente(val as EstadoCliente)}
          >
            <SelectTrigger id="estadoCliente" className="w-full h-8 text-xs">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs">Estados</SelectLabel>
                {Object.values(EstadoCliente).map((estado) => (
                  <SelectItem key={estado} value={estado} className="text-xs">
                    {estado.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Zona de Facturación */}
        <div className="space-y-1">
          <Label htmlFor="zonasFacturacion-all" className="text-xs">
            Zona de Facturación <span className="text-destructive">*</span>
          </Label>
          <ReactSelectComponent
            options={optionsZonasFacturacion}
            onChange={onSelectZonaFacturacion}
            value={
              zonasFacturacionSelected
                ? {
                    value: zonasFacturacionSelected,
                    label:
                      secureZonasFacturacion.find(
                        (s) => s.id === zonasFacturacionSelected,
                      )?.nombre || "",
                  }
                : null
            }
            className="text-xs text-black"
            placeholder="Seleccionar zona..."
            styles={compactSelectStyles}
          />
        </div>

        {/* 3. Fecha Instalación */}
        <div className="space-y-1">
          <Label
            htmlFor="fechaInstalacion-all"
            className="text-xs flex items-center gap-1"
          >
            Fecha Instalación
          </Label>
          <div className="relative">
            <DatePicker
              id="fechaInstalacion-all"
              selected={fechaInstalacion}
              onChange={(date) => onChangeFechaInstalacion(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full h-8 px-3 py-1 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              wrapperClassName="w-full"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* 4. Toggle WhatsApp (Con diseño de tarjeta compacta) */}
        <div className="flex items-end">
          <div className="w-full h-8 flex items-center justify-between rounded-md border px-3 bg-card">
            <Label
              htmlFor="whatsapp"
              className="flex items-center gap-2 cursor-pointer text-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Notificar por WhatsApp
            </Label>
            <Switch
              id="whatsapp"
              checked={formData.enviarRecordatorio}
              onCheckedChange={onEnviarRecordatorioChange}
              className="scale-75 origin-right" // Hacemos el switch un poco más pequeño para que quepa bien en h-8
            />
          </div>
        </div>
      </div>
    </section>
  );
}
