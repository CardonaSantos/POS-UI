// Datos mínimos del cobrador
export interface CobradorResumen {
  id: number;
  nombre: string;
  rol: string;
}

// Cliente simplificado
export interface ClienteResumen {
  id: number;
  nombre: string;
  apellidos: string;
}

// Cada ruta con select aplicado
export interface RutaAsignada {
  id: number;
  nombreRuta: string;
  creadoEn: Date;
  actualizadoEn: Date;
  observaciones: string | null;
  cobrador: CobradorResumen;
  _count: {
    clientes: number;
  };
  clientes: ClienteResumen[]; // con take:3
}

// Totales agregados
export interface TotalesRutas {
  totalRutas: number;
  totalClientes: number;
}

// Resultado final del servicio
export interface FindRutasAsignadasResult {
  rutas: RutaAsignada[];
  totales: TotalesRutas;
}
