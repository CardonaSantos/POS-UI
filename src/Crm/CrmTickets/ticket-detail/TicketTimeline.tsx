"use client";

import * as React from "react";

import {
  ChevronDown,
  History,
  LoaderCircle,
  MessageSquare,
} from "lucide-react";

import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  TicketHistoryItem,
  TicketHistoryType,
} from "@/Crm/CrmHooks/hooks/use-tickets/useTicketHistory";

import { TicketMetrics } from "./TicketMetrics";
import { TicketCommentItem } from "./TicketCommentItem";

import type { Comment, MetricsTicket, Ticket } from "../ticketTypes";

// =========================================================
// PROPS
// =========================================================

interface TicketTimelineProps {
  comments: Ticket["comments"];

  history: TicketHistoryItem[];

  isHistoryLoading?: boolean;

  creator: Ticket["creator"];

  date: string;

  closedAt: string;

  metricas: MetricsTicket;
}

// =========================================================
// TIMELINE UNIFICADA
// =========================================================

type TimelineItem =
  | {
      kind: "comment";

      id: string;

      date: string;

      comment: Comment;
    }
  | {
      kind: "history";

      id: string;

      date: string;

      history: TicketHistoryItem;
    };

// =========================================================
// LABELS DE AUDITORÍA
// =========================================================

const HISTORY_LABELS: Record<TicketHistoryType, string> = {
  CREADO: "Creó el ticket",

  ACTUALIZADO: "Editó el ticket",

  ESTADO_CAMBIADO: "Cambió el estado",

  PRIORIDAD_CAMBIADA: "Cambió la prioridad",

  ASIGNACION_CAMBIADA: "Cambió la asignación",

  CANCELADO: "Canceló el ticket",

  REABIERTO: "Reabrió el ticket",

  FIJADO: "Fijó el ticket",

  DESFIJADO: "Desfijó el ticket",
};

// =========================================================
// HELPERS
// =========================================================

