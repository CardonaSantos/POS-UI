import { Code2 } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppStack } from "@/components/app/primitives/app-stack";

import { stringifyPppoeJson } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

type Props = {
  title: string;
  value: unknown;
};

export function AuditoriaJsonDetails({ title, value }: Props) {
  if (value == null) return null;

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-[hsl(var(--app-primary))]">
        <Code2 className="size-3.5" aria-hidden="true" />
        {title}
      </summary>

      <AppCard
        variant="outline"
        size="xs"
        radius="md"
        className="mt-2 overflow-hidden"
      >
        <AppStack gap="xs">
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words p-2 text-[11px] leading-relaxed">
            {stringifyPppoeJson(value)}
          </pre>
        </AppStack>
      </AppCard>
    </details>
  );
}
