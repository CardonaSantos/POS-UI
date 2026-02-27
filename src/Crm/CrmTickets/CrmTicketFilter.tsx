"use client";

import {
  Search,
  Calendar,
  Plus,
  Filter,
  User,
  Tag,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { es } from "date-fns/locale";
import CrmCreateTicket from "./CreateTickets/CrmCreateTicket";
import ReactSelectComponent, { MultiValue } from "react-select";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";
import DatePicker from "react-datepicker";
import { Ticket } from "./ticketTypes";
import "react-datepicker/dist/react-datepicker.css";

interface Tecnicos {
  id: number;
  nombre: string;
}

interface Etiqueta {
  id: number;
  nombre: string;
}

type DateSide = "start" | "end";

interface TicketFiltersProps {
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
  onQuickViewChange: (value: string) => void;
  handleChangeDates: (side: DateSide, date: Date | null) => void;
  tickets: Ticket[];
  onFilterChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  openCreatT: boolean;
  setOpenCreateT: (value: boolean) => void;
  getTickets: () => void;
  tecnicos: Tecnicos[];
  tecnicoSelected: string | null;
  handleSelectedTecnico: (value: OptionSelected | null) => void;
  etiquetas: Etiqueta[];
  etiquetasSelecteds: number[];
  handleChangeLabels: (
    selectedOptions: MultiValue<{ value: string; label: string }>,
  ) => void;

  ticketsTotal: number;
}

export default function TicketFilters({
  // tickets,
  ticketsTotal,
  onFilterChange,
  getTickets,
  openCreatT,
  setOpenCreateT,
  onQuickViewChange,
  tecnicos,
  tecnicoSelected,
  handleSelectedTecnico,
  etiquetas,
  etiquetasSelecteds,
  handleChangeLabels,
  dateRangeEnd,
  dateRangeStart,
  handleChangeDates,
}: TicketFiltersProps) {
  const handleFilterChange = (value: string) => {
    onQuickViewChange(value);
  };

  const optionsTecnicos = tecnicos.map((tec) => ({
    value: String(tec.id),
    label: tec.nombre,
  }));

  const optionsLabels = etiquetas.map((label) => ({
    value: label.id.toString(),
    label: label.nombre,
  }));

  // Estilos personalizados para compactar React Select a h-8
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      fontSize: "12px",
      borderRadius: "0.375rem", // Tailwind rounded-md
      borderColor: "hsl(var(--input))",
      boxShadow: "none",
      "&:hover": {
        borderColor: "hsl(var(--ring))",
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: "30px",
      padding: "0 8px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "30px",
    }),
    menu: (provided: any) => ({
      ...provided,
      fontSize: "12px",
      zIndex: 50,
    }),
  };

  return (
    <div className="w-full  p-2 border-b border-gray-100 ">
      <div className="flex flex-col xl:flex-row gap-3 items-center justify-between">
        {/* BLOQUE IZQUIERDO: Buscador + Filtros */}
        <div className="flex flex-1 flex-col lg:flex-row gap-2 w-full xl:w-auto items-center">
          {/* 1. Buscador (Flexible) */}
          <div className="relative w-full lg:w-[220px] shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar ticket..."
              className="pl-8 h-8 text-xs bg-gray-50  border-gray-200 text-black"
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>

          <div className="h-4 w-[1px] bg-gray-200  hidden lg:block mx-1" />

          <div className="flex flex-wrap items-center gap-2 w-full">
            {/* Fechas Compactas */}
            <div className="flex items-center rounded-md border border-input bg-background h-8 overflow-hidden shadow-sm">
              <div className="px-2 border-r border-gray-100 bg-gray-50 h-full flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <DatePicker
                locale={es}
                selected={dateRangeStart || null}
                onChange={(date) => handleChangeDates("start", date)}
                selectsStart
                startDate={dateRangeStart}
                endDate={dateRangeEnd}
                placeholderText="Desde"
                className="w-[85px] h-full border-none text-xs text-center focus:ring-0 bg-transparent cursor-pointer"
                dateFormat="dd/MM/yy"
              />
              <div className="text-gray-300 text-[10px]">–</div>
              <DatePicker
                locale={es}
                selected={dateRangeEnd || null}
                onChange={(date) => handleChangeDates("end", date)}
                selectsEnd
                startDate={dateRangeEnd}
                endDate={dateRangeEnd}
                minDate={dateRangeEnd}
                placeholderText="Hasta"
                className="w-[85px] h-full border-none text-xs text-center focus:ring-0 bg-transparent cursor-pointer"
                dateFormat="dd/MM/yy"
              />
            </div>

            {/* Selects con Iconos usando React Select Compacto */}
            <div className="w-full sm:w-[160px]">
              <ReactSelectComponent
                className="text-black"
                placeholder={
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />{" "}
                    <span className="text-[11px]">Técnico</span>
                  </div>
                }
                options={optionsTecnicos}
                isClearable
                styles={customSelectStyles}
                onChange={handleSelectedTecnico}
                value={
                  tecnicoSelected
                    ? {
                        value: tecnicoSelected,
                        label:
                          tecnicos.find(
                            (t) => t.id.toString() === tecnicoSelected,
                          )?.nombre || "",
                      }
                    : null
                }
              />
            </div>

            <div className="w-full sm:w-[200px]">
              <ReactSelectComponent
                className="text-black"
                placeholder={
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />{" "}
                    <span className="text-[11px]">Etiquetas</span>
                  </div>
                }
                options={optionsLabels}
                isClearable
                isMulti
                styles={customSelectStyles}
                onChange={handleChangeLabels}
                value={optionsLabels.filter((opt) =>
                  etiquetasSelecteds.includes(Number(opt.value)),
                )}
              />
            </div>

            {/* Filtro Rápido (View) */}
            <Select onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs border-dashed text-gray-600">
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3" />
                  <SelectValue placeholder="Vista" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tickets</SelectItem>
                <SelectItem value="assignedToMe">Asignados a mí</SelectItem>
                <SelectItem value="createdByMe">Creados por mí</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* BLOQUE DERECHO: Acciones y Contador */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 pt-2 xl:pt-0 border-gray-100">
          {/* Contador Sutil */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50  px-2 py-1 rounded-md border border-gray-100 ">
                  <Layers className="h-3.5 w-3.5" />
                  <span className="font-medium">{ticketsTotal}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Tickets abiertos o en proceso</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Botón Crear */}
          <div className="flex gap-2">
            <Button
              onClick={() => setOpenCreateT(true)}
              size="sm"
              className="h-8 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Nuevo Ticket
            </Button>

            {/* Modal Inyectado */}
            <CrmCreateTicket
              getTickets={getTickets}
              openCreatT={openCreatT}
              setOpenCreateT={setOpenCreateT}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
