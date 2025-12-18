import { useBotMutation } from "@/hooks/hookBot/useBotHook";

export function useMarkAsReadMessages(clienteId: number) {
  return useBotMutation<void, void>("patch", `chat/${clienteId}/mark-as-read`);
}
