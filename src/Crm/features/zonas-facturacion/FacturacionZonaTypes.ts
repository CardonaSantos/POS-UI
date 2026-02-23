export interface FacturacionZona {
  id: number;
  nombre: string;
  empresaId: number;

  // Configuración de generación y recordatorios
  diaGeneracionFactura: number;
  enviarRecordatorioGeneracion: boolean;

  diaPago: number;
  enviarAvisoPago: boolean;

  diaRecordatorio: number;
  enviarRecordatorio1: boolean;

  diaSegundoRecordatorio: number;
  enviarRecordatorio2: boolean;

  horaRecordatorio: string;
  enviarRecordatorio: boolean;

  // Corte y suspensión
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;

  // Timestamps
  creadoEn: string;
  actualizadoEn: string;

  // Relaciones y contadores
  clientesCount?: number;
  facturasCount?: number;

  nombreRuta: string;

  facturas: number;
  clientes: number;
}

export interface NuevaFacturacionZona {
  nombre: string;
  empresaId: number;

  // Configuración de generación y recordatorios
  diaGeneracionFactura: number;
  enviarRecordatorioGeneracion: boolean;

  diaPago: number;
  enviarAvisoPago: boolean;

  diaRecordatorio: number;
  enviarRecordatorio1: boolean;

  diaSegundoRecordatorio: number;
  enviarRecordatorio2: boolean;

  horaRecordatorio: string;
  enviarRecordatorio: boolean;

  // Corte y suspensión
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;
  // timestamps
  creadoEn: string;
  actualizadoEn: string;

  // Notificaciones
  whatsapp?: boolean;
  email?: boolean;
  sms?: boolean;
  llamada?: boolean;
  telegram?: boolean;
}
