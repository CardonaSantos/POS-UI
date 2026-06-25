import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import type { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";

export type ClienteServicioAdicional = NonNullable<
  ClienteDetailsDto["clienteServicio"]
>[number];

function EmptyText({ children = "N/A" }: { children?: React.ReactNode }) {
  return (
    <span className="text-xs italic text-[hsl(var(--app-muted-foreground))]">
      {children}
    </span>
  );
}

export const serviciosAdicionalesColumns: ColumnDef<
  ClienteServicioAdicional,
  any
>[] = [
  {
    accessorKey: "servicio.nombre",
    header: "Servicio",
    size: 240,
    meta: {
      grow: true,
    },
    cell: ({ row }) => {
      const nombre = row.original.servicio?.nombre;

      if (!nombre) return <EmptyText />;

      return (
        <span
          className="block truncate text-xs font-medium text-[hsl(var(--app-foreground))]"
          title={nombre}
        >
          {nombre}
        </span>
      );
    },
  },
  {
    accessorKey: "servicio.precio",
    header: "Precio",
    size: 120,
    meta: {
      align: "right",
    },
    cell: ({ row }) => (
      <span className="text-xs font-semibold">
        {formattMonedaGT(row.original.servicio?.precio ?? 0)}
      </span>
    ),
  },
  {
    accessorKey: "fechaContratacion",
    header: "Contratación",
    size: 170,
    cell: ({ row }) => {
      const fecha = row.original.fechaContratacion;

      if (!fecha) return <EmptyText />;

      return (
        <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
          {format(new Date(fecha), "PPP", { locale: es })}
        </span>
      );
    },
  },
];
