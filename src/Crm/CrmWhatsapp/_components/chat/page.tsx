"use client";

import { FindClientHistoryQuery } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/query-cliente-whatsapp.query";
import {
  useGetClienteHistorialChatsWz,
  useToggleBotCliente,
} from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/useGetClienteWhatsapp";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatHeader } from "./chat-header";
import { ChatFilters } from "./chat-filters";
import { ChatContainer } from "./chat-container";
import { ChatPagination } from "./chat-pagination";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useSocketEvent } from "@/Crm/WEB/SocketProvider";
import { useInvalidateQk } from "@/Crm/CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { clienteHistorialWhatsappQkeys } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/Qk";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useMarkAsReadMessages } from "@/Crm/CrmHooks/hooks/bot-server/use-mark-message/useMarkMessages";

export default function ChatPage() {
  const params = useParams();
  const clienteId = params.id ? Number(params.id) : 0;
  const markAsRead = useMarkAsReadMessages(clienteId);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FindClientHistoryQuery>({});
  const limit = 50;

  // Helpers
  const invalidateQk = useInvalidateQk();
  const toggleFilters = () => setShowFilters(!showFilters);

  // Data Fetching
  const { data, isError } = useGetClienteHistorialChatsWz(clienteId, {
    page: currentPage,
    limit: limit,
    ...filters,
  });

  // Mutation Hook
  const toggleBotMutation = useToggleBotCliente();

  // Handlers
  const handleFiltersChange = (newFilters: FindClientHistoryQuery) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Derived Data
  const serverResponse = data?.data;
  const meta = data?.meta;
  const messages = serverResponse?.chats
    ? [...serverResponse.chats].reverse()
    : [];

  const clientInfo = serverResponse?.cliente || {
    nombre: "Cargando...",
    telefono: "...",
    botActivo: true, // Asumimos activo por defecto mientras carga
  };

  // Socket Event
  useSocketEvent("nuvia:new-message", () => {
    invalidateQk(clienteHistorialWhatsappQkeys.chats(filters));
    markAsRead.mutateAsync();
  });

  // TOGGLE LOGIC
  const [openToggle, setOpenToggle] = useState<boolean>(false);
  const toggleOpen = () => setOpenToggle(!openToggle);

  // Calculamos el estado DESEADO (lo contrario al actual)
  const targetState = !clientInfo.botActivo;

  const handleToggleBot = async () => {
    const actionText = targetState ? "Activando" : "Desactivando";

    try {
      toast.promise(
        toggleBotMutation.mutateAsync({
          clienteId: clienteId,
          active: targetState, // 👈 Enviamos explícitamente el nuevo estado
        }),
        {
          loading: `${actionText} bot...`,
          success: () => {
            toggleOpen();
            // Invalidamos para que el UI haga refetch y actualice el estado visual
            invalidateQk(clienteHistorialWhatsappQkeys.chats(filters));
            return `Bot ${
              targetState ? "activado" : "desactivado"
            } correctamente`;
          },
          error: (error) => getApiErrorMessageAxios(error),
        }
      );
    } catch (error) {
      console.log("Error generado: ", error);
    }
  };

  // Textos dinámicos para el diálogo
  const dialogTitle = clientInfo.botActivo
    ? "Desactivar Asistente IA"
    : "Activar Asistente IA";

  const dialogDesc = clientInfo.botActivo
    ? "Si desactivas el bot, dejará de responder automáticamente a este cliente. ¿Deseas continuar?"
    : "El bot volverá a responder automáticamente a los mensajes entrantes. ¿Deseas activar el piloto automático?";

  const dialogConfirmLabel = clientInfo.botActivo
    ? "Sí, silenciar bot"
    : "Sí, activar bot";

  useEffect(() => {
    if (clienteId) {
      markAsRead.mutateAsync();
    }
  }, [clienteId]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error al cargar el historial.
      </div>
    );
  }

  return (
    <PageTransitionCrm
      className="flex flex-col h-[calc(100vh-65px)] overflow-hidden bg-background"
      titleHeader={`Chat · ${data?.data.cliente.nombre ?? ""}`}
      variant="fade-pure"
    >
      <ChatHeader
        toggleOpen={toggleOpen}
        botActivo={clientInfo.botActivo} // Pasamos el estado real
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
          // filters={filters} // Si no lo usa el container, no hace falta pasarlo
          clienteId={clienteId}
          messages={messages}
          className="h-full"
        />
      </div>

      <div className="shrink-0 ">
        <ChatPagination
          currentPage={meta?.page || 1}
          totalPages={meta?.totalPages || 1}
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
          // Sugerencia visual: rojo si desactiva, default si activa
          variant: clientInfo.botActivo ? "destructive" : "default",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: toggleBotMutation.isPending,
          onClick: toggleOpen,
        }}
      />
    </PageTransitionCrm>
  );
}
