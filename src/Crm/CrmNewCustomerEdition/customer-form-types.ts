/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";

// ========= Estado Cliente =========

export type EstadoClienteType = (value: EstadoCliente) => void;

// ========= Option Selected =========
export interface OptionSelected {
  value: number;
  label: string;
}

// ========= Tipos base del formulario =========
export interface FormData {
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
  estado: EstadoCliente;
  enviarRecordatorio: boolean;
  activateOnMk?: boolean;
}

export interface ContratoID {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

// ========= Interfaces de datos seguros =========
interface Departamentos {
  id: number;
  nombre: string;
}

interface Municipios {
  id: number;
  nombre: string;
}

interface Sector {
  id: number;
  nombre: string;
  descripcion: string | null;
  municipioId: number;
}

export interface ServiciosInternet {
  id: number;
  nombre: string;
  velocidad: string;
}

export interface MikrotikRoutersResponse {
  id: number;
  nombre: string;
  ip?: string;
  usuario?: string;
}

// ========= Handler Types =========
export type FormChangeHandler = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;
export type SelectHandler<T> = (option: T | null) => void;
export type MultiSelectHandler<T> = (options: readonly T[] | null) => void;

// ========= Props de secciones =========
export interface PersonalInfoSectionProps {
  formData: Pick<
    FormData,
    "nombre" | "apellidos" | "telefono" | "dpi" | "direccion"
  >;
  onChangeForm: FormChangeHandler;
}

export interface MkConfigSectionProps {
  mkSelected: number | null;
  mikrotiks: MikrotikRoutersResponse[];
  optionsMikrotiks: OptionSelected[];
  onSelectMk: SelectHandler<OptionSelected>;

  // formData: Pick<FormData, "ip" | "gateway" | "mascara" | "estado">;

  // onChangeForm: FormChangeHandler;
  // setOpenUpdNet: () => void;
  // setOpenAuth: () => void;
  // isInstalation: boolean;

  //  mkSelected,
  // mikrotiks,
  // optionsMikrotiks,
  // onSelectMk
}

export interface NetworkConfigSectionProps extends MkConfigSectionProps {
  formData: Pick<FormData, "ip" | "gateway" | "mascara" | "estado">;
  onChangeForm: FormChangeHandler;
  setOpenUpdNet: () => void;
  setOpenAuth: () => void;
  isInstalation: boolean;
  isCreation: boolean;
}

export interface ServiceInfoSectionProps {
  formData: Pick<FormData, "contrasenaWifi" | "ssidRouter">;
  serviceSelected: number[];
  serviceWifiSelected: number | null;
  optionsServices: OptionSelected[];
  optionsServicesWifi: OptionSelected[];
  secureServiciosWifi: ServiciosInternet[];
  onChangeForm: FormChangeHandler;
  onSelectService: MultiSelectHandler<OptionSelected>;
  onSelectServiceWifi: SelectHandler<OptionSelected>;
}

export interface LocationSectionProps {
  formData: Pick<
    FormData,
    "coordenadas" | "contactoReferenciaNombre" | "contactoReferenciaTelefono"
  >;
  depaSelected: number | null;
  muniSelected: number | null;
  sectorSelected: number | null;
  optionsDepartamentos: OptionSelected[];
  optionsMunis: OptionSelected[];
  optionsSectores: OptionSelected[];
  secureDepartamentos: Departamentos[];
  secureMunicipios: Municipios[];
  secureSectores: Sector[];
  onChangeForm: FormChangeHandler;
  onSelectDepartamento: SelectHandler<OptionSelected>;
  onSelectMunicipio: SelectHandler<OptionSelected>;
  onSelectSector: SelectHandler<OptionSelected>;
}

export interface StatusBillingSectionProps {
  formData: Pick<FormData, "estado" | "enviarRecordatorio">;
  fechaInstalacion: Date | null;
  zonasFacturacionSelected: number | null;
  optionsZonasFacturacion: OptionSelected[];
  secureZonasFacturacion: FacturacionZona[];
  onSelectEstadoCliente: (estado: EstadoCliente) => void;
  onEnviarRecordatorioChange: (checked: boolean) => void;
  onSelectZonaFacturacion: SelectHandler<OptionSelected>;
  onChangeFechaInstalacion: (date: Date | null) => void;
}

export interface ContractSectionProps {
  formDataContrato: ContratoID;
  onChangeContrato: FormChangeHandler;
  setFormDataContrato: Dispatch<SetStateAction<ContratoID>>;
}

export interface ObservationsSectionProps {
  observaciones: string;
  onChangeForm: FormChangeHandler;
}
