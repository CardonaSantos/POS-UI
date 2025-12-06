// KpiCard.tsx
import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface KpiCardProps {
  title: string;
  value: number | string;
  color: string; // clases de fondo/borde (bg-..., border-..., etc.)
  solidText?: boolean;
  Icon?: LucideIcon; // icono opcional
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
      className={`rounded-lg px-2.5 py-1.5 shadow-sm ${color} ${
        solidText ? "text-slate-50" : "text-slate-900"
      } dark:text-slate-50 flex flex-col justify-between gap-1`}
    >
      <Link to={linkTo}>
        <div className="flex items-center justify-between gap-2">
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

      <p className="text-sm md:text-base font-bold leading-none">{value}</p>
    </div>
  );
}
