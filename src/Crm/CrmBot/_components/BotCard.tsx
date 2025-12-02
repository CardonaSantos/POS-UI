import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cpu, FileText, Gauge, SlidersHorizontal, Timer } from "lucide-react";
import { BotType } from "./form/schema";

interface BotGeneralProps {
  bot: BotType;
  knowledgeCount: number;
}

const formatDate = (iso: string | undefined) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

const BotGeneralCard: React.FC<BotGeneralProps> = ({ bot, knowledgeCount }) => {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Cpu className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold leading-tight">
                {bot.nombre}
              </h2>
              <Badge
                variant={bot.status === "ACTIVE" ? "default" : "secondary"}
                className="h-5 px-2 text-[11px]"
              >
                {bot.status === "ACTIVE" ? "Activo" : "Deshabilitado"}
              </Badge>
            </div>

            {bot.descripcion && (
              <p className="text-xs text-muted-foreground">{bot.descripcion}</p>
            )}

            <div className="flex flex-wrap gap-1.5 text-[11px] mt-1.5">
              <Badge variant="outline" className="font-mono">
                slug: {bot.slug}
              </Badge>
              <Badge variant="outline">{bot.provider}</Badge>
              <Badge variant="outline" className="max-w-[220px] truncate">
                {bot.model}
              </Badge>
              <Badge variant="outline">
                Docs conocimiento: {knowledgeCount}
              </Badge>
            </div>
          </div>

          <div className="text-right text-[11px] text-muted-foreground space-y-0.5">
            <div>Creado: {formatDate(bot.creadoEn)}</div>
            <div>Actualizado: {formatDate(bot.actualizadoEn)}</div>
          </div>
        </div>

        <Separator />

        {/* Parámetros de generación */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" />
              <span>Tokens máx.</span>
            </div>
            <p className="font-mono text-sm">{bot.maxCompletionTokens}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Temperatura</span>
            </div>
            <p className="font-mono text-sm">{bot?.temperature?.toFixed(2)}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Top P</span>
            </div>
            <p className="font-mono text-sm">{bot.topP?.toFixed(2)}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Freq. penalty</span>
            </div>
            <p className="font-mono text-sm">
              {bot.frequencyPenalty?.toFixed(2)}
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Presence penalty</span>
            </div>
            <p className="font-mono text-sm">
              {bot.presencePenalty?.toFixed(2)}
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Timer className="h-3.5 w-3.5" />
              <span>Historial máx.</span>
            </div>
            <p className="font-mono text-sm">{bot.maxHistoryMessages}</p>
          </div>
        </div>

        <Separator />

        {/* System prompt */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>System prompt</span>
          </div>
          <p className="text-[11px] font-mono bg-muted/60 rounded-md p-2 max-h-40 overflow-auto whitespace-pre-wrap">
            {bot.systemPrompt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotGeneralCard;
