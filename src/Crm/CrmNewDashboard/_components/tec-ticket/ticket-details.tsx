"use client";

import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppDataState } from "@/components/app/primitives/app-data-state";

import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
} from "@/components/app/handlers";

import {
  useGetTicketDetails,
  usePatchTicketEnProceso,
  usePatchTicketEnRevision,
} from "@/Crm/CrmHooks/hooks/dashboard/useDashboard";

import {
  getLifecycleAction,
  TicketContactSection,
  TicketDescriptionSection,
  TicketHero,
  TicketLocationSection,
} from "../ticket-helpers";
import { useParams } from "react-router-dom";
import { TicketMediaSection } from "./ticket-media-section";
import { TicketBottomActionBar } from "./ticket-bottom-bar";

export type TicketLifecycleAction = "start" | "review";

function TicketAsignadoDetails() {
  const { id } = useParams();
  const ticketId = Number(id ?? 0);

  const ticketQuery = useGetTicketDetails(ticketId);

  const {
    data: ticket,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = ticketQuery;

  const actionDialog = useAppConfirmHandler<TicketLifecycleAction>();

  const patchEnProceso = usePatchTicketEnProceso(ticketId);
  const patchEnRevision = usePatchTicketEnRevision(ticketId);

  const lifecycleAction = ticket ? getLifecycleAction(ticket.estado) : null;

  const updateTicketAction = useAppAsyncAction(
    async (action: TicketLifecycleAction) => {
      const promise =
        action === "review"
          ? patchEnRevision.mutateAsync()
          : patchEnProceso.mutateAsync();

      toast.promise(promise, {
        loading:
          action === "review"
            ? "Enviando ticket a revisión..."
            : "Tomando ticket en proceso...",
        success:
          action === "review"
            ? "Ticket enviado a revisión"
            : "Ticket tomado en proceso",
        error: "Ocurrió un error al actualizar el ticket",
      });

      await promise;
    },
    {
      preventConcurrent: true,
      onSuccess: () => {
        actionDialog.close();
      },
    },
  );

  const isMutating =
    patchEnProceso.isPending ||
    patchEnRevision.isPending ||
    updateTicketAction.isLoading;

  return (
    <PageTransitionCrm
      titleHeader={ticket ? `Ticket #${ticket.id}` : "Detalle del ticket"}
      subtitle="Gestión técnica en campo"
      variant="crm-soft"
      stickyHeader
      actions={
        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          width="auto"
          disabled={isFetching}
          leftIcon={
            <RefreshCw
              className={cn("h-3.5 w-3.5", isFetching && "animate-spin")}
            />
          }
          onClick={() => refetch()}
        >
          Actualizar
        </AppButton>
      }
    >
      <AppDataState
        isLoading={isLoading}
        isFetching={isFetching}
        error={isError ? error : null}
        isEmpty={!ticket}
        onRetry={() => refetch()}
      >
        {ticket ? (
          <>
            <main className="pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-4">
              <AppStack gap="sm">
                <TicketHero ticket={ticket} />

                <TicketContactSection ticket={ticket} />

                <TicketLocationSection ticket={ticket} />

                <TicketDescriptionSection ticket={ticket} />

                <TicketMediaSection medias={ticket.medias ?? []} />
              </AppStack>
            </main>

            <TicketBottomActionBar
              ticket={ticket}
              lifecycleAction={lifecycleAction}
              isLoading={isMutating}
              onRequestAction={() => {
                if (!lifecycleAction) return;
                actionDialog.open(lifecycleAction);
              }}
            />

            <AppConfirmDialog
              open={actionDialog.isOpen}
              onOpenChange={actionDialog.setOpen}
              preset="info"
              tone="info"
              title={
                actionDialog.target === "review"
                  ? "Enviar ticket a revisión"
                  : "Tomar ticket en proceso"
              }
              description={
                actionDialog.target === "review"
                  ? "El ticket pasará a PENDIENTE_REVISION. Verifica que la evidencia y observaciones estén completas."
                  : "El ticket pasará a EN_PROCESO y quedará registrado como iniciado."
              }
              confirmText={
                actionDialog.target === "review"
                  ? "Enviar a revisión"
                  : "Tomar en proceso"
              }
              cancelText="Cancelar"
              loadingText="Procesando..."
              isLoading={updateTicketAction.isLoading}
              preventClose={updateTicketAction.isLoading}
              closeOnConfirm={false}
              onConfirm={() =>
                actionDialog.confirm(async (action) => {
                  await updateTicketAction.run(action);
                })
              }
            >
              <AppCard variant="outline" size="xs">
                <AppStack gap="xs">
                  <AppInline gap="xs" align="center" justify="between">
                    <span className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                      Ticket
                    </span>

                    <span className="text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
                      #{ticket.id}
                    </span>
                  </AppInline>

                  <p className="line-clamp-2 text-xs leading-snug text-[hsl(var(--app-foreground,var(--foreground)))]">
                    {ticket.titulo || "Ticket sin título"}
                  </p>
                </AppStack>
              </AppCard>
            </AppConfirmDialog>
          </>
        ) : null}
      </AppDataState>
    </PageTransitionCrm>
  );
}

export default TicketAsignadoDetails;
