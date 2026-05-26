import {
  WazDirection,
  WazMediaType,
  WazStatus,
} from "../clientes-whatsapp-server/clientes-whatsapp-server";

export interface QueryMediaSearch {
  creadoEn?: string;
  clienteId?: number;
  startDate?: string;
  endDate?: string;
  type?: WazMediaType;
  direction?: WazDirection;
}

export interface MediaCliente {
  id: number;
  nombre: string;
  telefono: string;
}

export interface WazMediaRecord {
  id: number;
  body: string | null;
  direction: WazDirection;
  creadoEn: string;
  actualizadoEn: string;
  from: string;
  to: string;
  status: WazStatus;
  type: WazMediaType;
  wamid: string;
  mediaUrl: string | null;
  cliente: MediaCliente;
}

export const GALLERY_MEDIA_TYPES = [
  WazMediaType.IMAGE,
  WazMediaType.VIDEO,
  WazMediaType.DOCUMENT,
] as const;

export type GalleryMediaType = (typeof GALLERY_MEDIA_TYPES)[number];

export type GalleryMediaRecord = Omit<WazMediaRecord, "type"> & {
  type: GalleryMediaType;
};

export interface MediaFilterState {
  creadoEn: string;
  clienteId: string;
  startDate: string;
  endDate: string;
  type: GalleryMediaType | "ALL";
  direction: WazDirection | "ALL";
}

export const INITIAL_MEDIA_FILTERS: MediaFilterState = {
  creadoEn: "",
  clienteId: "",
  startDate: "",
  endDate: "",
  type: "ALL",
  direction: WazDirection.INBOUND,
};

export function isGalleryMediaType(
  type: WazMediaType,
): type is GalleryMediaType {
  return (GALLERY_MEDIA_TYPES as readonly WazMediaType[]).includes(type);
}
