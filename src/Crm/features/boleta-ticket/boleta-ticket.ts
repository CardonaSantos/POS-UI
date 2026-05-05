export interface BoletaSoporteDto {
  ticketId?: number | null;
  titulo: string;
  descripcion?: string | null;
  estado: "NUEVO" | "ABIERTA" | "EN_PROCESO" | "CERRADA";
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  fechaApertura: string;
  fechaCierre: string | null;
  fechaGeneracionBoleta: string;

  cliente?: {
    id: number;
    nombreCompleto: string;
    telefono: string;
    direccion: string;
  } | null;

  tecnico: {
    id: number;
    nombre: string;
  } | null;

  empresa: {
    id: number;
    nombre: string;
    direccion: string;
    correo: string;
    telefono: string;
    pbx: string;
  };
}
