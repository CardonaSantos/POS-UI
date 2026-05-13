"use client";

import { ClienteWhatsappServerListItem } from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import { cn } from "@/lib/utils";
import { BotIcon, BellOff } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(creadoEn: string | null | undefined): string {
  if (!creadoEn) return "";

  const date = new Date(creadoEn);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString("es-GT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return "Ayer";

  return date.toLocaleDateString("es-GT", { day: "2-digit", month: "2-digit" });
}

function Avatar({
  iniciales,
  avatarUrl,
}: {
  iniciales: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={iniciales}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <span className="text-xs font-medium text-muted-foreground uppercase leading-none">
        {iniciales?.slice(0, 2)}
      </span>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

interface ChatSidebarItemProps {
  item: ClienteWhatsappServerListItem;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export function ChatSidebarItem({
  item,
  isSelected,
  onClick,
}: ChatSidebarItemProps) {
  const { contacto, chat, ultimoMensaje } = item;
  const lastMsg = ultimoMensaje?.contenido ?? "";
  const time = formatTimestamp(ultimoMensaje?.creadoEn ?? chat.lastActivityAt);
  const unread = chat.unreadCount ?? 0;
  const isOutbound = ultimoMensaje?.direccion === "OUTBOUND";

  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-border/50 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        isSelected ? "bg-accent" : "hover:bg-muted/60",
      )}
      aria-current={isSelected ? "true" : undefined}
      aria-label={`Chat con ${contacto.nombre}`}
    >
      {/* Avatar */}
      <Avatar iniciales={contacto.iniciales} avatarUrl={contacto.avatarUrl} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-medium truncate leading-none">
            {contacto.nombre}
          </span>
          <span
            className={cn(
              "text-xs shrink-0",
              unread > 0 ? "text-primary font-medium" : "text-muted-foreground",
            )}
          >
            {time}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="text-xs text-muted-foreground truncate leading-relaxed">
            {isOutbound && (
              <span className="text-muted-foreground/70 mr-0.5">Tú:</span>
            )}
            {lastMsg}
          </p>

          {/* Right badges */}
          <div className="flex items-center gap-1 shrink-0">
            {!contacto.botActivo && (
              <BotIcon
                className="w-3 h-3 text-muted-foreground/60"
                aria-label="Bot desactivado"
              />
            )}
            {chat.muted && (
              <BellOff
                className="w-3 h-3 text-muted-foreground/60"
                aria-label="Silenciado"
              />
            )}
            {unread > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
