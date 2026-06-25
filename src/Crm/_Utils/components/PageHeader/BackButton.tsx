import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppButton } from "@/components/app/primitives/app-button";
import { useGoBackCrm } from "./UseGoBack";

type BackButtonProps = {
  fallback?: string;
  className?: string;
  label?: string;
  placement?: "inline" | "absolute" | "fixed";
  compact?: boolean;
};

export function BackButtonCrm({
  fallback = "/",
  className,
  label,
  placement = "inline",
  compact = true,
}: BackButtonProps) {
  const goBack = useGoBackCrm(fallback);

  const posClass =
    placement === "absolute"
      ? "absolute"
      : placement === "fixed"
        ? "fixed"
        : "";

  if (label) {
    return (
      <AppButton
        type="button"
        onClick={goBack}
        aria-label={label}
        variant="secondary"
        size={compact ? "xs" : "sm"}
        width="auto"
        leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
        className={cn(posClass, compact && "h-7", className)}
      >
        {label}
      </AppButton>
    );
  }

  return (
    <AppButton
      type="button"
      onClick={goBack}
      aria-label="Volver"
      variant="secondary"
      size="xs"
      width="auto"
      className={cn(posClass, "h-7 w-7 px-0", className)}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span className="sr-only">Volver</span>
    </AppButton>
  );
}
