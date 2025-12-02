export const BotQkeys = {
  all: ["bot"] as const,
  specific: (botId: number) => ["bot", botId],
};

export const KnowledgeQkeys = {
  all: ["knowledge"] as const,
  specific: (kId: number) => ["knowledge", kId],
};
