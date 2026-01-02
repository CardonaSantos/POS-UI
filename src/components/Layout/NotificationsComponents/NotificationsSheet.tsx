"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from "lucide-react";
import NotificationList from "./NotificationList";
import { UiNotificacion } from "@/Crm/WEB/notifications/notifications.type";
import React from "react";
import { ReusableTabs } from "@/Crm/Utils/Components/tabs/reusable-tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  icon?: React.ReactNode;
  tooltipText?: string;

  notifications: UiNotificacion[];
  isLoading?: boolean;
  onDelete?: (id: number) => void | Promise<void>;
  countBadge?: number;
  deleteAllNotis: () => Promise<void>;
  setOpenDeleteAllNoti: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteAllNoti: boolean;
}

export default function NotificationsSheet({
  notifications,
  isLoading,
  onDelete,
  countBadge,
  setOpenDeleteAllNoti,
  icon,
  tooltipText,
}: Props) {
  const hasNotis = (countBadge ?? 0) > 0;

  ReusableTabs;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <Button variant="outline" size="icon">
            <Tooltip delayDuration={1100}>
              <TooltipTrigger>
                {icon ? icon : <Bell className="h-6 w-6" />}
              </TooltipTrigger>
              <TooltipContent>{tooltipText ?? ""}</TooltipContent>
            </Tooltip>
          </Button>
          {(countBadge ?? 0) > 0 && (
            <span
              className="absolute -top-1 -right-1 inline-flex items-center justify-center
              h-5 min-w-5 px-1 rounded-full text-[10px] font-bold text-white bg-rose-500"
            >
              {countBadge}
            </span>
          )}
        </div>
      </SheetTrigger>

      {/* derecha y más ancho en desktop */}
      <SheetContent
        side="right"
        className="w-[92vw] sm:w-[480px] md:w-[560px] lg:w-[640px] p-0"
      >
        <div className="flex h-full flex-col">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="text-2xl font-bold">
                Notificaciones
              </SheetTitle>

              {/* Acción alineada a la derecha, discreta */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setOpenDeleteAllNoti(true)}
                disabled={!hasNotis}
                className="gap-2"
                aria-disabled={!hasNotis}
                title={
                  hasNotis
                    ? "Eliminar todas las notificaciones"
                    : "No hay notificaciones"
                }
              >
                <Trash2 className="h-4 w-4" />
                Eliminar todo
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              onDelete={onDelete}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
