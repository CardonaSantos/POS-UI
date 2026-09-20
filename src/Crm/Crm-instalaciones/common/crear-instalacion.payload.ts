import {
  EstadoInstalacionCliente,
  MetodoAutenticacionInternet,
  ModoAccesoInstalacion,
  TecnologiaAccesoInternet,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";

export type CrearClienteInstalacionCostosPayload = {
  costoInstalacion?: number;
  costoMateriales?: number;
  costoManoObra?: number;
  costoOtros?: number;

  montoCobradoCliente?: number;
  saldoPendiente?: number;

  notas?: string;
};

export type AsignarTecnicoInstalacionPayload = {
  tecnicoId: number;

  rol?: string;

  esResponsable?: boolean;

  observaciones?: string | null;
};

export type CrearAccesoNuevoInstalacionPayload = {
  modo: ModoAccesoInstalacion.NUEVO;
  tecnologia: TecnologiaAccesoInternet;
  metodoAutenticacion: MetodoAutenticacionInternet;
  mikrotikRouterId?: number;
};

export type VincularAccesoExistenteInstalacionPayload = {
  modo: ModoAccesoInstalacion.EXISTENTE;
  accesoInternetId: number;
};

export type AccesoInstalacionPayload =
  | CrearAccesoNuevoInstalacionPayload
  | VincularAccesoExistenteInstalacionPayload;

export type CrearClienteInstalacionPayload = {
  empresaId: number;
  clienteId: number;

  servicioInternetId?: number;
  ticketId?: number;

  asesorId: number | null;

  acceso: AccesoInstalacionPayload;

  tipo?: TipoInstalacionCliente;
  estado?: EstadoInstalacionCliente;

  descripcion?: string;
  motivo?: string;
  observaciones?: string;

  fechaProgramada?: string;
  fechaInicio?: string;

  direccionInstalacion?: string;
  referenciaUbicacion?: string;

  coordenadas?: string;

  costos?: CrearClienteInstalacionCostosPayload;

  tecnicos?: AsignarTecnicoInstalacionPayload[];
};
