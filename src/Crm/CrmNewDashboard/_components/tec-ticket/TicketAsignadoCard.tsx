"use client";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCopy,
  Eye,
  ImageIcon,
  MapPin,
  Navigation,
  Route,
  Send,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  useAppAsyncAction,
  useAppConfirmHandler,
} from "@/components/app/handlers";

import type { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import { handleCall, handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";
import { copyToClipBoard } from "@/utils/clipBoard";
import {
  usePatchTicketEnProceso,
  usePatchTicketEnRevision,
} from "@/Crm/CrmHooks/hooks/dashboard/useDashboard";
import {
  formatTicketDate,
  getBlockedActionLabel,
  getDireccionText,
  getEstadoTicketMeta,
  getLifecycleAction,
  getPrioridadTicketMeta,
  getTicketAccentClass,
} from "../ticket-helpers";
import { ContactActionBlock, TicketMediaStrip } from "../contact-action-block";
type TicketLifecycleAction = "start" | "review";

interface TicketCardProps {
  ticket: TicketAsignadoTecnico;
}

export function TicketAsignadoCard({ ticket }: TicketCardProps) {
  const lifecycleDialog = useAppConfirmHandler<TicketLifecycleAction>();

  const patchEnProceso = usePatchTicketEnProceso(ticket.id);
  const patchEnRevision = usePatchTicketEnRevision(ticket.id);

  const lifecycleAction = getLifecycleAction(ticket.estado);
  const isMutating =
    patchEnProceso.isPending ||
    patchEnRevision.isPending ||
    lifecycleDialog.isOpen;

  const estadoMeta = getEstadoTicketMeta(ticket.estado);
  const prioridadMeta = getPrioridadTicketMeta(ticket.prioridad);
  const direccionText = getDireccionText(ticket.direccion);
  const hasLocation = Boolean(ticket.ubicacionMaps);
  const hasMainPhone = Boolean(ticket.clienteTel);
  const hasReferencePhone = Boolean(ticket.referenciaContacto);
  const medias = Array.isArray(ticket.medias) ? ticket.medias : [];

  const updateTicketAction = useAppAsyncAction(
    async (action: TicketLifecycleAction) => {
      const promise =
        action === "review"
          ? patchEnRevision.mutateAsync()
          : patchEnProceso.mutateAsync();

      toast.promise(promise, {
        loading:
          action === "review"
            ? "Marcando pendiente de revisión..."
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
        lifecycleDialog.close();
      },
    },
  );

  const openMaps = () => {
    if (!ticket.ubicacionMaps) return;

    const { lat, lng } = ticket.ubicacionMaps;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const startRoute = () => {
    if (!ticket.ubicacionMaps) return;

    const { lat, lng } = ticket.ubicacionMaps;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyCoords = () => {
    if (!ticket.ubicacionMaps) return;

    const { lat, lng } = ticket.ubicacionMaps;

    copyToClipBoard(`${lat}, ${lng}`);
    toast.success("Coordenadas copiadas");
  };

  const openWhatsapp = (phone?: string | null) => {
    if (!phone) return;

    window.open(handleOpenWhatsapp(phone), "_blank", "noopener,noreferrer");
  };

  const callPhone = (phone?: string | null) => {
    if (!phone) return;

    window.location.href = handleCall(phone);
  };

  const copyPhone = (phone?: string | null) => {
    if (!phone) return;

    copyToClipBoard(phone);
    toast.success("Número copiado");
  };

  return (
    <>
      <AppCard
        variant="outline"
        size="xs"
        radius="md"
        className={cn(
          "overflow-hidden border-l-[3px] px-2 py-2",
          getTicketAccentClass(prioridadMeta.tone),
        )}
      >
        <AppStack gap="xs">
          <AppInline gap="xs" align="start" justify="between">
            <AppInline gap="xs" align="center" wrap className="min-w-0">
              <AppBadge size="xs" tone={estadoMeta.tone} appearance="soft">
                {estadoMeta.label}
              </AppBadge>

              <AppBadge size="xs" tone={prioridadMeta.tone} appearance="soft">
                {prioridadMeta.label}
              </AppBadge>

              {medias.length > 0 ? (
                <AppBadge size="xs" tone="info" appearance="soft">
                  <ImageIcon className="h-3 w-3" />
                  {medias.length}
                </AppBadge>
              ) : null}
            </AppInline>

            <AppInline
              gap="xs"
              align="center"
              className="shrink-0 text-[11px] leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            >
              <CalendarClock className="h-3 w-3" />
              <span>{formatTicketDate(ticket.abiertoEn)}</span>
            </AppInline>
          </AppInline>

          <AppStack gap="none" className="min-w-0">
            <h2
              title={ticket.titulo ?? undefined}
              className="line-clamp-2 text-[15px] font-semibold leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]"
            >
              {ticket.titulo || "Ticket sin título"}
            </h2>

            <p className="mt-1 line-clamp-3 text-xs leading-snug text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {ticket.descripcion || "Sin descripción registrada."}
            </p>
          </AppStack>

          <AppSeparator spacing="none" />

          <AppStack gap="xs">
            <AppInline gap="xs" align="start" className="min-w-0">
              <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />

              <div className="min-w-0">
                <p className="truncate text-[11px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  Cliente #{ticket.clientId}
                </p>

                <p
                  title={ticket.clienteNombre}
                  className="truncate text-sm font-medium leading-tight text-[hsl(var(--app-foreground,var(--foreground)))]"
                >
                  {ticket.clienteNombre || "Cliente sin nombre"}
                </p>
              </div>
            </AppInline>

            {direccionText ? (
              <AppInline gap="xs" align="start" className="min-w-0">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]" />

                <p className="line-clamp-2 text-xs leading-snug text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  {direccionText}
                </p>
              </AppInline>
            ) : null}
          </AppStack>

          {medias.length > 0 ? <TicketMediaStrip medias={medias} /> : null}

          <AppSeparator spacing="none" />

          <AppStack gap="xs">
            <ContactActionBlock
              label="Contacto principal"
              phone={ticket.clienteTel}
              disabled={!hasMainPhone}
              onWhatsapp={() => openWhatsapp(ticket.clienteTel)}
              onCall={() => callPhone(ticket.clienteTel)}
              onCopy={() => copyPhone(ticket.clienteTel)}
            />

            {hasReferencePhone ? (
              <ContactActionBlock
                label="Referencia"
                phone={ticket.referenciaContacto}
                disabled={!hasReferencePhone}
                compact
                onWhatsapp={() => openWhatsapp(ticket.referenciaContacto)}
                onCall={() => callPhone(ticket.referenciaContacto)}
                onCopy={() => copyPhone(ticket.referenciaContacto)}
              />
            ) : null}
          </AppStack>

          {hasLocation ? (
            <>
              <AppSeparator spacing="none" />

              <AppGrid cols={3} gap="xs">
                <AppButton
                  type="button"
                  size="xs"
                  variant="secondary"
                  width="full"
                  leftIcon={<Route className="h-3.5 w-3.5" />}
                  onClick={startRoute}
                  className="h-8"
                >
                  Ruta
                </AppButton>

                <AppButton
                  type="button"
                  size="xs"
                  variant="ghost"
                  width="full"
                  leftIcon={<Navigation className="h-3.5 w-3.5" />}
                  onClick={openMaps}
                  className="h-8"
                >
                  Mapa
                </AppButton>

                <AppButton
                  type="button"
                  size="xs"
                  variant="ghost"
                  width="full"
                  leftIcon={<ClipboardCopy className="h-3.5 w-3.5" />}
                  onClick={copyCoords}
                  className="h-8"
                >
                  GPS
                </AppButton>
              </AppGrid>
            </>
          ) : null}

          <AppSeparator spacing="none" />

          <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
            {lifecycleAction ? (
              <AppButton
                type="button"
                size="sm"
                variant={lifecycleAction === "review" ? "secondary" : "primary"}
                width="full"
                loading={updateTicketAction.isLoading}
                loadingText={
                  lifecycleAction === "review" ? "Marcando..." : "Iniciando..."
                }
                disabled={isMutating}
                leftIcon={
                  lifecycleAction === "review" ? (
                    <Send className="h-4 w-4" />
                  ) : (
                    <Wrench className="h-4 w-4" />
                  )
                }
                onClick={() => lifecycleDialog.open(lifecycleAction)}
                className="h-9"
              >
                {lifecycleAction === "review"
                  ? "Enviar a revisión"
                  : "Tomar en proceso"}
              </AppButton>
            ) : (
              <AppButton
                type="button"
                size="sm"
                variant="secondary"
                width="full"
                disabled
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="h-9"
              >
                {getBlockedActionLabel(ticket.estado)}
              </AppButton>
            )}
            <Link to={`/crm/ticket-detalles/${ticket.id}`}>
              <AppButton
                size="sm"
                variant="ghost"
                width="full"
                leftIcon={<Eye className="h-4 w-4" />}
                className="h-9"
              >
                Ver detalles
              </AppButton>
            </Link>
          </AppGrid>
        </AppStack>
      </AppCard>

      <AppConfirmDialog
        open={lifecycleDialog.isOpen}
        onOpenChange={lifecycleDialog.setOpen}
        preset="info"
        tone="info"
        title={
          lifecycleDialog.target === "review"
            ? "Enviar ticket a revisión"
            : "Tomar ticket en proceso"
        }
        description={
          lifecycleDialog.target === "review"
            ? `El ticket #${ticket.id} pasará a PENDIENTE_REVISION.`
            : `El ticket #${ticket.id} pasará a EN_PROCESO.`
        }
        confirmText={
          lifecycleDialog.target === "review"
            ? "Enviar a revisión"
            : "Confirmar inicio"
        }
        cancelText="Cancelar"
        loadingText={
          lifecycleDialog.target === "review" ? "Marcando..." : "Iniciando..."
        }
        isLoading={updateTicketAction.isLoading}
        preventClose={updateTicketAction.isLoading}
        closeOnConfirm={false}
        onConfirm={() =>
          lifecycleDialog.confirm(async (action) => {
            await updateTicketAction.run(action);
          })
        }
      >
        <AppCard variant="outline" size="xs" className="p-2">
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
  );
}
