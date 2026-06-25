"use client";

import { MessageSquare } from "lucide-react";

import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { TicketMetrics } from "./TicketMetrics";
import { TicketCommentItem } from "./TicketCommentItem";
import type { MetricsTicket, Ticket } from "../ticketTypes";

interface TicketTimelineProps {
  comments: Ticket["comments"];
  creator: Ticket["creator"];
  date: string;
  closedAt: string;
  metricas: MetricsTicket;
}

export function TicketTimeline({
  comments,
  creator,
  metricas,
  closedAt,
  date,
}: TicketTimelineProps) {
  const hasComments = Boolean(comments?.length);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[hsl(var(--app-border,var(--border)))]">
      <AppStack gap="sm" className="px-3 py-2">
        <AppInline
          align="center"
          justify="center"
          gap="xs"
          wrap
          className="select-none text-center text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        >
          {creator ? (
            <>
              <span>
                Creado por{" "}
                <span className="font-medium text-[hsl(var(--app-foreground,var(--foreground))/0.82)]">
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

        <TicketMetrics metricas={metricas} />

        <AppStack gap="sm">
          {hasComments ? (
            comments?.map((comment, index) => (
              <TicketCommentItem
                key={`${comment.date}-${index}`}
                comment={comment}
              />
            ))
          ) : (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<MessageSquare size={26} strokeWidth={1.5} />}
              title="Sin comentarios"
              description="Aún no hay seguimientos registrados para este ticket."
              className="py-6"
            />
          )}
        </AppStack>
      </AppStack>
    </div>
  );
}
