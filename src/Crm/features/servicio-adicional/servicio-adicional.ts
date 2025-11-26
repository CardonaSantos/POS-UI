export interface ServicioAdicional {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  estado: "ACTIVO" | "INACTIVO";
  tipoServicioId: number | null;
  creadoEn: string;
  actualizadoEn: string;
}
