"use client";

import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import type { ObservationsSectionProps } from "./customer-form-types";

export function ObservationsSection({
  observaciones,
  onChangeForm,
}: ObservationsSectionProps) {
  return (
    <section aria-labelledby="section-observaciones" className="space-y-2">
      <h3
        id="section-observaciones"
        className="font-medium flex items-center gap-2 text-sm"
      >
        <MessageSquare className="h-4 w-4 text-primary dark:text-white" />
        Observaciones generales
      </h3>
      <Textarea
        id="observaciones-all"
        name="observaciones"
        value={observaciones}
        onChange={onChangeForm}
        placeholder="Observaciones adicionales"
        className="min-h-[80px] text-sm"
      />
    </section>
  );
}
