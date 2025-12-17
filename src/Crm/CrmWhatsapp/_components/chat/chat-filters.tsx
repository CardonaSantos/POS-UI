"use client";

import type { ChatFilters as ChatFiltersType } from "@/Crm/features/bot-server/whatsapp-messages/whatsapp-messages.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ChatFiltersProps {
  filters: ChatFiltersType;
  onFiltersChange: (filters: ChatFiltersType) => void;
}

export function ChatFilters({ filters, onFiltersChange }: ChatFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="border-b bg-background pt-2">
      {/* CAMBIO: Usamos flex en lugar de grid para que los elementos se ajusten a su contenido */}
      <div className="px-3 pb-3 flex flex-wrap items-center gap-2">
        {/* Filtros */}
        <Select
          value={filters.direction || ""}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, direction: value as any })
          }
        >
          {/* w-[120px] le da un ancho fijo y ordenado */}
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue placeholder="Dirección" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INBOUND">Entrada</SelectItem>
            <SelectItem value="OUTBOUND">Salida</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type || ""}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, type: value as any })
          }
        >
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TEXT">Texto</SelectItem>
            <SelectItem value="IMAGE">Imagen</SelectItem>
            <SelectItem value="DOCUMENT">Documento</SelectItem>
            <SelectItem value="AUDIO">Audio</SelectItem>
            <SelectItem value="VIDEO">Video</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || ""}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value as any })
          }
        >
          <SelectTrigger className="h-8 text-xs w-[120px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SENT">Enviado</SelectItem>
            <SelectItem value="DELIVERED">Entregado</SelectItem>
            <SelectItem value="READ">Leído</SelectItem>
            <SelectItem value="FAILED">Fallido</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón de Limpiar: Lo moví al final (es más común) y lo hice sutil */}
        {hasActiveFilters && (
          <Button
            variant="ghost" // 'ghost' es más limpio que 'destructive' para una acción de UI
            onClick={clearFilters}
            size="sm" // size sm reduce el padding
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
            title="Limpiar filtros"
          >
            <X className="h-4 w-4 mr-1" />
            <span className="text-xs">Limpiar</span>
          </Button>
        )}
      </div>
    </div>
  );
}
