import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routerMkSchemaZ, RouterMkType } from "./_components/form/zformRouter";
import FormCreateRouter from "./_components/form/form-create-router";
import { ReusableTabs, TabItem } from "../Utils/Components/tabs/reusable-tabs";
import { MikroTikIcon } from "../Icons/MikroTikIcon";
import { useState } from "react";
import MikroTiks from "./_components/mikrotiks-map";
import { DiamondPlus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTabChangeWithUrl } from "../Utils/Components/handleTabChangeWithParamURL";
import {
  useCreateMikrotikRouter,
  useDeleteRouterMk,
  useGetMikroTiks,
  useUpdateMikrotikRouter,
} from "../CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { MikrotikRoutersResponse } from "../features/mikro-tiks/mikrotiks.interfaces";
import { AdvancedDialogCRM } from "../_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

function RouterMainPage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = (searchParams.get("tab") as string) || "mk";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isToUpdate, setIsToUpdate] = useState<boolean>(false);
  const [mkToEdit, setMkToEdit] = useState<MikrotikRoutersResponse | null>(
    null,
  );
  const [mktoDelete, setMkToDelete] = useState<MikrotikRoutersResponse | null>(
    null,
  );
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [openSubmit, setOpenSubmit] = useState<boolean>(false);

  const formRouterMk = useForm<RouterMkType>({
    resolver: zodResolver(routerMkSchemaZ),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      passwordEnc: "",
      descripcion: "",
      host: "",
      nombre: "",
      sshPort: 22,
      usuario: "",
      empresaId: empresaId,
    },
  });

  const createMk = useCreateMikrotikRouter();
  const updateMk = useUpdateMikrotikRouter();
  const deleteMk = useDeleteRouterMk(mktoDelete?.id ?? 0);

  const onSubmit = formRouterMk.handleSubmit(async (values) => {
    const { passwordEnc, ...rest } = values;

    const payload = passwordEnc ? { ...rest, passwordEnc } : rest;

    if (isToUpdate && mkToEdit) {
      await updateMk.mutateAsync({ ...payload, id: mkToEdit.id });

      setOpenSubmit(false);
      setIsToUpdate(false);
      formRouterMk.reset();
    } else {
      await createMk.mutateAsync(payload);

      setOpenSubmit(false);
      formRouterMk.reset();
    }
  });

  const handleSend = async () => {
    await toast.promise(onSubmit(), {
      loading: isToUpdate ? "Actualizando..." : "Creando...",
      success: () => {
        formRouterMk.reset({
          passwordEnc: "",
          descripcion: "",
          host: "",
          nombre: "",
          sshPort: 22,
          usuario: "",
          empresaId: empresaId,
        });
        return "Completado";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const handleDelete = async () => {
    await toast.promise(deleteMk.mutateAsync, {
      loading: "Eliminando...",
      success: () => {
        setOpenDelete(false);
        setMkToDelete(null);
        return "Eliminado";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const handleChangeTabs = useTabChangeWithUrl({
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
  });

  const { data: mks } = useGetMikroTiks();
  const mikrotiks = mks ? mks : [];

  const handleSelectToEdit = (mk: MikrotikRoutersResponse) => {
    setIsToUpdate(true);
    setMkToEdit(mk);
    formRouterMk.reset({
      nombre: mk.nombre ?? "",
      host: mk.host ?? "",
      sshPort: mk.sshPort ?? 22,
      usuario: mk.usuario ?? "",
      descripcion: mk.descripcion ?? "",
      passwordEnc: "",
      empresaId: empresaId,
    });
    setActiveTab("anadir");
  };

  const handleCancelEdit = () => {
    formRouterMk.reset({
      passwordEnc: "",
      descripcion: "",
      host: "",
      nombre: "",
      sshPort: 22,
      usuario: "",
    });
    setActiveTab("mk");
    setIsToUpdate(false);
  };
  const {
    formState: { isValid, isDirty },
  } = formRouterMk;

  const canContinue =
    !isValid || // si no es válido, nunca dejamos continuar
    (!isToUpdate && !isDirty) || // solo exigimos cambios cuando es creación
    createMk.isPending ||
    updateMk.isPending;

  const handleOpen = () => {
    if (canContinue) return;
    setOpenSubmit(true);
  };

  const handleOpenDelete = (mk: MikrotikRoutersResponse) => {
    setMkToDelete(mk);
    if (!mktoDelete) return;
    setOpenDelete(true);
  };

  const tabs: Array<TabItem> = [
    {
      label: "MikroTiks",
      value: "mk",
      icon: <MikroTikIcon size={16} />,
      content: (
        <MikroTiks
          handleOpenDelete={handleOpenDelete}
          isToUpdate={isToUpdate}
          handleSelectToEdit={handleSelectToEdit}
          mikrotiks={mikrotiks}
        />
      ),
    },

    {
      label: "Añadir",
      value: "anadir",
      icon: <DiamondPlus size={16} />,
      content: (
        <FormCreateRouter
          handleOpen={handleOpen}
          handleCancelEdit={handleCancelEdit}
          isToEdit={isToUpdate}
          form={formRouterMk}
        />
      ),
    },
  ];

  const title = isToUpdate
    ? "Actualización de Mikrotik Router"
    : "Añadir nuevo Mk";
  const description = isToUpdate
    ? "¿Estas seguro de actualizar este Router Mk? Esto podría afectar funciones asociadas al cliente"
    : "¿Estás seguro de añadir un nuevo router con estás credenciales?";
  const label = isToUpdate ? "Actualizar" : "Guardar";
  const typeDialog = isToUpdate ? "warning" : "confirmation";

  return (
    <PageTransitionCrm
      titleHeader="Routers Mikrotik"
      subtitle={``}
      variant="fade-pure"
    >
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleTabChange={handleChangeTabs}
        variant="compact"
      />
      <AdvancedDialogCRM
        type={typeDialog}
        open={openSubmit}
        onOpenChange={setOpenSubmit}
        title={title}
        description={description}
        confirmButton={{
          onClick: handleSend,
          label: label,
          disabled: canContinue,
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => {
            setOpenSubmit(false);
          },
          disabled: createMk.isPending || updateMk.isPending,
        }}
      />

      <AdvancedDialogCRM
        type={"destructive"}
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminación de Router Mk"
        description={`¿Estás seguro de querer eliminar ${mktoDelete?.nombre}?`}
        confirmButton={{
          onClick: handleDelete,
          label: "Sí, continuar",
          disabled: deleteMk.isPending,
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => {
            setOpenDelete(false);
          },
          disabled: deleteMk.isPending,
        }}
      />
    </PageTransitionCrm>
  );
}

export default RouterMainPage;
