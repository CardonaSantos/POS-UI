// Types
export interface EtiquetaTicket {
  id: number;
  nombre: string;
  tickets?: number;
  ticketsCount?: number; // Campo calculado para mostrar la cantidad de tickets
}
