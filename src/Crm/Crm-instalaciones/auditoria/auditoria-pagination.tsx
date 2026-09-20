import { ChevronLeft, ChevronRight } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  isFetching: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function AuditoriaPagination({
  page,
  totalPages,
  total,
  isFetching,
  onPrevious,
  onNext,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-2">
      <AppInline
        justify="between"
        align="center"
        gap="sm"
        collapseBelow="sm"
        fullWidth
      >
        <p className="text-[11px] text-[hsl(var(--app-muted-foreground))]">
          Página {page} de {totalPages} · {total} registros agrupados
        </p>

        <AppInline gap="xs" wrap={false}>
          <AppButton
            type="button"
            variant="outline"
            size="xs"
            disabled={page <= 1 || isFetching}
            onClick={onPrevious}
          >
            <ChevronLeft aria-hidden="true" />
            Anterior
          </AppButton>

          <AppButton
            type="button"
            variant="outline"
            size="xs"
            disabled={page >= totalPages || isFetching}
            onClick={onNext}
          >
            Siguiente
            <ChevronRight aria-hidden="true" />
          </AppButton>
        </AppInline>
      </AppInline>
    </AppCard>
  );
}
