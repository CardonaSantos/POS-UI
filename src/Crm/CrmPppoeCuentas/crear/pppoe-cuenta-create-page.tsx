import { useNavigate } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppContainer } from "@/components/app/primitives/app-container";
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
          <PppoeCuentaCreateForm onCreated={handleCreated} />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
