"use client";
import {
  useDeleteExpediente,
  useGetClienteExpedientes,
  useGetCredito,
} from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
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
import { CreditCard, File, ImagePlus } from "lucide-react";
import { useTabChangeWithUrl } from "@/Crm/Utils/Components/handleTabChangeWithParamURL";
import LoadArchivoCredito from "../main/components/expediente/load-archivo-credito";
import ExpedienteRecordsPage from "../main/components/expediente-records/expediente-records-page";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [openCuota, setOpenCuota] = useState<boolean>(true);
  const [creditoCuota, setCreditoCuota] = useState<CreditoCuotaResponse | null>(
    null,
  );

  const [expedienteSelected, setExpedienteSelected] = useState<number | null>(
    null,
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSelectToDelete = (id: number) => {
    setExpedienteSelected(id);
    setOpenDeleteDialog(true);
  };

  const defaultTab = (searchParams.get("tab") as string) || "credito";
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
  const { data: expedients } = useGetClienteExpedientes(data.id);

  const expedientes = expedients ? expedients : [];
  const submitDelete = useDeleteExpediente(expedienteSelected);

  const handleDeleteExpediente = async () => {
    if (!expedienteSelected) return;

    toast.promise(submitDelete.mutateAsync(), {
      loading: "Eliminando expediente...",
      success: () => {
        setOpenDeleteDialog(false);
        setExpedienteSelected(null);
        return "Expediente eliminado correctamente";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const tabs: Array<TabItem> = [
    {
      label: "Crédito",
      value: "credito",
      icon: <CreditCard size={16} />,
      content: (
        <CreditoDetails
          creditoCuota={creditoCuota}
          openCuota={openCuota}
          setCreditoCuota={setCreditoCuota}
          setOpenCuota={setOpenCuota}
          credito={data}
        />
      ),
    },
    {
      label: "Expediente",
      value: "expediente",
      icon: <File size={16} />,
      content: (
        <ExpedienteRecordsPage
          expedientes={expedientes}
          handleSelectToDelete={handleSelectToDelete}
        />
      ),
    },
    {
      label: "Archivos",
      value: "anadir",
      icon: <ImagePlus size={16} />,
      content: <LoadArchivoCredito clienteId={data.clienteId} />,
    },
  ];

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <h2></h2>
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleTabChange={handleChangeTabs}
        variant="compact"
      />

      <AdvancedDialogCRM
        open={openDeleteDialog}
        onOpenChange={(open) => {
          setOpenDeleteDialog(open);
          if (!open) setExpedienteSelected(null);
        }}
        title="Eliminar expediente"
        description="Esta acción eliminará el expediente y todos sus archivos. ¿Deseas continuar?"
        type="warning"
        cancelButton={{
          label: "Cancelar",
          onClick: () => setOpenDeleteDialog(false),
        }}
        confirmButton={{
          label: "Eliminar",
          variant: "destructive",
          onClick: handleDeleteExpediente,
          loading: submitDelete.isPending,
        }}
      />
    </PageTransitionCrm>
  );
}
