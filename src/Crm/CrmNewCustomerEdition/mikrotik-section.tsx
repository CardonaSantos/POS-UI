"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Router } from "lucide-react";
import ReactSelectComponent from "react-select";
import type { NetworkConfigSectionProps } from "./customer-form-types";

/**
 * Sección de configuración de red (IP + Mikrotik)
 */
export function MikrotikSection({
  mkSelected,
  mikrotiks,
  optionsMikrotiks,
  onSelectMk,
}: NetworkConfigSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2"></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Router className="h-3 w-3" />
            Router Mikrotik
          </h4>
          <div className="space-y-1">
            <Label htmlFor="mikrotik-select" className="text-sm">
              Mikrotik Asignado <span className="text-destructive">*</span>
            </Label>
            <ReactSelectComponent
              inputId="mikrotik-select"
              placeholder="Selecciona un Router MK"
              isClearable
              options={optionsMikrotiks}
              onChange={onSelectMk}
              value={
                mkSelected !== null
                  ? {
                      value: mkSelected,
                      label:
                        mikrotiks.find((s) => s.id === mkSelected)?.nombre ||
                        "",
                    }
                  : null
              }
              className="text-sm text-black"
              classNames={{
                control: () => "!bg-background !border-input",
                menu: () => "!bg-background",
                option: () => "!text-foreground",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
