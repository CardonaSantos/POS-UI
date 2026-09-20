import { CheckCircle2, Circle, CircleAlert } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import type { PppoeAuditoriaCuentaCompleta } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

type Props = {
  account: PppoeAuditoriaCuentaCompleta | null;
};

export function PppoeAdminProgress({ account }: Props) {
  const items = [
    {
      label: "Cuenta generada",
      done: Boolean(account?.generadoEn),
      warning: !account,
    },
    {
      label: "Secret creado",
      done: Boolean(account?.secretCreadoEn),
      warning: account?.estado === "ERROR",
    },
    {
      label: "Secret habilitado",
      done: account?.estado === "ACTIVA" || Boolean(account?.activadoEn),
      warning: account?.estado === "ERROR",
    },
    {
      label: "Acceso activo",
      done: account?.accesoInternet.estado === "ACTIVO",
      warning: account?.accesoInternet.estado === "SUSPENDIDO",
    },
    {
      label: "Sincronización confirmada",
      done: Boolean(account?.ultimaSincronizacionEn),
      warning: Boolean(account?.ultimoError),
    },
  ];

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <p className="text-sm font-semibold">Estado del aprovisionamiento</p>
      <AppGrid cols={{ base: 1, sm: 2, lg: 5 }} gap="xs" className="mt-3">
        {items.map((item) => {
          const Icon = item.done
            ? CheckCircle2
            : item.warning
              ? CircleAlert
              : Circle;

          return (
            <AppInline
              key={item.label}
              align="center"
              gap="xs"
              wrap={false}
              className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2"
            >
              <Icon
                className={
                  item.done
                    ? "size-4 text-[hsl(var(--app-success))]"
                    : item.warning
                      ? "size-4 text-[hsl(var(--app-warning))]"
                      : `size-4 ${mutedTextClass}`
                }
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium">{item.label}</span>
            </AppInline>
          );
        })}
      </AppGrid>
    </AppCard>
  );
}
