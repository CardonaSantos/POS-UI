export interface DashboardData {
  periodo: {
    desde: string;
    hasta: string;
    zonaHoraria: string;
  };

  clientes: {
    resumen: {
      totalEnSistema: number;
      carteraActual: number;
    };

    servicio: {
      activos: number;
      suspendidos: number;
      pendientesActivacion: number;
      enInstalacion: number;
      desinstalados: number;
    };

    cobranza: {
      alDia: number;
      pagoPendiente: number;
      atrasados: number;
      morosos: number;
    };
  };

  facturacion: {
    facturasEmitidasMes: number;
    facturasPagadasMes: number;

    montoFacturadoMes: number;
    montoCobradoMes: number;
    montoPendienteMes: number;
  };
}

// COBROS SIDE MENU
// Tipado para cada objeto dentro del array "rutasActiva"
export interface RutaActiva {
  nombreRuta: string;
  cobrador: string;
  totalClientes: number;
}

// Tipado para cada objeto dentro del array "morosoTop"
export interface ClienteMoroso {
  id: number;
  nombre: string;
  cantidad: number; // Representa meses de adeudo o cantidad de facturas pendientes
}

// Tipado de la respuesta completa del servidor
export interface DashboardCobrosResponse {
  rutasActiva: RutaActiva[];
  morosoTop: ClienteMoroso[];
}
