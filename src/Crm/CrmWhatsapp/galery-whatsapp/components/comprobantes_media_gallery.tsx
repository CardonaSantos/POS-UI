import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  AlertCircle,
  CalendarDays,
  ExternalLink,
  FileText,
  ImageIcon,
  User,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  GalleryMediaRecord,
  GalleryMediaType,
} from "@/Crm/features/bot-server/galery/galery-types-response.types";

import {
  WazDirection,
  WazMediaType,
} from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";

interface Props {
  items: GalleryMediaRecord[];
  isLoading: boolean;
  isError: boolean;
}

function useResponsiveColumns() {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setColumns(4);
        return;
      }

      if (width >= 1024) {
        setColumns(3);
        return;
      }

      if (width >= 640) {
        setColumns(2);
        return;
      }

      setColumns(1);
    };

    updateColumns();

    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  return columns;
}

function chunkItems<T>(items: T[], columns: number) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += columns) {
    rows.push(items.slice(index, index + columns));
  }

  return rows;
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Fecha inválida";

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTypeLabel(type: GalleryMediaType) {
  const labels: Record<GalleryMediaType, string> = {
    [WazMediaType.IMAGE]: "Imagen",
    [WazMediaType.VIDEO]: "Video",
    [WazMediaType.DOCUMENT]: "Documento",
  };

  return labels[type] ?? "Archivo";
}

function getDirectionLabel(direction: unknown) {
  if (direction === WazDirection.INBOUND) return "Cliente";
  if (direction === WazDirection.OUTBOUND) return "Bot";

  return "Sin dirección";
}

function getDirectionVariant(direction: unknown): "default" | "outline" {
  return direction === WazDirection.INBOUND ? "default" : "outline";
}

function getClienteNombre(item: GalleryMediaRecord) {
  const nombre = item.cliente?.nombre?.trim();

  if (nombre) return nombre;

  const telefono = item.cliente?.telefono?.trim();

  if (telefono) return `Cliente ${telefono}`;

  const from = item.from?.trim();

  if (from) return `Cliente ${from}`;

  return "Cliente sin nombre";
}

function getClienteTelefono(item: GalleryMediaRecord) {
  const telefono = item.cliente?.telefono?.trim();

  if (telefono) return telefono;

  const from = item.from?.trim();

  if (from) return from;

  return "Sin teléfono";
}

function getBodyText(item: GalleryMediaRecord) {
  const body = item.body?.trim();

  if (body) return body;

  if (item.type === WazMediaType.IMAGE) return "Imagen sin mensaje";
  if (item.type === WazMediaType.VIDEO) return "Video sin mensaje";
  if (item.type === WazMediaType.DOCUMENT) return "Documento sin mensaje";

  return "Sin mensaje";
}

function getMediaUrl(item: GalleryMediaRecord) {
  const mediaUrl = item.mediaUrl?.trim();

  return mediaUrl || null;
}

function getMediaAlt(item: GalleryMediaRecord) {
  const cliente = getClienteNombre(item);
  const body = getBodyText(item);

  return `${getTypeLabel(item.type)} de ${cliente}: ${body}`;
}

function MediaIcon({ type }: { type: GalleryMediaType }) {
  if (type === WazMediaType.IMAGE) {
    return <ImageIcon className="size-3.5" aria-hidden="true" />;
  }

  if (type === WazMediaType.VIDEO) {
    return <Video className="size-3.5" aria-hidden="true" />;
  }

  return <FileText className="size-3.5" aria-hidden="true" />;
}

function EmptyMediaPreview({
  label = "Archivo no disponible",
}: {
  label?: string;
}) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
      <div className="flex flex-col items-center gap-1 text-center">
        <AlertCircle className="size-5" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}

