"use client";

import * as React from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Flag,
  MessageSquare,
  Save,
  Smartphone,
  Ticket,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppMultiSelect } from "@/components/app/primitives/app-multi-select";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTextarea } from "@/components/app/primitives/app-textarea";
import {
  useAppAsyncAction,
  useAppStateHandlers,
} from "@/components/app/handlers";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

import { useCreateTicket } from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { useGetTagsTicket } from "@/Crm/CrmHooks/hooks/tags-ticket/useTagsTickets";
import { useGetUsersToSelect } from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";
import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

interface CreateTicketProps {
  openCreatT: boolean;
  setOpenCreateT: (open: boolean) => void;
  getTickets: () => void;
}

type CreateTicketTab = "info" | "details";

type TicketEstado =
  | "NUEVO"
  | "ABIERTA"
  | "EN_PROCESO"
  | "PENDIENTE"
  | "PENDIENTE_CLIENTE"
  | "PENDIENTE_TECNICO";

type TicketPrioridad = "BAJA" | "MEDIA" | "ALTA" | "URGENTE";

interface FormDataCreateTicket {
  clienteId: number | null;
  tecnicoId: number | null;
  tecnicosAdicionales: number[];
  telefonoTemporal: string;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  prioridad: TicketPrioridad;
  etiquetas: number[];
  userId: number;
  empresaId: number;
}

export interface PayloadCreateTicket extends FormDataCreateTicket {
  etiquetas: number[];
  tecnicoId: number | null;
}

const STATUS_OPTIONS: Array<AppSelectOption<TicketEstado>> = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "ABIERTA", label: "Abierta" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "PENDIENTE_CLIENTE", label: "Pendiente cliente" },
  { value: "PENDIENTE_TECNICO", label: "Pendiente técnico" },
];

const PRIORITY_OPTIONS: Array<AppSelectOption<TicketPrioridad>> = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "URGENTE", label: "Urgente" },
];

const TABS: Array<{
  value: CreateTicketTab;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "info",
    label: "Información básica",
    icon: <AlertCircle size={13} />,
  },
  {
    value: "details",
    label: "Detalles",
    icon: <MessageSquare size={13} />,
  },
];

function createInitialTicketState(
  userId: number,
  empresaId: number,
): FormDataCreateTicket {
  return {
    clienteId: null,
    tecnicoId: null,
    titulo: "",
    descripcion: "",
    estado: "NUEVO",
    prioridad: "MEDIA",
    etiquetas: [],
    userId,
    empresaId,
    tecnicosAdicionales: [],
    telefonoTemporal: "",
  };
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AppInline
      align="center"
      gap="xs"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-1.5 text-xs font-semibold text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
    >
      {icon}
      <span>{children}</span>
    </AppInline>
  );
}

