import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import type {
  FacturaInternet,
  estadoFacturaInternet,
} from "@/Crm/features/cliente-interfaces/cliente-types";

dayjs.extend(utc);
dayjs.locale("es");

export interface FacturaToDelete {
  id: number;
  estado: string;
  fechaEmision: string;
  fechaVencimiento: string;
}

export interface BillingHistoryRow {
  id: number;
  fecha: string;
  fechaPagada: string | Date;
  fechaEmision: string;
  fechaVencimiento: string;
  periodo: string | null;
  referencia: string;
  detalle: string;
  estado: estadoFacturaInternet;
  tipoPago: string;
  canal: {
    creador: string;
    cobrador: string;
  };
  cobro: number;
  pago: number;
  saldo: number;
}

type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export function safeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function formatBillingMoney(value: unknown) {
  return formattMonedaGT(safeNumber(value));
}

export function formatBillingDate(value?: string | Date | null) {
  if (!value) return "N/A";

  const parsed = dayjs(value);

  if (!parsed.isValid()) return "Fecha inválida";

  return parsed.format("DD/MM/YYYY");
}

export function formatBillingPeriod(value?: string | null) {
  if (!value) return "N/A";

  if (/^\d{6}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);

    return `${month}/${year}`;
  }

  return value;
}

export function formatFacturaDetalle(fechaVencimiento?: string | null) {
  if (!fechaVencimiento) return "FACTURA SIN PERIODO";

  const parsed = dayjs.utc(fechaVencimiento);

  if (!parsed.isValid()) return "FACTURA SIN PERIODO";

  return `FACTURA ${parsed.locale("es").format("MMMM YYYY").toUpperCase()}`;
}

export function getFacturaEstadoTone(
  estado?: estadoFacturaInternet | string | null,
): BadgeTone {
  switch (estado) {
    case "PAGADA":
      return "success";

    case "VENCIDA":
      return "danger";

    case "PARCIAL":
      return "warning";

    case "PENDIENTE":
      return "info";

    case "ANULADA":
      return "neutral";

    default:
      return "neutral";
  }
}

export function FacturaEstadoBadge({
  estado,
}: {
  estado?: estadoFacturaInternet | string | null;
}) {
  return (
    <AppBadge
      tone={getFacturaEstadoTone(estado)}
      appearance="soft"
      size="xs"
      radius="md"
    >
      {estado ?? "N/A"}
    </AppBadge>
  );
}

export function buildBillingHistoryRows(
  facturas: FacturaInternet[] | null | undefined,
): BillingHistoryRow[] {
  const sorted = safeArray(facturas)
    .slice()
    .sort((a, b) => {
      const aDate = new Date(a.fechaVencimiento ?? a.fechaEmision).getTime();
      const bDate = new Date(b.fechaVencimiento ?? b.fechaEmision).getTime();

      return aDate - bDate;
    });

  let saldoAcumulado = 0;

  return sorted.map((factura) => {
    const pagos = safeArray(factura.pagos);

    const pagoTotal = pagos.reduce(
      (total, pago) => total + safeNumber(pago.montoPagado),
      0,
    );

    const cobro = safeNumber(factura.monto);

    saldoAcumulado = saldoAcumulado + cobro - pagoTotal;

    const cobradores = pagos
      .map((pago) => pago.cobrador?.nombreCobrador)
      .filter(Boolean)
      .join(", ");

    const metodosPago = pagos
      .map((pago) => pago.metodoPago)
      .filter(Boolean)
      .join(", ");

    return {
      id: factura.id,
      fecha: factura.fechaEmision,
      fechaPagada: factura.fechaPagada ?? null,
      fechaEmision: factura.fechaEmision,
      fechaVencimiento: factura.fechaVencimiento,
      periodo: factura.periodo ?? null,
      referencia: String(factura.id),
      detalle: formatFacturaDetalle(factura.fechaVencimiento),
      estado: factura.estado,
      tipoPago: metodosPago || "N/A",
      canal: {
        creador: factura.creador?.nombre ?? "SISTEMA AUTO",
        cobrador: cobradores || "Sin registrar",
      },
      cobro,
      pago: pagoTotal,
      saldo: saldoAcumulado,
    };
  });
}
