import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ListarInstalacionesTecnicasAsignadasResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";

type PaginationMeta = ListarInstalacionesTecnicasAsignadasResponse["meta"];

type InstalacionesPaginationProps = {
  meta: PaginationMeta;
  isFetching: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export const InstalacionesPagination = memo(
  function InstalacionesPagination({
    meta,
    isFetching,
    onPrevious,
    onNext,
  }: InstalacionesPaginationProps) {
    return (
      <nav aria-label="Paginación de instalaciones asignadas">
        <AppInline justify="between" gap="sm" fullWidth wrap={false}>
          <AppButton
            variant="outline"
            size="sm"
            disabled={meta.page <= 1 || isFetching}
            onClick={onPrevious}
            aria-label="Ir a la página anterior"
          >
            <ChevronLeft aria-hidden="true" />
            Anterior
          </AppButton>

          <span className="text-center text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">{meta.page}</strong>
            {" de "}
            {meta.totalPages}
          </span>

          <AppButton
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages || isFetching}
            onClick={onNext}
            aria-label="Ir a la página siguiente"
          >
            Siguiente
            <ChevronRight aria-hidden="true" />
          </AppButton>
        </AppInline>
      </nav>
    );
  },
);
