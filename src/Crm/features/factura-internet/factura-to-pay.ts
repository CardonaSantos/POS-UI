import { RolUsuario } from "@/Crm/CrmProfile/interfacesProfile";
import {
  EstadoCliente,
  estadoFacturaInternet,
  FacturaInternet,
} from "../cliente-interfaces/cliente-types";

export interface FacturaInternetToPay {
  id: number;
  creador: Creador;
  fechaPagoEsperada: string;
  fechaPagada: string;
  montoPago: number;
  saldoPendiente: number;
  empresaId: number;
  empresa: Empresa;
  metodoPago: MetodoPagoFacturaInternet;
  clienteId: number;
  cliente: ClienteInternet;
  estadoFacturaInternet: estadoFacturaInternet;
  pagos: PagoFacturaInternet[];
  creadoEn: string;
  actualizadoEn: string;
  nombreClienteFactura?: string;
  detalleFactura?: string;
  facturacionZonaId?: number;
  facturacionZona?: FacturacionZona;
  RecordatorioPago: RecordatorioPago[];
  facturasPendientes: FacturaInternet[];
}

export enum MetodoPagoFacturaInternet {
  EFECTIVO = "EFECTIVO",
  DEPOSITO = "DEPOSITO",
  TARJETA = "TARJETA",
  OTRO = "OTRO",
  PENDIENTE = "PENDIENTE",
  PAYPAL = "PAYPAL",
}

interface ClienteInternet {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  dpi?: string;
  estadoCliente: EstadoCliente;
  servicioInternet?: ServicioInternet;
  facturacionZona?: FacturacionZona;
  empresa?: Empresa;
}

interface RecordatorioPago {
  id: number;
  fechaEnvio: string;
  medioEnvio: string;
}

interface PagoFacturaInternet {
  id: number;
  facturaInternetId: number;
  clienteId: number;
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  fechaPago: string;
  cobradorId: number;
  cobrador: Cobrador;
  creadoEn: string;
}

// Interfaces
interface Empresa {
  id: number;
  nombre: string;
}

interface FacturacionZona {
  id: number;
  nombre: string;
}

interface ServicioInternet {
  id: number;
  nombre: string;
  velocidad?: string;
  precio: number;
}

interface Cobrador {
  id: number;
  nombre: string;
  rol: RolUsuario;
}

interface Creador extends Cobrador {}
