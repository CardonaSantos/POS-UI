// src/Crm/WEB/browserNotifications.ts
export type TicketStatusPayload = {
  ticketId: number;
  nuevoEstado: string;
  titulo?: string;
};

export function showTicketBrowserNotification(data: TicketStatusPayload) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const { ticketId, nuevoEstado, titulo } = data;

  const title =
    nuevoEstado === "EN_PROCESO"
      ? `Ticket #${ticketId} en proceso`
      : nuevoEstado === "PENDIENTE_REVISION"
      ? `Ticket #${ticketId} pendiente de revisión`
      : `Ticket #${ticketId} actualizado`;

  const body = titulo || "";

  const notif = new Notification(title, {
    body,
    icon: "/icons/ticket-notification.png", // pon aquí tu icono en /public
    tag: `ticket-${ticketId}`, // evita spam de muchas notis duplicadas
  });

  // Cuando el user hace click en la notificación
  notif.onclick = () => {
    window.focus();
    // abre / lleva al detalle del ticket (ajusta la ruta a tu gusto)
    window.open(`/crm/tecnico/ticket/${ticketId}`, "_self");
  };

  // === Sonidito tipo WhatsApp ===
  try {
    const audio = new Audio("/sounds/ticket.mp3"); // pon un mp3 en /public/sounds
    audio.play().catch(() => {
      // algunos navegadores bloquean autoplay; ignoramos el error
    });
  } catch {
    // ignore
  }
}
