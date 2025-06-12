export enum EstadoFactura {
  ANULADA = "ANULADA",
  PAGADA = "PAGADA",
  PENDIENTE = "PENDIENTE",
  PARCIAL = "PARCIAL",
  VENCIDA = "VENCIDA",
}

interface StatusStyle {
  className: string;
}

export const stateInvoice = (state: EstadoFactura): StatusStyle => {
  const baseClasses = "text-xs font-medium font-semibold";

  switch (state) {
    case EstadoFactura.ANULADA:
      return {
        className: `${baseClasses} text-neutral-500 dark:text-neutral-400`,
      };

    case EstadoFactura.PAGADA:
      return {
        className: `${baseClasses} text-emerald-600 dark:text-emerald-400`,
      };

    case EstadoFactura.PENDIENTE:
      return {
        className: `${baseClasses} text-amber-600 dark:text-amber-400`,
      };

    case EstadoFactura.PARCIAL:
      return {
        className: `${baseClasses} text-blue-600 dark:text-blue-400`,
      };

    case EstadoFactura.VENCIDA:
      return {
        className: `${baseClasses} text-rose-600 dark:text-rose-400`,
      };

    default:
      return {
        className: `${baseClasses} text-neutral-500 dark:text-neutral-400`,
      };
  }
};
