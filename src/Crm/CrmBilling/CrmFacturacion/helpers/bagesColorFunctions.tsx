import { estadoFacturaInternet } from "@/Crm/features/cliente-interfaces/cliente-types";
import { MetodoPagoFacturaInternet } from "@/Crm/features/factura-internet/factura-to-pay";
import {
  Building,
  CalendarCheck,
  CalendarX,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  FileText,
  Wallet,
  XCircle,
} from "lucide-react";

export function getMetodoPagoBadgeColor(metodo: string) {
  switch (metodo.toLowerCase()) {
    case "efectivo":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "tarjeta":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "transferencia":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

export const getEstadoBadgeColor = (estado: estadoFacturaInternet) => {
  switch (estado) {
    case estadoFacturaInternet.PAGADA:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case estadoFacturaInternet.PENDIENTE:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case estadoFacturaInternet.VENCIDA:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case estadoFacturaInternet.ANULADA:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    case estadoFacturaInternet.PARCIAL:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "";
  }
};

export const getEstadoIcon = (estado: estadoFacturaInternet) => {
  switch (estado) {
    case estadoFacturaInternet.PAGADA:
      return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
    case estadoFacturaInternet.PENDIENTE:
      return <Clock className="h-3.5 w-3.5 mr-1" />;
    case estadoFacturaInternet.VENCIDA:
      return <CalendarX className="h-3.5 w-3.5 mr-1" />;
    case estadoFacturaInternet.ANULADA:
      return <XCircle className="h-3.5 w-3.5 mr-1" />;
    case estadoFacturaInternet.PARCIAL:
      return <CalendarCheck className="h-3.5 w-3.5 mr-1" />;
    default:
      return null;
  }
};

export const getMetodoPagoIcon = (metodoPago: MetodoPagoFacturaInternet) => {
  switch (metodoPago) {
    case MetodoPagoFacturaInternet.EFECTIVO:
      return <Coins className="h-4 w-4 mr-1" />;
    case MetodoPagoFacturaInternet.DEPOSITO:
      return <Building className="h-4 w-4 mr-1" />;
    case MetodoPagoFacturaInternet.TARJETA:
      return <CreditCard className="h-4 w-4 mr-1" />;
    case MetodoPagoFacturaInternet.PAYPAL:
      return <FileText className="h-4 w-4 mr-1" />;
    default:
      return <Wallet className="h-4 w-4 mr-1" />;
  }
};
