// utils/getEstadoIconRutaList.tsx
import { EstadoRuta } from "@/Crm/features/rutas/rutas.interfaces";
import { CheckCircle, Clock, Check, XCircle } from "lucide-react";
import type { JSX } from "react";

export function getEstadoIconRutaList(estado: EstadoRuta): JSX.Element | null {
  switch (estado) {
    case EstadoRuta.ACTIVO:
      return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
    case EstadoRuta.PENDIENTE:
      return <Clock className="h-3.5 w-3.5 mr-1" />;
    case EstadoRuta.COMPLETADO:
      return <Check className="h-3.5 w-3.5 mr-1" />;
    case EstadoRuta.INACTIVO:
    case EstadoRuta.CERRADO:
      return <XCircle className="h-3.5 w-3.5 mr-1" />;
    default:
      return null;
  }
}
