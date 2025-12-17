"use client";

import { FindClientHistoryQuery } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/query-cliente-whatsapp.query";
import { useGetClienteHistorialChatsWz } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/useGetClienteWhatsapp";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChatHeader } from "./chat-header";
import { ChatFilters } from "./chat-filters";
import { ChatContainer } from "./chat-container";
import { ChatPagination } from "./chat-pagination";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

export default function ChatPage() {
  const params = useParams();
  const clienteId = params.id ? Number(params.id) : 0;

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FindClientHistoryQuery>({});
  const limit = 250;

  // helpers
  const toggleFilters = () => setShowFilters(!showFilters);

  const { data, isLoading, isError, isFetching } =
    useGetClienteHistorialChatsWz(clienteId, {
      page: currentPage,
      limit: limit,
      ...filters, // Esparce search, direction, type, status, dates
    });

  const handleFiltersChange = (newFilters: FindClientHistoryQuery) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const serverResponse = data?.data;
  const meta = data?.meta;

  const messages = serverResponse?.chats || [];
  const clientInfo = serverResponse?.cliente || {
    nombre: "Cargando...",
    telefono: "...",
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error al cargar el historial. Por favor intenta recargar.
      </div>
    );
  }

  return (
    <PageTransitionCrm
      className="flex flex-col h-screen max-h-screen bg-background"
      titleHeader={`Chat iniciado con · ${
        data?.data.cliente.nombre.slice(0, 15) + "..."
      } `}
      variant="fade-pure"
    >
      {/* Header: Datos del Cliente (Vienen separados de los chats ahora) */}
      <ChatHeader
        toggleFilters={toggleFilters}
        showFilters={showFilters}
        clientName={clientInfo.nombre}
        clientPhone={clientInfo.telefono}
      />

      {/* Filtros */}
      {showFilters ? (
        <ChatFilters filters={filters} onFiltersChange={handleFiltersChange} />
      ) : null}

      <div className="flex-1 overflow-hidden relative">
        {/* Loading Overlay: Se muestra si está cargando por primera vez o re-fetcheando */}
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <div className="bg-white/90 p-3 rounded-full shadow-lg text-xs font-medium animate-pulse text-primary">
              {isLoading ? "Cargando chat..." : "Actualizando..."}
            </div>
          </div>
        )}

        {/* Contenedor de Mensajes */}
        {/* Si no hay mensajes y no está cargando, podrías mostrar un EmptyState aquí */}
        <ChatContainer messages={messages} />
      </div>

      {/* Paginación: Usamos la meta del servidor */}
      <ChatPagination
        currentPage={meta?.page || 1}
        totalPages={meta?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </PageTransitionCrm>
  );
}
