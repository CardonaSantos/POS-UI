"use client";
import { useGetCredito } from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { useParams } from "react-router-dom";
import CreditoDetails from "../main/components/credito-details";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { initialCredito } from "@/Crm/features/credito/credito-interfaces";

export default function Page() {
  const { creditoId } = useParams<{ creditoId: string }>();
  const id = creditoId ? parseInt(creditoId) : 0;
  const { data = initialCredito } = useGetCredito(id);
  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <CreditoDetails credito={data} />
    </PageTransitionCrm>
  );
}
