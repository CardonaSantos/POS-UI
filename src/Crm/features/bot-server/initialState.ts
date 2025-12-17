import { BotApi } from "./bot.interfaces";

export const initialBotState: BotApi = {
  id: 0,
  empresaId: 0,

  nombre: "",
  slug: "",
  descripcion: null,

  provider: "",
  model: "",

  systemPrompt: "",
  contextPrompt: null,
  historyPrompt: null,
  outputStyle: null,

  maxCompletionTokens: 500,
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxHistoryMessages: 10,

  status: "ACTIVE",

  creadoEn: new Date().toISOString(),
  actualizadoEn: new Date().toISOString(),
};
