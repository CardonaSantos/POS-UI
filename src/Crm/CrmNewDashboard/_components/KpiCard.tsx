import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/app/primitives/app-badge";

type KpiTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "teal";

interface KpiCardProps {
  title: string;
  value: number | string;
  Icon?: LucideIcon;
  type: "FACTURACION" | "CLIENTE";
  linkValue: string;
  tone?: KpiTone;
  description?: string;
}

export function KpiCard({
  title,
  value,
  Icon,
  type,
  linkValue,
  tone = "neutral",
}: KpiCardProps) {
  const href = getKpiHref(type, linkValue);
  const toneClass = getKpiToneClass(tone);
  const badgeTone = getKpiBadgeTone(tone);

  return (
    <Link
      to={href}
      aria-label={`${title}: ${String(value)}`}
      className={[
        "group block min-w-0 rounded-[var(--app-radius-md)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
      ].join(" ")}
    >
      <article
        className={cn(
          [
            "flex h-[46px] min-w-0 flex-col justify-between overflow-hidden",
            "rounded-[var(--app-radius-md)] border px-2 py-1.5",
            "transition active:scale-[var(--app-motion-scale-press)]",
            "group-hover:bg-[hsl(var(--app-muted,var(--muted))/0.28)]",
          ].join(" "),
          toneClass,
        )}
      >
        <div className="flex min-w-0 items-center justify-between gap-1">
          <p className="truncate text-[9px] font-semibold uppercase leading-none tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {title}
          </p>

          {Icon ? (
            <AppBadge
              size="xs"
              tone={badgeTone}
              appearance="soft"
              radius="sm"
              className="h-4 min-h-4 shrink-0 px-1"
            >
              <Icon className="h-3 w-3" />
            </AppBadge>
          ) : null}
        </div>

        <p
          title={String(value)}
          className="truncate text-[14px] font-semibold leading-none text-[hsl(var(--app-foreground,var(--foreground)))]"
        >
          {value}
        </p>
      </article>
    </Link>
  );
}

function getKpiHref(type: KpiCardProps["type"], linkValue: string) {
  const value = encodeURIComponent(linkValue);

  if (type === "FACTURACION") {
    return `/crm/facturacion?estadoFactura=${value}`;
  }

  return `/crm-clientes?estado=${value}`;
}

function getKpiBadgeTone(
  tone: KpiTone,
): "neutral" | "primary" | "success" | "warning" | "danger" | "info" {
  switch (tone) {
    case "teal":
      return "primary";

    case "purple":
      return "info";

    case "neutral":
    case "primary":
    case "success":
    case "warning":
    case "danger":
    case "info":
      return tone;

    default:
      return "neutral";
  }
}

function getKpiToneClass(tone: KpiTone) {
  switch (tone) {
    case "primary":
      return [
        "border-[hsl(var(--app-primary,var(--primary))/0.28)]",
        "bg-[hsl(var(--app-primary,var(--primary))/0.045)]",
      ].join(" ");

    case "success":
      return [
        "border-[hsl(var(--app-success)/0.32)]",
        "bg-[hsl(var(--app-success)/0.055)]",
      ].join(" ");

    case "warning":
      return [
        "border-[hsl(var(--app-warning)/0.32)]",
        "bg-[hsl(var(--app-warning)/0.065)]",
      ].join(" ");

    case "danger":
      return [
        "border-[hsl(var(--app-danger,var(--destructive))/0.34)]",
        "bg-[hsl(var(--app-danger,var(--destructive))/0.06)]",
      ].join(" ");

    case "info":
      return [
        "border-[hsl(var(--app-info)/0.32)]",
        "bg-[hsl(var(--app-info)/0.055)]",
      ].join(" ");

    case "purple":
      return [
        "border-[hsl(265_84%_60%/0.30)]",
        "bg-[hsl(265_84%_60%/0.06)]",
      ].join(" ");

    case "teal":
      return [
        "border-[hsl(var(--app-primary,var(--primary))/0.32)]",
        "bg-[hsl(var(--app-primary,var(--primary))/0.06)]",
      ].join(" ");

    case "neutral":
    default:
      return [
        "border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-card-bg,var(--card)))]",
      ].join(" ");
  }
}
