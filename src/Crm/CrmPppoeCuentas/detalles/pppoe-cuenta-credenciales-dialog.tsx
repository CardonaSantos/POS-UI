import { useCallback, useEffect, useState } from "react";

import { Check, Clipboard, Eye, EyeOff, KeyRound } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";

import { AppBadge } from "@/components/app/primitives/app-badge";

import { AppButton } from "@/components/app/primitives/app-button";

import { AppCard } from "@/components/app/primitives/app-card";

import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";

import { AppGrid } from "@/components/app/primitives/app-grid";

import { AppInline } from "@/components/app/primitives/app-inline";

import { AppStack } from "@/components/app/primitives/app-stack";

import { usePostRevelarCredencialesPppoeCuenta } from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import type { PppoeCuentaDetalle } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import { copyText } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.utils";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

type Props = {
  cuenta: PppoeCuentaDetalle;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onDataChanged?: () => void | Promise<void>;
};

export function PppoeCuentaCredencialesDialog({
  cuenta,
  open,
  onOpenChange,
  onDataChanged,
}: Props) {
  const mutation = usePostRevelarCredencialesPppoeCuenta(cuenta.cuentaPppoeId);

  const { data, error, isPending, mutateAsync, reset } = mutation;

  const [confirmed, setConfirmed] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [copied, setCopied] = useState<"usuario" | "contrasena" | null>(null);

  const clearSensitiveState = useCallback(() => {
    /**
     * reset() elimina la respuesta almacenada
     * dentro del estado de la mutation.
     */
    reset();

    setConfirmed(false);

    setPasswordVisible(false);

    setCopied(null);
  }, [reset]);

  useEffect(() => {
    if (!open) {
      clearSensitiveState();
    }
  }, [open, clearSensitiveState]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        clearSensitiveState();
      }

      onOpenChange(nextOpen);
    },
    [clearSensitiveState, onOpenChange],
  );

  const handleReveal = useCallback(async () => {
    try {
      await mutateAsync(undefined);

      setConfirmed(true);

      await onDataChanged?.();
    } catch {
      /**
       * El error se presenta dentro
       * del mismo diálogo.
       */
    }
  }, [mutateAsync, onDataChanged]);

  const handleCopy = useCallback(
    async (field: "usuario" | "contrasena", value: string) => {
      await copyText(value);

      setCopied(field);

      window.setTimeout(() => {
        setCopied(null);
      }, 1_500);
    },
    [],
  );

  return (
    <AppDialog modal open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="md" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Credenciales PPPoE</AppDialogTitle>

          <AppDialogDescription>
            La consulta queda registrada en auditoría y la respuesta se limpia
            al cerrar.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            {!confirmed ? (
              <>
                <AppAlert
                  tone="warning"
                  title="Información confidencial"
                  size="xs"
                >
                  Confirme que necesita visualizar las credenciales de la cuenta
                  PPPoE antes de solicitar su descifrado temporal.
                </AppAlert>

                <AppCard
                  variant="outline"
                  size="xs"
                  radius="md"
                  className="p-3"
                >
                  <AppInline
                    justify="between"
                    align="center"
                    gap="xs"
                    fullWidth
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">
                        Cuenta #{cuenta.cuentaPppoeId}
                      </p>

                      <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground))]">
                        {cuenta.perfilHomologacion.codigoPerfil}
                      </p>
                    </div>

                    <AppBadge
                      tone="neutral"
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {cuenta.estadoCuenta}
                    </AppBadge>
                  </AppInline>
                </AppCard>

                <AppInline justify="end" gap="xs" fullWidth>
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancelar
                  </AppButton>

                  <AppButton
                    type="button"
                    size="sm"
                    loading={isPending}
                    loadingText="Revelando..."
                    onClick={handleReveal}
                  >
                    <KeyRound aria-hidden="true" />
                    Confirmar y revelar
                  </AppButton>
                </AppInline>
              </>
            ) : data ? (
              <>
                <AppCard
                  variant="outline"
                  size="xs"
                  radius="md"
                  className="p-3"
                >
                  <AppStack gap="sm">
                    <AppInline
                      justify="between"
                      align="center"
                      gap="xs"
                      fullWidth
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">
                          Cuenta #{data.cuentaPppoeId}
                        </p>

                        <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground))]">
                          {cuenta.perfilHomologacion.codigoPerfil}
                        </p>
                      </div>

                      <AppBadge
                        tone="neutral"
                        appearance="soft"
                        size="xs"
                        radius="full"
                      >
                        {cuenta.estadoCuenta}
                      </AppBadge>
                    </AppInline>

                    <AppGrid
                      cols={{
                        base: 1,
                        sm: 2,
                      }}
                      gap="xs"
                    >
                      <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2">
                        <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                          Usuario
                        </p>

                        <AppInline
                          justify="between"
                          align="center"
                          gap="xs"
                          fullWidth
                        >
                          <code className="min-w-0 truncate text-xs">
                            {data.usuario}
                          </code>

                          <AppButton
                            type="button"
                            variant="ghost"
                            size="iconXs"
                            aria-label="Copiar usuario"
                            onClick={() => handleCopy("usuario", data.usuario)}
                          >
                            {copied === "usuario" ? <Check /> : <Clipboard />}
                          </AppButton>
                        </AppInline>
                      </div>

                      <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2">
                        <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
                          Contraseña
                        </p>

                        <AppInline
                          justify="between"
                          align="center"
                          gap="xs"
                          fullWidth
                        >
                          <code className="min-w-0 truncate text-xs">
                            {passwordVisible ? data.contrasena : "••••••••••••"}
                          </code>

                          <AppInline gap="none" wrap={false}>
                            <AppButton
                              type="button"
                              variant="ghost"
                              size="iconXs"
                              aria-label={
                                passwordVisible
                                  ? "Ocultar contraseña"
                                  : "Mostrar contraseña"
                              }
                              onClick={() =>
                                setPasswordVisible((current) => !current)
                              }
                            >
                              {passwordVisible ? <EyeOff /> : <Eye />}
                            </AppButton>

                            <AppButton
                              type="button"
                              variant="ghost"
                              size="iconXs"
                              aria-label="Copiar contraseña"
                              onClick={() =>
                                handleCopy("contrasena", data.contrasena)
                              }
                            >
                              {copied === "contrasena" ? (
                                <Check />
                              ) : (
                                <Clipboard />
                              )}
                            </AppButton>
                          </AppInline>
                        </AppInline>
                      </div>
                    </AppGrid>
                  </AppStack>
                </AppCard>

                <AppInline justify="end" fullWidth>
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenChange(false)}
                  >
                    Ocultar y cerrar
                  </AppButton>
                </AppInline>
              </>
            ) : null}

            {error ? (
              <AppAlert tone="danger" title="No fue posible revelar" size="xs">
                {getApiErrorMessageAxios(error)}
              </AppAlert>
            ) : null}
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
