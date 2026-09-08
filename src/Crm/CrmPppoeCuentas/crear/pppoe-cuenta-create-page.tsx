import { ArrowLeft, Router } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { CrearPrealtaPppoeCuentaResponse } from "@/Crm/features/pppoe-cuentas/pppoe-prealta.interfaces";

import { PppoeCuentaCreateForm } from "./pppoe-cuenta-create-form";

export default function PppoeCuentaCreatePage() {
  const navigate = useNavigate();

  const handleCreated = async (result: CrearPrealtaPppoeCuentaResponse) => {
    /**
     * La provisión real se ejecuta desde el detalle.
     *
     * Incluso si creada=false, el backend devolvió
     * la cuenta/prealta válida que debemos administrar.
     */
    navigate(`/crm/pppoe/cuentas/${result.cuentaPppoeId}`, {
      replace: true,
    });
  };

  return (
    <PageTransitionCrm titleHeader="Nueva cuenta PPPoE" variant="fade-pure">
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <AppCard variant="outline" size="xs" radius="md" className="p-3">
            <AppInline
              justify="between"
              align="start"
              collapseBelow="sm"
              gap="sm"
              fullWidth
            >
              <div className="min-w-0">
                <AppInline align="center" gap="xs" wrap>
                  <Router size={18} aria-hidden="true" />

                  <h1 className="text-base font-semibold">
                    Nueva cuenta PPPoE
                  </h1>
                </AppInline>

                <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                  Prepare una identidad PPPoE para un cliente existente sin
                  crear una instalación.
                </p>
              </div>

              <AppButton
                asChild
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft size={14} aria-hidden="true" />}
              >
                <Link to="/crm/pppoe/cuentas">Regresar</Link>
              </AppButton>
            </AppInline>
          </AppCard>

          <AppAlert tone="warning" title="Flujo en dos etapas" size="xs">
            Crear la prealta no activa el servicio. Después de preparar la
            cuenta será dirigido a su detalle, donde deberá ejecutar la acción{" "}
            <strong>Provisionar</strong>.
          </AppAlert>

          <PppoeCuentaCreateForm onCreated={handleCreated} />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
