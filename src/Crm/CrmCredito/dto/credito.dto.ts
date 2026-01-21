import {
  FrecuenciaPago,
  InteresTipo,
  OrigenCredito,
} from "@/Crm/features/credito/credito-interfaces";

export interface CreditoDTO {
  clienteId: number;

  montoCapital: string;
  interesPorcentaje: string;
  interesTipo: InteresTipo;

  plazoCuotas: number;
  frecuencia: FrecuenciaPago;
  intervaloDias: number;
  fechaInicio: Date;

  creadoPorId: number;

  // NUEVO
  tipoGeneracionCuotas: "AUTOMATICA" | "CUSTOM";

  // OPCIONAL
  engancheMonto?: string;
  engancheFecha?: Date;

  // SOLO SI ES CUSTOM
  cuotasCustom?: {
    numeroCuota: number;
    fechaVencimiento: Date;
    montoCapital: string;
    montoInteres: string;
  }[];

  origenCredito?: OrigenCredito;
  observaciones?: string;
}
