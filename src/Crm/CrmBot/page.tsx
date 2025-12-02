// BotMainPage.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { ReusableTabs, TabItem } from "../Utils/Components/tabs/reusable-tabs";
import { useTabChangeWithUrl } from "../Utils/Components/handleTabChangeWithParamURL";

import { BrainMachineIcon } from "../Icons/BraintIcon";
import { RobotWinkIcon } from "../Icons/RobotWink";
import { Robot } from "../Icons/Robot";

import BotGeneral from "./_components/bot-general";
import KnowledgeMap from "./_components/knowledge/knowledgeMap";
import FormBotEdit from "./_components/form/form-create";

import {
  getAllKnowledgeBot,
  useGetBot,
  useUpdateBot,
  useCreateKnowledge,
  useUpdateKnowledge,
  useDeleteKnowledge,
} from "../CrmHooks/hooks/bot/useBot";

import { initialBotState } from "../features/bot/initialState";
import {
  KnowledgeDocument,
  KnowledgeDocumentType,
  KnowledgeDocumentUpdate,
  initialKnowledgeDocumentState,
} from "../features/bot/knowledge/knowledge";

import { botSchemaZ, BotType } from "./_components/form/schema";

import { AdvancedDialogCRM } from "../_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  knowledgeCreateSchemaZ,
  KnowledgeCreateType,
} from "./_components/knowledge/schema-knowledge";
import FormKnowledgeCreate from "./_components/knowledge/form-create-knowledge";
// Componente principal
function BotMainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = (searchParams.get("tab") as string) || "general";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleChangeTabs = useTabChangeWithUrl({
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
  });

  const [openUpdateBot, setOpenUpdateBot] = useState(false);
  const [openCreateKnowledge, setOpenCreateKnowledge] = useState(false);

  const [openUpdateKnowledge, setOpenUpdateKnowledge] = useState(false);
  const [openDeleteK, setOpenDeleteK] = useState<boolean>(false);

  const [knowledgeSelected, setKnowledgeSelected] =
    useState<KnowledgeDocumentUpdate>(initialKnowledgeDocumentState);
  const [isCreatingKnowledge, setIsCreatingKnowledge] = useState(false);

  const { data: k } = getAllKnowledgeBot();
  const { data: b } = useGetBot();

  const knowledge = k ?? [];
  const bot = b ?? initialBotState;

  // 5) Mutations (bot + knowledge create)
  const updateBot = useUpdateBot(bot.id);
  //conocimientos
  const createKnowledge = useCreateKnowledge();
  const updateK = useUpdateKnowledge(knowledgeSelected.id);

  const deleteK = useDeleteKnowledge(knowledgeSelected.id);

  const formBot = useForm<BotType>({
    resolver: zodResolver(botSchemaZ),
    defaultValues: bot,
  });

  useEffect(() => {
    if (b) {
      formBot.reset(b);
    }
  }, [b, formBot]);

  const handleCancelBotEdit = () => {
    if (b) {
      formBot.reset(b);
    } else {
      formBot.reset(initialBotState);
    }
  };

  const handleOpenBotUpdateDialog = () => setOpenUpdateBot(true);
  const handleCloseBotUpdateDialog = () => setOpenUpdateBot(false);

  const handleSubmitBotUpdate = formBot.handleSubmit(async (dto) => {
    const promise = updateBot.mutateAsync(dto);

    try {
      await toast.promise(promise, {
        loading: "Actualizando parámetros...",
        success: "Parámetros ajustados",
        error: (err) => getApiErrorMessageAxios(err),
      });

      setOpenUpdateBot(false);
    } catch {
      // El error ya lo maneja el toast
    }
  });

  const formKnowledge = useForm<KnowledgeCreateType>({
    resolver: zodResolver(knowledgeCreateSchemaZ),
    defaultValues: {
      empresaId: bot.empresaId || 1,
      tipo: KnowledgeDocumentType.FAQ,
      titulo: "",
      descripcion: "",
      origen: "CRM",
      idioma: "es",
      textoLargo: "",
    },
  });

  const handleCloseCreateKnowledgeDialog = () => setOpenCreateKnowledge(false);
  const handleCloseUpdateKnowledge = () => setOpenUpdateKnowledge(false);

  const handleOpenCreateKnowledgeDialog = () => setOpenCreateKnowledge(true);
  const handleOpenUpdateKnowledgeDialog = () => setOpenUpdateKnowledge(true);

  const handleOpenDeleteK = () => setOpenDeleteK(true);

  const handleSubmitCreateKnowledge = formKnowledge.handleSubmit(
    async (dto) => {
      const promise = createKnowledge.mutateAsync(dto);

      try {
        await toast.promise(promise, {
          loading: "Creando conocimiento...",
          success: () => {
            formKnowledge.reset({
              empresaId: dto.empresaId,
              tipo: dto.tipo,
              origen: dto.origen ?? "CRM",
              idioma: dto.idioma ?? "es",
              titulo: "",
              descripcion: "",
              textoLargo: "",
            });

            setOpenCreateKnowledge(false);
            setIsCreatingKnowledge(false);
            return "Conocimiento creado correctamente";
          },
          error: (err) => getApiErrorMessageAxios(err),
        });
      } catch (err) {
        // El error ya lo maneja el toast
        console.log(err);
      }
    }
  );

  const handleUpdateK = async () => {
    try {
      const values = formKnowledge.getValues();

      const dto = {
        id: knowledgeSelected.id,
        titulo: values.titulo,
        descripcion: values.descripcion,
        textoLargo: values.textoLargo,
        tipo: values.tipo,
      };

      await toast.promise(updateK.mutateAsync(dto), {
        loading: "Actualizando conocimiento...",
        success: () => {
          setOpenUpdateKnowledge(false);
          // modo edición
          setIsCreatingKnowledge(false);
          setKnowledgeSelected(initialKnowledgeDocumentState);

          formKnowledge.reset({
            empresaId: bot.empresaId,
            tipo: KnowledgeDocumentType.FAQ,
            titulo: "",
            descripcion: "",
            origen: "CRM",
            idioma: "es",
            textoLargo: "",
          });

          return "Conocimiento actualizado";
        },
        error: (err) => getApiErrorMessageAxios(err),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteK = async () => {
    try {
      if (!knowledgeSelected.id) {
        toast.info("registro no válido");
        return;
      }

      await toast.promise(deleteK.mutateAsync(), {
        loading: "Eliminando de base de conocimientos...",
        success: () => {
          setIsCreatingKnowledge(false);
          setOpenDeleteK(false);
          setKnowledgeSelected(initialKnowledgeDocumentState);

          formKnowledge.reset({
            empresaId: bot.empresaId,
            tipo: KnowledgeDocumentType.FAQ,
            titulo: "",
            descripcion: "",
            origen: "CRM",
            idioma: "es",
            textoLargo: "",
          });

          return "Eliminado";
        },
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectKnowledge = (k: KnowledgeDocument) => {
    setIsCreatingKnowledge(false); // Estamos editando, no creando
    setKnowledgeSelected({ ...k });

    formKnowledge.reset({
      id: k.id,
      empresaId: k.empresaId,
      tipo: k.tipo,
      titulo: k.titulo,
      descripcion: k.descripcion ?? "",
      origen: k.origen ?? "CRM",
      textoLargo: k.textoLargo ?? "",
    });
  };

  const handleCancelUpdateOrCreate = () => {
    setIsCreatingKnowledge(false);
    setKnowledgeSelected(initialKnowledgeDocumentState);

    formKnowledge.reset({
      empresaId: bot.empresaId,
      tipo: KnowledgeDocumentType.FAQ,
      titulo: "",
      descripcion: "",
      origen: "CRM",
      idioma: "es",
      textoLargo: "",
    });
  };

  const handleCreateNewK = () => {
    setIsCreatingKnowledge(true);
    setKnowledgeSelected(initialKnowledgeDocumentState); // NO estamos editando
    formKnowledge.reset({
      empresaId: bot.empresaId,
      tipo: KnowledgeDocumentType.FAQ,
      titulo: "",
      descripcion: "",
      origen: "CRM",
      idioma: "es",
      textoLargo: "",
    });
  };

  const tabs: Array<TabItem> = [
    {
      label: "General",
      value: "general",
      content: <BotGeneral bot={bot} knowledgeCount={knowledge.length} />,
      icon: <Robot />,
    },
    {
      label: "Conocimientos",
      value: "knowledge",
      content: (
        <div className="">
          {isCreatingKnowledge || knowledgeSelected.id !== 0 ? (
            <FormKnowledgeCreate
              handleOpenDeleteK={handleOpenDeleteK}
              handleDeleteK={handleDeleteK}
              form={formKnowledge}
              isEditingK={knowledgeSelected.id !== 0}
              handleCancelUpdateOrCreate={handleCancelUpdateOrCreate}
              handleOpen={handleOpenCreateKnowledgeDialog}
              handleOpenUpdate={handleOpenUpdateKnowledgeDialog}
            />
          ) : (
            <KnowledgeMap
              knowledge={knowledge}
              handleSelectKnowledge={handleSelectKnowledge}
              handleCreateNewK={handleCreateNewK} // botón para crear
            />
          )}
        </div>
      ),
      icon: <BrainMachineIcon />,
    },
    {
      label: "Comportamiento",
      value: "performance",
      content: (
        <FormBotEdit
          form={formBot}
          handleCancelEdit={handleCancelBotEdit}
          isToEdit={true}
          handleOpen={handleOpenBotUpdateDialog}
        />
      ),
      icon: <RobotWinkIcon />,
    },
  ];

  return (
    <PageTransitionCrm
      titleHeader="Configuración de parámetros de Bot"
      subtitle="Performance y comportamientos"
      variant="fade-pure"
    >
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        variant="default"
        handleTabChange={handleChangeTabs}
      />

      {/* Dialog actualización BOT */}
      <AdvancedDialogCRM
        type="warning"
        open={openUpdateBot}
        onOpenChange={setOpenUpdateBot}
        title="Actualización de parámetros de bot"
        description="¿Estás seguro de aplicar estos cambios?"
        confirmButton={{
          label: "Actualizar",
          onClick: handleSubmitBotUpdate,
          disabled: updateBot.isPending,
          loadingText: "Actualizando...",
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => {
            handleCancelBotEdit();
            handleCloseBotUpdateDialog();
          },
          disabled: updateBot.isPending,
          loadingText: "Actualizando...",
        }}
      />

      {/* Dialog creación KNOWLEDGE */}
      <AdvancedDialogCRM
        type="info"
        open={openCreateKnowledge}
        onOpenChange={setOpenCreateKnowledge}
        title="Crear conocimiento"
        description="¿Deseas guardar este conocimiento en la base del bot?"
        confirmButton={{
          label: "Crear",
          onClick: handleSubmitCreateKnowledge,
          disabled: createKnowledge.isPending,
          loadingText: "Creando...",
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: handleCloseCreateKnowledgeDialog,
          disabled: createKnowledge.isPending,
          loadingText: "Cancelando...",
        }}
      />

      <AdvancedDialogCRM
        type="confirmation"
        open={openUpdateKnowledge}
        onOpenChange={setOpenUpdateKnowledge}
        title="Actualizar conocimiento"
        description="¿Deseas actualizar este conocimiento en la base del bot?"
        confirmButton={{
          label: "Actualizar",
          onClick: handleUpdateK,
          disabled: updateK.isPending,
          loadingText: "Creando...",
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: handleCloseUpdateKnowledge,
          disabled: updateK.isPending,
          loadingText: "Cancelando...",
        }}
      />

      <AdvancedDialogCRM
        type="destructive"
        open={openDeleteK}
        onOpenChange={setOpenDeleteK}
        title="Eliminar conocimiento"
        description="¿Deseas eliminar este conocimiento en la base del bot?"
        confirmButton={{
          label: "Eliminar",
          onClick: handleDeleteK,
          disabled: deleteK.isPending,
          loadingText: "Eliminando...",
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: handleCloseUpdateKnowledge,
          disabled: deleteK.isPending,
          loadingText: "Cancelando...",
        }}
      />
    </PageTransitionCrm>
  );
}

export default BotMainPage;
