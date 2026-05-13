"use client";

import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  ClienteWhatsappServerListItem,
  PaginationMeta,
} from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import { ChatSidebarItem } from "./chat-sidebar-items";

interface ChatSidebarProps {
  data: ClienteWhatsappServerListItem[];
  meta: PaginationMeta;
  isLoading: boolean;
  isFetching: boolean;
  nombre: string;
  onNombreChange: (value: string) => void;
  onPageChange: (pageIndex: number) => void;
  selectedId: number | null;
  onSelectCliente: (id: number) => void;
}

export function ChatSidebar({
  data,
  meta,
  isLoading,
  isFetching,
  nombre,
  onNombreChange,
  onPageChange,
  selectedId,
  onSelectCliente,
}: ChatSidebarProps) {
  const canPrev = meta.hasPreviousPage;
  const canNext = meta.hasNextPage;

  const handlePrev = () => {
    if (canPrev) onPageChange(meta.page - 2); // pageIndex (0-based)
  };

  const handleNext = () => {
    if (canNext) onPageChange(meta.page); // pageIndex (0-based)
  };

  return (
    <aside
      className="flex flex-col h-full min-h-0 border-r border-border bg-background"
      aria-label="Lista de chats"
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Mensajería</span>
          {isFetching && !isLoading && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            placeholder="Buscar chat…"
            className="h-7 text-xs pl-7 bg-muted/40 border-0 focus-visible:ring-1"
            aria-label="Buscar cliente por nombre"
          />
        </div>
      </div>

      {/* List */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        role="list"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 px-3">
            No se encontraron chats
          </p>
        ) : (
          data.map((item) => (
            <div key={item.id} role="listitem">
              <ChatSidebarItem
                item={item}
                isSelected={selectedId === item.id}
                onClick={onSelectCliente}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination footer */}
      <div className="border-t border-border px-3 py-2 flex items-center justify-between shrink-0">
        <span className="text-xs text-muted-foreground">
          {meta.total} chats · pág. {meta.page}/{meta.totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
