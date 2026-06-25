import type React from "react";

interface CompactFieldProps {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  value?: React.ReactNode;
  extra?: React.ReactNode;
  badge?: React.ReactNode;
  valueClassName?: string;
  className?: string;
}

export const CompactField: React.FC<CompactFieldProps> = ({
  icon,
  label,
  value,
  extra,
  badge,
  valueClassName,
  className,
}) => {
  return (
    <div
      className={["min-w-0 space-y-0.5", className].filter(Boolean).join(" ")}
    >
      {label ? (
        <div className="truncate text-[11px] font-medium leading-tight text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </div>
      ) : null}

      <div className="flex min-w-0 items-center gap-1.5 text-xs leading-tight">
        {icon ? <div className="shrink-0">{icon}</div> : null}

        <span
          className={[
            "min-w-0 break-words font-medium text-[hsl(var(--app-foreground,var(--foreground)))]",
            valueClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {value ?? "N/A"}
        </span>

        {extra ? (
          <span className="shrink-0 whitespace-nowrap text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            ({extra})
          </span>
        ) : null}

        {badge ? <span className="shrink-0">{badge}</span> : null}
      </div>
    </div>
  );
};
