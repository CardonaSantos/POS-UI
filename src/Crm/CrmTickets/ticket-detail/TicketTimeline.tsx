import { TicketMetrics } from "./TicketMetrics";
import { TicketCommentItem } from "./TicketCommentItem";
import { MetricsTicket, Ticket } from "../ticketTypes";

interface TicketTimelineProps {
  comments: Ticket["comments"];
  creator: Ticket["creator"];

  date: Ticket["date"];
  closedAt: Ticket["closedAt"];

  metricas: MetricsTicket;
}

export function TicketTimeline({
  comments,
  creator,
  metricas,
  closedAt,
  date,
}: TicketTimelineProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-3 pt-2 pb-1 text-center text-[9px] text-muted-foreground select-none">
        {creator && (
          <>
            <span>
              Creado por{" "}
              <span className="font-medium text-foreground/80">
                {creator.name}
              </span>
            </span>
            <span className="text-muted-foreground/50">·</span>
          </>
        )}

        <span>Creado {date}</span>

        {closedAt && (
          <>
            <span className="text-muted-foreground/50">·</span>
            <span>Cerrado {closedAt}</span>
          </>
        )}
      </div>

      <TicketMetrics metricas={metricas} />

      <div className="px-3 py-2 space-y-2">
        {comments && comments.length > 0 ? (
          comments.map((comment, i) => (
            <TicketCommentItem key={i} comment={comment} />
          ))
        ) : (
          <p className="text-center text-[10px] text-gray-300 italic py-6">
            Sin comentarios aún.
          </p>
        )}
      </div>
    </div>
  );
}
