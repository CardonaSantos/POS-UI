import { Filter, RefreshCcw, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  GalleryMediaType,
  MediaFilterState,
} from "@/Crm/features/bot-server/galery/galery-types-response.types";

import {
  WazDirection,
  WazMediaType,
} from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import ReactSelect from "react-select";
import { OptionSelected } from "@/Crm/features/OptionSelected/OptionSelected";

interface ComprobantesMediaHeaderProps {
  clienteOptions: OptionSelected[];
  clienteSelected: OptionSelected | null;
  isLoadingClientes: boolean;
  onSelectCliente: (option: OptionSelected | null) => void;

  filters: MediaFilterState;
  total: number;
  isFetching: boolean;
  onChangeFilter: <K extends keyof MediaFilterState>(
    key: K,
    value: MediaFilterState[K],
  ) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
}

const MEDIA_TYPE_OPTIONS: Array<{
  label: string;
  value: GalleryMediaType | "ALL";
}> = [
  {
    label: "Todos",
    value: "ALL",
  },
  {
    label: "Imágenes",
    value: WazMediaType.IMAGE,
  },
  {
    label: "Videos",
    value: WazMediaType.VIDEO,
  },
  {
    label: "Documentos",
    value: WazMediaType.DOCUMENT,
  },
];

const DIRECTION_OPTIONS: Array<{
  label: string;
  value: WazDirection | "ALL";
}> = [
  {
    label: "Todas",
    value: "ALL",
  },
  {
    label: "Cliente → Bot",
    value: WazDirection.INBOUND,
  },
  {
    label: "Bot → Cliente",
    value: WazDirection.OUTBOUND,
  },
];

export function ComprobantesMediaHeader({
  filters,
  total,
  isFetching,
  onChangeFilter,
  onResetFilters,
  onRefresh,
  onSelectCliente,
  clienteOptions,
  clienteSelected,
  isLoadingClientes,
}: ComprobantesMediaHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2"></div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="h-7 rounded-lg text-xs">
              {total} registros
            </Badge>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={onRefresh}
              disabled={isFetching}
            >
              <RefreshCcw
                className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refrescar
            </Button>
          </div>
        </div>

        <Separator />

        <section
          aria-label="Filtros de búsqueda"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6"
        >
          <div className="space-y-1">
            <div className="relative">
              <div className="space-y-1">
                <Label htmlFor="clienteId" className="text-xs">
                  Cliente
                </Label>

                <ReactSelect<OptionSelected, false>
                  inputId="clienteId"
                  value={clienteSelected}
                  options={clienteOptions}
                  onChange={(option) => {
                    onSelectCliente(option);
                  }}
                  isClearable
                  isLoading={isLoadingClientes}
                  placeholder="Buscar cliente..."
                  noOptionsMessage={() => "Sin clientes"}
                  loadingMessage={() => "Cargando clientes..."}
                  className="text-xs text-black"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "32px",
                      height: "32px",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: "32px",
                      padding: "0 8px",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "32px",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: "12px",
                    }),
                    option: (base) => ({
                      ...base,
                      fontSize: "12px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="type" className="text-xs">
              Tipo
            </Label>

            <Select
              value={filters.type}
              onValueChange={(value) => {
                onChangeFilter("type", value as MediaFilterState["type"]);
              }}
            >
              <SelectTrigger id="type" className="h-8 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>

              <SelectContent>
                {MEDIA_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="direction" className="text-xs">
              Dirección
            </Label>

            <Select
              value={filters.direction}
              onValueChange={(value) => {
                onChangeFilter(
                  "direction",
                  value as MediaFilterState["direction"],
                );
              }}
            >
              <SelectTrigger id="direction" className="h-8 text-xs">
                <SelectValue placeholder="Dirección" />
              </SelectTrigger>

              <SelectContent>
                {DIRECTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="startDate" className="text-xs">
              Desde
            </Label>

            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(event) => {
                onChangeFilter("startDate", event.target.value);
              }}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="endDate" className="text-xs">
              Hasta
            </Label>

            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(event) => {
                onChangeFilter("endDate", event.target.value);
              }}
              className="h-8 text-xs "
            />
          </div>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" aria-hidden="true" />
            Los filtros se aplican automáticamente al cambiar los valores.
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 justify-start gap-1.5 text-xs sm:justify-center"
            onClick={onResetFilters}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Limpiar filtros
          </Button>
        </div>
      </div>
    </header>
  );
}
