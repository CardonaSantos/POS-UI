import type { ReactNode } from "react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppStack } from "@/components/app/primitives/app-stack";

export function DetailSection({
  title,
  description,
  children,
}: {
  title: string;

  description?: string;

  children: ReactNode;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppStack gap="xs">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>

          {description ? (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </AppStack>
    </AppCard>
  );
}

export function DetailItem({
  label,
  value,
  className,
}: {
  label: string;

  value: ReactNode;

  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>

      <dd className="mt-0.5 min-w-0 break-words text-xs font-medium">
        {value ?? "-"}
      </dd>
    </div>
  );
}
