export interface DashboardData {
  clientes: {
    totalEnSistema: number; // antes: enSistema
    activos: number; // antes: alDia
    suspendidos: number;
    desinstalados: number;
    pendientesActivacion: number; // antes: pendienteActivo
    morosos: number;
  };
  facturacion: {
    facturasEmitidasMes: number; // antes: fEmitidasMes
    facturasPagadasMes: number; // antes: fPagadasMes
    montoFacturadoMes: number; // antes: fTotalGeneradas
    montoCobradoMes: number; // antes: fTotalPagadas
    montoPendienteMes: number; // antes: fGeneradasSinPagar
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
