export interface TicketSignaturePadFileOptions {
  fileName?: string;
}

export interface TicketSignaturePadHandle {
  clear: () => void;

  isEmpty: () => boolean;

  toBlob: () => Promise<Blob | null>;

  toFile: (options?: TicketSignaturePadFileOptions) => Promise<File | null>;
}

export interface TicketSignaturePadProps {
  disabled?: boolean;

  required?: boolean;

  invalid?: boolean;

  error?: string;

  label?: string;

  description?: string;

  onEmptyChange?: (isEmpty: boolean) => void;
}
