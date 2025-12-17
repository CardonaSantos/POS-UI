"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ChatPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ChatPagination({ currentPage, totalPages, onPageChange }: ChatPaginationProps) {
  return (
    <div className="border-t bg-background p-3 flex items-center justify-between">
      <div className="text-xs text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
