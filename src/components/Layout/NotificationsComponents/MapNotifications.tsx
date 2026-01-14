"use client";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, User, ExternalLink } from "lucide-react";
import type { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";
import {
  getCategoryMeta,
  getSeverityStyles,
  getActionFor,
} from "./notification-style";
import { Link } from "react-router-dom";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface Props {
  notification: UiNotificacion;
  selectNoti: (noti: UiNotificacion) => void;

  onDelete?: (id: number) => void | Promise<void>;
}

function MapNotificationCompact({ notification, onDelete, selectNoti }: Props) {
  const sev = useMemo(
    () => getSeverityStyles(notification.severidad),
    [notification.severidad]
  );

  const cat = useMemo(
    () => getCategoryMeta(notification.categoria),
    [notification.categoria]
  );

  const action = useMemo(() => getActionFor(notification), [notification]);
  const recibido = formattFechaWithMinutes(notification.recibidoEn);

  const mensaje = notification.mensaje.slice(0, 80) + "...";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div
        className={[
          "relative rounded-xl border-l-4 bg-white hover:cursor-pointer dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow p-3",
          "flex items-start gap-3",
          sev.accent.replace("bg-", "border-l-"),
        ].join(" ")}
        style={{ wordBreak: "break-word" }}
        onClick={() => selectNoti(notification)}
      >
        <div
          className={`rounded-full p-2 ${sev.accent
            .replace("bg-", "bg-")
            .replace("500", "100")
            .replace("600", "100")} ${sev.accent.replace(
            "bg-",
            "text-"
          )} shrink-0`}
        >
          <sev.Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {notification.titulo ?? "Notificación"}
              </h3>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5 h-auto shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-0 font-medium"
              >
                <cat.Icon className="h-2.5 w-2.5 mr-1" />
                {cat.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {recibido}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 -mr-1"
                onClick={() => onDelete?.(notification.id)}
                title="Eliminar notificación"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {mensaje}
          </p>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2">
              {notification.remitente && (
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <User className="h-3 w-3" />
                  <span className="font-medium">
                    {notification.remitente.nombre}
                  </span>
                </div>
              )}
            </div>

            {action.label && action.to !== "#" && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={`h-6 text-[11px] px-2 font-medium ${sev.accent.replace(
                  "bg-",
                  "text-"
                )} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
              >
                <Link to={action.to} className="flex items-center gap-1">
                  {action.label}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export default memo(MapNotificationCompact);
