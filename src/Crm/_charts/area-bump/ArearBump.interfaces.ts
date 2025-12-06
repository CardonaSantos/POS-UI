// 1. Definimos la forma de cada punto de datos (x, y)
export interface AreaBumpDatum {
  x: number; // En tu JSON son años (enteros), así que usamos number
  y: number; // El valor numérico
}

// 2. Definimos la estructura de la Serie (id + datos)
export interface AreaBumpSerie {
  id: string; // "JavaScript", "TypeScript", etc.
  data: AreaBumpDatum[];
}

// 3. Este es el tipo final que pasarás a la prop 'data' del componente
export type AreaBumpData = AreaBumpSerie[];
