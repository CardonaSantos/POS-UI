import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

type DetalleSectionCardProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  trailing?: ReactNode;
};

export const DetalleSectionCard = memo(function DetalleSectionCard({
  id,
  title,
  icon: Icon,
  children,
  trailing,
}: DetalleSectionCardProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId}>
      <AppCard size="sm">
        <div className="px-1.5 py-1 sm:px-2 sm:py-1.5">
          <AppStack gap="sm">
            <AppInline justify="between" align="center" gap="sm" fullWidth>
              <AppInline gap="xs" wrap={false}>
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <h2
                  id={headingId}
                  className="text-sm font-semibold text-foreground"
                >
                  {title}
                </h2>
              </AppInline>
              {trailing}
            </AppInline>

            {children}
          </AppStack>
        </div>
      </AppCard>
    </section>
  );
});
