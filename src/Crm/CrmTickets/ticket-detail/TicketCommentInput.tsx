"use client";

import * as React from "react";
import { Send } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppTextarea } from "@/components/app/primitives/app-textarea";
import { AppInline } from "@/components/app/primitives/app-inline";
import { useAppStateHandlers } from "@/components/app/handlers";

interface TicketCommentInputProps {
  isPending?: boolean;
  onSubmit: (text: string) => void | Promise<void>;
}

export function TicketCommentInput({
  isPending,
  onSubmit,
}: TicketCommentInputProps) {
  const form = useAppStateHandlers({
    text: "",
  });

  const canSubmit = Boolean(form.state.text.trim()) && !isPending;

  const handleSubmit = React.useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();

      const trimmed = form.state.text.trim();

      if (!trimmed || isPending) return;

      await onSubmit(trimmed);
      form.setField("text", "");
    },
    [form, isPending, onSubmit],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || event.shiftKey) return;

      event.preventDefault();
      void handleSubmit();
    },
    [handleSubmit],
  );

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="shrink-0 border-t border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))] px-3 py-2"
    >
      <AppInline align="end" gap="xs" className="w-full">
        <AppTextarea
          value={form.state.text}
          onChange={(event) => form.setField("text", event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Escribe un seguimiento… Enter para enviar"
          disabled={isPending}
          size="xs"
          fieldWidth="full"
          className="min-h-[42px] resize-none text-xs leading-snug"
        />

        <AppButton
          type="submit"
          variant="primary"
          size="xs"
          width="auto"
          disabled={!canSubmit}
          loading={isPending}
          aria-label="Enviar comentario"
          className="h-8 w-8 shrink-0 p-0"
        >
          <Send size={14} />
        </AppButton>
      </AppInline>
    </form>
  );
}
