import { MessageSquare } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3 select-none"
      aria-label="Selecciona un chat para comenzar"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Selecciona un chat
        </p>
      </div>
    </div>
  );
}
