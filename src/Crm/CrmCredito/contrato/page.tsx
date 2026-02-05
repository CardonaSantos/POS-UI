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

export const CONTRATO_VARIABLES = [
  // =====================
  // CLIENTE
  // =====================
  {
    group: "Cliente",
    items: [
      { key: "cliente.id", example: "22" },
      { key: "cliente.nombre", example: "Adalinda Anita" },
      { key: "cliente.apellidos", example: "Jacinto" },
      {
        key: "cliente.nombreCompleto",
        example: "Adalinda Anita Jacinto",
      },
      { key: "cliente.dpi", example: "1234567890101" },
      { key: "cliente.nit", example: "1234567-8" },
      { key: "cliente.telefono", example: "31353941" },
      {
        key: "cliente.direccion",
        example: "Frente a RENAP, zona 1",
      },
      { key: "cliente.municipio", example: "Jacaltenango" },
      { key: "cliente.departamento", example: "Huehuetenango" },
    ],
  },

  // =====================
  // CRÉDITO
  // =====================
  {
    group: "Crédito",
    items: [
      { key: "credito.id", example: "18" },
      { key: "credito.montoCapital", example: "2000.00" },
      { key: "credito.montoTotal", example: "2400.00" },
      { key: "credito.montoCuota", example: "500.00" },
      { key: "credito.plazoCuotas", example: "4" },
      { key: "credito.frecuencia", example: "SEMANAL" },
      { key: "credito.estado", example: "ACTIVO" },
      { key: "credito.interesPorcentaje", example: "5.00" },
      { key: "credito.interesMoraPorcentaje", example: "8.00" },
      { key: "credito.intervaloDias", example: "30" },
      { key: "credito.interesTipo", example: "FIJO" },
      { key: "credito.origen", example: "TIENDA" },
      {
        key: "credito.observaciones",
        example: "Crédito preferencial",
      },
      { key: "credito.fechaInicio", example: "2026-01-28" },
      { key: "credito.creadoEn", example: "2026-01-28" },
    ],
  },

  // =====================
  // CUOTAS
  // =====================
  {
    group: "Cuotas",
    items: [
      { key: "cuotas.total", example: "4" },
      { key: "cuotas.pagadas", example: "1" },
      { key: "cuotas.pendientes", example: "3" },
      { key: "cuotas.vencidas", example: "0" },
    ],
  },

  // =====================
  // MORA
  // =====================
  {
    group: "Mora",
    items: [
      { key: "mora.tieneMora", example: "Sí" },
      { key: "mora.totalDias", example: "12" },
      { key: "mora.montoTotal", example: "120.00" },
      { key: "mora.interesTotal", example: "120.00" },
    ],
  },

  // =====================
  // PAGOS
  // =====================
  {
    group: "Pagos",
    items: [
      { key: "pagos.totalPagado", example: "1000.00" },
      { key: "pagos.numeroPagos", example: "2" },
      { key: "pagos.fechaUltimoPago", example: "2026-02-04" },
    ],
  },

  // =====================
  // EMPRESA
  // =====================
  {
    group: "Empresa",
    items: [
      { key: "empresa.nombre", example: "Nova Sistemas" },
      {
        key: "empresa.razonSocial",
        example: "Nova Sistemas S.A.",
      },
      { key: "empresa.nit", example: "1234567-8" },
      {
        key: "empresa.direccion",
        example: "Zona 3, Jacaltenango",
      },
      { key: "empresa.telefono", example: "77661234" },
    ],
  },

  // =====================
  // FLAGS (LÓGICAS)
  // =====================
  {
    group: "Flags",
    items: [
      { key: "flags.tieneEnganche", example: "Sí" },
      { key: "flags.tieneMora", example: "No" },
      { key: "flags.creditoActivo", example: "Sí" },
    ],
  },
];

function extractUsedVariables(html: string): Set<string> {
  const regex = /{{\s*([^}]+)\s*}}/g;
  const used = new Set<string>();

  let match;
  while ((match = regex.exec(html)) !== null) {
    used.add(match[1].trim());
  }

  return used;
}

export function ContratoBuilder() {
  const createPlantilla = useCreatePlantillaLegal();

  const isPending = createPlantilla.isPending;

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

  function VariablesPanel({ content }: { content: string }) {
    const usedVariables = extractUsedVariables(content);

    return (
      <div className="space-y-4 max-h-80 overflow-y-auto">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Variables disponibles
        </h3>

        {CONTRATO_VARIABLES.map((group) => (
          <div key={group.group} className="">
            <p className="text-xs font-medium mb-1 ">{group.group}</p>

            <div className="space-y-1">
              {group.items.map((v) => {
                const isUsed = usedVariables.has(v.key);

                return (
                  <div
                    key={v.key}
                    className="flex items-center justify-between text-xs border rounded px-2 py-1"
                  >
                    <div>
                      <code className="font-mono">{`{{${v.key}}}`}</code>

                      <div className="text-muted-foreground">
                        Ej: {v.example}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUsed ? (
                        <span className="text-green-600">Usada</span>
                      ) : (
                        <span className="text-orange-500">No usada</span>
                      )}

                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          navigator.clipboard.writeText(`{{${v.key}}}`)
                        }
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
            className="w-full rounded-md border px-3 py-2 text-sm text-black"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPlantillaLegal)}
          >
            <option value={TipoPlantillaLegal.CONTRATO}>Contrato</option>
            <option value={TipoPlantillaLegal.PAGARE}>Pagaré</option>
          </select>

          {/* Editor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TiptapEditor
                isPending={isPending}
                content={content}
                onUpdate={setContent}
                onSave={handleSave}
                placeholder="Escribe el contenido de tu contrato aquí..."
              />
            </div>

            <div className="md:col-span-1">
              <VariablesPanel content={content} />
            </div>
          </div>

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
