import { useMemo } from "react";

import { Router } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";

import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

import { AppGrid } from "@/components/app/primitives/app-grid";

import { AppInline } from "@/components/app/primitives/app-inline";

import { AppStack } from "@/components/app/primitives/app-stack";

import type { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";

import MikroTikCard from "./mikrotik-card";

interface PropsMikrotiks {
  mikrotiks: MikrotikRoutersResponse[];

  handleSelectToEdit: (mk: MikrotikRoutersResponse) => void;

  handleOpenDelete: (mk: MikrotikRoutersResponse) => void;
}

function getCreatedTimestamp(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function MikroTiks({
  mikrotiks,
  handleSelectToEdit,
  handleOpenDelete,
}: PropsMikrotiks) {
  const orderedMikrotiks = useMemo(
    () =>
      [...mikrotiks].sort(
        (a, b) =>
          getCreatedTimestamp(b.creadoEn) - getCreatedTimestamp(a.creadoEn),
      ),
    [mikrotiks],
  );

  if (orderedMikrotiks.length === 0) {
    return (
      <AppEmptyState
        title="No hay routers MikroTik registrados"
        description="Cuando registres un router aparecerá aquí junto con su estado y datos de conexión."
        icon={<Router aria-hidden="true" />}
      />
    );
  }

  const routerCount = orderedMikrotiks.length;

  return (
    <AppStack gap="sm">
      <AppInline
        justify="between"
        align="center"
        gap="sm"
        collapseBelow="sm"
        fullWidth
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold">Routers registrados</p>

          <p className="mt-0.5 text-xs text-[hsl(var(--app-muted-foreground))]">
            Infraestructura MikroTik disponible para las operaciones del CRM.
          </p>
        </div>

        <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
          {routerCount} {routerCount === 1 ? "router" : "routers"}
        </AppBadge>
      </AppInline>

      <AppGrid
        cols={{
          base: 1,
          md: 2,
          xl: 3,
        }}
        gap="sm"
      >
        {orderedMikrotiks.map((mk) => (
          <MikroTikCard
            key={mk.id}
            mk={mk}
            handleOpenDelete={handleOpenDelete}
            handleSelectToEdit={handleSelectToEdit}
          />
        ))}
      </AppGrid>
    </AppStack>
  );
}

export default MikroTiks;
