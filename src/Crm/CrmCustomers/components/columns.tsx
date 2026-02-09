import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { ClasificacionCliente } from "@/Crm/features/credito/credito-interfaces";
import { ClienteTableDto } from "../CustomerTable";
import { ServicioInternet } from "@/Crm/CrmServices/CrmServiciosWifi/servicio-internet.types";

const getEstadoColor = (estado: string) => {
  const map: Record<string, string> = {
    ACTIVO: "text-green-700  border-green-200 uppercase text-sm",
    MOROSO: "text-red-700 border-red-200 uppercase text-sm",
    SUSPENDIDO: "text-gray-600 border-gray-200 uppercase text-sm",
    PENDIENTE_ACTIVO: "text-yellow-700 border-yellow-200",
    ATRASADO: "text-orange-700  border-orange-200 uppercase text-sm",
    PAGO_PENDIENTE: " text-blue-700 border-blue-200 uppercase text-sm",
    DESINSTALADO: " text-gray-500 border-gray-300 uppercase text-sm",
    EN_INSTALACION: "text-purple-700 border-purple-200 uppercase text-sm",
  };
  return map[estado] || "text-gray-600 border-gray-200 uppercase text-sm";
};

const getEstadoColorClasificacion = (estado: ClasificacionCliente) => {
  const map: Record<ClasificacionCliente, string> = {
    CONFIABLE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    NO_APROBABLE: "bg-red-50 text-red-700 border border-red-200",
    RIESGO_ALTO: "bg-orange-50 text-orange-700 border border-orange-200",
    RIESGO_MEDIO: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  };
  return map[estado] || "bg-gray-50 text-gray-600 border border-gray-200";
};

export const clienteTableColumns: ColumnDef<ClienteTableDto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-gray-500 dark:text-white">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "nombreCompleto",
    header: "Cliente",
    cell: ({ row }) => (
      <Link
        to={`/crm/cliente/${row.original.id}/?tab=resumen`}
        className="text-sm font-medium hover:underline truncate block max-w-[180px] dark:text-white"
        title={row.original.nombreCompleto}
      >
        {row.original.nombreCompleto}
      </Link>
    ),
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700 dark:text-white">
        {row.original.telefono}
      </span>
    ),
  },
  {
    accessorKey: "direccionIp",
    header: "IP",
    cell: ({ row }) => (
      <span className="text-sm font-mono text-gray-600 dark:text-white">
        {row.original.direccionIp || (
          <span className="text-gray-400 italic">Sin IP</span>
        )}
      </span>
    ),
  },
  {
    id: "servicios",
    header: "Servicio",
    accessorFn: (row) => row.servicios?.[0],
    cell: ({ getValue }) => {
      const servicio = getValue<ServicioInternet>();

      if (!servicio) {
        return (
          <span className="text-xs text-gray-400 italic dark:text-white">
            Sin servicio
          </span>
        );
      }

      return (
        <span
          className="text-sm font-medium text-gray-700 truncate block max-w-[120px] dark:text-white"
          title={servicio.nombre}
        >
          {servicio.nombre}
        </span>
      );
    },
  },
  {
    accessorKey: "facturacionZona",
    header: "Zona Fac.",
    cell: ({ row }) => (
      <span
        className="text-sm text-gray-600 truncate block max-w-[100px] dark:text-white"
        title={row.original.facturacionZona}
      >
        {row.original.facturacionZona}
      </span>
    ),
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
    cell: ({ row }) => (
      <span
        className="text-sm text-gray-600 truncate block max-w-[200px] dark:text-white"
        title={row.original.direccion}
      >
        {row.original.direccion}
      </span>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => {
      const estadoRaw = getValue<string>();

      const mapTexto: Record<string, string> = {
        ACTIVO: "Activo",
        PENDIENTE_ACTIVO: "Pendiente",
        PAGO_PENDIENTE: "Pago Pend.",
        MOROSO: "Moroso",
        ATRASADO: "Atrasado",
        SUSPENDIDO: "Suspendido",
        DESINSTALADO: "Desinstalado",
        EN_INSTALACION: "Instalando",
      };

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium  ${getEstadoColor(estadoRaw)}`}
        >
          {mapTexto[estadoRaw] || estadoRaw}
        </span>
      );
    },
  },
  {
    id: "sector",
    header: "Sector",
    accessorFn: (row) => row.sector?.nombre ?? "Sin sector",
    cell: ({ row }) => (
      <span
        className="text-sm text-gray-600 truncate block max-w-[120px]"
        title={row.original.sector?.nombre}
      >
        {row.original.sector?.nombre ?? "Sin sector"}
      </span>
    ),
  },
  {
    accessorKey: "clasificacionCredito",
    header: "Crédito",
    cell: ({ row }) => {
      const clasificacion = row.original.clasificacionCredito;
      if (!clasificacion)
        return <span className="text-xs text-gray-400">N/A</span>;

      const mapTexto: Record<ClasificacionCliente, string> = {
        CONFIABLE: "Confiable",
        NO_APROBABLE: "No Aprobable",
        RIESGO_ALTO: "Alto",
        RIESGO_MEDIO: "Medio",
      };

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEstadoColorClasificacion(clasificacion)}`}
        >
          {mapTexto[clasificacion] || clasificacion}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <Link
          to={`/crm/cliente-edicion/${row.original.id}`}
          className="inline-flex items-center justify-center p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-blue-600"
          title="Editar Cliente"
        >
          <Edit size={16} />
        </Link>
      );
    },
  },
];
