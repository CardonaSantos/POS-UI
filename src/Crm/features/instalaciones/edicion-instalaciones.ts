import { RolTecnicoOperacionCliente, TipoInstalacionCliente } from "./enums";
import { ClienteInstalacionBase } from "./instalaciones.interfaces";

export type ActualizarTecnicoInstalacionPayload = {
  tecnicoId: number;

  rol: RolTecnicoOperacionCliente;

  esResponsable: boolean;

  tiempoMinutos?: number | null;

  observaciones?: string | null;
};

export type ActualizarCostosInstalacionPayload = {
  costoInstalacion?: number;

  costoMateriales?: number;

  costoManoObra?: number;

  costoOtros?: number;

  montoCobradoCliente?: number;

  notasCostos?: string | null;
};

export type ActualizarClienteInstalacionPayload = {
  tipo?: TipoInstalacionCliente;

  asesorId?: number | null;

  ticketId?: number | null;

  descripcion?: string | null;

  motivo?: string | null;

  observaciones?: string | null;

  fechaProgramada?: string | null;

  direccionInstalacion?: string | null;

  referenciaUbicacion?: string | null;

  latitud?: number | null;

  longitud?: number | null;

  costos?: ActualizarCostosInstalacionPayload;

  tecnicos?: ActualizarTecnicoInstalacionPayload[];
};

export type ActualizarClienteInstalacionResponse = ClienteInstalacionBase;
