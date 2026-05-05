import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketCommentInputProps {
  isPending?: boolean;
  onSubmit: (text: string) => void;
}

export function TicketCommentInput({ isPending, onSubmit }: TicketCommentInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-1.5 px-3 py-2 border-t bg-white"
    >
      <textarea
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un seguimiento… (Enter para enviar)"
        disabled={isPending}
        className="flex-1 resize-none text-xs border border-gray-200 rounded px-2 py-1.5 leading-snug focus:outline-none focus:border-gray-400 placeholder:text-gray-300 disabled:opacity-50 bg-white"
      />
      <Button
        type="submit"
        disabled={isPending || !value.trim()}
        size="icon"
        className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 shrink-0 rounded"
        aria-label="Enviar comentario"
      >
        <Send className="w-3.5 h-3.5 text-white" />
      </Button>
    </form>
  );
}
