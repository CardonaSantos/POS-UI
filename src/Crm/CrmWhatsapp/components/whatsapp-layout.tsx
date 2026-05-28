"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

function getNumberParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
) {
  const value = searchParams.get(key);
  const parsed = value ? Number(value) : NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getNullableNumberParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  const parsed = value ? Number(value) : NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function WhatsappLayout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const invalidateQk = useInvalidateQk();

  const page = getNumberParam(searchParams, "page", 1);
  const take = getNumberParam(searchParams, "take", 15);
  const selectedId = getNullableNumberParam(searchParams, "clienteId");
  const nombre = searchParams.get("nombre") ?? "";

  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(selectedId));

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

  const patchUrlParams = (
    patch: Record<string, string | number | null | undefined>,
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
          return;
        }

        next.set(key, String(value));
      });

      return next;
    });
  };

  const handleNombreChange = (value: string) => {
    patchUrlParams({
      nombre: value.trim() ? value : null,
      page: 1,
    });
  };

  const handlePageChange = (pageIndex: number) => {
    patchUrlParams({
      page: pageIndex + 1,
    });
  };

  const handleSelectCliente = (id: number) => {
    patchUrlParams({
      clienteId: id,
    });

    setMobileChatOpen(true);
  };

  const handleMobileBack = () => {
    setMobileChatOpen(false);
  };

  useSocketEvent("nuvia:new-message", () => {
    invalidateQk(ClienteWhatsAppQkeys.list(params));

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
