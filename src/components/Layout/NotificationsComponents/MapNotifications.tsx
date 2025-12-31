"use client";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, User, ExternalLink } from "lucide-react";
import { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type"; // Ajusta ruta
import {
  getCategoryMeta,
  getSeverityStyles,
  getActionFor,
} from "./notification-style";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface Props {
  notification: UiNotificacion;
  onDelete?: (id: number) => void | Promise<void>;
}

function MapNotificationCompact({ notification, onDelete }: Props) {
  const sev = useMemo(
    () => getSeverityStyles(notification.severidad),
    [notification.severidad]
  );

  const cat = useMemo(
    () => getCategoryMeta(notification.categoria),
    [notification.categoria]
  );

  const action = useMemo(() => getActionFor(notification), [notification]);
  const recibido = dayjs(notification.recibidoEn).fromNow();

  const mensaje = notification.mensaje.slice(0, 100) + "...";

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
          "relative rounded-xl border shadow-sm ring-1 p-3 md:p-3.5",
          "grid grid-cols-[auto,1fr,auto] gap-3 md:gap-4 items-start",
          sev.cardBg,
          sev.ring,
        ].join(" ")}
        style={{ wordBreak: "break-word" }}
      >
        <span
          className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${sev.accent}`}
          aria-hidden
        />

        <div className={`mt-0.5 rounded-md p-1.5 ${sev.accent} text-white`}>
          <sev.Icon className="h-3 w-3" />
        </div>

        <div className="min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <cat.Icon className="h-4 w-4 opacity-80 shrink-0" />
            <h3
              className={`text-[13px] font-semibold leading-5 ${sev.title} truncate`}
            >
              {notification.titulo ?? "Notificación"}
            </h3>
          </div>

          <p className={`text-[13px] leading-5 ${sev.body}`}>{mensaje}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {notification.remitente && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5 flex items-center gap-1 bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/30 text-current border-0"
              >
                <User className="h-3 w-3" />
                {notification.remitente.nombre}
              </Badge>
            )}

            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0.5 border-0 ${cat.badgeClass}`}
            >
              {cat.label}
            </Badge>

            {action.label && action.to !== "#" && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] px-2 ml-auto hover:bg-white/40 dark:hover:bg-white/10"
              >
                <Link to={action.to}>
                  {action.label}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-medium opacity-70 whitespace-nowrap leading-6 text-black dark:text-white">
            {recibido}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100/50 dark:hover:bg-red-900/30"
            onClick={() => onDelete?.(notification.id)}
            title="Eliminar notificación"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.li>
  );
}

export default memo(MapNotificationCompact);
