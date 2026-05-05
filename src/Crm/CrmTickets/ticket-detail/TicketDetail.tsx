"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MultiValue, SingleValue } from "react-select";

import { TicketHeader } from "./TicketHeader";
import { TicketTimeline } from "./TicketTimeline";
import { TicketCommentInput } from "./TicketCommentInput";
import { DialogEditTicket } from "./dialogs/DialogEditTicket";
import { DialogDeleteTicket } from "./dialogs/DialogDeleteTicket";
import { DialogCloseTicket } from "./dialogs/DialogCloseTicket";
import type { TicketResumenSchemaType } from "./dialogs/DialogCloseTicket";
import { getPriorityBadge, SelectOption } from "./ticket-detail.types";
import { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";
import { Ticket } from "../ticketTypes";
import { RolUsuario } from "@/Crm/features/users/users-rol";
import { useCreateTicketResumen } from "@/Crm/CrmHooks/hooks/use-ticket-resumen/useTicketResumen";
import {
  QuerySearchTickets,
  useDeleteTicket,
  usePostCommentary,
  useUpdateTicket,
} from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { updateTicketDto } from "@/Crm/features/ticket/ticket-types";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useQueryClient } from "@tanstack/react-query";
import { ticketsSoporteQkeys } from "@/Crm/CrmHooks/hooks/use-tickets/Qk";
// import {
//   getPriorityBadge,
//   type Ticket,
//   type SelectOption,
//   type SolucionTicketItem,
// } from "./ticket-detail.types";

// ─── Hook stubs — replace with your actual hooks ──────────────────────────
// import { usePostCommentary, useUpdateTicket, useDeleteTicket } from "@/hooks/useTicketsSoporte";
// import { useCreateTicketResumen } from "@/hooks/useTicketResumen";
// import { useStoreCrm } from "@/ZustandCrm/ZustandCrmContext";

interface TicketDetailProps {
  ticket: Ticket;
  getTickets: () => void;
  setSelectedTicketId: (value: number | null) => void;
  optionsLabels: SelectOption[];
  optionsTecs: SelectOption[];
  optionsCustomers: SelectOption[];
  soluciones: SolucionTicketItem[];
  /** Current logged-in user id — from your Zustand store */
  userId?: number;
  query: QuerySearchTickets;
}

