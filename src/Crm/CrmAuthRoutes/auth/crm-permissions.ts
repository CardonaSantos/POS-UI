export const CRM_PERMISSION = {
  // Dashboard
  DASHBOARD_VER: "dashboard.ver",
  DASHBOARD_TECNICO_VER: "dashboard.tecnico.ver",

  // Clientes
  CLIENTES_VER: "clientes.ver",
  CLIENTES_CREAR: "clientes.crear",
  CLIENTES_EDITAR: "clientes.editar",

  // Instalaciones
  INSTALACIONES_VER: "instalaciones.ver",
  INSTALACIONES_CREAR: "instalaciones.crear",
  INSTALACIONES_EDITAR: "instalaciones.editar",
  INSTALACIONES_TECNICO_VER: "instalaciones.tecnico.ver",

  // PPPoE
  PPPOE_HOMOLOGACIONES_VER: "pppoe.homologaciones.ver",

  // Soporte
  TICKETS_VER: "tickets.ver",
  TICKETS_TECNICO_GESTIONAR: "tickets.tecnico.gestionar",
  SOPORTE_METAS_VER: "soporte.metas.ver",
  SOPORTE_CATEGORIAS_VER: "soporte.categorias.ver",

  // Desinstalaciones
  DESINSTALACIONES_VER: "desinstalaciones.ver",
  DESINSTALACIONES_CREAR: "desinstalaciones.crear",
  DESINSTALACIONES_AUTORIZAR: "desinstalaciones.autorizar",

  // Servicios
  SERVICIOS_VER: "servicios.ver",

  // Facturación / zonas
  FACTURACION_ZONA_VER: "facturacion-zona.ver",
  PAGOS_GESTIONAR: "pagos.gestionar",
  SECTORES_VER: "sectores.ver",

  // WhatsApp
  BOT_VER: "bot.ver",
  WHATSAPP_VER: "whatsapp.ver",
  WHATSAPP_GALERIA_VER: "whatsapp.galeria.ver",
  WHATSAPP_PLANTILLAS_VER: "whatsapp.plantillas.ver",
  WHATSAPP_CAMPANAS_VER: "whatsapp.campanas.ver",

  // Contratos
  PLANTILLAS_CONTRATO_VER: "plantillas-contrato.ver",

  // Cobros
  RUTAS_COBRO_VER: "rutas-cobro.ver",
  RUTAS_ASIGNADAS_VER: "rutas-asignadas.ver",

  // Red
  OPTICO_VER: "optico.ver",

  // Créditos
  CREDITOS_VER: "creditos.ver",
  CREDITOS_CREAR: "creditos.crear",

  // Eliminados
  REGISTROS_ELIMINADOS_VER: "registros-eliminados.ver",

  // Reportes
  REPORTES_VER: "reportes.ver",

  // Empresa
  EMPRESA_VER: "empresa.ver",

  // Perfil
  PERFIL_VER: "perfil.ver",

  // Usuarios
  USUARIOS_VER: "usuarios.ver",
  USUARIOS_CREAR: "usuarios.crear",

  // Desarrollo / diagnóstico
  PRUEBAS_VER: "pruebas.ver",

  //   nuevos

  // PPPoE / infraestructura sensible
  PPPOE_AUDITORIA_VER: "pppoe.auditoria.ver",

  PPPOE_OPERACIONES_VER: "pppoe.operaciones.ver",

  PPPOE_OPERACIONES_REINTENTAR: "pppoe.operaciones.reintentar",

  PPPOE_DIAGNOSTICO_SENSIBLE_VER: "pppoe.diagnostico-sensible.ver",

  PPPOE_CREDENCIALES_REVELAR: "pppoe.credenciales.revelar",

  // PPPoE / administración

  PPPOE_ACTIVAR_INICIAL: "pppoe.activar-inicial",

  PPPOE_ADMINISTRACION_VER: "pppoe.administracion.ver",

  PPPOE_PREALTA_REINTENTAR: "pppoe.prealta.reintentar",

  PPPOE_SUSPENDER: "pppoe.suspender",

  PPPOE_REACTIVAR: "pppoe.reactivar",
} as const;

export type CrmPermission =
  (typeof CRM_PERMISSION)[keyof typeof CRM_PERMISSION];