function formatTimelineDate(iso: string): string {
  try {
    const date = new Date(iso);

    return date.toLocaleString("es-GT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function getInitials(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) {
    return "?";
  }

  return parts
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

// =========================================================
// ITEM DE HISTORIAL
// =========================================================

interface TicketHistoryEventProps {
  history: TicketHistoryItem;
}

function TicketHistoryEvent({ history }: TicketHistoryEventProps) {
  const [open, setOpen] = React.useState(false);

  const actorName = history.actor?.nombre || "Sistema";

  const label = HISTORY_LABELS[history.tipo] ?? "Modificó el ticket";

  const initials = getInitials(actorName);

  return (
    <div className="group flex gap-2">
      {/* =================================================
          AVATAR / ICONO
          ================================================= */}

      <span
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0",
          "items-center justify-center",
          "rounded-full",
          "border",
          "border-[hsl(var(--app-primary,var(--primary))/0.28)]",
          "bg-[hsl(var(--app-primary,var(--primary))/0.08)]",
          "text-[8px] font-bold uppercase",
          "text-[hsl(var(--app-primary,var(--primary)))]",
        ].join(" ")}
        title={actorName}
      >
        {history.actor?.usuarioId ? (
          initials
        ) : (
          <History size={11} strokeWidth={1.8} />
        )}
      </span>

      {/* =================================================
          CONTENIDO
          ================================================= */}

      <div className="min-w-0 flex-1">
        {/* HEADER */}

        <div className="mb-0.5 flex items-baseline gap-1">
          <span
            className={[
              "truncate",
              "text-[10px]",
              "font-semibold",
              "text-[hsl(var(--app-foreground,var(--foreground)))]",
            ].join(" ")}
          >
            {actorName}
          </span>

          <span
            className={[
              "shrink-0",
              "text-[9px]",
              "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
            ].join(" ")}
          >
            {formatTimelineDate(history.creadoEn)}
          </span>
        </div>

        {/* =================================================
            EVENTO EXPANDIBLE
            ================================================= */}

        <div
          className={[
            "overflow-hidden rounded",
            "rounded-tl-none",
            "border",
            "border-[hsl(var(--app-border,var(--border)))]",
            "bg-[hsl(var(--app-muted,var(--muted))/0.08)]",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className={[
              "flex w-full",
              "items-center",
              "justify-between",
              "gap-2",
              "px-2 py-1.5",
              "text-left",
              "transition-colors",
              "hover:bg-[hsl(var(--app-muted,var(--muted))/0.25)]",
            ].join(" ")}
            aria-expanded={open}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <History
                size={12}
                className="shrink-0 text-[hsl(var(--app-primary,var(--primary)))]"
              />

              <span
                className={[
                  "truncate",
                  "text-[11px]",
                  "font-medium",
                  "text-[hsl(var(--app-foreground,var(--foreground)))]",
                ].join(" ")}
              >
                {label}
              </span>
            </span>

            <ChevronDown
              size={13}
              className={[
                "shrink-0",
                "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                "transition-transform duration-200",
                open ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {/* ===============================================
              DETALLE
              =============================================== */}

          {open ? (
            <div
              className={[
                "border-t",
                "border-[hsl(var(--app-border,var(--border)))]",
                "px-2 py-2",
                "bg-[hsl(var(--app-background,var(--background))/0.45)]",
              ].join(" ")}
            >
              <p
                className={[
                  "whitespace-pre-wrap",
                  "break-words",
                  "text-[10px]",
                  "leading-relaxed",
                  "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                ].join(" ")}
              >
                {history.descripcion || "Cambio registrado en el ticket."}
              </p>

              <div className="mt-1.5 flex items-center gap-1 text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground))/0.75)]">
                <span>Tipo:</span>

                <span className="font-medium">{history.tipo}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// COMPONENT
// =========================================================

export function TicketTimeline({
  comments,
  history,
  isHistoryLoading = false,
  creator,
  metricas,
  closedAt,
  date,
}: TicketTimelineProps) {
  // =======================================================
  // COMENTARIOS + HISTORIAL
  // =======================================================

  const timelineItems = React.useMemo<TimelineItem[]>(() => {
    const commentItems: TimelineItem[] = (comments ?? []).map(
      (comment, index) => ({
        kind: "comment",

        id: `comment-${comment.date}-${index}`,

        date: comment.date,

        comment,
      }),
    );

    const historyItems: TimelineItem[] = (history ?? []).map((item) => ({
      kind: "history",

      id: `history-${item.id}`,

      date: item.creadoEn,

      history: item,
    }));

    return [...commentItems, ...historyItems].sort(
      (a, b) => getTimestamp(a.date) - getTimestamp(b.date),
    );
  }, [comments, history]);

  const hasActivity = timelineItems.length > 0;

  return (
    <div
      className={[
        "min-h-0 flex-1",
        "overflow-y-auto",
        "scrollbar-thin",
        "scrollbar-thumb-[hsl(var(--app-border,var(--border)))]",
      ].join(" ")}
    >
      <AppStack gap="sm" className="px-3 py-2">
        {/* =================================================
            CABECERA
            ================================================= */}

        <AppInline
          align="center"
          justify="center"
          gap="xs"
          wrap
          className={[
            "select-none",
            "text-center",
            "text-[9px]",
            "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
          ].join(" ")}
        >
          {creator ? (
            <>
              <span>
                Creado por{" "}
                <span
                  className={[
                    "font-medium",
                    "text-[hsl(var(--app-foreground,var(--foreground))/0.82)]",
                  ].join(" ")}
                >
                  {creator.name}
                </span>
              </span>

              <span className="opacity-50">·</span>
            </>
          ) : null}

          {date ? <span>Creado {date}</span> : null}

          {closedAt ? (
            <>
              <span className="opacity-50">·</span>

              <span>Cerrado {closedAt}</span>
            </>
          ) : null}
        </AppInline>

        {/* =================================================
            MÉTRICAS
            ================================================= */}

        <TicketMetrics metricas={metricas} />

        {/* =================================================
            TIMELINE
            ================================================= */}

        <AppStack gap="sm">
          {hasActivity
            ? timelineItems.map((item) => {
                if (item.kind === "comment") {
                  return (
                    <TicketCommentItem key={item.id} comment={item.comment} />
                  );
                }

                return (
                  <TicketHistoryEvent key={item.id} history={item.history} />
                );
              })
            : null}

          {/* ===============================================
              CARGANDO HISTORIAL
              =============================================== */}

          {isHistoryLoading ? (
            <div
              className={[
                "flex items-center",
                "justify-center",
                "gap-1.5",
                "py-3",
                "text-[10px]",
                "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
              ].join(" ")}
            >
              <LoaderCircle size={13} className="animate-spin" />

              <span>Cargando historial...</span>
            </div>
          ) : null}

          {/* ===============================================
              VACÍO
              =============================================== */}

          {!hasActivity && !isHistoryLoading ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<MessageSquare size={26} strokeWidth={1.5} />}
              title="Sin actividad"
              description="Aún no hay comentarios ni cambios registrados para este ticket."
              className="py-6"
            />
          ) : null}
        </AppStack>
      </AppStack>
    </div>
  );
}
