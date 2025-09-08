// Enums
export enum EstadoRuta {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
  COMPLETADO = "COMPLETADO",
  PENDIENTE = "PENDIENTE",
  CERRADO = "CERRADO",
}

export enum EstadoCliente {
  ACTIVO = "ACTIVO", // pago al día
  PENDIENTE_ACTIVO = "PENDIENTE_ACTIVO", // TIENE UN RECIBO PENDIENTE
  PAGO_PENDIENTE = "PAGO_PENDIENTE", // tiene un pago pendiente vencido
  MOROSO = "MOROSO", // más de ciertos pagos, 3 MESES SIN PAGAR Y CORTADO
  ATRASADO = "ATRASADO", // DOS FACTURAS
  SUSPENDIDO = "SUSPENDIDO", // servicio cortado
  DESINSTALADO = "DESINSTALADO", // desinstalado
  EN_INSTALACION = "EN_INSTALACION", // en instalación
}

// Interfaces
export interface Empresa {
  id: number;
  nombre: string;
}

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
  direccion?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  rol: string;
}

export interface ClienteInternetFromCreateRuta {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  telefonoReferencia?: string;
  direccion?: string;
  dpi?: string;
  estadoCliente: EstadoCliente;
  empresaId?: number;
  empresa?: Empresa;
  ubicacion?: Ubicacion;
  saldoPendiente?: number;
  facturasPendientes?: number;
  facturacionZona: number;
  zonaFacturacion: string;

  municipio: Municipio;
  sector: SectorCliente;
  facturas?: { id: number; montoFactura: number; fechaPagoEsperada: string }[]; // 👈
}

export interface ClienteInternetFromRuta
  extends ClienteInternetFromCreateRuta {}

interface Municipio {
  id: number;
  nombre: string;
}

interface SectorCliente {
  id: number;
  nombre: string;
}

export interface Ruta {
  id: number;
  nombreRuta: string;
  cobradorId?: number;
  cobrador?: Usuario;
  empresaId: number;
  empresa: Empresa;
  clientes: ClienteInternetFromCreateRuta[];
  cobrados: number;
  estadoRuta: EstadoRuta;
  fechaCreacion: string;
  fechaActualizacion: string;
  observaciones?: string;
  diasCobro?: string[];
  //

  totalACobrar: number;
  totalCobrado: number;
}

export interface CreateRutaDto {
  nombreRuta: string;
  cobradorId?: string | null;
  EmpresaId: number;
  facturasIds: string[]; // 👈 ahora mandamos facturas, no clientes
  observaciones?: string;
  clientesIds: [];
}

export interface OptionSelected {
  value: string;
  label: string;
}

export interface Sector {
  id: true;
  nombre: true;
  clientes: number;
  clientesCount: number;
}

export interface FacturacionZona {
  id: number;
  creadoEn: string;
  actualizadoEn: string;
  nombreRuta: string;
  diaPago: number;
  diaGeneracionFactura: number;
  diaCorte: number;
  facturas: number;
  clientes: number;
}
