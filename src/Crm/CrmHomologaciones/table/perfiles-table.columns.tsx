import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Power, PowerOff } from "lucide-react";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";
import { PerfilHomologacionListItem } from "@/Crm/features/pppoe-homologaciones/intefaces";

interface CreatePerfilesTableColumnsParams {
  onEdit: (item: PerfilHomologacionListItem) => void;
  onToggleStatus: (item: PerfilHomologacionListItem) => void;
}

function PlanCell({ item }: { item: PerfilHomologacionListItem }) {
  return (
    <div className="min-w-0">
      <p
        className="truncate text-xs font-semibold"
        title={item.servicioInternet.nombre}
      >
        {item.servicioInternet.nombre}
      </p>
    </div>
  );
}

function RouterCell({ item }: { item: PerfilHomologacionListItem }) {
  return (
    <div className="min-w-0">
      <p
        className="truncate text-xs font-medium"
        title={item.mikrotikRouter.nombre}
      >
        {item.mikrotikRouter.nombre}
      </p>
    </div>
  );
}

function CodigoPerfilCell({ codigo }: { codigo: string }) {
  return (
    <code
      className="block max-w-full truncate rounded bg-muted px-1.5 py-0.5 text-xs"
      title={codigo}
    >
      {codigo}
    </code>
  );
}

function EstadoCell({ activo }: { activo: boolean }) {
  return (
    <AppBadge
      tone={activo ? "success" : "neutral"}
      appearance="soft"
      size="xs"
      radius="full"
      dot
    >
      {activo ? "Activa" : "Inactiva"}
    </AppBadge>
  );
}

export function createPerfilesTableColumns({
  onEdit,
  onToggleStatus,
}: CreatePerfilesTableColumnsParams): ColumnDef<
  PerfilHomologacionListItem,
  unknown
>[] {
  return [
    {
      accessorKey: "servicioInternet.nombre",
      header: "Plan",
      size: 90,
      minSize: 240,
      meta: {
        grow: true,
      },
      cell: ({ row }) => <PlanCell item={row.original} />,
    },
    {
      accessorKey: "mikrotikRouter.nombre",
      header: "Router",
      size: 90,
      minSize: 220,
      cell: ({ row }) => <RouterCell item={row.original} />,
    },
    {
      accessorKey: "codigoPerfil",
      header: "Código MikroTik",
      size: 220,
      minSize: 180,
      cell: ({ row }) => (
        <CodigoPerfilCell codigo={row.original.codigoPerfil} />
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      size: 110,
      minSize: 110,
      maxSize: 110,
      cell: ({ row }) => <EstadoCell activo={row.original.activo} />,
    },
    {
      id: "cuentas",
      header: "Cuentas",
      size: 90,
      minSize: 90,
      maxSize: 90,
      meta: {
        align: "center",
      },
      accessorFn: (row) => row.conteos.cuentas,
      cell: ({ getValue }) => (
        <span className="text-xs tabular-nums">{String(getValue())}</span>
      ),
    },
    createAppRowActionsColumn<PerfilHomologacionListItem>({
      header: "",
      size: 44,
      actions: (row) => [
        {
          label: "Editar código",
          icon: <Pencil size={14} />,
          onClick: () => onEdit(row.original),
        },
        {
          label: row.original.activo ? "Desactivar" : "Activar",
          icon: row.original.activo ? (
            <PowerOff size={14} />
          ) : (
            <Power size={14} />
          ),
          tone: row.original.activo ? "danger" : "success",
          separatorBefore: true,
          onClick: () => onToggleStatus(row.original),
        },
      ],
    }),
  ];
}
