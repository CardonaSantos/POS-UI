"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, AlertTriangle } from "lucide-react";
import type { NetworkConfigSectionProps } from "./customer-form-types";
import { Button } from "@/components/ui/button";

/**
 * Sección de configuración de red (IP + Mikrotik)
 */
export function NetworkConfigSection({
  formData,
  onChangeForm,
  setOpenUpdNet,
  setOpenAuth,
  isInstalation,
}: NetworkConfigSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Network className="h-4 w-4" />
          Configuración de Red
          <span className="ml-auto flex items-center gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IP Configuration */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Configuración IP
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ip" className="text-sm">
                IP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ip"
                name="ip"
                value={formData.ip}
                onChange={onChangeForm}
                placeholder="192.168.1.100"
                required
                className="h-9 font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gateway" className="text-sm">
                Gateway
              </Label>
              <Input
                id="gateway"
                name="gateway"
                value={formData.gateway}
                onChange={onChangeForm}
                placeholder="192.168.1.1"
                className="h-9 font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mascara" className="text-sm">
                Subnet Mask
              </Label>
              <Input
                id="mascara"
                name="mascara"
                value={formData.mascara}
                onChange={onChangeForm}
                placeholder="255.255.255.0"
                className="h-9 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={setOpenUpdNet}
            size={"sm"}
            variant={"outline"}
            type="button"
          >
            Actualizar
          </Button>

          <Button
            disabled={!isInstalation}
            onClick={setOpenAuth}
            size={"sm"}
            variant={"outline"}
            type="button"
          >
            Autorizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