function CrmCreateTicket({
  openCreatT,
  setOpenCreateT,
  getTickets,
}: CreateTicketProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const form = useAppStateHandlers<FormDataCreateTicket>(
    createInitialTicketState(userId, empresaId),
  );

  const ui = useAppStateHandlers({
    activeTab: "info" as CreateTicketTab,
  });

  const createTicket = useCreateTicket();

  const { data: clientesData } = useGetCustomerToSelect();
  const { data: tecnicosData } = useGetUsersToSelect();
  const { data: etiquetasData } = useGetTagsTicket();

  const clientes = clientesData ?? [];
  const tecnicos = tecnicosData ?? [];
  const etiquetas = etiquetasData ?? [];

  React.useEffect(() => {
    form.patch({
      userId,
      empresaId,
    });
  }, [userId, empresaId]);

  const optionsCustomers = React.useMemo<Array<AppSelectOption<number>>>(
    () =>
      clientes.map((cliente) => ({
        value: cliente.id,
        label: cliente.nombre,
      })),
    [clientes],
  );

  const optionsTecs = React.useMemo<Array<AppSelectOption<number>>>(
    () =>
      tecnicos.map((tecnico) => ({
        value: tecnico.id,
        label: tecnico.nombre,
      })),
    [tecnicos],
  );

  const optionsLabels = React.useMemo<Array<AppSelectOption<number>>>(
    () =>
      etiquetas.map((etiqueta) => ({
        value: etiqueta.id,
        label: etiqueta.nombre,
      })),
    [etiquetas],
  );

  const availableMainTechOptions = React.useMemo(
    () =>
      optionsTecs.filter(
        (option) => !form.state.tecnicosAdicionales.includes(option.value),
      ),
    [form.state.tecnicosAdicionales, optionsTecs],
  );

  const companionOptions = React.useMemo(
    () => optionsTecs.filter((option) => option.value !== form.state.tecnicoId),
    [form.state.tecnicoId, optionsTecs],
  );

  const resetForm = React.useCallback(() => {
    form.setState(createInitialTicketState(userId, empresaId));
    ui.setField("activeTab", "info");
  }, [empresaId, form, ui, userId]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (createTicket.isPending) return;

      setOpenCreateT(nextOpen);

      if (!nextOpen) {
        resetForm();
      }
    },
    [createTicket.isPending, resetForm, setOpenCreateT],
  );

  const handleMainTechChange = React.useCallback(
    (value: number | null) => {
      form.patch({
        tecnicoId: value,
        tecnicosAdicionales: form.state.tecnicosAdicionales.filter(
          (id) => id !== value,
        ),
      });
    },
    [form],
  );

  const submitAction = useAppAsyncAction(
    async () => {
      const titulo = form.state.titulo.trim();
      const descripcion = form.state.descripcion.trim();
      const telefonoTemporal = form.state.telefonoTemporal.trim();

      if (!form.state.clienteId) {
        ui.setField("activeTab", "info");
        toast.info("Seleccione un cliente para crear el ticket");
        return;
      }

      if (!titulo) {
        ui.setField("activeTab", "details");
        toast.info("El ticket debe tener un título");
        return;
      }

      const payload: PayloadCreateTicket = {
        ...form.state,
        userId,
        empresaId,
        titulo,
        descripcion,
        telefonoTemporal,
        clienteId: form.state.clienteId,
        tecnicoId: form.state.tecnicoId ?? null,
        tecnicosAdicionales: form.state.tecnicosAdicionales ?? [],
        etiquetas: form.state.etiquetas ?? [],
      };

      await toast.promise(createTicket.mutateAsync(payload), {
        loading: "Registrando ticket...",
        success: "Ticket creado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      getTickets();
      resetForm();
      setOpenCreateT(false);
    },
    {
      preventConcurrent: true,
    },
  );

  const isSubmitting = createTicket.isPending || submitAction.isLoading;
  const hasMainTech = Boolean(form.state.tecnicoId);

  return (
    <AppDialog open={openCreatT} onOpenChange={handleOpenChange}>
      <AppDialogContent size="5xl" viewport="tall" padding="none">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submitAction.run();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <AppDialogHeader divider className="px-4 py-3">
            <AppDialogTitle className="flex items-center gap-2 text-sm">
              <Ticket size={16} />
              Crear nuevo ticket de soporte
            </AppDialogTitle>

            <AppDialogDescription>
              Registre el cliente, asignación técnica, estado, prioridad y
              detalle inicial del ticket.
            </AppDialogDescription>
          </AppDialogHeader>

          <div className="shrink-0 border-b border-[hsl(var(--app-border,var(--border)))] px-4 py-2">
            <div className="grid grid-cols-2 rounded-[var(--app-radius-md)] bg-[hsl(var(--app-muted,var(--muted))/0.45)] p-0.5">
              {TABS.map((tab) => {
                const isActive = ui.state.activeTab === tab.value;

                return (
                  <AppButton
                    key={tab.value}
                    type="button"
                    variant={isActive ? "secondary" : "ghost"}
                    size="xs"
                    width="full"
                    className={[
                      "h-7 justify-center gap-1 rounded-[var(--app-radius-sm)]",
                      isActive
                        ? "bg-[hsl(var(--app-background,var(--background)))] text-[hsl(var(--app-foreground,var(--foreground)))]"
                        : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                    ].join(" ")}
                    onClick={() => ui.setField("activeTab", tab.value)}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </AppButton>
                );
              })}
            </div>
          </div>

          <AppDialogBody
            padding="none"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            {ui.state.activeTab === "info" ? (
              <AppGrid cols={{ base: 1, lg: 2 }} gap="lg" className="p-4">
                <AppStack gap="md">
                  <SectionTitle icon={<User size={14} />}>
                    Cliente y asignaciones
                  </SectionTitle>

                  <AppField label="Cliente" required>
                    {(field) => (
                      <AppSingleSelect<number>
                        inputId={field.id}
                        value={form.state.clienteId}
                        onChange={(value) => form.setField("clienteId", value)}
                        options={optionsCustomers}
                        placeholder="Seleccione un cliente"
                        isClearable
                        isSearchable
                        size="xs"
                        density="compact"
                        fieldWidth="full"
                        invalid={field.invalid}
                        isDisabled={isSubmitting}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>

                  <AppField label="Tel. temporal" description="Opcional">
                    {(field) => (
                      <AppInput
                        id={field.id}
                        type="tel"
                        leftIcon={<Smartphone size={14} />}
                        placeholder="12345678"
                        size="xs"
                        fieldWidth="full"
                        disabled={isSubmitting}
                        invalid={field.invalid}
                        aria-invalid={field.invalid}
                        aria-describedby={field.describedBy}
                        {...form.inputProps("telefonoTemporal")}
                      />
                    )}
                  </AppField>

                  <AppField label="Técnico asignado">
                    {(field) => (
                      <AppSingleSelect<number>
                        inputId={field.id}
                        value={form.state.tecnicoId}
                        onChange={handleMainTechChange}
                        options={availableMainTechOptions}
                        placeholder="Seleccione un técnico"
                        isClearable
                        isSearchable
                        size="xs"
                        density="compact"
                        fieldWidth="full"
                        invalid={field.invalid}
                        isDisabled={isSubmitting}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>

                  <AppField
                    label="Acompañantes"
                    description={
                      hasMainTech
                        ? "Técnicos adicionales para el ticket."
                        : "Seleccione primero un técnico principal."
                    }
                  >
                    {(field) => (
                      <AppMultiSelect<number>
                        inputId={field.id}
                        value={form.state.tecnicosAdicionales}
                        onChange={(values) =>
                          form.setField("tecnicosAdicionales", values)
                        }
                        options={companionOptions}
                        placeholder="Agregar acompañantes"
                        isClearable
                        isSearchable
                        size="xs"
                        density="compact"
                        fieldWidth="full"
                        invalid={field.invalid}
                        isDisabled={isSubmitting || !hasMainTech}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>
                </AppStack>

                <AppStack gap="md">
                  <SectionTitle icon={<Clock size={14} />}>
                    Estado y configuración
                  </SectionTitle>

                  <AppField label="Estado">
                    {(field) => (
                      <AppSingleSelect<TicketEstado>
                        inputId={field.id}
                        value={form.state.estado}
                        onChange={(value) => {
                          if (value) form.setField("estado", value);
                        }}
                        options={STATUS_OPTIONS}
                        placeholder="Seleccionar estado"
                        isClearable={false}
                        isSearchable={false}
                        size="xs"
                        density="compact"
                        fieldWidth="full"
                        invalid={field.invalid}
                        isDisabled={isSubmitting}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>

                  <AppField label="Prioridad">
                    {(field) => (
                      <AppSingleSelect<TicketPrioridad>
                        inputId={field.id}
                        value={form.state.prioridad}
                        onChange={(value) => {
                          if (value) form.setField("prioridad", value);
                        }}
                        options={PRIORITY_OPTIONS}
                        placeholder="Seleccionar prioridad"
                        isClearable={false}
                        isSearchable={false}
                        size="xs"
                        density="compact"
                        fieldWidth="full"
                        invalid={field.invalid}
                        isDisabled={isSubmitting}
                        portalToBody
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuShouldScrollIntoView={false}
                      />
                    )}
                  </AppField>

                  <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-3 py-2">
                    <AppInline
                      align="center"
                      gap="xs"
                      className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
                    >
                      <Flag size={14} />
                      <span>
                        El ticket se creará con estado{" "}
                        <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                          {form.state.estado}
                        </span>{" "}
                        y prioridad{" "}
                        <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                          {form.state.prioridad}
                        </span>
                        .
                      </span>
                    </AppInline>
                  </div>
                </AppStack>
              </AppGrid>
            ) : (
              <AppStack gap="md" className="mx-auto max-w-3xl p-4">
                <AppField label="Título" required>
                  {(field) => (
                    <AppInput
                      id={field.id}
                      leftIcon={<AlertCircle size={14} />}
                      placeholder="Título descriptivo del problema"
                      size="xs"
                      fieldWidth="full"
                      disabled={isSubmitting}
                      invalid={field.invalid}
                      aria-invalid={field.invalid}
                      aria-describedby={field.describedBy}
                      {...form.inputProps("titulo")}
                    />
                  )}
                </AppField>

                <AppField label="Descripción">
                  {(field) => (
                    <AppTextarea
                      id={field.id}
                      placeholder="Describa detalladamente el problema o solicitud"
                      rows={5}
                      size="xs"
                      fieldWidth="full"
                      disabled={isSubmitting}
                      invalid={field.invalid}
                      aria-invalid={field.invalid}
                      aria-describedby={field.describedBy}
                      className="min-h-[100px] resize-y"
                      {...form.textareaProps("descripcion")}
                    />
                  )}
                </AppField>

                <AppField label="Etiquetas">
                  {(field) => (
                    <AppMultiSelect<number>
                      inputId={field.id}
                      value={form.state.etiquetas}
                      onChange={(values) => form.setField("etiquetas", values)}
                      options={optionsLabels}
                      placeholder="Seleccione etiquetas"
                      isClearable
                      isSearchable
                      size="xs"
                      density="compact"
                      fieldWidth="full"
                      invalid={field.invalid}
                      isDisabled={isSubmitting}
                      portalToBody
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldScrollIntoView={false}
                    />
                  )}
                </AppField>
              </AppStack>
            )}
          </AppDialogBody>

          <AppDialogFooter divider className="px-4 py-2.5">
            <AppInline
              align="center"
              justify="between"
              gap="sm"
              className="w-full"
            >
              <AppInline
                align="center"
                gap="xs"
                className="hidden text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] sm:flex"
              >
                <Calendar size={14} />
                <span>
                  Fecha de creación: {new Date().toLocaleDateString()}
                </span>
              </AppInline>

              <AppInline
                align="center"
                justify="end"
                gap="xs"
                className="ml-auto"
              >
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  leftIcon={<X size={14} />}
                  disabled={isSubmitting}
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </AppButton>

                <AppButton
                  type="submit"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<Save size={14} />}
                  loading={isSubmitting}
                  loadingText="Creando..."
                >
                  Crear ticket
                </AppButton>
              </AppInline>
            </AppInline>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}

export default CrmCreateTicket;
