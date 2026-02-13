import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface KpiCardProps {
  title: string;
  value: number | string;
  color: string;
  solidText?: boolean;
  Icon?: LucideIcon;
  type: "FACTURACION" | "CLIENTE";
  linkValue: string;
}

export function KpiCard({
  title,
  value,
  color,
  solidText = true,
  Icon,
  type,
  linkValue,
}: KpiCardProps) {
  const linkTo =
    type === "FACTURACION"
      ? `/crm/facturacion?estadoFactura=${linkValue}`
      : `/crm-clientes?estado=${linkValue}`;

  return (
    <div
      className={`rounded-lg px-2.5 py-2 shadow-sm ${color} ${
        solidText ? "text-slate-50" : "text-slate-900"
      } dark:text-slate-50 flex flex-col justify-between gap-1.5 min-w-0 overflow-hidden`}
    >
      <Link to={linkTo} className="min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <p
            className={`text-[10px] uppercase tracking-wide font-semibold truncate ${
              solidText ? "opacity-80" : "opacity-60"
            }`}
          >
            {title}
          </p>

          {Icon && <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />}
        </div>
      </Link>

      <p
        className="text-sm md:text-base lg:text-lg font-bold leading-tight truncate"
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}
