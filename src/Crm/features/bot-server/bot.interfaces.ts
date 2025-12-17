// Si quieres reutilizar el status como tipo
export type BotStatus = "ACTIVE" | "DISABLED";

export interface BotApi {
  id: number;
  empresaId: number;

  nombre: string;
  slug: string;
  descripcion: string | null;

  provider: string;
  model: string;

  systemPrompt: string;
  contextPrompt: string | null;
  historyPrompt: string | null;
  outputStyle: string | null;

  maxCompletionTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxHistoryMessages: number;

  status: BotStatus;

  creadoEn: string; // ISO string desde el backend
  actualizadoEn: string; // igual
}

export type BotUpdateDto = Partial<BotApi>;
