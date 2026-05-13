"use client";

import { useMemo, useState } from "react";
import type { FindClientesQuery } from "@/Crm/features/bot-server/whatsapp-messages/query";
import { useGetClientes } from "@/Crm/CrmHooks/hooks/bot-server/use-whatsapp-server/useWhatsappServer";
import { ChatSidebar } from "./chat-sidebar";
import { ChatPanel } from "./chat-panel";
import { ChatEmptyState } from "./chat-empty-state";
import { MessageSquare, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WhatsappLayout() {
  const [page, setPage] = useState(1);
  const [take] = useState(15);
  const [nombre, setNombre] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // On mobile: track if the chat panel is shown (selected chat open)
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const skip = (page - 1) * take;

  const params: FindClientesQuery = useMemo(
    () => ({
      take,
      skip,
      nombre: nombre.trim() ? nombre.trim() : undefined,
    }),
    [take, skip, nombre],
  );

  const q = useGetClientes(params);

  const rows = q.data?.data ?? [];
  const meta = q.data?.meta ?? {
    total: 0,
    take,
    skip,
    page,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const handleNombreChange = (value: string) => {
    setNombre(value);
    setPage(1);
  };

  const handlePageChange = (pageIndex: number) => {
    setPage(pageIndex + 1);
  };

  const handleSelectCliente = (id: number) => {
    setSelectedId(id);
    setMobileChatOpen(true);
  };

  const handleMobileBack = () => {
    setMobileChatOpen(false);
  };

  return (
    <div
      className="flex h-screen max-h-screen w-full overflow-hidden"
      aria-label="Mensajería WhatsApp"
    >
      {/*
       * ── LEFT PANEL: sidebar list ──────────────────────────────────────────
       * On mobile: visible only when no chat is open
       * On md+: always visible, fixed width
       */}
      <div
        className={cn(
          "flex flex-col shrink-0",
          // mobile: full width, hide when chat open
          "w-full md:w-64 lg:w-72 xl:w-80",
          mobileChatOpen ? "hidden md:flex" : "flex",
        )}
      >
        <ChatSidebar
          data={rows}
          meta={meta}
          isLoading={q.isLoading}
          isFetching={q.isFetching}
          nombre={nombre}
          onNombreChange={handleNombreChange}
          onPageChange={handlePageChange}
          selectedId={selectedId}
          onSelectCliente={handleSelectCliente}
        />
      </div>

      {/*
       * ── RIGHT PANEL: chat ─────────────────────────────────────────────────
       * On mobile: full width, visible only when a chat is selected & open
       * On md+: flex-1 (takes remaining space), always rendered
       */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-hidden",
          // mobile: hide when no chat is open
          mobileChatOpen ? "flex" : "hidden md:flex",
        )}
      >
        {/* Mobile back button row */}
        {mobileChatOpen && selectedId && (
          <div className="flex items-center gap-1 px-2 py-1 border-b border-border md:hidden shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleMobileBack}
              aria-label="Volver a la lista"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {selectedId ? <ChatPanel clienteId={selectedId} /> : <ChatEmptyState />}
      </div>
    </div>
  );
}
