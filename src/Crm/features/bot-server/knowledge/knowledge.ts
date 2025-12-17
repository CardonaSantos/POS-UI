export interface KnowledgeDocument {
  id: number;
  empresaId: number;
  tipo: KnowledgeDocumentType;
  externoId: string | null;
  origen: string | null;
  titulo: string;
  descripcion: string | null;
  textoLargo: string;
  creadoEn: string;
  actualizadoEn: string;
}

export enum KnowledgeDocumentType {
  FAQ = "FAQ",
  DOCUMENTO = "DOCUMENTO",
  CONTRATO = "CONTRATO",
  PLAN = "PLAN",
  TICKET = "TICKET",
  COBRO = "COBRO",
  OTRO = "OTRO",
}

// 👇 id obligatorio, el resto parcial
export type KnowledgeDocumentUpdate = {
  id: number;
} & Partial<KnowledgeDocument>;

export const initialKnowledgeDocumentState: KnowledgeDocument = {
  id: 0,
  empresaId: 0,
  tipo: KnowledgeDocumentType.FAQ,
  externoId: null,
  origen: null,
  titulo: "",
  descripcion: null,
  textoLargo: "",
  creadoEn: new Date().toISOString(),
  actualizadoEn: new Date().toISOString(),
};
