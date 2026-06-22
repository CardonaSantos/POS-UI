"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";

import type { MetaPropsResponse } from "../features/meta-server-response/meta-responses";

interface Props {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  meta: MetaPropsResponse;
}

export default function CrmTicketPagination({
  handleNextPage,
  handlePrevPage,
  meta,
}: Props) {
  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const isFirstPage = !meta?.hasPrevPage;
  const isLastPage = !meta?.hasNextPage;

  return (
    <div className="shrink-0 border-t border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))] px-2 py-1.5">
      <AppInline align="center" justify="between" gap="sm" className="w-full">
        <AppButton
          type="button"
          variant="secondary"
          size="xs"
          width="auto"
          disabled={isFirstPage}
          onClick={handlePrevPage}
          aria-label="Página anterior"
          className="h-7 min-w-8 px-2"
        >
          <ArrowLeft size={15} strokeWidth={2.4} />
        </AppButton>

        <AppInline
          align="center"
          justify="center"
          gap="xs"
          className="min-w-0 flex-1 text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        >
          <span className="whitespace-nowrap">
            Página{" "}
            <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {currentPage}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              {totalPages}
            </span>
          </span>

          <span className="hidden text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] sm:inline">
            · {total} registros
          </span>
        </AppInline>

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="auto"
          disabled={isLastPage}
          onClick={handleNextPage}
          aria-label="Página siguiente"
          className="h-7 min-w-8 px-2"
        >
          <ArrowRight size={15} strokeWidth={2.4} />
        </AppButton>
      </AppInline>
    </div>
  );
}
