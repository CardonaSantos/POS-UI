import {
  ClienteDetailsDto,
  EstadoCliente,
  EstadoCobranzaCliente,
  EstadoServicioMikrotik,
} from "@/Crm/features/cliente-interfaces/cliente-types";

export const clienteInitialState: ClienteDetailsDto = {
  id: 0,
  nombre: "",
  apellidos: "",
  telefono: null,
  direccion: null,
  dpi: null,
  observaciones: null,
  contactoReferenciaNombre: null,
  contactoReferenciaTelefono: null,

  estadoCliente: EstadoCliente.PENDIENTE_ACTIVO,
  estadoCobranza: EstadoCobranzaCliente.AL_DIA,

  estadoServicioMikrotik: EstadoServicioMikrotik.SIN_MIKROTIK,
  servicioEstado: false,

  contrasenaWifi: null,
  ssidRouter: null,
  fechaInstalacion: null,

  imagenes: [],

  asesor: null,
  servicio: null,
  municipio: null,
  departamento: null,
  sector: null,
  empresa: null,

  IP: null,
  ubicacion: null,
  mikrotik: null,

  // Importante: mejor null que objeto incompleto.
  facturacionZona: null,

  contratoServicioInternet: null,
  saldoCliente: null,

  creadoEn: "",
  actualizadoEn: "",

  ticketSoporte: [],
  facturaInternet: [],
  clienteServicio: [],
};
