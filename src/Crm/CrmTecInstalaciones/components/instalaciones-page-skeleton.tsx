import { memo } from "react";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import {
  AppSkeleton,
  AppSkeletonCard,
} from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";

export const InstalacionesPageSkeleton = memo(
  function InstalacionesPageSkeleton() {
    return (
      <AppStack gap="md" aria-label="Cargando instalaciones">
        <AppGrid cols={{ base: 2, md: 4 }} gap="xs">
          {Array.from({ length: 4 }, (_, index) => (
            <AppCard key={index} size="xs" variant="muted">
              <div className="px-1 py-0.5">
                <AppInline gap="xs" wrap={false}>
                  <AppSkeleton shape="circle" size="lg" width="fit" />
                  <AppStack gap="xs">
                    <AppSkeleton shape="text" size="sm" width="1/3" />
                    <AppSkeleton shape="text" size="xs" width="2/3" />
                  </AppStack>
                </AppInline>
              </div>
            </AppCard>
          ))}
        </AppGrid>

        <AppStack gap="sm">
          {Array.from({ length: 4 }, (_, index) => (
            <AppSkeletonCard
              key={index}
              withHeader
              lines={3}
              animation="shimmer"
            />
          ))}
        </AppStack>
      </AppStack>
    );
  },
);
