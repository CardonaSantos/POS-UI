import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { AppInline } from "@/components/app/primitives/app-inline";

type DetailValueRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  emphasize?: boolean;
};

export const DetailValueRow = memo(function DetailValueRow({
  icon: Icon,
  label,
  value,
  emphasize = false,
}: DetailValueRowProps) {
  return (
    <AppInline gap="xs" align="start" wrap={false} fullWidth>
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={
            emphasize
              ? "mt-0.5 break-words text-sm font-medium text-foreground"
              : "mt-0.5 break-words text-sm text-foreground"
          }
        >
          {value}
        </div>
      </div>
    </AppInline>
  );
});
