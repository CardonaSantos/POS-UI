export interface BoletaConformidadDto {
  id: number;
  resultado: string;
  creadoEn: string;
  respondidoEn: string | null;
}

export interface BoletaFirmaClienteDto {
  id: number;
  nombreFirmante: string;
  telefonoFirmante: string | null;
  firmadoEn: string;
  mediaId: number;
  url: string;
  mimeType: string;
  tamanioBytes: string;
}

export interface BoletaFirmaTecnicoDto {
  id: number;
  usuarioFirmanteId: number | null;
  nombreFirmante: string;
  firmadoEn: string;
  mediaId: number;
  url: string;
  mimeType: string;
  tamanioBytes: string;
}

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

  conformidad: BoletaConformidadDto | null;

  firmaCliente: BoletaFirmaClienteDto | null;

  firmaTecnico: BoletaFirmaTecnicoDto | null;
}
