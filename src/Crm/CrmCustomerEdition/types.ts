// Tipos para la aplicación

import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import { ServiciosInternet } from "../features/cliente-interfaces/cliente-types";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";

// Servicios
export interface Servicios {
  id: number;
  nombre: string;
}
// Contrato
export interface ContratoID {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

// Datos del Cliente
export interface CustomerData {
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
  departamento: Departamentos;
  municipio: Municipios;
  servicios: Servicios[];
  servicioWifi: ServiciosInternet;
  zonaFacturacion: FacturacionZona;
  contrato?: {
    idContrato: string;
    fechaFirma: string;
    archivoContrato: string;
    observaciones: string;
  };
}

// Datos del formulario
export interface FormData {
  // Datos básicos
  nombre: string;
  coordenadas: string;
  ip: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;

  // Datos del servicio
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: Date | null;
  asesorId: string | null;
  servicioId: string | null;
  municipioId: string | null;
  departamentoId: string | null;
  empresaId: string;

  mascara: string;
  gateway: string;
}