export default function TicketDetail({
  ticket,
  getTickets,
  setSelectedTicketId,
  optionsLabels,
  optionsTecs,
  optionsCustomers,
  soluciones,
  query,
}: TicketDetailProps) {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const q = useQueryClient();

  // ── Local state ──────────────────────────────────────────────────────────
  const [ticketEdit, setTicketEdit] = useState<Ticket>(ticket);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openClose, setOpenClose] = useState(false);
  const [commentPending, setCommentPending] = useState(false);

  const create_ticket_resumen = useCreateTicketResumen();

  const deleteTicket = useDeleteTicket(ticket.id);
  const updateTicket = useUpdateTicket(ticketEdit.id);

  const postCommentary = usePostCommentary();

  // Sync ticket prop → local edit copy when parent changes selection
  useEffect(() => {
    setTicketEdit(ticket);
  }, [ticket]);

  // ── Close-ticket form ────────────────────────────────────────────────────
  const formCloseTicket = useForm<TicketResumenSchemaType>({
    defaultValues: {
      ticketId: ticket.id,
      solucionId: null,
      resueltoComo: "",
      notasInternas: "",
    },
  });

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleClose = () => setSelectedTicketId(null);

  const handleCommentSubmit = async (text: string) => {
    setCommentPending(true);
    try {
      toast.promise(
        postCommentary.mutateAsync({
          ticketId: ticket.id,
          usuarioId: userId,
          descripcion: text,
        }),
        {
          loading: "Añadiendo comentario...",
          success: () => {
            q.invalidateQueries({
              queryKey: ticketsSoporteQkeys.search(query),
            });
            return "Comentario añadido";
          },
          error: (error) => getApiErrorMessageAxios(error),
        },
      );
      await getTickets();
    } finally {
      setCommentPending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTicketEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTicketEdit((prev) => ({
      ...prev,
      [name]: name === "fixed" ? value === "true" : value,
    }));
  };

  const handleChangeCustomer = (opt: SingleValue<SelectOption>) => {
    setTicketEdit((prev) => ({
      ...prev,
      customer: opt ? { id: Number(opt.value), name: opt.label } : null,
    }));
  };

  const handleChangeTec = (opt: SingleValue<SelectOption>) => {
    setTicketEdit((prev) => ({
      ...prev,
      assignee: opt
        ? {
            id: Number(opt.value),
            name: opt.label,
            initials: "",
            rol: RolUsuario.TECNICO,
          }
        : null,
    }));
  };

  const handleChangeCompanions = (opts: MultiValue<SelectOption>) => {
    setTicketEdit((prev) => ({
      ...prev,
      companios: opts
        ? opts.map((o) => ({
            id: Number(o.value),
            name: o.label,
            rol: RolUsuario.TECNICO,
          }))
        : [],
    }));
  };

  const handleChangeLabels = (opts: MultiValue<SelectOption>) => {
    setTicketEdit((prev) => ({
      ...prev,
      tags: opts.map((o) => ({ value: o.value, label: o.label })),
    }));
  };

  // Submit edit — wire to useUpdateTicket().mutateAsync in real app
  // const handleSubmitEdit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!ticketEdit.title?.trim()) return;
  //   await updateTicket.mutateAsync(ticketEdit);
  //   await getTickets();
  //   setOpenEdit(false);
  // };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketEdit.title?.trim()) {
      toast.info("El ticket debe tener un título");
      return;
    }

    const payload: updateTicketDto = {
      title: ticketEdit.title.trim(),
      description: ticketEdit.description?.trim() || "",
      priority: ticketEdit.priority,
      status: ticketEdit.status,
      fixed: ticketEdit.fixed,

      clienteId: ticketEdit.customer?.id ?? null,
      tecnicoId: ticketEdit.assignee?.id ?? null,

      tecnicosAdicionales: ticketEdit.companios?.map((c) => c.id) ?? [],
      tags: ticketEdit.tags?.map((t) => Number(t.value)) ?? [],
    };

    toast.promise(updateTicket.mutateAsync(payload), {
      loading: "Actualizando ticket...",
      success: async () => {
        await getTickets();
        // setOpenUpdateTicket(false);
        return "Ticket actualizado";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  // Delete — wire to useDeleteTicket().mutateAsync in real app
  const handleDelete = async () => {
    toast.promise(deleteTicket.mutateAsync(), {
      success: "Ticket eliminado",
      loading: "Eliminando ticket...",
      error: (error) => getApiErrorMessageAxios(error),
    });
    await getTickets();
    setOpenDelete(false);
    setSelectedTicketId(null);
  };

  const handleCloseTicket = async (data: TicketResumenSchemaType) => {
    toast.promise(create_ticket_resumen.mutateAsync(data), {
      loading: "Cerrando ticket...",
      success: "Ticket cerrado",
      error: (error) => getApiErrorMessageAxios(error),
    });
    setOpenClose(false);
    await getTickets();
    formCloseTicket.reset({
      notasInternas: "",
      resueltoComo: "",
      solucionId: null,
      ticketId: ticket.id,
    });
  };
  console.log("Los comentarios son: ", ticket);

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded overflow-hidden bg-white">
      {/* Header: sticky, compact */}
      <TicketHeader
        ticket={ticket}
        badgeProps={getPriorityBadge(ticket.priority)}
        onCloseView={handleClose}
        onEdit={() => {
          setTicketEdit(ticket);
          setOpenEdit(true);
        }}
        onDelete={() => setOpenDelete(true)}
        onCloseTicket={() => {
          setTicketEdit(ticket);
          setOpenClose(true);
        }}
      />

      {/* Timeline: scrollable middle section */}
      <TicketTimeline
        metricas={ticket.metrics}
        comments={ticket.comments}
        creator={ticket.creator}
      />

      {/* Comment input: fixed footer */}
      <TicketCommentInput
        isPending={commentPending}
        onSubmit={handleCommentSubmit}
      />

      {/* Dialogs */}
      <DialogEditTicket
        open={openEdit}
        onOpenChange={setOpenEdit}
        ticket={ticketEdit}
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
        open={openDelete}
        ticketId={ticket.id}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
      />

      <DialogCloseTicket
        open={openClose}
        ticketId={ticket.id}
        soluciones={soluciones}
        form={formCloseTicket}
        onOpenChange={setOpenClose}
        onSubmit={handleCloseTicket}
      />
    </div>
  );
}
