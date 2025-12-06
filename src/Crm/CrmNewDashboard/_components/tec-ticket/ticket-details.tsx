import React, { useState } from "react";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import {
  MapPin,
  Phone,
  Calendar,
  User,
  Navigation,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  MessageCircle,
  Copy,
} from "lucide-react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { handleCall, handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";
import { copyToClipBoard } from "@/utils/clipBoard";
import { useParams } from "react-router-dom";
import {
  useGetTicketDetails,
  usePatchTicketEnProceso,
  usePatchTicketEnRevision,
} from "@/Crm/CrmHooks/hooks/dashboard/useDashboard";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { toast } from "sonner";

// --- HELPERS DE ESTILOS ---

function getEstadoBadgeClasses(estado: string): string {
  switch (estado) {
    case "EN_PROCESO":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200";
    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
    case "PENDIENTE_TECNICO":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200 border-sky-200";
    case "NUEVO":
    case "ABIERTA":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200 border-slate-200";
  }
}

function getPrioridadBadgeClasses(prioridad: string): string {
  switch (prioridad) {
    case "ALTA":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200 border-rose-200";
    case "BAJA":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200 border-slate-200";
    case "MEDIA":
    default:
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 border-amber-200";
  }
}

function formatFechaCompleta(fechaIso: string | null | undefined): string {
  if (!fechaIso) return "Sin fecha";
  try {
    const d = new Date(fechaIso);
    return d.toLocaleString("es-GT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Sin fecha";
  }
}

const INITIAL_TICKET_ASIGNADO: TicketAsignadoTecnico = {
  id: 0,
  titulo: "",
  abiertoEn: "",
  estado: "NUEVO",
  prioridad: "MEDIA",
  descripcion: "",
  clientId: 0,
  clienteNombre: "",
  clienteTel: "",
  referenciaContacto: "",
  direccion: "",
  ubicacionMaps: null,
  medias: [],
};

// --- COMPONENTE AUXILIAR: menú de teléfono ---

interface PhoneMenuProps {
  label: string;
  phone: string;
}

const PhoneDropdown: React.FC<PhoneMenuProps> = ({ label, phone }) => {
  if (!phone) {
    return <p className="text-sm text-muted-foreground">N/A</p>;
  }

  const openWhatsApp = () => {
    window.open(handleOpenWhatsapp(phone), "_blank");
  };

  const openCall = () => {
    window.location.href = handleCall(phone);
  };

  const copyPhone = () => {
    copyToClipBoard(phone);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 text-sm font-mono px-2 py-1 rounded-md border bg-background hover:bg-muted transition-colors">
          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{phone}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={openWhatsApp}>
          <MessageCircle className="w-3.5 h-3.5 mr-2 text-emerald-600" />
          Abrir en WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openCall}>
          <Phone className="w-3.5 h-3.5 mr-2" />
          Llamar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyPhone}>
          <Copy className="w-3.5 h-3.5 mr-2" />
          Copiar número
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function TicketAsignadoDetails() {
  const { id } = useParams();
  const ticketId = id ? parseInt(id) : 0;
  const { data: t } = useGetTicketDetails(ticketId);
  const ticket = t ? t : INITIAL_TICKET_ASIGNADO;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const contactPhone = ticket.clienteTel ?? "";
  const refPhone = ticket.referenciaContacto ?? "";
  const hasLocation = !!ticket.ubicacionMaps;

  const handleOpenMaps = () => {
    if (!ticket.ubicacionMaps) return;
    const { lat, lng } = ticket.ubicacionMaps;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleStartRouteMaps = () => {
    if (!ticket.ubicacionMaps) return;
    const { lat, lng } = ticket.ubicacionMaps;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleCopyCoords = () => {
    if (!ticket.ubicacionMaps) return;
    const { lat, lng } = ticket.ubicacionMaps;
    copyToClipBoard(`${lat}, ${lng}`);
  };
  // Hooks de patch
  const patchEnProceso = usePatchTicketEnProceso(ticketId);
  const patchEnRevision = usePatchTicketEnRevision(ticketId);

  // ¿Está ya iniciado?
  const isIniciado = ticket.estado === "EN_PROCESO";

  // Acción que se disparará al confirmar en el dialog
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

    setIsActionDialogOpen(false);
  };

  return (
    <PageTransitionCrm
      titleHeader={`Ticket #${ticket.id}`}
      subtitle="Detalles completos del soporte"
      variant="fade-pure"
    >
      <div className="pb-24 max-w-3xl mx-auto">
        {/* HEADER: Estado, Prioridad, Título, Fecha */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-0.5 border ${getEstadoBadgeClasses(
                ticket.estado
              )}`}
            >
              {ticket.estado.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-0.5 border ${getPrioridadBadgeClasses(
                ticket.prioridad
              )}`}
            >
              Prioridad {ticket.prioridad}
            </Badge>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight text-foreground">
              {ticket.titulo || "Ticket sin título"}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatFechaCompleta(ticket.abiertoEn)}</span>
            </div>
          </div>
        </div>

        {/* 1. DESCRIPCIÓN */}
        <section className="bg-card rounded-xl border p-4">
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {ticket.descripcion ||
              "No se proporcionó una descripción detallada para este ticket."}
          </div>
        </section>

        {/* 2. CLIENTE Y CONTACTOS */}
        <section className="mt-4 bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Información del Cliente
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Nombre
              </span>
              <p className="text-sm font-medium">{ticket.clienteNombre}</p>
            </div>

            {/* Teléfono principal (menú de acciones) */}
            <div className="space-y-1 space-x-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Teléfono Principal
              </span>
              <PhoneDropdown label="Contacto principal" phone={contactPhone} />
            </div>

            {/* Teléfono referencia (menú de acciones) */}
            <div className="space-y-1 sm:col-span-2 space-x-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Teléfono de referencia
              </span>
              <PhoneDropdown label="Contacto de referencia" phone={refPhone} />
            </div>
          </div>
        </section>

        {/* 3. UBICACIÓN */}
        <section className="mt-4 bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Ubicación
            </h3>
            {hasLocation && (
              <Badge
                variant="secondary"
                className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                GPS disponible
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-muted/40 rounded-md">
              <p className="text-sm italic text-foreground/90 leading-snug">
                {ticket.direccion || "Dirección no especificada"}
              </p>
            </div>

            {hasLocation ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-9"
                  onClick={handleOpenMaps}
                >
                  <MapPin className="w-3.5 h-3.5 mr-2" />
                  Ver en mapa
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full text-xs h-9"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-2" />
                      Opciones de ruta
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Acciones de ubicación</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleStartRouteMaps}>
                      <Navigation className="w-3.5 h-3.5 mr-2" />
                      Iniciar ruta en Maps
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyCoords}>
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copiar coordenadas
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                <Clock className="w-3.5 h-3.5" />
                <span>Sin coordenadas GPS registradas.</span>
              </div>
            )}
          </div>
        </section>

        {/* 4. MULTIMEDIA */}
        {ticket.medias && ticket.medias.length > 0 && (
          <section className="mt-4 bg-card rounded-xl border p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Multimedia
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ticket.medias.map((media) => (
                <div
                  key={media.id}
                  className="relative aspect-square rounded-md overflow-hidden border bg-muted group cursor-pointer"
                  onClick={() => setSelectedImage(media.cdnUrl)}
                >
                  <img
                    src={media.cdnUrl}
                    alt="Evidencia"
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BARRA DE ACCIÓN INFERIOR */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-10 sm:static sm:bg-transparent sm:border-0 sm:p-0 sm:mt-6">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Button
              className="flex-[2] sm:w-auto"
              onClick={() => setIsActionDialogOpen(true)}
              disabled={patchEnProceso.isPending || patchEnRevision.isPending}
            >
              {isIniciado ? "Marcar pendiente revisión" : "Tomar en proceso"}
            </Button>
          </div>
        </div>

        <AdvancedDialogCRM
          type="info"
          open={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
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
            label: isIniciado
              ? "Marcar pendiente revisión"
              : "Confirmar inicio",
            loadingText: isIniciado ? "Marcando..." : "Iniciando...",
            onClick: handleConfirmAction, // 👈 aquí se conecta la mutación
          }}
          cancelButton={{
            label: "Cancelar",
            loadingText: "...",
          }}
        />

        {/* DIALOG IMAGEN GRANDE */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
        >
          <DialogContent className="max-w-3xl p-1 bg-transparent border-0">
            {selectedImage && (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Vista previa"
                  className="w-full h-auto max-h-[80vh] object-contain bg-black/50 rounded-lg"
                />
                <Button
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 p-0"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransitionCrm>
  );
}

export default TicketAsignadoDetails;
