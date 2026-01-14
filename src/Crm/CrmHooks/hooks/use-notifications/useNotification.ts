import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { notificationsSystemQkeys } from "./Qk";
import { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";

export function useGetNotification() {
  return useCrmQuery<{
    botsNotifications: UiNotificacion[];
    notifications: UiNotificacion[];
  }>(notificationsSystemQkeys.all, `notificaciones/system`, undefined, {
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}
