"use client";

import { MessageItem } from "./message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WhatsappMessage } from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";
import { useEffect, useRef } from "react";

interface ChatContainerProps {
  messages: WhatsappMessage[];
}

export function ChatContainer({ messages }: ChatContainerProps) {
  // 1. Cambiamos el nombre para que tenga sentido: referencia al FINAL
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // 2. Usamos scrollIntoView
    // behavior: "smooth" hace que baje suavemente (animado)
    // behavior: "auto" hace que salte de golpe (mejor para la carga inicial)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Se ejecuta cada vez que llega un mensaje nuevo

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No hay mensajes para mostrar
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4 space-y-1">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* 3. El div invisible ancla */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
