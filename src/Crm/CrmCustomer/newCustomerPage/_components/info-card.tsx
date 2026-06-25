import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import { cn } from "@/lib/utils";

export interface InfoItem {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  divider?: boolean;
}

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  items?: InfoItem[];
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

function hasValue(value: ReactNode) {
  return value !== null && value !== undefined && value !== "";
}

function EmptyValue() {
  return (
    <span className="italic text-[hsl(var(--app-muted-foreground))]">
      No especificado
    </span>
  );
}

export function InfoCard({
  title,
  icon: Icon,
  action,
  items,
  children,
  className,
  contentClassName,
}: InfoCardProps) {
  return (
    <AppCard
      variant="outline"
      size="sm"
      radius="md"
      className={cn("overflow-visible p-2", className)}
    >
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="sm" wrap={false}>
          <AppInline gap="xs" align="center" className="min-w-0">
            {Icon ? (
              <Icon
                size={16}
                className="shrink-0 text-[hsl(var(--app-muted-foreground))]"
              />
            ) : null}

            <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground))]">
              {title}
            </h3>
          </AppInline>

          {action ? <div className="shrink-0">{action}</div> : null}
        </AppInline>

        {items?.length ? (
          <dl className={cn("grid gap-2 text-xs", contentClassName)}>
            {items.map((item, index) => (
              <div key={`${item.label}-${index}`}>
                {item.divider ? <AppSeparator className="mb-2" /> : null}

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-start">
                  <dt className="flex min-w-0 items-center gap-2 text-[hsl(var(--app-muted-foreground))]">
                    {item.icon ? (
                      <item.icon size={14} className="shrink-0" />
                    ) : null}

                    <span className="truncate">{item.label}</span>
                  </dt>

                  <dd className="min-w-0 break-words font-medium text-[hsl(var(--app-foreground))]">
                    {hasValue(item.value) ? item.value : <EmptyValue />}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        ) : null}

        {children}
      </AppStack>
    </AppCard>
  );
}
