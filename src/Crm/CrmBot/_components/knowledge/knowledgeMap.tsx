import { KnowledgeDocument } from "@/Crm/features/bot/knowledge/knowledge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CalendarClock, Tag } from "lucide-react";

interface PropsKnowledge {
  knowledge: KnowledgeDocument[];
  handleSelectKnowledge: (k: KnowledgeDocument) => void;
  handleCreateNewK: () => void;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function KnowledgeMap({
  knowledge,
  handleSelectKnowledge,
  handleCreateNewK,
}: PropsKnowledge) {
  console.log("Los datos recibidos son: ", knowledge);

  if (!knowledge || knowledge.length === 0) {
    return (
      <div className="text-xs text-muted-foreground border rounded-md p-3">
        <div className="mb-2">
          <Button
            onClick={handleCreateNewK}
            size="sm"
            variant="default"
            className="h-7 px-2 text-[11px]"
          >
            Añadir nuevo conocimiento
          </Button>
        </div>
        No hay documentos de conocimiento registrados para este bot.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[420px] rounded-md border p-2">
      <div className="mb-2">
        <Button
          onClick={handleCreateNewK}
          size="sm"
          variant="default"
          className="h-7 px-2 text-[11px]"
        >
          Añadir nuevo conocimiento
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {knowledge.map((k) => (
          <Card
            key={k.id}
            className="border border-border/70 hover:border-primary/60 transition-colors"
          >
            <CardContent className="p-3 space-y-2">
              {/* Encabezado */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-xs font-semibold leading-tight">
                      {k.titulo}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <Badge
                      variant="outline"
                      className="px-1.5 py-0 text-[10px]"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {k.tipo}
                    </Badge>
                    {k.origen && (
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        Origen: {k.origen}
                      </Badge>
                    )}
                    {k.externoId && (
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        ID externo: {k.externoId}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground flex flex-col items-end gap-0.5">
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" />
                    {formatDate(k.actualizadoEn)}
                  </span>
                </div>
              </div>

              {/* Descripción / preview */}
              {k.descripcion && (
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {k.descripcion}
                </p>
              )}

              <p className="text-[11px] font-mono bg-muted/40 rounded-sm p-1.5 line-clamp-3 whitespace-pre-wrap">
                {k.textoLargo}
              </p>

              {/* Botón de seleccionar */}
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-[11px]"
                  onClick={() => handleSelectKnowledge(k)}
                >
                  Editar conocimiento
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

export default KnowledgeMap;
