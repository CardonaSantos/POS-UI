import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { PerfilHomologacionListItem } from "@/Crm/features/pppoe-homologaciones/intefaces";

interface PerfilMobileCardProps {
  item: PerfilHomologacionListItem;
  onEdit: (item: PerfilHomologacionListItem) => void;
  onToggleStatus: (item: PerfilHomologacionListItem) => void;
}

export function PerfilMobileCard({
  item,
  onEdit,
  onToggleStatus,
}: PerfilMobileCardProps) {
  return (
    <AppStack gap="xs">
      <AppInline justify="between" align="start" gap="sm" fullWidth>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {item.servicioInternet.nombre}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {item.mikrotikRouter.nombre} · {item.mikrotikRouter.host}
          </p>
        </div>

        <AppBadge tone={item.activo ? "success" : "neutral"} size="xs" dot>
          {item.activo ? "Activa" : "Inactiva"}
        </AppBadge>
      </AppInline>

      <code className="w-fit rounded bg-muted px-1.5 py-0.5 text-xs">
        {item.codigoPerfil}
      </code>

      <AppInline justify="between" align="center" gap="sm" fullWidth>
        <span className="text-xs text-muted-foreground">
          {item.conteos.cuentas} cuentas
        </span>

        <AppInline align="center" gap="xs">
          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onEdit(item)}
          >
            Editar
          </AppButton>
          <AppButton
            type="button"
            variant={item.activo ? "danger" : "ghost"}
            size="xs"
            onClick={() => onToggleStatus(item)}
          >
            {item.activo ? "Desactivar" : "Activar"}
          </AppButton>
        </AppInline>
      </AppInline>
    </AppStack>
  );
}
