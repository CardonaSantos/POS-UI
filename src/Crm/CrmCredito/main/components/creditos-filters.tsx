"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Search, X } from "lucide-react";
import { GetCreditosQueryDto } from "@/Crm/CrmHooks/hooks/use-credito/query";
import { EstadoCredito } from "@/Crm/features/credito/credito-interfaces";

interface CreditosFiltersProps {
  filters: GetCreditosQueryDto;
  onFiltersChange: (filters: GetCreditosQueryDto) => void;
}

const estadoOptions = [
  { value: "ALL", label: "Todos" },
  { value: EstadoCredito.ACTIVO, label: "Activo" },
  { value: EstadoCredito.EN_MORA, label: "En mora" },
  { value: EstadoCredito.COMPLETADO, label: "Completado" },
  { value: EstadoCredito.CANCELADO, label: "Cancelado" },
];

export function CreditosFilters({
  filters,
  onFiltersChange,
}: CreditosFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1,
    });
  };

  const handleEstadoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      estado: value === "ALL" ? undefined : (value as EstadoCredito),
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
    });
  };

  const hasActiveFilters = filters.search || filters.estado;

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>
      <Select
        value={filters.estado || "ALL"}
        onValueChange={handleEstadoChange}
      >
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {estadoOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="h-8 px-2 text-xs"
        >
          <X className="size-3 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
