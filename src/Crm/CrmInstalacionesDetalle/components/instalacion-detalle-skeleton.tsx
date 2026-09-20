import { memo } from "react";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import {
  AppSkeleton,
  AppSkeletonCard,
} from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";

export const InstalacionDetalleSkeleton = memo(
  function InstalacionDetalleSkeleton() {
    return (
      <AppStack gap="sm" aria-label="Cargando detalle de instalación">
        <AppInline justify="between" align="start" gap="sm" fullWidth>
          <AppSkeleton shape="circle" size="lg" width="fit" />
          <AppSkeleton shape="circle" size="lg" width="fit" />
        </AppInline>

        <AppStack gap="xs">
          <AppSkeleton shape="text" size="xs" width="1/3" />
          <AppSkeleton shape="text" size="lg" width="2/3" />
          <AppSkeleton shape="text" size="sm" width="1/2" />
        </AppStack>

        <AppCard size="sm">
          <div className="px-2 py-2">
            <AppStack gap="sm">
              <AppSkeleton shape="text" size="sm" width="1/3" />
              <AppSkeleton shape="block" size="lg" width="full" />
              <AppInline gap="xs" wrap>
                <AppSkeleton shape="block" size="md" width="1/3" />
                <AppSkeleton shape="block" size="md" width="1/3" />
              </AppInline>
            </AppStack>
          </div>
        </AppCard>

        <AppGrid cols={{ base: 1, lg: 2 }} gap="sm">
          {Array.from({ length: 4 }, (_, index) => (
            <AppSkeletonCard
              key={index}
              withHeader
              lines={index % 2 === 0 ? 4 : 3}
              animation="shimmer"
            />
          ))}
        </AppGrid>
      </AppStack>
    );
  },
);
