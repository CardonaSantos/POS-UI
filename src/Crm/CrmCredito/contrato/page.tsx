"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { TiptapEditor } from "./editor-tiptap";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { TipoPlantillaLegal } from "@/Crm/features/plantillas-legales/plantillas-legales.interfaces";
import {
  CreatePlantillaLegalPayload,
  useCreatePlantillaLegal,
} from "@/Crm/CrmHooks/hooks/use-contrato/use-contrato";

export function ContratoBuilder() {
  const createPlantilla = useCreatePlantillaLegal();

  const [content, setContent] = useState("<p>Escribe tu contrato aquí...</p>");
  const [version, setVersion] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoPlantillaLegal>(
    TipoPlantillaLegal.CONTRATO,
  );

  const handleSave = async (html: string) => {
    const payload: CreatePlantillaLegalPayload = {
      contenido: html,
      version,
      nombre,
      tipo,
      activa: true,
    };

    toast.promise(createPlantilla.mutateAsync(payload), {
      loading: "Registrando plantilla...",
      success: () => {
        setContent("<p>Escribe tu contrato aquí...</p>");
        setVersion("");
        setNombre("");
        setTipo(TipoPlantillaLegal.CONTRATO);
        return "Plantilla legal registrada";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Constructor de Plantilla Legal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Nombre */}
          <Input
            placeholder="Nombre de la plantilla"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          {/* Versión */}
          <Input
            placeholder="Versión (ej: v1.0)"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />

          {/* Tipo */}
          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPlantillaLegal)}
          >
            <option value={TipoPlantillaLegal.CONTRATO}>Contrato</option>
            <option value={TipoPlantillaLegal.PAGARE}>Pagaré</option>
          </select>

          {/* Editor */}
          <TiptapEditor
            content={content}
            onUpdate={setContent}
            onSave={handleSave}
            placeholder="Escribe el contenido de tu contrato aquí..."
            className="shadow-sm"
          />

          {/* Preview */}
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
              Vista previa
            </h3>
            <div className="bg-white p-8 shadow rounded-md border">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContratoBuilder;
