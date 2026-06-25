import type React from "react";

import { cn } from "@/lib/utils";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { BackButtonCrm } from "@/Crm/_Utils/components/PageHeader/BackButton";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  fallbackBackTo?: string;
  actions?: React.ReactNode;
  sticky?: boolean;
  showBackButton?: boolean;
  containerSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
};

export function PageHeaderCrm({
  title,
  subtitle,
  fallbackBackTo = "/",
  actions,
  sticky = false,
  showBackButton = true,
  containerSize = "full",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "print:hidden",
        sticky
          ? [
              "sticky top-0 z-40",
              "border-b border-[hsl(var(--app-border,var(--border)))]",
              "bg-[hsl(var(--app-background,var(--background))/0.84)]",
              "backdrop-blur-md",
            ].join(" ")
          : "border-b border-transparent",
        className,
      )}
    >
      <AppContainer size={containerSize} paddingX="sm" paddingY="none">
        <div
          className={cn(
            "grid min-h-9 w-full min-w-0 items-center gap-2 py-1",
            showBackButton
              ? "grid-cols-[auto_minmax(0,1fr)_auto]"
              : "grid-cols-[minmax(0,1fr)_auto]",
          )}
        >
          {showBackButton ? (
            <BackButtonCrm fallback={fallbackBackTo} compact />
          ) : null}

          <AppStack gap="none" className="min-w-0">
            <h1
              title={title}
              className={cn(
                "truncate text-sm font-semibold leading-tight tracking-tight",
                "text-[hsl(var(--app-foreground,var(--foreground)))]",
              )}
            >
              {title}
            </h1>

            {subtitle ? (
              <p
                title={subtitle}
                className={cn(
                  "truncate text-[11px] leading-tight",
                  "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </AppStack>

          {actions ? (
            <AppInline
              gap="xs"
              align="center"
              justify="end"
              className={cn(
                "min-w-0 shrink-0",
                "max-w-[52vw] overflow-x-auto",
                "[-ms-overflow-style:none] [scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
              )}
            >
              {actions}
            </AppInline>
          ) : (
            <span />
          )}
        </div>
      </AppContainer>
    </header>
  );
}
