export enum TipoPlantillaLegal {
  CONTRATO = "CONTRATO",
  PAGARE = "PAGARE",
}

export interface PlantillaLegal {
  id: number;
  tipo: TipoPlantillaLegal;
  nombre: string;
  contenido: string;
  version: string;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}
