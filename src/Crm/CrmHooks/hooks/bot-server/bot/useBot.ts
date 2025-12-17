import { useBotMutation, useBotQuery } from "@/hooks/hookBot/useBotHook";
import { BotQkeys, KnowledgeQkeys } from "./Qk";
import { BotApi, BotUpdateDto } from "@/Crm/features/bot-server/bot.interfaces";
import { useQueryClient } from "@tanstack/react-query";
import {
  KnowledgeDocument,
  KnowledgeDocumentUpdate,
} from "@/Crm/features/bot-server/knowledge/knowledge";
import { KnowledgeCreateType } from "@/Crm/CrmBot/_components/knowledge/schema-knowledge";

// BOT
export function useGetBot() {
  return useBotQuery<BotApi>(BotQkeys.all, `bot/${1}`, undefined, {
    staleTime: 0,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}

export function useUpdateBot(botId: number) {
  const queryClient = useQueryClient();
  return useBotMutation<void, BotUpdateDto>(
    "patch",
    `bot/${botId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: BotQkeys.specific(botId),
        });
      },
    }
  );
}

// KNOWLEDGE
export function getAllKnowledgeBot() {
  return useBotQuery<Array<KnowledgeDocument>>(
    KnowledgeQkeys.all,
    `knowledge`,
    undefined,
    {
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
  );
}

export function useUpdateKnowledge(kId: number) {
  const queryClient = useQueryClient();
  return useBotMutation<void, KnowledgeDocumentUpdate>(
    "patch",
    `knowledge/${kId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: KnowledgeQkeys.all,
        });
      },
    }
  );
}

export function useCreateKnowledge() {
  const queryClient = useQueryClient();
  return useBotMutation<void, KnowledgeCreateType>(
    "post",
    `knowledge`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: KnowledgeQkeys.all,
        });
      },
    }
  );
}

export function useDeleteKnowledge(kId: number) {
  const queryClient = useQueryClient();
  return useBotMutation<void, void>("delete", `knowledge/${kId}`, undefined, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: KnowledgeQkeys.all,
      });
    },
  });
}
