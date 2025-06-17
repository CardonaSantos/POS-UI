export interface ClienteDetailsDto {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  estadoCliente: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: string; // ISO string
  asesor: Asesor | null;
  servicio: Servicio | null; // Relación 1:1, solo un servicio
  municipio: Municipio;
  sector: Sector;
  departamento: Departamento;
  empresa: Empresa;
  IP: IP;
  ubicacion: Ubicacion;
  saldoCliente: SaldoCliente | null;
  creadoEn: string; // ISO string
  actualizadoEn: string; // ISO string
  ticketSoporte: TicketSoporte[];
  facturaInternet: FacturaInternet[];
  clienteServicio: ClienteServicio[];
  contratoServicioInternet: ContratoServicioInternet | null;
}

interface ContratoServicioInternet {
  id: number;
  creadoEn: string; // ISO string
  actualizadoEn: string; // ISO string
  costoInstalacion: number;
  fechaInstalacionProgramada: string; // ISO string
  fechaPago: string; // ISO string
  ssid: string;
  wifiPassword: string;
}

interface Sector {
  id: number;
  nombre: string;
}

interface Asesor {
  id: number;
  nombre: string;
}

interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  velocidad: string;
}

interface Municipio {
  id: number;
  nombre: string;
}

interface Departamento {
  id: number;
  nombre: string;
}

interface Empresa {
  id: number;
  nombre: string;
}

interface IP {
  id: number;
  direccion: string;
  mascara: string;
  gateway: string;
}

interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

interface SaldoCliente {
  id: number;
  saldo: number;
  saldoPendiente: number;
  totalPagos: number;
  ultimoPago: string; // ISO string
}

interface TicketSoporte {
  id: number;
  titulo: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string; // ISO string
  fechaCierre: string | null; // ISO string or null
}

export interface FacturaInternet {
  id: number;
  monto: number;
  fechaEmision: string; // ISO string
  fechaVencimiento: string; // ISO string
  pagada: boolean;
  estado: string;
  pagos: Pagos[];
  creador: CreadorFactura;
}

interface CreadorFactura {
  id: number;
  nombre: string;
  rol: UsersRol;
}

enum UsersRol {
  TECNICO = "TECNICO",
  OFICINA = "OFICINA",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  COBRADOR = "COBRADOR",
}

interface Cobrador {
  id: number;
  nombreCobrador: string;
  rol: UsersRol;
}

interface Pagos {
  fechaPago: string;
  metodoPago: string;
  montoPagado: number;
  cobrador: Cobrador;
}

interface ClienteServicio {
  id: number;
  servicio: Servicio;
  fechaContratacion: string; // ISO string
}
