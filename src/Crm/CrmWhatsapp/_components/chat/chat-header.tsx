import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Bot, Power, Ban, Filter, Zap } from "lucide-react"; // Nuevos iconos
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importante para lógica condicional de clases

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem, // Usaré Item normal para acciones, Checkbox para estados
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  clientName: string;
  clientPhone: string;
  toggleFilters: () => void;
  showFilters: boolean;
  botActivo: boolean;
  toggleOpen: () => void;
}

export function ChatHeader({
  clientName,
  clientPhone,
  toggleFilters,
  showFilters,
  botActivo,
  toggleOpen,
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
    // Agregamos backdrop-blur si quieres que sea medio transparente, o dejalo bg-background
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* AVATAR CON ESTADO */}
        <div className="relative">
          <Avatar
            className={cn(
              "h-10 w-10 transition-all duration-300",
              // Si el bot está activo, añade un anillo verde brillante
              botActivo
                ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background"
                : "grayscale opacity-90"
            )}
          >
            {/* Fallback con gradiente sutil para verse mas moderno */}
            <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-medium text-xs">
              {getInitials(clientName)}
            </AvatarFallback>
          </Avatar>

          {/* Indicador de estado (Puntito) */}
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background transition-colors",
              botActivo ? "bg-emerald-500" : "bg-gray-400"
            )}
          />
        </div>

        {/* INFO CLIENTE + ESTADO TEXTUAL */}
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold leading-none mb-1">
            {clientName}
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              {clientPhone}
            </span>
            <span className="text-[10px] text-muted-foreground/30">•</span>
            {/* Pequeña etiqueta de estado */}
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] font-medium transition-colors",
                botActivo ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {botActivo ? (
                <Bot className="h-3 w-3" />
              ) : (
                <Power className="h-3 w-3" />
              )}
              {botActivo ? "IA Activa" : "IA Pausada"}
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Configuración de sesión
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              onClick={toggleFilters}
              checked={showFilters}
              className="text-xs"
            >
              <Filter className="mr-2 h-3.5 w-3.5 opacity-70" />
              Ver Filtros
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            {/* Switch del Bot destacado */}
            <DropdownMenuItem
              onClick={toggleOpen}
              className={cn(
                "focus:bg-accent cursor-pointer",
                botActivo
                  ? "text-red-600 focus:text-red-600"
                  : "text-emerald-600 focus:text-emerald-600"
              )}
            >
              {botActivo ? (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  <span>Desactivar Bot</span>
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Activar Bot</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled className="text-xs opacity-50">
              <Ban className="mr-2 h-3.5 w-3.5" />
              Bloquear cliente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
