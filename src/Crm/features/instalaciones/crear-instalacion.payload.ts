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
