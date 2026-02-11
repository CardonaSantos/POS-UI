import { ServicioInternet } from "../CrmServices/CrmServiciosWifi/servicio-internet.types";
import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
import { ClasificacionCliente } from "../features/credito/credito-interfaces";

export interface ClienteTableDto {
  id: number;
  nombreCompleto: string;
  estado: EstadoCliente;
  telefono: string;
  dpi: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: Date;
  departamento: string;
  municipio: string;
  municipioId: number;
  departamentoId: number;
  direccionIp: string;
  servicios: ServicioInternet[];
  facturacionZona: string;
  facturacionZonaId: number;
  sector: Sector;
  sectorId: number;
  clasificacionCredito: ClasificacionCliente;
}

interface Sector {
  id: number;
  nombre: string;
  clientesCount: number;
}
