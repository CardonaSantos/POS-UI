import logo from "@/assets/LogoCrmPng.png";
import ring from "@/assets/audio/ring.wav";

export type TicketStatusPayload = {
  ticketId: number;
  nuevoEstado: string;
  titulo?: string;
  tecnico?: string;
};

export function showTicketBrowserNotification(data: TicketStatusPayload) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const { ticketId, nuevoEstado, titulo, tecnico } = data;

  const title =
    nuevoEstado === "EN_PROCESO"
      ? `Ticket #${ticketId} en proceso`
      : nuevoEstado === "PENDIENTE_REVISION"
      ? `Ticket #${ticketId} pendiente de revisión`
      : `Ticket #${ticketId} actualizado`;

  const accion =
    nuevoEstado === "EN_PROCESO"
      ? "iniciado"
      : nuevoEstado === "PENDIENTE_REVISION"
      ? "finalizado"
      : "actualizado";

  let body = "";

  if (tecnico && titulo) {
    body = `${tecnico} ha ${accion} el ticket: ${titulo}`;
  } else if (tecnico) {
    body = `${tecnico} ha ${accion} el ticket #${ticketId}`;
  } else if (titulo) {
    body = `El ticket "${titulo}" ha sido ${accion}`;
  } else {
    body = `El ticket #${ticketId} ha sido ${accion}`;
  }

  const notif = new Notification(title, {
    body,
    icon: logo,
  });

  notif.onclick = () => {
    window.focus();
    window.open(`/crm/ticket-detalles/${ticketId}`, "_self");
  };

  try {
    const audio = new Audio(ring);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}
