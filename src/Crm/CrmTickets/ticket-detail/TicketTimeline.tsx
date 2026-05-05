import { TicketMetrics } from "./TicketMetrics";
import { TicketCommentItem } from "./TicketCommentItem";
import { MetricsTicket, Ticket } from "../ticketTypes";

interface TicketTimelineProps {
  comments: Ticket["comments"];
  creator: Ticket["creator"];
  metricas: MetricsTicket;
}

export function TicketTimeline({
  comments,
  creator,
  metricas,
}: TicketTimelineProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
      {/* Creator hint */}
      {creator && (
        <p className="text-center text-[9px] text-gray-300 pt-2 pb-1 select-none">
          Creado por {creator.name}
        </p>
      )}

      {/* Metrics: time + resolution */}
      <TicketMetrics metricas={metricas} />

      {/* Comment list */}
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
