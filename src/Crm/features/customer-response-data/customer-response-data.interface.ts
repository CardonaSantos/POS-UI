import { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";
import {
  EstadoCliente,
  Sector,
  Servicio,
  ServiciosInternet,
} from "../cliente-interfaces/cliente-types";
import {
  Departamentos,
  Municipios,
} from "../locations-interfaces/municipios_departamentos.interfaces";
import { CustomerImage } from "../customer-galery/customer-galery.interfaces";
import { MikroTikCustomerResponse } from "../mikro-tiks/mikrotiks.interfaces";

export interface CustomerDataResponse {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  coordenadas: string[];
  ip: string;
  gateway: string;
  mascara: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: string;
  enviarRecordatorio: boolean;
  estado: EstadoCliente;
  departamento: Departamentos;
  municipio: Municipios;
  sector: Sector;
  mikrotik: MikroTikCustomerResponse;
  servicios: Servicio[];
  servicioWifi: ServiciosInternet;
  zonaFacturacion: FacturacionZona;
  imagenes: CustomerImage[];
  contrato?: {
    idContrato: string;
    fechaFirma: string;
    archivoContrato: string;
    observaciones: string;
  };
}
