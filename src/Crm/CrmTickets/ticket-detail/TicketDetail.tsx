"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import type { MultiValue, SingleValue } from "react-select";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppAsyncAction,
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";

import { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";
import { RolUsuario } from "@/Crm/features/users/users-rol";
import { useCreateTicketResumen } from "@/Crm/CrmHooks/hooks/use-ticket-resumen/useTicketResumen";
import {
  QuerySearchTickets,
  useDeleteTicket,
  usePostCommentary,
  useUpdateTicket,
} from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { ticketsSoporteQkeys } from "@/Crm/CrmHooks/hooks/use-tickets/Qk";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { Ticket } from "../ticketTypes";
import { SelectOption } from "./ticket-detail.types";
import { TicketHeader } from "./TicketHeader";
import { TicketTimeline } from "./TicketTimeline";
import { TicketCommentInput } from "./TicketCommentInput";
import { DialogEditTicket } from "./dialogs/DialogEditTicket";
import { DialogDeleteTicket } from "./dialogs/DialogDeleteTicket";
import { DialogCloseTicket } from "./dialogs/DialogCloseTicket";
import type { TicketResumenSchemaType } from "./dialogs/DialogCloseTicket";
import {
  buildUpdateTicketPayload,
  safeFormatTicketDate,
} from "../_components/ticket-detail.helpers";

interface TicketDetailProps {
  ticket: Ticket;
  getTickets: () => void;
  setSelectedTicketId: (value: number | null) => void;
  optionsLabels: SelectOption[];
  optionsTecs: SelectOption[];
  optionsCustomers: SelectOption[];
  soluciones: SolucionTicketItem[];
  userId?: number;
  query: QuerySearchTickets;
}

export default function TicketDetail({
  ticket,
  setSelectedTicketId,
  optionsLabels,
  optionsTecs,
  optionsCustomers,
  soluciones,
  query,
}: TicketDetailProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const queryClient = useQueryClient();

  const editDialog = useAppDisclosure();
  const deleteDialog = useAppDisclosure();
  const closeDialog = useAppDisclosure();

  const ticketEdit = useAppStateHandlers<Ticket>(ticket);

  const createTicketResumen = useCreateTicketResumen();
  const deleteTicket = useDeleteTicket(ticket.id);
  const updateTicket = useUpdateTicket(ticketEdit.state.id);
  const postCommentary = usePostCommentary();

  const formCloseTicket = useForm<TicketResumenSchemaType>({
    defaultValues: {
      ticketId: ticket.id,
      solucionId: null,
      resueltoComo: "",
      notasInternas: "",
    },
  });

  React.useEffect(() => {
    ticketEdit.setState(ticket);

    formCloseTicket.reset({
      ticketId: ticket.id,
      solucionId: null,
      resueltoComo: "",
      notasInternas: "",
    });
  }, [ticket.id]);

  const invalidateTickets = React.useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ticketsSoporteQkeys.search(query),
    });
  }, [query, queryClient]);

  const handleCloseView = React.useCallback(() => {
    setSelectedTicketId(null);
  }, [setSelectedTicketId]);

  const commentAction = useAppAsyncAction(
    async (text: string) => {
      await toast.promise(
        postCommentary.mutateAsync({
          ticketId: ticket.id,
          usuarioId: userId,
          descripcion: text,
        }),
        {
          loading: "Añadiendo comentario...",
          success: "Comentario añadido",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      await invalidateTickets();
    },
    {
      preventConcurrent: true,
    },
  );

  const editAction = useAppAsyncAction(
    async () => {
      const currentTicket = ticketEdit.state;

      if (!currentTicket.title?.trim()) {
        toast.info("El ticket debe tener un título");
        return;
      }

      const payload = buildUpdateTicketPayload(currentTicket);

      await toast.promise(updateTicket.mutateAsync(payload), {
        loading: "Actualizando ticket...",
        success: "Ticket actualizado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      await invalidateTickets();
      editDialog.close();
    },
    {
      preventConcurrent: true,
    },
  );

  const deleteAction = useAppAsyncAction(
    async () => {
      await toast.promise(deleteTicket.mutateAsync(), {
        loading: "Eliminando ticket...",
        success: "Ticket eliminado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      await invalidateTickets();
      deleteDialog.close();
      setSelectedTicketId(null);
    },
    {
      preventConcurrent: true,
    },
  );

  const closeTicketAction = useAppAsyncAction(
    async (data: TicketResumenSchemaType) => {
      const payload: TicketResumenSchemaType = {
        ...data,
        ticketId: ticket.id,
      };

      await toast.promise(createTicketResumen.mutateAsync(payload), {
        loading: "Cerrando ticket...",
        success: "Ticket cerrado",
        error: (error) => getApiErrorMessageAxios(error),
      });

      await invalidateTickets();

      closeDialog.close();
      setSelectedTicketId(null);

      formCloseTicket.reset({
        ticketId: ticket.id,
        solucionId: null,
        resueltoComo: "",
        notasInternas: "",
      });
    },
    {
      preventConcurrent: true,
    },
  );

  const handleOpenEdit = React.useCallback(() => {
    ticketEdit.setState(ticket);
    editDialog.open();
  }, [editDialog, ticket, ticketEdit]);

  const handleOpenCloseTicket = React.useCallback(() => {
    ticketEdit.setState(ticket);
    closeDialog.open();
  }, [closeDialog, ticket, ticketEdit]);

  const handleSubmitEdit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void editAction.run();
    },
    [editAction],
  );

  const handleDelete = React.useCallback(() => {
    void deleteAction.run();
  }, [deleteAction]);

  const handleCloseTicket = React.useCallback(
    (data: TicketResumenSchemaType) => {
      void closeTicketAction.run(data);
    },
    [closeTicketAction],
  );

  const handleCommentSubmit = React.useCallback(
    async (text: string) => {
      await commentAction.run(text);
    },
    [commentAction],
  );

  /**
   * Handlers puente para DialogEditTicket.
   * Cuando refactoricemos ese dialog a AppInput/AppSelect directos, estos desaparecen.
   */
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      ticketEdit.patch({
        [name]: value,
      } as Partial<Ticket>);
    },
    [ticketEdit],
  );

  const handleSelectChange = React.useCallback(
    (name: string, value: string) => {
      ticketEdit.patch({
        [name]: name === "fixed" ? value === "true" : value,
      } as Partial<Ticket>);
    },
    [ticketEdit],
  );

  const handleChangeCustomer = React.useCallback(
    (option: SingleValue<SelectOption>) => {
      ticketEdit.patch({
        customer: option
          ? {
              id: Number(option.value),
              name: option.label,
            }
          : null,
      });
    },
    [ticketEdit],
  );

  const handleChangeTec = React.useCallback(
    (option: SingleValue<SelectOption>) => {
      ticketEdit.patch({
        assignee: option
          ? {
              id: Number(option.value),
              name: option.label,
              initials: "",
              rol: RolUsuario.TECNICO,
            }
          : null,
      });
    },
    [ticketEdit],
  );

  const handleChangeCompanions = React.useCallback(
    (options: MultiValue<SelectOption>) => {
      ticketEdit.patch({
        companios: options.map((option) => ({
          id: Number(option.value),
          name: option.label,
          rol: RolUsuario.TECNICO,
        })),
      });
    },
    [ticketEdit],
  );

  const handleChangeLabels = React.useCallback(
    (options: MultiValue<SelectOption>) => {
      ticketEdit.patch({
        tags: options.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      });
    },
    [ticketEdit],
  );

  return (
    <AppStack
      gap="none"
      className="h-full overflow-hidden rounded-[var(--app-radius-lg)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))]"
    >
      <TicketHeader
        ticket={ticket}
        onCloseView={handleCloseView}
        onEdit={handleOpenEdit}
        onDelete={deleteDialog.open}
        onCloseTicket={handleOpenCloseTicket}
      />

      <TicketTimeline
        date={safeFormatTicketDate(ticket.date)}
        closedAt={safeFormatTicketDate(ticket.closedAt)}
        metricas={ticket.metrics}
        comments={ticket.comments}
        creator={ticket.creator}
      />

      <TicketCommentInput
        isPending={commentAction.isLoading}
        onSubmit={handleCommentSubmit}
      />

      <DialogEditTicket
        open={editDialog.isOpen}
        onOpenChange={editDialog.setOpen}
        ticket={ticketEdit.state}
        optionsLabels={optionsLabels}
        optionsTecs={optionsTecs}
        optionsCustomers={optionsCustomers}
        onSubmit={handleSubmitEdit}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onChangeCustomer={handleChangeCustomer}
        onChangeTec={handleChangeTec}
        onChangeCompanions={handleChangeCompanions}
        onChangeLabels={handleChangeLabels}
      />

      <DialogDeleteTicket
        open={deleteDialog.isOpen}
        ticketId={ticket.id}
        onOpenChange={deleteDialog.setOpen}
        onConfirm={handleDelete}
        isPending={deleteAction.isLoading}
      />

      <DialogCloseTicket
        open={closeDialog.isOpen}
        ticketId={ticket.id}
        soluciones={soluciones}
        form={formCloseTicket}
        onOpenChange={closeDialog.setOpen}
        onSubmit={handleCloseTicket}
      />
    </AppStack>
  );
}
