import { MultiValue } from "react-select";
import { OptionSelected } from "../../ReactSelectComponent/OptionSelected";
import { Ticket } from "../ticketTypes";

export interface Tecnico {
  id: number;
  nombre: string;
}

export interface Etiqueta {
  id: number;
  nombre: string;
}

export type DateSide = "start" | "end";

export interface TicketFiltersProps {
  ticketsTotal: number;
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
  tickets: Ticket[];
  tecnicoSelected: string | null;
  tecnicos: Tecnico[];
  etiquetas: Etiqueta[];
  etiquetasSelecteds: number[];
  openCreatT: boolean;
  onFilterChange: (value: string) => void;
  onQuickViewChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  handleChangeDates: (side: DateSide, date: Date | null) => void;
  handleSelectedTecnico: (value: OptionSelected | null) => void;
  handleChangeLabels: (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => void;
  setOpenCreateT: (value: boolean) => void;
  getTickets: () => void;
}
