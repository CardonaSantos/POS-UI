"use client";

import { Button } from "@/components/ui/button";
import { MessageItem } from "./message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { WhatsappMessage } from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";
import { useEffect, useRef, useState } from "react";
import { FileIcon, Paperclip, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendAgentMessage } from "@/Crm/CrmHooks/hooks/bot-server/user-send-message/useSendAgentMessage";
import { useInvalidateQk } from "@/Crm/CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { clienteHistorialWhatsappQkeys } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/Qk";
import { FindClientHistoryQuery } from "@/Crm/CrmHooks/hooks/bot-server/use-cliente-whatsapp/query-cliente-whatsapp.query";

interface ChatContainerProps {
  className?: string; // 1. Agrega esto
  messages: WhatsappMessage[];
  clienteId: number;
  filters: FindClientHistoryQuery;
}

export function ChatContainer({
  messages,
  className,
  clienteId,
  filters,
}: ChatContainerProps) {
  const invalidateQk = useInvalidateQk();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); //  Ref para el input oculto
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado del archivo

  // Hook de mutación
  const { mutate: sendMessage, isPending } = useSendAgentMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    // Resetear value para permitir seleccionar el mismo archivo si se borra y vuelve a poner
    e.target.value = "";
  };

  // Enviar mensaje
  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !selectedFile) return; // No enviar si todo está vacío

    sendMessage(
      {
        clienteId,
        text: newMessage,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          setNewMessage(""); // Limpiar texto
          setSelectedFile(null); // Limpiar archivo
          // Enfocar de nuevo el input por comodidad
          setTimeout(() => textareaRef.current?.focus(), 100);

          invalidateQk(clienteHistorialWhatsappQkeys.chats(filters));
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {/* Input oculto para archivos */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 1. ScrollArea con flex-1 para ocupar todo el espacio disponible */}
      <ScrollArea className={cn("flex-1 w-full pr-4", className)}>
        <div className="space-y-4 pb-2 p-2">
          {messages.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
              No hay mensajes para mostrar
            </div>
          ) : (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 2. Área de Input: shrink-0 (no se aplasta), sin sticky, p-2 (compacto) */}
      <div className="border-t bg-background p-2 shrink-0 z-10">
        <div className="flex flex-col gap-2 w-full relative">
          {/* VISTA PREVIA DEL ARCHIVO ADJUNTO */}
          {selectedFile && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md w-fit max-w-full border">
              <div className="bg-primary/10 p-1.5 rounded">
                <FileIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-end gap-2 w-full">
            {/* Botón Clip Compacto (h-8 w-8) */}
            <Button
              variant="ghost"
              size="icon"
              className="mb-0.5 shrink-0 h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Textarea Compacto (min-h-38px) */}
            <Textarea
              ref={textareaRef}
              placeholder="Escribe un mensaje..."
              className="min-h-[38px] max-h-[120px] resize-none py-2 px-3 flex-1 text-sm leading-relaxed"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
            />

            {/* Botón Enviar Compacto (h-8 w-8) */}
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="mb-0.5 shrink-0 h-8 w-8"
              disabled={
                isPending || (newMessage.trim() === "" && !selectedFile)
              }
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
