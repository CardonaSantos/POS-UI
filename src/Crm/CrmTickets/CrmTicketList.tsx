"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, User, Pin } from "lucide-react"; // Iconos extra para estado
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import type { Ticket } from "./ticketTypes";

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
}

// --- CONFIGURACIÓN DE COLORES Y ESTILOS ---

// 1. Mapa de Estilos para ESTADOS (Soporta Light y Dark mode)
const getStatusStyles = (status: string) => {
  const styles: Record<string, string> = {
    NUEVO:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
    ABIERTA:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
    EN_PROCESO:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30",
    PENDIENTE:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
    PENDIENTE_CLIENTE:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    PENDIENTE_TECNICO:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
    RESUELTA:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    CANCELADA:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
    ARCHIVADA:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
  return (
    styles[status] ||
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
  );
};

// 2. Mapa de Estilos para PRIORIDAD
const getPriorityStyles = (priority: string) => {
  const styles: Record<string, string> = {
    BAJA: "text-slate-500 bg-slate-50 border-slate-100 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20",
    MEDIA:
      "text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20",
    ALTA: "text-orange-600 bg-orange-50 border-orange-100 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
    URGENTE:
      "text-red-600 bg-red-50 border-red-100 font-bold dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20",
  };
  return styles[priority] || "text-gray-500 bg-gray-50 border-gray-100";
};

// --- COMPONENT: Ticket Item ---
const TicketItem = ({
  ticket,
  isSelected,
  onSelect,
  avatarColor,
}: {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  avatarColor: string;
}) => {
  const isAssigned = !!ticket.assignee;
  const dateFormatted = format(new Date(ticket.date), "d MMM", { locale: es });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onSelect(ticket)}
      className={`
        group relative flex gap-3 p-3 border-b cursor-pointer transition-all duration-200
        hover:bg-muted/50
        ${
          isSelected
            ? "bg-muted/60 border-l-[3px] border-l-primary"
            : "bg-card border-l-[3px] border-l-transparent hover:border-l-primary/20"
        }
      `}
    >
      {/* 1. Avatar Compacto */}
      <div className="shrink-0 pt-1">
        <Avatar className="h-9 w-9 border shadow-sm">
          <AvatarFallback
            className={`${avatarColor} text-white font-bold text-[11px]`}
          >
            {ticket.customer
              ? ticket.customer.name.slice(0, 2).toUpperCase()
              : "NA"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 2. Contenido Principal */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Fila Superior: Cliente + Icono Fijo + Fecha */}
        <div className="flex items-center justify-between leading-none">
          <div className="flex items-center gap-1.5 max-w-[70%]">
            {ticket.fixed && (
              <Pin className="w-3 h-3 text-orange-500 fill-orange-500/20 rotate-45 shrink-0" />
            )}
            <span className="text-[12px] font-semibold text-foreground/90 truncate">
              {ticket.customer?.name || "Sin Cliente"}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
            {dateFormatted}
          </span>
        </div>

        {/* Fila Título: ID + Título */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded-[3px] shrink-0 border border-border/50">
            #{ticket.id}
          </span>
          <h4
            className={`text-[13px] font-medium truncate leading-snug ${
              isSelected ? "text-primary dark:text-white" : "text-foreground"
            }`}
          >
            {ticket.title}
          </h4>
        </div>

        {/* Fila Inferior: Tags + Estado/Prioridad */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40">
          {/* AREA DE TAGS / ASIGNADO */}
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Asignado mini */}
            <div
              className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0"
              title="Técnico asignado"
            >
              <User
                className={`w-3 h-3 ${
                  isAssigned
                    ? "text-green-600 dark:text-indigo-600"
                    : "text-muted-foreground/40"
                }`}
              />
              <span
                className={`max-w-[80px] text-green-600 dark:text-indigo-600 font-semibold truncate ${
                  !isAssigned && "italic opacity-50"
                }`}
              >
                {isAssigned
                  ? ticket.assignee?.name.split(" ")[0]
                  : "Sin asignar"}
              </span>
            </div>

            {/* Separador sutil */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="h-3 w-[1px] bg-border/60 mx-1"></div>
            )}

            {/* Tags (Solo muestra 1 o 2 para no saturar) */}
            <div className="flex gap-1 overflow-hidden mask-linear-fade">
              {ticket.tags?.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[9px] px-1.5 py-0.5 bg-secondary rounded-sm text-secondary-foreground truncate max-w-[60px]"
                >
                  {tag.label}
                </span>
              ))}
              {ticket.tags && ticket.tags.length > 2 && (
                <span className="text-[9px] text-muted-foreground">+</span>
              )}
            </div>
          </div>

          {/* BADGES DE ESTADO Y PRIORIDAD */}
          <div className="flex items-center gap-1.5 pl-2 shrink-0">
            {/* Priority Badge */}
            <div
              className={`px-2 py-[2px] rounded-md text-[9px] font-semibold border tracking-wide uppercase ${getPriorityStyles(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </div>

            {/* Status Badge */}
            <div
              className={`px-2 py-[2px] rounded-md text-[9px] font-bold border tracking-wide flex items-center gap-1 ${getStatusStyles(
                ticket.status
              )}`}
            >
              {/* Opcional: Pequeño dot para indicar estado vivo */}
              {["NUEVO", "ABIERTA", "EN_PROCESO", "URGENTE"].includes(
                ticket.status
              ) && (
                <span className="w-1 h-1 rounded-full bg-current opacity-70 animate-pulse" />
              )}
              {ticket.status.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT: Ticket List Container ---
const TicketsListContainer = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  colorMap,
  emptyMessage,
}: {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  colorMap: Record<string, string>;
  emptyMessage: { title: string; description: string };
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] w-full pr-3">
      <div className="flex flex-col pb-4">
        <AnimatePresence mode="popLayout">
          {tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 px-4"
            >
              <Alert className="bg-muted/50 border-dashed flex flex-col items-center text-center p-6 gap-2">
                <div className="p-3 rounded-full bg-background border shadow-sm">
                  <Terminal className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <AlertTitle className="mb-1">{emptyMessage.title}</AlertTitle>
                  <AlertDescription className="text-muted-foreground text-xs">
                    {emptyMessage.description}
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          ) : (
            tickets
              .sort((a, b) => Number(b.fixed) - Number(a.fixed))
              .map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={Number(selectedTicketId) === Number(ticket.id)}
                  onSelect={onSelectTicket}
                  avatarColor={colorMap[ticket.id] || "bg-gray-200"}
                />
              ))
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

// --- MAIN EXPORT ---
export default function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: TicketListProps) {
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Paleta "Vibrant Pastel" personalizada
    const avatarColors = [
      // Rosa Fuerte
      "bg-[#FF85A1] dark:bg-[#831843]",
      // Azul Cielo Intenso
      "bg-[#60A5FA] dark:bg-[#1E3A8A]",
      // Verde Menta Vibrante
      "bg-[#4ADE80] dark:bg-[#14532D]",
      // Naranja Coral
      "bg-[#FB923C] dark:bg-[#7C2D12]",
      // Violeta Profundo
      "bg-[#A78BFA] dark:bg-[#4C1D95]",
      // Turquesa
      "bg-[#2DD4BF] dark:bg-[#134E4A]",
      // Amarillo Ocre (para que se lea bien el texto)
      "bg-[#FACC15] dark:bg-[#713F12]",
      // Índigo Suave
      "bg-[#818CF8] dark:bg-[#312E81]",
    ];

    setColorMap((prev) => {
      const newMap = { ...prev };
      let hasChanges = false;
      tickets.forEach((t) => {
        if (!newMap[t.id]) {
          newMap[t.id] =
            avatarColors[Math.floor(Math.random() * avatarColors.length)];
          hasChanges = true;
        }
      });
      return hasChanges ? newMap : prev;
    });
  }, [tickets]);

  // Filtros
  const filterTickets = (statusFilter: (t: Ticket) => boolean) =>
    tickets.filter(statusFilter);

  const allActive = filterTickets(
    (t) =>
      t.status !== "RESUELTA" &&
      t.status !== "ARCHIVADA" &&
      t.status !== "CANCELADA"
  );
  const inProgress = filterTickets(
    (t) => t.status === "EN_PROCESO" || t.status === "PENDIENTE_TECNICO"
  );
  const resolved = filterTickets((t) => t.status === "RESUELTA");
  const archived = filterTickets(
    (t) => t.status === "ARCHIVADA" || t.status === "CANCELADA"
  );

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-lg border shadow-sm overflow-hidden">
      <Tabs defaultValue="inbox" className="w-full h-full flex flex-col">
        <div className="px-3 py-2 border-b bg-background/95 backdrop-blur">
          <TabsList className="grid w-full grid-cols-4 h-9 bg-muted/50 p-1">
            <TabsTrigger
              value="inbox"
              className="text-[10px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              TODOS ({allActive.length})
            </TabsTrigger>
            <TabsTrigger
              value="enProceso"
              className="text-[10px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              PROCESO ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger
              value="lista"
              className="text-[10px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              LISTOS ({resolved.length})
            </TabsTrigger>
            <TabsTrigger
              value="archivados"
              className="text-[10px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              HISTORIAL
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 bg-background">
          <TabsContent value="inbox" className="m-0 h-full">
            <TicketsListContainer
              tickets={allActive}
              selectedTicketId={selectedTicketId}
              onSelectTicket={onSelectTicket}
              colorMap={colorMap}
              emptyMessage={{
                title: "Todo al día",
                description:
                  "No tienes tickets pendientes en tu bandeja de entrada.",
              }}
            />
          </TabsContent>

          <TabsContent value="enProceso" className="m-0 h-full">
            <TicketsListContainer
              tickets={inProgress}
              selectedTicketId={selectedTicketId}
              onSelectTicket={onSelectTicket}
              colorMap={colorMap}
              emptyMessage={{
                title: "Sin actividad",
                description: "No hay tickets en proceso técnico actualmente.",
              }}
            />
          </TabsContent>

          <TabsContent value="lista" className="m-0 h-full">
            <TicketsListContainer
              tickets={resolved}
              selectedTicketId={selectedTicketId}
              onSelectTicket={onSelectTicket}
              colorMap={colorMap}
              emptyMessage={{
                title: "Sin resueltos",
                description: "Aún no has resuelto tickets hoy.",
              }}
            />
          </TabsContent>

          <TabsContent value="archivados" className="m-0 h-full">
            <TicketsListContainer
              tickets={archived}
              selectedTicketId={selectedTicketId}
              onSelectTicket={onSelectTicket}
              colorMap={colorMap}
              emptyMessage={{
                title: "Archivo limpio",
                description: "El historial de tickets está vacío.",
              }}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
