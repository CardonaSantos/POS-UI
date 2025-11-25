import { EstadoCliente } from "../cliente-interfaces/cliente-types";

export interface UpdateCustomerDto {
  id: number;
  nombre: string;
  apellidos: string;
  ip: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: Date | null;
  municipioId: number | null;
  departamentoId: number | null;
  sectorId: number | null;
  mikrotikRouterId: number | null;

  empresaId: number;
  coordenadas: string[];
  servicesIds: number[];
  servicioWifiId: number | null;
  zonaFacturacionId: number | null;
  gateway: string;
  mascara: string;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observacionesContrato: string;
  estado: EstadoCliente;
  enviarRecordatorio: boolean;
}
