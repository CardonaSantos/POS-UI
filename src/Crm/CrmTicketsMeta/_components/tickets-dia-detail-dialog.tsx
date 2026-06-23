"use client";
import { Calendar, Ticket, TrendingUp, UserRound } from "lucide-react";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogDescription,
} from "@/components/app/primitives/app-dialog";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";
import { TicketDiaDetail } from "./metricas.helpers";

interface TicketsDiaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: TicketDiaDetail | null;
}

export function TicketsDiaDetailDialog({
  open,
  onOpenChange,
  detail,
}: TicketsDiaDetailDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[440px]">
        <AppDialogHeader>
          <AppDialogTitle>Detalles del día</AppDialogTitle>
          <AppDialogDescription>
            Tickets resueltos por técnico en el día seleccionado.
          </AppDialogDescription>
        </AppDialogHeader>

        {detail ? (
          <AppStack gap="md">
            <AppCard variant="outline" size="xs">
              <AppInline align="center" justify="between" gap="sm">
                <AppInline align="center" gap="xs">
                  <Calendar
                    size={15}
                    className="text-[hsl(var(--app-primary))]"
                  />
                  <div>
                    <p className="text-xs font-semibold">Día {detail.dia}</p>
                    <p className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                      Resumen diario
                    </p>
                  </div>
                </AppInline>

                <AppBadge tone="primary" appearance="soft" size="sm">
                  {detail.total} total
                </AppBadge>
              </AppInline>
            </AppCard>

            <AppStack gap="xs">
              {detail.tecnicos.length > 0 ? (
                detail.tecnicos.map((item) => (
                  <AppCard key={item.name} variant="outline" size="xs">
                    <AppInline align="center" justify="between" gap="sm">
                      <AppInline align="center" gap="xs" className="min-w-0">
                        <UserRound
                          size={14}
                          className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                        />
                        <span className="truncate text-xs font-semibold capitalize">
                          {item.name}
                        </span>
                      </AppInline>

                      <AppBadge tone="success" appearance="soft" size="xs">
                        <Ticket size={12} />
                        {item.resolved}
                      </AppBadge>
                    </AppInline>
                  </AppCard>
                ))
              ) : (
                <p className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] p-3 text-center text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  No hay técnicos con resoluciones registradas para este día.
                </p>
              )}
            </AppStack>

            <AppSeparator />

            <AppCard variant="outline" size="xs">
              <AppInline align="center" justify="between" gap="sm">
                <AppInline align="center" gap="xs">
                  <TrendingUp
                    size={15}
                    className="text-[hsl(var(--app-success))]"
                  />
                  <span className="text-xs font-semibold">Total resueltos</span>
                </AppInline>

                <AppBadge tone="success" appearance="solid" size="sm">
                  {detail.total}
                </AppBadge>
              </AppInline>
            </AppCard>
          </AppStack>
        ) : null}

        <AppDialogFooter>
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </AppButton>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
