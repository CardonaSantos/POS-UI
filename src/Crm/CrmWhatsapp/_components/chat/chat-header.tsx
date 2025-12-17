import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  clientName: string;
  clientPhone: string;
  toggleFilters: () => void;
  showFilters: boolean;
}

export function ChatHeader({
  clientName,
  clientPhone,
  toggleFilters,
  showFilters,
}: ChatHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-b bg-background p-1 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs">
            {getInitials(clientName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-semibold">{clientName}</h2>
          <p className="text-xs text-muted-foreground">{clientPhone}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Opciones de chat</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              onClick={toggleFilters}
              checked={showFilters}
            >
              Filtros
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Eliminar cliente (próximamente)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Bloquear bot (próximamente)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Bloquear cliente (próximamente)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
