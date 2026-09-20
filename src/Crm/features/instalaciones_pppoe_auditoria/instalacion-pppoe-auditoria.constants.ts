import type {
  AccionAuditoriaPppoe,
  EstadoOperacionPppoe,
  OrigenOperacionPppoe,
  TipoOperacionPppoe,
} from "./instalacion-pppoe-auditoria.interfaces";

export const TIPO_OPERACION_OPTIONS: Array<{
  value: TipoOperacionPppoe;
  label: string;
}> = [
  { value: "CREAR_SECRET", label: "Crear secret" },
  { value: "ACTIVAR_SECRET", label: "Activar secret" },
  { value: "SUSPENDER_SERVICIO", label: "Suspender servicio" },
  { value: "ELIMINAR_SECRET", label: "Eliminar secret" },
];

export const ESTADO_OPERACION_OPTIONS: Array<{
  value: EstadoOperacionPppoe;
  label: string;
}> = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "AUTORIZADA", label: "Autorizada" },
  { value: "EJECUTANDO", label: "Ejecutando" },
  { value: "EXITOSA", label: "Exitosa" },
  { value: "PARCIAL", label: "Parcial" },
  { value: "FALLIDA", label: "Fallida" },
  { value: "CANCELADA", label: "Cancelada" },
];

export const ORIGEN_OPERACION_OPTIONS: Array<{
  value: OrigenOperacionPppoe;
  label: string;
}> = [
  { value: "OPERADOR", label: "Operador" },
  { value: "SISTEMA", label: "Sistema" },
  { value: "COBRANZA_AUTOMATICA", label: "Cobranza automática" },
];

export const ACCION_AUDITORIA_OPTIONS: Array<{
  value: AccionAuditoriaPppoe;
  label: string;
}> = [
  { value: "PERFIL_HOMOLOGADO", label: "Perfil homologado" },
  { value: "PERFIL_ACTUALIZADO", label: "Perfil actualizado" },
  { value: "PERFIL_ACTIVADO", label: "Perfil activado" },
  { value: "PERFIL_DESACTIVADO", label: "Perfil desactivado" },
  { value: "PREALTA_CREADA", label: "Prealta creada" },
  { value: "CONTRASENA_GENERADA", label: "Contraseña generada" },
  { value: "CREACION_AUTORIZADA", label: "Creación autorizada" },
  { value: "SECRET_CREADO", label: "Secret creado" },
  // { value: "SECRET_HABILITADO", label: "Secret habilitado" },
  { value: "SERVICIO_ACTIVADO", label: "Servicio activado" },
  // { value: "SERVICIO_REACTIVADO", label: "Servicio reactivado" },
  // { value: "SECRET_DESHABILITADO", label: "Secret deshabilitado" },
  { value: "SERVICIO_SUSPENDIDO", label: "Servicio suspendido" },
  { value: "SESION_ACTIVA_REMOVIDA", label: "Sesión activa removida" },
  {
    value: "DESINSTALACION_AUTORIZADA",
    label: "Desinstalación autorizada",
  },
  // {
  //   value: "DESINSTALACION_RECHAZADA",
  //   label: "Desinstalación rechazada",
  // },
  { value: "SECRET_ELIMINADO", label: "Secret eliminado" },
  // { value: "REAUTENTICACION_EXITOSA", label: "Reautenticación exitosa" },
  { value: "REAUTENTICACION_FALLIDA", label: "Reautenticación fallida" },
  { value: "OPERACION_CREADA", label: "Operación creada" },
  { value: "OPERACION_INICIADA", label: "Operación iniciada" },
  { value: "OPERACION_REINTENTADA", label: "Operación reintentada" },
  { value: "OPERACION_RECUPERADA", label: "Operación recuperada" },
  { value: "OPERACION_EXITOSA", label: "Operación exitosa" },
  { value: "OPERACION_FALLIDA", label: "Operación fallida" },
  { value: "OPERACION_PARCIAL", label: "Operación parcial" },
  { value: "OPERACION_CANCELADA", label: "Operación cancelada" },
  // { value: "SINCRONIZACION_EXITOSA", label: "Sincronización exitosa" },
  // { value: "SINCRONIZACION_FALLIDA", label: "Sincronización fallida" },
  // {
  //   value: "DESINCRONIZACION_DETECTADA",
  //   label: "Desincronización detectada",
  // },
  { value: "HOJA_VISUALIZADA", label: "Hoja visualizada" },
  { value: "HOJA_GENERADA", label: "Hoja generada" },
];

export const ORDEN_OPTIONS: Array<{
  value: "asc" | "desc";
  label: string;
}> = [
  { value: "desc", label: "Más reciente primero" },
  { value: "asc", label: "Más antiguo primero" },
];

export const PAGE_SIZE_OPTIONS: Array<{
  value: number;
  label: string;
}> = [
  { value: 5, label: "5 por página" },
  { value: 10, label: "10 por página" },
  { value: 20, label: "20 por página" },
  { value: 50, label: "50 por página" },
];
