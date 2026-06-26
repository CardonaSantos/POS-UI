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

function getInitials(name?: string | null) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!words.length) return "?";

  return words
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAvatarUrl(avatar?: string | { url?: string } | null) {
  if (!avatar) return "";

  if (typeof avatar === "string") return avatar;

  return avatar.url ?? "";
}

function CommentAvatar({
  name,
  perfil,
}: {
  name: string;
  perfil?: {
    avatar?: string | { url?: string } | null;
    portadaUrl?: string | null;
    bio?: string | null;
  } | null;
}) {
  const avatarUrl = getAvatarUrl(perfil?.avatar);
  const initials = getInitials(name);
  const bio = perfil?.bio?.trim() || "Sin biografía registrada.";

  const tooltipText = [`${name}`, `Bio: ${bio}`].join("\n");

  return (
    <span
      title={tooltipText}
      className={[
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full",
        "border border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-muted,var(--muted))/0.65)]",
        "text-[9px] font-bold uppercase",
        "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
        "transition",
        "hover:border-[hsl(var(--app-primary,var(--primary))/0.55)]",
        "hover:ring-2 hover:ring-[hsl(var(--app-primary,var(--primary))/0.14)]",
      ].join(" ")}
      aria-hidden="true"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
}

export function TicketCommentItem({ comment }: TicketCommentItemProps) {
  const userName = comment.user?.name ?? "Usuario eliminado";

  /**
   * Ajusta esta línea según tu DTO real:
   * - Si viene en comment.user.perfil, deja así.
   * - Si viene en comment.perfil, cambia a: const perfil = comment.perfil;
   */
  const perfil = comment.perfil;

  return (
    <div className="group flex gap-2">
      <CommentAvatar name={userName} perfil={perfil} />

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline gap-1">
          <span className="truncate text-[10px] font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {userName}
          </span>

          <span className="shrink-0 text-[9px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {formatDate(comment.date)}
          </span>

          {comment.isPrivate ? (
            <span className="shrink-0 text-[9px] font-medium text-[hsl(var(--app-warning))]">
              · privado
            </span>
          ) : null}
        </div>

        <div
          className={[
            "rounded rounded-tl-none border px-2 py-1",
            "border-[hsl(var(--app-border,var(--border)))]",
            "bg-[hsl(var(--app-muted,var(--muted))/0.12)]",
          ].join(" ")}
        >
          <p className="whitespace-pre-wrap break-words text-xs leading-snug text-[hsl(var(--app-foreground,var(--foreground)))]">
            {comment.text || "Sin comentario"}
          </p>
        </div>
      </div>
    </div>
  );
}