function MediaPreview({ item }: { item: GalleryMediaRecord }) {
  const mediaUrl = getMediaUrl(item);

  if (!mediaUrl) {
    return <EmptyMediaPreview label="Sin archivo adjunto" />;
  }

  if (item.type === WazMediaType.IMAGE) {
    return (
      <img
        src={mediaUrl}
        alt={getMediaAlt(item)}
        loading="lazy"
        className="aspect-[4/3] w-full rounded-lg border object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  if (item.type === WazMediaType.VIDEO) {
    return (
      <video
        src={mediaUrl}
        controls
        preload="metadata"
        className="aspect-[4/3] w-full rounded-lg border bg-black object-cover"
      >
        Tu navegador no puede reproducir este video.
      </video>
    );
  }

  return (
    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border bg-muted p-3 text-center">
      <FileText className="size-8 text-muted-foreground" aria-hidden="true" />

      <p className="line-clamp-2 text-xs text-muted-foreground">
        {getBodyText(item)}
      </p>

      <Button
        asChild
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 text-xs"
      >
        <a href={mediaUrl} target="_blank" rel="noreferrer">
          Abrir
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </Button>
    </div>
  );
}

const ComprobanteMediaCard = memo(function ComprobanteMediaCard({
  item,
}: {
  item: GalleryMediaRecord;
}) {
  const type = item.type;
  const clienteNombre = getClienteNombre(item);
  const clienteTelefono = getClienteTelefono(item);
  const bodyText = getBodyText(item);
  const createdAt = formatDate(item.creadoEn);
  const directionLabel = getDirectionLabel(item.direction);

  return (
    <Card className="h-full overflow-hidden rounded-xl">
      <CardContent className="space-y-2 p-2">
        <MediaPreview item={item} />

        <div className="space-y-2 px-1 pb-1">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="gap-1 rounded-md text-[11px]">
              <MediaIcon type={type} />
              {getTypeLabel(type)}
            </Badge>

            <Badge
              variant={getDirectionVariant(item.direction)}
              className="rounded-md text-[11px]"
            >
              {directionLabel}
            </Badge>
          </div>

          <p className="line-clamp-2 min-h-8 text-xs text-foreground">
            {bodyText}
          </p>

          <div className="space-y-1 text-[11px] text-muted-foreground">
            <p className="flex min-w-0 items-center gap-1.5">
              <User className="size-3.5 shrink-0" aria-hidden="true" />

              <span className="truncate">
                {clienteNombre} · {clienteTelefono}
              </span>
            </p>

            <p className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />

              <span>{createdAt}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-xl border bg-muted"
        />
      ))}
    </div>
  );
}

export function ComprobantesMediaGallery({ items, isLoading, isError }: Props) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const columns = useResponsiveColumns();

  const safeItems = Array.isArray(items) ? items : [];

  const rows = useMemo(() => {
    return chunkItems(safeItems, columns);
  }, [safeItems, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 335,
    overscan: 6,
  });

  if (isLoading) return <LoadingGrid />;

  if (isError) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card p-6 text-center">
        <div className="max-w-sm space-y-1">
          <h2 className="text-sm font-semibold">
            No se pudo cargar la galería
          </h2>

          <p className="text-xs text-muted-foreground">
            Revisa el endpoint, permisos o conexión con el servidor.
          </p>
        </div>
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card p-6 text-center">
        <div className="max-w-sm space-y-1">
          <h2 className="text-sm font-semibold">Sin comprobantes</h2>

          <p className="text-xs text-muted-foreground">
            No hay imágenes, videos o documentos con los filtros actuales.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Resultados de comprobantes">
      <div
        ref={parentRef}
        className="h-[calc(100dvh-13rem)] min-h-[420px] overflow-auto rounded-xl border bg-background p-2"
      >
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] ?? [];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute left-0 top-0 grid w-full gap-3 pb-3"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {row.map((item, itemIndex) => {
                  const key =
                    item.id ??
                    item.wamid ??
                    `${item.cliente?.telefono ?? item.from ?? "media"}-${
                      virtualRow.index
                    }-${itemIndex}`;

                  return <ComprobanteMediaCard key={key} item={item} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
