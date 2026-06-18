import type { VisibilityState } from "@tanstack/react-table";

import {
  EstadoCliente,
  EstadoCobranzaCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";

// export type AppOption<TValue extends string | number = string> = {
//   value: TValue;
//   label: string;
// };

export const RUTAS_PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200];

export const INITIAL_RUTAS_COLUMN_VISIBILITY: VisibilityState = {
  direccion: false,
  municipio: false,
};

export const ESTADO_CLIENTE_RUTA_OPTIONS: AppOption[] = [
  { value: "TODOS", label: "Todos" },
  { value: EstadoCliente.ACTIVO, label: "Activos" },
  { value: EstadoCliente.ATRASADO, label: "Atrasados" },
  { value: EstadoCliente.MOROSO, label: "Morosos" },
  { value: EstadoCliente.PAGO_PENDIENTE, label: "Pago pendiente" },
  { value: EstadoCliente.PENDIENTE_ACTIVO, label: "Pendiente activo" },
  { value: EstadoCliente.SUSPENDIDO, label: "Suspendidos" },
];

export const ESTADO_COBRANZA_RUTA_OPTIONS: AppOption[] = [
  { value: "TODOS", label: "Todos" },
  { value: EstadoCobranzaCliente.AL_DIA, label: "Al día" },
  { value: EstadoCobranzaCliente.PAGO_PENDIENTE, label: "Pago pendiente" },
  { value: EstadoCobranzaCliente.ATRASADO, label: "Atrasados" },
  { value: EstadoCobranzaCliente.MOROSO, label: "Morosos" },
];

export const RUTAS_SORT_OPTIONS: AppOption[] = [
  { value: "nombre-asc", label: "Nombre ascendente" },
  { value: "nombre-desc", label: "Nombre descendente" },
  { value: "saldo-asc", label: "Saldo ascendente" },
  { value: "saldo-desc", label: "Saldo descendente" },
  { value: "facturas-asc", label: "Facturas ascendente" },
  { value: "facturas-desc", label: "Facturas descendente" },
];
