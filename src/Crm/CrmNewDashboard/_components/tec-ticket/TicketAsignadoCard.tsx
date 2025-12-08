import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import { handleCall, handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";
import { copyToClipBoard } from "@/utils/clipBoard";

import { MapPin, Phone, MessageCircle, Navigation, Copy } from "lucide-react";
import {
  usePatchTicketEnProceso,
  usePatchTicketEnRevision,
} from "@/Crm/CrmHooks/hooks/dashboard/useDashboard";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";

/* ================== HELPERS ================== */

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "Sin descripción";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

function getEstadoBadgeClasses(estado: string): string {
  switch (estado) {
    case "EN_PROCESO":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200";
    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
    case "PENDIENTE_TECNICO":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200";
    case "PENDIENTE_REVISION":
      return "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-200";
    case "NUEVO":
    case "ABIERTA":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200";
  }
}

function getPrioridadBadgeClasses(prioridad: string): string {
  switch (prioridad) {
    case "ALTA":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200";
    case "BAJA":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200";
    case "MEDIA":
    default:
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200";
  }
}

function formatFecha(fechaIso: string | null | undefined): string {
  if (!fechaIso) return "Sin fecha";
  try {
    const d = new Date(fechaIso);
    return d.toLocaleString("es-GT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Sin fecha";
  }
}

/** Fondo / borde según estado del ticket */
function getCardEstadoClasses(estado: string): string {
  switch (estado) {
    case "EN_PROCESO":
      return "border-amber-200/80 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20";
    case "PENDIENTE_REVISION":
      return "border-fuchsia-200/80 bg-fuchsia-50/70 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/20";
    case "NUEVO":
    case "ABIERTA":
      return "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/15";
    default:
      return "border-slate-200/70 bg-card dark:border-slate-800/60";
  }
}

/* ================== COMPONENTE ================== */

interface TicketCardProps {
  ticket: TicketAsignadoTecnico;
}

export function TicketAsignadoCard({ ticket }: TicketCardProps) {
  const hasLocation = !!ticket.ubicacionMaps;

  const isDisableReference: boolean = !ticket.referenciaContacto;
  const isDisableContact: boolean = !ticket.clienteTel;

  const [openActionDialog, setOpenActionDialog] = useState(false);

  // hooks de patch
  const patchEnProceso = usePatchTicketEnProceso(ticket.id);
  const patchEnRevision = usePatchTicketEnRevision(ticket.id);

  const isIniciado = ticket.estado === "EN_PROCESO";
  const isMutating = patchEnProceso.isPending || patchEnRevision.isPending;

  /* ====== acciones contacto ====== */

  const handleWhatsapp = (phone?: string | null) => {
    if (!phone) return;
    window.open(handleOpenWhatsapp(phone), "_blank");
  };

  const handleCallClick = (phone?: string | null) => {
    if (!phone) return;
    window.location.href = handleCall(phone);
  };

  /* ====== acciones ubicación ====== */

  const handleOpenMaps = () => {
    if (!ticket.ubicacionMaps) return;
    const { lat, lng } = ticket.ubicacionMaps;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  const handleStartRouteMaps = () => {
    if (!ticket.ubicacionMaps) return;
    const { lat, lng } = ticket.ubicacionMaps;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  const handleCopyCoords = () => {
    if (!ticket.ubicacionMaps) return;
    const { lat, lng } = ticket.ubicacionMaps;
    copyToClipBoard(`${lat}, ${lng}`);
  };

  /* ====== acción principal: proceso / revisión ====== */

  const handleConfirmAction = async () => {
    const fn = isIniciado
      ? () => patchEnRevision.mutateAsync()
      : () => patchEnProceso.mutateAsync();

    const loadingText = isIniciado
      ? "Marcando como pendiente revisión..."
      : "Marcando ticket en proceso...";

    const successText = isIniciado
      ? "Ticket marcado como pendiente de revisión"
      : "Ticket tomado en proceso";

    await toast.promise(fn(), {
      loading: loadingText,
      success: successText,
      error: "Ocurrió un error al actualizar el ticket",
    });

    setOpenActionDialog(false);
  };

  return (
    <>
      <article
        className={`rounded-xl border text-card-foreground px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-2.5 ${getCardEstadoClasses(
          ticket.estado
        )}`}
      >
        {/* fila top: estado + prioridad + fecha */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={`border-0 text-[10px] font-semibold px-2 py-0.5 ${getEstadoBadgeClasses(
                ticket.estado
              )}`}
            >
              {ticket.estado.replace("_", " ")}
            </Badge>

            <Badge
              variant="outline"
              className={`border-0 text-[10px] px-2 py-0.5 ${getPrioridadBadgeClasses(
                ticket.prioridad
              )}`}
            >
              {ticket.prioridad}
            </Badge>
          </div>

          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatFecha(ticket.abiertoEn)}
          </span>
        </div>

        {/* título + descripción */}
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold leading-tight line-clamp-2">
            {ticket.titulo || "Ticket sin título"}
          </h2>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {truncateText(ticket.descripcion ?? "", 120)}
          </p>
        </div>

        {/* GRID de info cliente + contactos + ubicación hint */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          {/* Cliente + dirección */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase text-muted-foreground">
              Cliente
            </span>
            <span className="font-medium text-[12px]">
              {ticket.clienteNombre}
            </span>

            {ticket.direccion && (
              <div className="mt-0.5 flex items-start gap-1 text-[11px] text-muted-foreground">
                <MapPin className="w-3 h-3 mt-[1px]" />
                <span className="line-clamp-2">
                  {ticket.direccion.direccion}
                </span>
              </div>
            )}

            {hasLocation && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border px-2 py-1 text-[10px] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40"
                  >
                    <Navigation className="w-3 h-3" />
                    Opciones de mapa
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ubicación GPS</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleOpenMaps}>
                    <MapPin className="w-3 h-3 mr-2" />
                    Ver en Google Maps
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleStartRouteMaps}>
                    <Navigation className="w-3 h-3 mr-2" />
                    Iniciar ruta en Maps
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyCoords}>
                    <Copy className="w-3 h-3 mr-2" />
                    Copiar coordenadas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Contactos: principal + referencia en grid */}
          <div className="grid grid-cols-1 gap-1.5">
            {/* Teléfono principal */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground">
                  Contacto
                </span>
                <span className="text-[12px] font-medium">
                  {ticket.clienteTel || "Sin teléfono"}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-[10px] hover:bg-accent"
                    disabled={isDisableContact}
                  >
                    Acciones
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Contacto principal</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isDisableContact}
                    onClick={() => handleWhatsapp(ticket.clienteTel)}
                  >
                    <MessageCircle className="w-3 h-3 mr-2" />
                    Abrir en WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDisableContact}
                    onClick={() => handleCallClick(ticket.clienteTel)}
                  >
                    <Phone className="w-3 h-3 mr-2" />
                    Llamar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDisableContact}
                    onClick={() =>
                      copyToClipBoard(ticket?.clienteTel ?? "No disponible")
                    }
                  >
                    Copiar número
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Teléfono referencia */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground">
                  Ref. contacto
                </span>
                <span className="text-[12px] font-medium">
                  {ticket.referenciaContacto || "Sin teléfono"}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-[10px] hover:bg-accent"
                    disabled={isDisableReference}
                  >
                    Acciones
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Referencia</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isDisableReference}
                    onClick={() => handleWhatsapp(ticket.referenciaContacto)}
                  >
                    <MessageCircle className="w-3 h-3 mr-2" />
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDisableReference}
                    onClick={() => handleCallClick(ticket.referenciaContacto)}
                  >
                    <Phone className="w-3 h-3 mr-2" />
                    Llamar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDisableReference}
                    onClick={() =>
                      copyToClipBoard(
                        ticket?.referenciaContacto ?? "No disponible"
                      )
                    }
                  >
                    Copiar número
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* acciones */}
        <div className="mt-1.5 flex flex-col sm:flex-row gap-1.5">
          <Button
            size="sm"
            className="w-full sm:w-auto text-xs"
            variant={isIniciado ? "secondary" : "default"}
            onClick={() => setOpenActionDialog(true)}
            disabled={isMutating}
          >
            {isIniciado ? "Marcar pendiente revisión" : "Tomar en proceso"}
          </Button>

          <Link
            to={`/crm/ticket-detalles/${ticket.id}`}
            className="w-full sm:w-auto"
          >
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              disabled={isMutating}
            >
              Ver detalles
            </Button>
          </Link>
        </div>
      </article>

      {/* Advanced Dialog para confirmar acción */}
      <AdvancedDialogCRM
        type="info"
        open={openActionDialog}
        onOpenChange={setOpenActionDialog}
        title={
          isIniciado
            ? "Marcar ticket como pendiente de revisión"
            : "Tomar en proceso este ticket"
        }
        description={
          isIniciado
            ? `El ticket #${ticket.id} (${
                ticket.titulo || "sin título"
              }) se marcará como PENDIENTE_REVISION.`
            : `Se registrará el inicio de atención para el ticket #${
                ticket.id
              } (${
                ticket.titulo || "sin título"
              }), y pasará a estado EN_PROCESO.`
        }
        confirmButton={{
          label: isIniciado ? "Marcar pendiente revisión" : "Confirmar inicio",
          loadingText: isIniciado ? "Marcando..." : "Iniciando...",
          onClick: handleConfirmAction,
        }}
        cancelButton={{
          label: "Cancelar",
          loadingText: "...",
        }}
      />
    </>
  );
}
