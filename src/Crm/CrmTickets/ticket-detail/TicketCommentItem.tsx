import { Comment } from "../ticketTypes";

interface TicketCommentItemProps {
  comment: Comment;
}

/** Formats an ISO date string to "DD mmm, HH:MM" */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("es", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function TicketCommentItem({ comment }: TicketCommentItemProps) {
  const initial = comment.user?.name
    ? comment.user.name.charAt(0).toUpperCase()
    : "?";
  const userName = comment.user?.name ?? "Usuario eliminado";

  return (
    <div className="flex gap-2 group">
      {/* Avatar */}
      <div
        className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold uppercase"
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-[10px] font-semibold text-gray-700 truncate">
            {userName}
          </span>
          <span className="text-[9px] text-gray-300 shrink-0">
            {formatDate(comment.date)}
          </span>
          {comment.isPrivate && (
            <span className="text-[9px] text-amber-500 font-medium shrink-0">
              · privado
            </span>
          )}
        </div>

        <div className="px-2 py-1 bg-white border border-gray-100 rounded rounded-tl-none">
          <p className="text-xs text-gray-600 leading-snug whitespace-pre-wrap break-words">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}
