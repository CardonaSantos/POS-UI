import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

export const clienteInitialState: ClienteDetailsDto = {
  id: 0,
  nombre: "",
  apellidos: "",
  telefono: "",
  direccion: "",
  dpi: "",
  observaciones: "",
  contactoReferenciaNombre: "",
  contactoReferenciaTelefono: "",
  estadoCliente: "",
  contrasenaWifi: "",
  ssidRouter: "",
  fechaInstalacion: "",

  // Relaciones requeridas con valores "placeholder" seguros
  sector: {
    id: 0,
    nombre: "",
    actualizadoEn: "",
    creadoEn: "",
    descripcion: "",
    municipioId: 0,
    clientes: [],
    municipio: {
      id: 0,
      nombre: "",
    },
  },
  municipio: { id: 0, nombre: "" },
  departamento: { id: 0, nombre: "" },

  empresa: {
    id: 0,
    nombre: "",
    direccion: "",
    correo: "",
    pbx: "",
    sitioWeb: "",
    telefono: "",
    nit: "",
  },

  IP: {
    id: 0,
    direccion: "192.168.100.1", // como tenías
    mascara: "",
    gateway: "",
  },

  ubicacion: {
    id: 0,
    latitud: 15.667147636975496,
    longitud: -91.71722598563508,
  },

  // Relaciones opcionales / listas vacías
  asesor: null,
  servicio: null,
  saldoCliente: null,
  ticketSoporte: [],
  facturaInternet: [],
  clienteServicio: [],
  contratoServicioInternet: null,

  creadoEn: "",
  actualizadoEn: "",
  imagenes: [],
};
