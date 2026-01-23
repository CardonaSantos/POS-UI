"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface CreditosPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function CreditosPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: CreditosPaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">
        Página {currentPage} de {totalPages} ({totalItems} registros)
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="size-7 bg-transparent"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
        >
          <ChevronsLeft className="size-3.5" />
          <span className="sr-only">Primera página</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="size-7 bg-transparent"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="size-3.5" />
          <span className="sr-only">Página anterior</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="size-7 bg-transparent"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <ChevronRight className="size-3.5" />
          <span className="sr-only">Página siguiente</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="size-7 bg-transparent"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
        >
          <ChevronsRight className="size-3.5" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  );
}
