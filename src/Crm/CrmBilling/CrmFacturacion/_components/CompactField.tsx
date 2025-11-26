import React from "react";

interface CompactFieldProps {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  value?: React.ReactNode;
  extra?: React.ReactNode;
  badge?: React.ReactNode;
  valueClassName?: string;
}

export const CompactField: React.FC<CompactFieldProps> = ({
  icon,
  label,
  value,
  extra,
  badge,
  valueClassName,
}) => {
  return (
    <div className="space-y-0.5">
      {label && (
        <div className="text-[11px] font-medium text-muted-foreground leading-tight">
          {label}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs leading-tight">
        {icon && <div className="shrink-0">{icon}</div>}

        <span className={`font-medium ${valueClassName ?? ""}`}>{value}</span>

        {extra && (
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            ({extra})
          </span>
        )}

        {badge}
      </div>
    </div>
  );
};
