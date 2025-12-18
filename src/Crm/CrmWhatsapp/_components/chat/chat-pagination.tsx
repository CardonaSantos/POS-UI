"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChatPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ChatPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ChatPaginationProps) {
  return (
    <div className="h-9 border-t bg-background px-2 flex items-center justify-between shrink-0 select-none">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
        Pág {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6" // Botones de 24px
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
