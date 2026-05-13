import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { Bell, LayoutDashboard, LogOut, Monitor, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Hooks & Stores

// Assets & Tipos
import logo from "@/assets/LogoCrmPng.png"; // Ajusta tu import
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useInvalidateQk } from "@/Crm/CrmHooks/hooks/useInvalidateQk/useInvalidateQk";
import { useGetNotification } from "@/Crm/CrmHooks/hooks/use-notifications/useNotification";
import { useSocketEvent } from "@/Crm/WEB/SocketProvider";
import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { AppSidebar } from "./app-sidebar";
import { ModeToggle } from "../mode-toggle";
import NotificationsSheet from "./NotificationsComponents/NotificationsSheet";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import NotificationDetailModal from "./NotificationsComponents/NotificationDetailModal";
import { Robot } from "@/Crm/Icons/Robot";
import {
  useGetMyUserProfile,
  UserExtendedProfile,
} from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";

interface LayoutProps {
  children?: React.ReactNode;
}

function useRequestNotificationPermission() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
}

export default function LayoutCrm({ children }: LayoutProps) {
  const location = useLocation();
  const isCrmLocation = location.pathname.startsWith("/crm");
  const erpLink = import.meta.env.VITE_ERP_LINK;
  const crmLink = import.meta.env.VITE_CRM_LINK;

  useRequestNotificationPermission();
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  // -----------------------------
  // 1. CRM STORE
  // -----------------------------
  const setNombre = useStoreCrm((state) => state.setNombre);
  const setCorreo = useStoreCrm((state) => state.setCorreo);
  const setActivo = useStoreCrm((state) => state.setActivo);
  const setRol = useStoreCrm((state) => state.setRol);
  const setUserId = useStoreCrm((state) => state.setUserIdCrm);
  const setEmpresaId = useStoreCrm((state) => state.setEmpresaId);

  // Estados de lectura
  const nombre = useStoreCrm((state) => state.nombre);
  const correo = useStoreCrm((state) => state.correo);
  const empresaId = useStoreCrm((state) => state.empresaId);

  // Opcional: Si tienes avatar en Zustand, extráelo aquí
  // const avatarUrl = useStoreCrm((state) => state.avatarUrl);

  const invalidateQk = useInvalidateQk();

  // -----------------------------
  // 2. NOTIFICACIONES
  // -----------------------------
  const [openDeleteAllNoti, setOpenDeleteAllNoti] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [openNotiDetails, setOpenNotiDetails] = useState<boolean>(false);
  const [notiSelected, setNotiSelected] = useState<any | null>(null);

  const { data: notifications } = useGetNotification();
  const secureNotifications = notifications?.notifications || [];
  const secureNotificationsBot = notifications?.botsNotifications || [];

  const isLoadingNotis = false;

  const deleteNoti = async (_id: number) => {
    toast.info("El módulo de notificaciones aún no está listo en el servidor.");
  };

  const deleteAllNotis = async () => {
    setIsDeletingAll(true);
    try {
      toast.info(
        "El módulo de notificaciones aún no está listo en el servidor.",
      );
    } finally {
      setIsDeletingAll(false);
      setOpenDeleteAllNoti(false);
    }
  };

  useSocketEvent(
    "notifications:system",
    () => {
      // invalidateQk("notificationsSystemQkeys.all"), // Ajusta tu query key
    },
    [invalidateQk],
  );

  const selectNoti = (noti: any) => {
    setNotiSelected(noti);
    setOpenNotiDetails(true);
  };

  // -----------------------------
  // 3. DECODE TOKENS CRM
  // -----------------------------
  useEffect(() => {
    const storedTokenCRM = localStorage.getItem("tokenAuthCRM");
    if (!storedTokenCRM) return;

    try {
      const decodedCrm = jwtDecode<any>(storedTokenCRM); // Ajusta tipo a UserCrmToken
      setNombre(decodedCrm.nombre);
      setCorreo(decodedCrm.correo);
      setActivo(decodedCrm.activo);
      setRol(decodedCrm.rol);
      setUserId(decodedCrm.id);
      setEmpresaId(decodedCrm.empresaId);
    } catch (error) {
      console.error("Error decodificando tokenAuthCRM:", error);
    }
  }, [setNombre, setCorreo, setActivo, setRol, setUserId, setEmpresaId]);

  // -----------------------------
  // 4. QUERIES (INFO EMPRESA)
  // -----------------------------
  const { data: empresaInfo } = useCrmQuery<any>( // Ajusta a tipo Sucursal/Empresa
    ["empresa-info", empresaId],
    `empresa/${empresaId}/details`,
    undefined,
    {
      enabled: !!empresaId, // Se ejecuta solo cuando el ID está listo
    },
  );

  // Si esperas un objeto:
  const { data: userData = {} as UserExtendedProfile } =
    useGetMyUserProfile(userId);

  // Si en otro caso esperaras un array (para poder hacer .map):
  // const { data: users = [] } = useGetProfiles();
  // -----------------------------
  // 5. HELPERS
  // -----------------------------
  function getInitials(name?: string | null) {
    if (!name) return "??";
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "??";
    const a = words[0]?.[0] ?? "";
    const b = words[1]?.[0] ?? words[0]?.[1] ?? "";
    return (a + b).toUpperCase() || "??";
  }

  const handleLogout = () => {
    localStorage.removeItem("tokenAuthCRM");
    toast.info("Sesión cerrada correctamente");
    window.location.reload();
  };

  // -----------------------------
  // 6. RENDER DE INTERFAZ
  // -----------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          {/* HEADER */}
          <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shrink-0">
            <div className="mx-auto flex px-2 py-1 items-center justify-between">
              {/* LADO IZQUIERDO: Logo + Nombre Empresa */}
              <div className="flex items-center gap-2">
                <SidebarTrigger className="h-7 w-7 -ml-0.5 text-muted-foreground" />
                <Link to="/crm">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-7 w-7 object-contain"
                  />
                </Link>
                <p className="text-xs font-medium text-foreground truncate max-w-[140px] sm:max-w-xs">
                  {empresaInfo?.nombre || "Cargando..."}
                </p>
              </div>

              {/* LADO DERECHO: Tema + Notificaciones + Menú de Usuario */}
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="hidden sm:inline-flex items-center gap-1.5 h-7 px-2 text-xs transition-colors"
                >
                  <a href={isCrmLocation ? erpLink : crmLink}>
                    {isCrmLocation ? (
                      <>
                        <Monitor className="h-3.5 w-3.5" />
                        <span>ERP</span>
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>CRM</span>
                      </>
                    )}
                  </a>
                </Button>

                <ModeToggle />

                {/* Notificaciones Bot */}
                <NotificationsSheet
                  selectNoti={selectNoti}
                  tooltipText="Notificaciones Bot"
                  icon={<Robot size={16} />}
                  notifications={secureNotificationsBot}
                  isLoading={isLoadingNotis}
                  onDelete={deleteNoti}
                  countBadge={secureNotificationsBot.length}
                  deleteAllNotis={deleteAllNotis}
                  openDeleteAllNoti={openDeleteAllNoti}
                  setOpenDeleteAllNoti={setOpenDeleteAllNoti}
                />

                {/* Notificaciones Sistema */}
                <NotificationsSheet
                  tooltipText="Notificaciones Sistema"
                  icon={<Bell size={16} />}
                  notifications={secureNotifications}
                  isLoading={isLoadingNotis}
                  onDelete={deleteNoti}
                  countBadge={secureNotifications.length}
                  deleteAllNotis={deleteAllNotis}
                  openDeleteAllNoti={openDeleteAllNoti}
                  setOpenDeleteAllNoti={setOpenDeleteAllNoti}
                  selectNoti={selectNoti}
                />

                {/* Menú de Perfil (Dropdown) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-7 w-7 ml-0.5 ring-2 ring-transparent transition-all hover:ring-border focus-visible:ring-border"
                      aria-label="Menú de usuario"
                    >
                      <Avatar className="h-7 w-7 border border-border">
                        <AvatarImage
                          src={userData?.perfil?.avatar?.url}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-emerald-600 text-white font-semibold uppercase text-[10px]">
                          {getInitials(userData?.nombre || nombre)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  {/* Aumentamos un poco el ancho a w-60 para que el correo no se corte fácilmente */}
                  <DropdownMenuContent align="end" className="w-60">
                    {/* SECCIÓN 1: Info del Usuario (Label no es clickeable) */}
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-semibold leading-none text-foreground truncate">
                          {userData?.nombre || nombre || "Usuario"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {userData?.correo || correo || "correo@ejemplo.com"}
                        </p>
                        {/* Mostramos el Rol como un pequeño Badge de texto */}
                        {(userData?.rol || userData.rol) && (
                          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mt-1">
                            {(userData?.rol || userData.rol).replace("_", " ")}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* SECCIÓN 2: Acciones (Ir al perfil) */}
                    <DropdownMenuGroup>
                      {/* Ajusta la ruta "/crm/perfil" a la ruta real de tu componente CrmProfileConfig */}
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          to="/crm/perfil"
                          className="flex items-center w-full"
                        >
                          <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Configuración de Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* SECCIÓN 3: Peligro (Cerrar Sesión) */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* MAIN (Contenido inyectado por el Router) */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full h-full">
              {children || <Outlet />}
            </div>
          </main>

          {/* FOOTER */}
        </div>
      </SidebarProvider>

      {/* DIALOGOS Y MODALES GLOBALES */}
      <AdvancedDialogCRM
        open={openDeleteAllNoti}
        onOpenChange={setOpenDeleteAllNoti}
        title="Eliminar todas las notificaciones"
        description="¿Seguro que deseas eliminar todas tus notificaciones? Esta acción no se puede deshacer."
        confirmButton={{
          label: "Sí, eliminar todo",
          onClick: deleteAllNotis,
          loading: isDeletingAll,
          loadingText: "Eliminando...",
          variant: "destructive",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: isDeletingAll,
          onClick: () => setOpenDeleteAllNoti(false),
        }}
      />

      <NotificationDetailModal
        notification={notiSelected}
        open={openNotiDetails}
        onOpenChange={setOpenNotiDetails}
      />
    </div>
  );
}
