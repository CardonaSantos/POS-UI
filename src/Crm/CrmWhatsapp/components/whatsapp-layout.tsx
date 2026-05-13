"use client";

import { useMemo, useState } from "react";
import type { FindClientesQuery } from "@/Crm/features/bot-server/whatsapp-messages/query";
import { useGetClientes } from "@/Crm/CrmHooks/hooks/bot-server/use-whatsapp-server/useWhatsappServer";
import { ChatSidebar } from "./chat-sidebar";
import { ChatPanel } from "./chat-panel";
import { ChatEmptyState } from "./chat-empty-state";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSocketEvent } from "@/Crm/WEB/SocketProvider";
import { useInvalidateQk } from "@/Crm/CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { ClienteWhatsAppQkeys } from "@/Crm/CrmHooks/hooks/bot-server/use-whatsapp-server/Qk";

export function WhatsappLayout() {
  const [page, setPage] = useState(1);
  const [take] = useState(15);
  const [nombre, setNombre] = useState("");
  const invalidateQk = useInvalidateQk();

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

  useSocketEvent("nuvia:new-message", () => {
    invalidateQk(ClienteWhatsAppQkeys.list(params));

    // markAsRead.mutateAsync();
    console.log("INVALIDANDO FETCH EN EL SIDEBAR NUEVO");
  });

  return (
    <div
      className="flex h-screen max-h-screen w-full overflow-hidden"
      aria-label="Mensajería WhatsApp"
    >
      <div
        className={cn(
          "flex flex-col shrink-0",
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

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-hidden",
          mobileChatOpen ? "flex" : "hidden md:flex",
        )}
      >
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
