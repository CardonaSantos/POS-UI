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
import { MessageSquare, Smartphone } from "lucide-react";
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
  return (
    <section
      aria-labelledby="section-estado-notificaciones"
      className="space-y-4"
    >
      <h3
        id="section-estado-notificaciones"
        className="font-medium flex items-center gap-2 text-sm"
      >
        <MessageSquare className="h-4 w-4 text-primary dark:text-white" />
        Estado, notificaciones y facturación
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
        {/* Estado + WhatsApp */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="estadoCliente" className="font-medium">
              Estado del cliente
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(val) =>
                onSelectEstadoCliente(val as EstadoCliente)
              }
            >
              <SelectTrigger id="estadoCliente" className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados disponibles</SelectLabel>
                  <SelectItem value={EstadoCliente.ACTIVO}>ACTIVO</SelectItem>
                  <SelectItem value={EstadoCliente.ATRASADO}>
                    ATRASADO
                  </SelectItem>
                  <SelectItem value={EstadoCliente.DESINSTALADO}>
                    DESINSTALADO
                  </SelectItem>
                  <SelectItem value={EstadoCliente.EN_INSTALACION}>
                    EN INSTALACIÓN
                  </SelectItem>
                  <SelectItem value={EstadoCliente.MOROSO}>MOROSO</SelectItem>
                  <SelectItem value={EstadoCliente.PAGO_PENDIENTE}>
                    PAGO PENDIENTE
                  </SelectItem>
                  <SelectItem value={EstadoCliente.PENDIENTE_ACTIVO}>
                    PENDIENTE ACTIVO
                  </SelectItem>
                  <SelectItem value={EstadoCliente.SUSPENDIDO}>
                    SUSPENDIDO
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle WhatsApp */}
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label
              htmlFor="whatsapp"
              className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              Notificar cobro por WhatsApp
              <Smartphone className="w-4 h-4" />
            </Label>
            <Switch
              id="whatsapp"
              checked={formData.enviarRecordatorio}
              onCheckedChange={onEnviarRecordatorioChange}
            />
          </div>
        </div>

        {/* Zona facturación */}
        <div className="space-y-2">
          <Label htmlFor="zonasFacturacion-all">
            Zonas de Facturación <span className="text-destructive">*</span>
          </Label>
          <ReactSelectComponent
            options={optionsZonasFacturacion}
            onChange={onSelectZonaFacturacion}
            value={
              zonasFacturacionSelected !== null
                ? {
                    value: zonasFacturacionSelected,
                    label:
                      secureZonasFacturacion.find(
                        (s) => s.id === zonasFacturacionSelected
                      )?.nombre || "",
                  }
                : null
            }
            className="text-sm text-black"
          />
        </div>

        {/* Fecha instalación */}
        <div className="space-y-2">
          <Label htmlFor="fechaInstalacion-all" className="font-medium">
            Fecha Instalación
          </Label>
          <DatePicker
            className="w-full p-2 rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            selected={fechaInstalacion}
            onChange={(date) => onChangeFechaInstalacion(date)}
            showTimeSelect
            dateFormat="Pp"
            aria-label="Fecha de instalación"
            id="fechaInstalacion-all"
          />
        </div>
      </div>
    </section>
  );
}
