"use client";
import { useGetCredito } from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { useParams } from "react-router-dom";
import CreditoDetails from "../main/components/credito-details";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import {
  CreditoCuotaResponse,
  initialCredito,
} from "@/Crm/features/credito/credito-interfaces";
import { useState } from "react";

export default function Page() {
  const [openCuota, setOpenCuota] = useState<boolean>(true);
  const [creditoCuota, setCreditoCuota] = useState<CreditoCuotaResponse | null>(
    null,
  );

  const { creditoId } = useParams<{ creditoId: string }>();
  const id = creditoId ? parseInt(creditoId) : 0;
  const { data = initialCredito } = useGetCredito(id);

  //   helpers ====>
  console.log("El credito find es: ", data);

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <CreditoDetails
        creditoCuota={creditoCuota}
        openCuota={openCuota}
        setCreditoCuota={setCreditoCuota}
        setOpenCuota={setOpenCuota}
        credito={data}
      />
    </PageTransitionCrm>
  );
}
