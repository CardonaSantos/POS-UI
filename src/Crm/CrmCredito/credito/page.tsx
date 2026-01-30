"use client";
import { useGetCredito } from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { useParams, useSearchParams } from "react-router-dom";
import CreditoDetails from "../main/components/credito-details";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import {
  CreditoCuotaResponse,
  initialCredito,
} from "@/Crm/features/credito/credito-interfaces";
import { useState } from "react";
import {
  ReusableTabs,
  TabItem,
} from "@/Crm/Utils/Components/tabs/reusable-tabs";
import { MikroTikIcon } from "@/Crm/Icons/MikroTikIcon";
import { DiamondPlus } from "lucide-react";
import { useTabChangeWithUrl } from "@/Crm/Utils/Components/handleTabChangeWithParamURL";

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [openCuota, setOpenCuota] = useState<boolean>(true);
  const [creditoCuota, setCreditoCuota] = useState<CreditoCuotaResponse | null>(
    null,
  );
  const defaultTab = (searchParams.get("tab") as string) || "mk";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const { creditoId } = useParams<{ creditoId: string }>();
  const id = creditoId ? parseInt(creditoId) : 0;
  const { data = initialCredito } = useGetCredito(id);
  const handleChangeTabs = useTabChangeWithUrl({
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
  });
  //   helpers ====>
  console.log("El credito find es: ", data);

  // const tabs: Array<TabItem> = [
  //   {
  //     label: "MikroTiks",
  //     value: "mk",
  //     icon: <MikroTikIcon size={16} />,
  //     content: (
  //      <CreditoDetails
  //     creditoCuota={creditoCuota}
  //     openCuota={openCuota}
  //     setCreditoCuota={setCreditoCuota}
  //     setOpenCuota={setOpenCuota}
  //     credito={data}
  //   />
  //     ),
  //   },

  //   {
  //     label: "Añadir",
  //     value: "anadir",
  //     icon: <DiamondPlus size={16} />,
  //     content: (
  //       <FormCreateRouter
  //         handleOpen={handleOpen}
  //         handleCancelEdit={handleCancelEdit}
  //         isToEdit={isToUpdate}
  //         form={formRouterMk}
  //       />
  //     ),
  //   },
  // ];

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <h2></h2>
      {/* <ReusableTabs

      
      >


      </ReusableTabs> */}
    </PageTransitionCrm>
  );
}
