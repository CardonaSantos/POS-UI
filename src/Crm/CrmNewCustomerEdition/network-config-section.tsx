"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw, Router, ShieldCheck } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { NetworkConfigSectionProps } from "./customer-form-types";

function NetworkActions({
  isCreation,
  isInstalation,
  onUpdateNetwork,
  onAuthorizeOlt,
}: {
  isCreation?: boolean;
  isInstalation?: boolean;
  onUpdateNetwork: () => void;
  onAuthorizeOlt: () => void;
}) {
  return (
    <div className="border-t border-[hsl(var(--app-border,var(--border)))] pt-3">
      <AppInline align="center" justify="end" gap="xs" wrap>
        <AppButton
          type="button"
          variant="secondary"
          size="xs"
          width="auto"
          leftIcon={<RefreshCw size={13} />}
          disabled={isCreation}
          onClick={onUpdateNetwork}
          title={
            isCreation
              ? "Disponible después de crear el cliente"
              : "Actualizar configuración de red"
          }
        >
          Actualizar red
        </AppButton>

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="auto"
          leftIcon={<ShieldCheck size={13} />}
          disabled={!isInstalation}
          onClick={onAuthorizeOlt}
          title={
            isInstalation
              ? "Autorizar en OLT"
              : "Disponible durante el proceso de instalación"
          }
        >
          Autorizar OLT
        </AppButton>
      </AppInline>
    </div>
  );
}

export function NetworkConfigSection({
  formData,
  onChangeForm,
  setOpenUpdNet,
  setOpenAuth,
  isInstalation,
  isCreation,
}: NetworkConfigSectionProps) {
  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeForm(event);
    },
    [onChangeForm],
  );

  const hasIp = Boolean(formData.ip?.trim());

  return (
    <AppStack gap="sm">
      <AppStack gap="sm">
        <AppInline align="center" gap="xs">
          <Router size={14} className="text-[hsl(var(--app-primary))]" />
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--app-foreground,var(--foreground)))]">
            Direccionamiento IP
          </h4>
        </AppInline>

        <AppGrid cols={{ base: 1, md: 3 }} gap="sm">
          <AppField
            label="Dirección IP"
            required
            description="IP asignada al cliente."
          >
            {(field) => (
              <AppInput
                id={field.id}
                name="ip"
                value={formData.ip}
                onChange={handleInputChange}
                placeholder="192.168.1.100"
                size="xs"
                fieldWidth="full"
                className="font-mono"
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                autoComplete="off"
              />
            )}
          </AppField>

          <AppField label="Gateway" description="Puerta de enlace de la red.">
            {(field) => (
              <AppInput
                id={field.id}
                name="gateway"
                value={formData.gateway}
                onChange={handleInputChange}
                placeholder="192.168.1.1"
                size="xs"
                fieldWidth="full"
                className="font-mono"
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                autoComplete="off"
              />
            )}
          </AppField>

          <AppField label="Máscara" description="Máscara de subred.">
            {(field) => (
              <AppInput
                id={field.id}
                name="mascara"
                value={formData.mascara}
                onChange={handleInputChange}
                placeholder="255.255.255.0"
                size="xs"
                fieldWidth="full"
                className="font-mono"
                invalid={field.invalid}
                aria-invalid={field.invalid}
                aria-describedby={field.describedBy}
                autoComplete="off"
              />
            )}
          </AppField>
        </AppGrid>

        <AppAlert
          tone={hasIp ? "success" : "warning"}
          size="xs"
          icon={<AlertTriangle size={14} />}
          title={hasIp ? "IP preparada" : "IP pendiente"}
          description={
            hasIp
              ? "La IP quedará asociada al cliente al guardar el registro."
              : "Ingrese una IP antes de crear o sincronizar el cliente."
          }
        />

        <NetworkActions
          isCreation={isCreation}
          isInstalation={isInstalation}
          onUpdateNetwork={setOpenUpdNet}
          onAuthorizeOlt={setOpenAuth}
        />
      </AppStack>
    </AppStack>
  );
}
