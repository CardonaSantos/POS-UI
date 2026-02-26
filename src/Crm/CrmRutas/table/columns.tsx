import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  Play,
  Trash2,
  Printer,
  BookmarkX,
  MoreVertical,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EstadoRuta, Ruta } from "@/Crm/features/rutas/rutas.interfaces";
import { formattShortFecha } from "@/utils/formattFechas";
import { getEstadoBadgeColorRutaList } from "../_Utils/utilsBadge";
import { getEstadoIconRutaList } from "../_Utils/getEstadoIconRutaList";

// 1. Definimos una interfaz para las acciones que pasaremos desde el componente padre
interface RutasColumnsActions {
  handleViewRuta: (ruta: Ruta) => void;
  handleDeleteClick: (rutaId: number) => void;
  handleCloseRuta: (rutaId: number) => void;
  handleDownloadExcelRutaCobro: (rutaId: number) => void;
}

// 2. Exportamos una FUNCIÓN que retorna las columnas, no solo el array.
// Esto nos permite inyectarle los handlers desde el componente listado.
export const getRutasColumns = ({
  handleViewRuta,
  handleDeleteClick,
  handleCloseRuta,
  handleDownloadExcelRutaCobro,
}: RutasColumnsActions): ColumnDef<Ruta>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
        className="translate-y-[2px] dark:border-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="translate-y-[2px] dark:border-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombreRuta",
    header: "Nombre de Ruta",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          {row.original.nombreRuta}
        </span>
        <span className="text-[10px] text-gray-400">
          Creada: {formattShortFecha(row.original.fechaCreacion)}
        </span>
      </div>
    ),
  },
  {
    id: "cobrador",
    header: "Cobrador",
    accessorFn: (row) =>
      row.cobrador
        ? `${row.cobrador.nombre} ${row.cobrador.apellidos || ""}`
        : "Sin Asignar",
    cell: ({ getValue }) => (
      <span
        className={`text-xs  dark:text-white ${getValue() === "Sin Asignar" ? "text-gray-400 italic " : ""}`}
      >
        {getValue<string>()}
      </span>
    ),
  },
  {
    id: "cantidadClientes",
    header: "Clientes",
    accessorFn: (row) => row.clientes?.length || 0,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 dark:text-white" />
        <span className="text-xs font-medium dark:text-white">
          {getValue<number>()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "estadoRuta",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<EstadoRuta>();
      return (
        <Badge
          className={`${getEstadoBadgeColorRutaList(estado)} flex items-center w-fit text-xs`}
        >
          {getEstadoIconRutaList(estado)}
          {estado}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const ruta = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 dark:text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewRuta(ruta)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" /> <span>Ver detalles</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDownloadExcelRutaCobro(ruta.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Printer className="h-4 w-4" /> <span>Imprimir ruta</span>
              </DropdownMenuItem>

              {ruta.estadoRuta !== EstadoRuta.CERRADO && (
                <>
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Link to={`/crm/cobros-en-ruta/${ruta.id}`}>
                      <Play className="h-4 w-4" /> <span>Iniciar Ruta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Link to={`/crm/rutas-cobro/edit/${ruta.id}`}>
                      <Edit className="h-4 w-4" /> <span>Editar</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCloseRuta(ruta.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <BookmarkX className="h-4 w-4" /> <span>Cerrar Ruta</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem
                onClick={() => handleDeleteClick(ruta.id)}
                className="flex items-center gap-2 text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
