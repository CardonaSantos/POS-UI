"use client";

import { useState, useEffect } from "react";
import type { FindClientHistoryQuery } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/query-cliente-whatsapp.query";
import {
  useGetClienteHistorialChatsWz,
  useToggleBotCliente,
} from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/useGetClienteWhatsapp";
import { useSocketEvent } from "@/Crm/WEB/SocketProvider";
import { useInvalidateQk } from "@/Crm/CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { clienteHistorialWhatsappQkeys } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/Qk";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useMarkAsReadMessages } from "@/Crm/CrmHooks/hooks/bot-server/use-mark-message/useMarkMessages";
import { AlertCircle } from "lucide-react";
import { ChatFilters } from "../_components/chat/chat-filters";
import { ChatContainer } from "../_components/chat/chat-container";
import { ChatPagination } from "../_components/chat/chat-pagination";
import { ChatHeader } from "../_components/chat/chat-header";

interface ChatPanelProps {
  clienteId: number;
}

export function ChatPanel({ clienteId }: ChatPanelProps) {
  const markAsRead = useMarkAsReadMessages(clienteId);

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FindClientHistoryQuery>({
    clienteId: clienteId,
  });
  const limit = 50;

  const invalidateQk = useInvalidateQk();
  const toggleFilters = () => setShowFilters((prev) => !prev);

  const { data, isError } = useGetClienteHistorialChatsWz(clienteId, {
    page: currentPage,
    limit,
    ...filters,
  });

  const toggleBotMutation = useToggleBotCliente();

  const handleFiltersChange = (newFilters: FindClientHistoryQuery) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const serverResponse = data?.data;
  const meta = data?.meta;
  const messages = serverResponse?.chats
    ? [...serverResponse.chats].reverse()
    : [];

  const clientInfo = serverResponse?.cliente ?? {
    nombre: "Cargando...",
    telefono: "...",
    botActivo: true,
  };

  useSocketEvent("nuvia:new-message", () => {
    invalidateQk(clienteHistorialWhatsappQkeys.chats(filters));
    markAsRead.mutateAsync();
  });

  // Toggle bot
  const [openToggle, setOpenToggle] = useState(false);
  const toggleOpen = () => setOpenToggle((prev) => !prev);
  const targetState = !clientInfo.botActivo;

  const handleToggleBot = async () => {
    const actionText = targetState ? "Activando" : "Desactivando";
    try {
      toast.promise(
        toggleBotMutation.mutateAsync({
          clienteId,
          active: targetState,
        }),
        {
          loading: `${actionText} bot...`,
          success: () => {
            toggleOpen();
            invalidateQk(clienteHistorialWhatsappQkeys.chats(filters));
            return `Bot ${targetState ? "activado" : "desactivado"} correctamente`;
          },
          error: (error) => getApiErrorMessageAxios(error),
        },
      );
    } catch (error) {
      console.log("[ChatPanel] toggle bot error:", error);
    }
  };

  const dialogTitle = clientInfo.botActivo
    ? "Desactivar Asistente IA"
    : "Activar Asistente IA";
  const dialogDesc = clientInfo.botActivo
    ? "Si desactivas el bot, dejará de responder automáticamente a este cliente. ¿Deseas continuar?"
    : "El bot volverá a responder automáticamente a los mensajes entrantes. ¿Deseas activar el piloto automático?";
  const dialogConfirmLabel = clientInfo.botActivo
    ? "Sí, silenciar bot"
    : "Sí, activar bot";

  // Reset state when clienteId changes
  useEffect(() => {
    setShowFilters(false);
    setCurrentPage(1);
    setFilters({
      clienteId: clienteId,
    });
    if (clienteId) {
      markAsRead.mutateAsync();
    }
  }, [clienteId]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
        <AlertCircle className="w-5 h-5" />
        <p className="text-xs">Error al cargar el historial</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background">
      <ChatHeader
        toggleOpen={toggleOpen}
        botActivo={clientInfo.botActivo}
        toggleFilters={toggleFilters}
        showFilters={showFilters}
        clientName={clientInfo.nombre}
        clientPhone={clientInfo.telefono}
      />

      {showFilters && (
        <ChatFilters filters={filters} onFiltersChange={handleFiltersChange} />
      )}

      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        <ChatContainer
          filters={filters}
          clienteId={clienteId}
          messages={messages}
          className="h-full"
        />
      </div>

      <div className="shrink-0">
        <ChatPagination
          currentPage={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          onPageChange={handlePageChange}
        />
      </div>

      <AdvancedDialogCRM
        title={dialogTitle}
        description={dialogDesc}
        open={openToggle}
        onOpenChange={setOpenToggle}
        confirmButton={{
          label: dialogConfirmLabel,
          loading: toggleBotMutation.isPending,
          disabled: toggleBotMutation.isPending,
          onClick: handleToggleBot,
          variant: clientInfo.botActivo ? "destructive" : "default",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: toggleBotMutation.isPending,
          onClick: toggleOpen,
        }}
      />
    </div>
  );
}
