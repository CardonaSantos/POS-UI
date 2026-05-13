import { Inbox } from "lucide-react";

interface TicketEmptyStateProps {
  title: string;
  description: string;
}

export function TicketEmptyState({
  title,
  description,
}: TicketEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-10 px-4 text-center">
      <Inbox className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/60 max-w-[180px]">
        {description}
      </p>
    </div>
  );
}
