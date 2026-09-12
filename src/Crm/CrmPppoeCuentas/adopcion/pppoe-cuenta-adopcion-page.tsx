import { ArrowLeft, Link2 } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { AdoptarCuentaPppoeResponse } from "@/Crm/features/pppoe-cuentas/pppoe-adopcion.interfaces";

import { PppoeCuentaAdopcionForm } from "./pppoe-cuenta-adopcion-form";

export default function PppoeCuentaAdopcionPage() {
  const navigate = useNavigate();

  const handleAdopted = async (result: AdoptarCuentaPppoeResponse) => {
    navigate(`/crm/pppoe/cuentas/${result.cuentaPppoeId}`, {
      replace: true,
    });
  };

  return (
    <PageTransitionCrm
      titleHeader="Adoptar cuenta PPPoE"
      subtitle="
                  Vincule al CRM una cuenta que ya existe en MikroTik.
    "
      variant="fade-pure"
    >
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <AppAlert
            tone="info"
            title="La cuenta ya debe existir en MikroTik"
            size="xs"
          ></AppAlert>

          <PppoeCuentaAdopcionForm onAdopted={handleAdopted} />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
