import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, Edit, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { ClasificacionCliente } from "@/Crm/features/credito/credito-interfaces";
import { ClienteTableDto } from "../CustomerTable";
import { ServicioInternet } from "@/Crm/CrmServices/CrmServiciosWifi/servicio-internet.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";

const getEstadoColor = (estado: string) => {
  // Usamos el patrón "Badge": bg-color-50 + text-color-700 + border-color-200
  // Incluimos la clase 'border' aquí para asegurar que se pinte el borde
  const map: Record<string, string> = {
    ACTIVO: "bg-green-50 text-green-700 border border-green-200",
    PENDIENTE_ACTIVO: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    EN_INSTALACION: "bg-purple-50 text-purple-700 border border-purple-200",
    PAGO_PENDIENTE: "bg-blue-50 text-blue-700 border border-blue-200",

    // Estados de alerta/negativos
    MOROSO: "bg-red-50 text-red-700 border border-red-200",
    ATRASADO: "bg-orange-50 text-orange-700 border border-orange-200",
    SUSPENDIDO: "bg-gray-100 text-gray-600 border border-gray-200",
    DESINSTALADO: "bg-slate-100 text-slate-500 border border-slate-200",
  };

  return map[estado] || "bg-gray-50 text-gray-600 border border-gray-200";
};

const getEstadoColorClasificacion = (clasificacion: ClasificacionCliente) => {
  const map: Record<ClasificacionCliente, string> = {
    CONFIABLE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    RIESGO_MEDIO: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    RIESGO_ALTO: "bg-orange-50 text-orange-700 border border-orange-200",
    NO_APROBABLE: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    map[clasificacion] || "bg-gray-50 text-gray-600 border border-gray-200"
  );
};

export const clienteTableColumns: ColumnDef<ClienteTableDto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-6 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          ID
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      );
    },
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
        className="text-xs font-medium hover:underline truncate block max-w-[180px] dark:text-white"
        title={row.original.nombreCompleto}
      >
        {row.original.nombreCompleto}
      </Link>
    ),
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ row }) => {
      const telefono = row.original.telefono;
      if (!telefono) return <span className="text-xs text-gray-400">-</span>;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-6 px-1.5 text-xs font-normal text-gray-700 dark:text-gray-300  flex items-center gap-1"
            >
              <span className="truncate max-w-[85px]">{telefono}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal text-gray-500">
              {telefono}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(telefono);
                toast.success("Teléfono copiado");
              }}
              className="cursor-pointer text-xs"
            >
              <Copy className="mr-2 h-3.5 w-3.5 text-gray-500" />
              Copiar número
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const url = handleOpenWhatsapp(telefono);
                window.open(url, "_blank");
              }}
              className="cursor-pointer text-xs"
            >
              <MessageCircle className="mr-2 h-3.5 w-3.5 text-green-600" />
              Abrir chat
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => (window.location.href = `tel:${telefono}`)}
              className="cursor-pointer text-xs"
            >
              <Phone className="mr-2 h-3.5 w-3.5 text-blue-600" />
              Llamar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "direccionIp",
    header: "IP",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-gray-600 dark:text-white">
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
          className="text-xs font-medium text-gray-700 truncate block max-w-[120px] dark:text-white"
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
        className="text-xs text-gray-600 truncate block max-w-[150px] dark:text-white"
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
        className="text-xs text-gray-600 truncate block max-w-[200px] dark:text-white"
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
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide leading-none ${getEstadoColor(estadoRaw)}`}
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
        className="text-xs text-gray-600 truncate block max-w-[120px]"
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
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide leading-none ${getEstadoColorClasificacion(clasificacion)}`}
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
          className="inline-flex items-center justify-center h-6 w-6 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-blue-600"
          title="Editar Cliente"
        >
          <Edit size={14} />
        </Link>
      );
    },
  },
];
