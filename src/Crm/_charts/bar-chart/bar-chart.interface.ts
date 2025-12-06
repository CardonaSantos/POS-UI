// Un datum genérico para Nivo Bar
export interface NivoBarDatum {
  // clave → string (ej. "country", "month", "year", "instalaciones"...)
  // valor → string o number
  [key: string]: string | number;
}

// El array completo de data
export type NivoBarData = NivoBarDatum[];
