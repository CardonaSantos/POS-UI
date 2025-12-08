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
  Map,
  Text,
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
  direccion: {
    direccion: "",
    municipio: "",
    sector: "",
  },
  observaciones: "",
  ubicacionMaps: null,
  medias: [],
};

// --- COMPONENTES AUXILIARES ---

// 1. Componente para mostrar un dato (Label + Valor)
const InfoItem = ({
  icon: Icon,
  label,
  children,
  className = "",
}: {
  icon?: any;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span className="text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </span>
    </div>
    <div className="text-sm font-medium text-foreground">{children || "—"}</div>
  </div>
);

// 2. Menú de teléfono
interface PhoneMenuProps {
  label: string;
  phone: string | null;
}

const PhoneDropdown: React.FC<PhoneMenuProps> = ({ label, phone }) => {
  if (!phone)
    return (
      <span className="text-sm text-muted-foreground italic">
        No registrado
      </span>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 font-mono text-xs"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          {phone}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.open(handleOpenWhatsapp(phone), "_blank")}
        >
          <MessageCircle className="w-3.5 h-3.5 mr-2 text-emerald-600" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (window.location.href = handleCall(phone))}
        >
          <Phone className="w-3.5 h-3.5 mr-2" />
          Llamar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipBoard(phone)}>
          <Copy className="w-3.5 h-3.5 mr-2" />
          Copiar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- COMPONENTE PRINCIPAL ---

function TicketAsignadoDetails() {
  const { id } = useParams();
  const ticketId = id ? parseInt(id) : 0;
  const { data: t } = useGetTicketDetails(ticketId);
  const ticket = t || INITIAL_TICKET_ASIGNADO;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  // Helpers de ubicación
  const hasLocation = !!ticket.ubicacionMaps;
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
    copyToClipBoard(`${ticket.ubicacionMaps.lat}, ${ticket.ubicacionMaps.lng}`);
  };

  // Lógica de estado
  const patchEnProceso = usePatchTicketEnProceso(ticketId);
  const patchEnRevision = usePatchTicketEnRevision(ticketId);
  const isIniciado = ticket.estado === "EN_PROCESO";

  const handleConfirmAction = async () => {
    const fn = isIniciado
      ? () => patchEnRevision.mutateAsync()
      : () => patchEnProceso.mutateAsync();
    const loadingText = isIniciado ? "Finalizando..." : "Iniciando...";
    const successText = isIniciado
      ? "Ticket enviado a revisión"
      : "Ticket en proceso";

    await toast.promise(fn(), {
      loading: loadingText,
      success: successText,
      error: "Error al actualizar estado",
    });
    setIsActionDialogOpen(false);
  };

  return (
    <PageTransitionCrm
      titleHeader={`Ticket #${ticket.id}`}
      subtitle="Gestión de soporte en campo"
      variant="fade-pure"
    >
      <div className="pb-28 max-w-5xl mx-auto px-1 sm:px-0">
        {/* --- HEADER --- */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getEstadoBadgeClasses(ticket.estado)}>
              {ticket.estado.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={getPrioridadBadgeClasses(ticket.prioridad)}
            >
              {ticket.prioridad}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {formatFechaCompleta(ticket.abiertoEn)}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {ticket.titulo || "Sin título"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --- COLUMNA 1: Contexto y Cliente --- */}
          <div className="space-y-6">
            {/* CARD: Descripción */}
            <section className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <Text className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Descripcion</h3>
              </div>

              <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                {ticket.descripcion || "Sin descripción detallada."}
              </div>
            </section>

            {/* CARD: Cliente */}
            <section className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">
                  Información del Cliente
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <InfoItem label="Cliente" icon={null}>
                  <span className="text-base font-semibold">
                    {ticket.clienteNombre}
                  </span>
                </InfoItem>

                <div className="grid grid-cols-2 gap-1 ">
                  <div className="space-y-1 space-x-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Contacto Principal
                    </span>
                    <PhoneDropdown
                      label="Llamar a principal"
                      phone={ticket.clienteTel}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Referencia
                    </span>
                    <PhoneDropdown
                      label="Llamar a referencia"
                      phone={ticket.referenciaContacto}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --- COLUMNA 2: Ubicación y Media --- */}
          <div className="space-y-6">
            {/* CARD: Dirección y Mapa */}
            <section className="bg-card rounded-xl border shadow-sm p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">
                    Ubicación y Dirección
                  </h3>
                </div>
                {hasLocation && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 text-[10px]"
                  >
                    GPS ACTIVO
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Municipio" icon={null} className="col-span-1">
                  {ticket.direccion.municipio}
                </InfoItem>
                <InfoItem
                  label="Sector / Zona"
                  icon={null}
                  className="col-span-1"
                >
                  {ticket.direccion.sector}
                </InfoItem>
                <InfoItem
                  label="Dirección exacta"
                  icon={null}
                  className="col-span-2"
                >
                  <div className="bg-muted/50 p-2 rounded-md text-sm">
                    {ticket.direccion.direccion}
                  </div>
                </InfoItem>
              </div>

              {ticket.observaciones && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-3">
                  <InfoItem label="Observaciones Adicionales" icon={null}>
                    {ticket.observaciones}
                  </InfoItem>
                </div>
              )}

              {hasLocation ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenMaps}
                    className="w-full"
                  >
                    <Map className="w-3.5 h-3.5 mr-2" />
                    Ver Mapa
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="w-full">
                        <Navigation className="w-3.5 h-3.5 mr-2" />
                        Ir ahora
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleStartRouteMaps}>
                        Iniciar Ruta (GPS)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCopyCoords}>
                        Copiar Coordenadas
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-md text-xs mt-2 border border-orange-100 dark:border-orange-900">
                  <Clock className="w-4 h-4" />
                  No hay coordenadas GPS registradas para este ticket.
                </div>
              )}
            </section>

            {/* CARD: Multimedia */}
            {ticket.medias && ticket.medias.length > 0 && (
              <section className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">
                    Evidencia Multimedia ({ticket.medias.length})
                  </h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ticket.medias.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => setSelectedImage(media.cdnUrl)}
                      className="aspect-square relative group cursor-pointer rounded-md overflow-hidden border bg-muted"
                    >
                      <img
                        src={media.cdnUrl}
                        alt="Evidencia"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* --- BOTTOM ACTION BAR (Móvil Fixed / Desktop Static) --- */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-20 md:static md:bg-transparent md:border-0 md:p-0 md:mt-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className={`w-full shadow-lg ${
                isIniciado
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-primary hover:bg-primary/90"
              }`}
              onClick={() => setIsActionDialogOpen(true)}
              disabled={patchEnProceso.isPending || patchEnRevision.isPending}
            >
              {isIniciado ? (
                <>
                  <Clock className="mr-2 h-5 w-5" /> Marcar como Pendiente
                  Revisión
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-5 w-5" /> Tomar Ticket en
                  Proceso
                </>
              )}
            </Button>
          </div>
        </div>

        {/* --- DIALOGOS --- */}
        <AdvancedDialogCRM
          type="info"
          open={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
          title={
            isIniciado ? "¿Terminar labor en sitio?" : "¿Iniciar atención?"
          }
          description={
            isIniciado
              ? "El ticket pasará a estado PENDIENTE_REVISION. Asegúrate de haber cargado toda la evidencia."
              : "Se registrará el inicio de tu labor y el tiempo comenzará a correr."
          }
          confirmButton={{
            label: isIniciado ? "Finalizar Labor" : "Comenzar",
            loadingText: "Procesando...",
            onClick: handleConfirmAction,
          }}
          cancelButton={{ label: "Cancelar", loadingText: "..." }}
        />

        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none flex justify-center items-center">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Full preview"
                  className="max-h-[85vh] w-auto object-contain rounded-md shadow-2xl"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -top-3 -right-3 rounded-full shadow-md"
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
