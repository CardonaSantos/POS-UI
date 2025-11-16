import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useState, useEffect } from "react";
import { User, LogOut, AtSign } from "lucide-react";

import { Link, Outlet, useLocation } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import logo from "@/assets/LOGOPNG.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { UserToken } from "@/Types/UserToken/UserToken";
import { jwtDecode } from "jwt-decode";
import { useStore } from "../Context/ContextSucursal";
import { Sucursal } from "@/Types/Sucursal/Sucursal_Info";
import { toast } from "sonner";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { UserCrmToken } from "@/Crm/CrmAuth/UserCRMToken";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import NotificationsSheet from "./NotificationsComponents/NotificationsSheet";
import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { UiNotificacionDTO } from "@/Crm/WEB/realtime/notifications/notifications";
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout2({ children }: LayoutProps) {
  const location = useLocation();
  const isCrmLocation = location.pathname.startsWith("/crm");

  // -----------------------------
  // POS STORE
  // -----------------------------
  const setUserNombre = useStore((state) => state.setUserNombre);
  const setUserCorreo = useStore((state) => state.setUserCorreo);
  const setUserId = useStore((state) => state.setUserId);
  const setActivo = useStore((state) => state.setActivo);
  const setRol = useStore((state) => state.setRol);
  const setSucursalId = useStore((state) => state.setSucursalId);

  const posNombre = useStore((state) => state.userNombre);
  const posCorreo = useStore((state) => state.userCorreo);
  const sucursalId = useStore((state) => state.sucursalId);

  // -----------------------------
  // CRM STORE
  // -----------------------------
  const setNombreCrm = useStoreCrm((state) => state.setNombre);
  const setCorreoCrm = useStoreCrm((state) => state.setCorreo);
  const setActivoCrm = useStoreCrm((state) => state.setActivo);
  const setRolCrm = useStoreCrm((state) => state.setRol);
  const setUserIdCrm = useStoreCrm((state) => state.setUserIdCrm);
  const setEmpresaIdCrm = useStoreCrm((state) => state.setEmpresaId);

  const nombreCrm = useStoreCrm((state) => state.nombre);
  const correoCrm = useStoreCrm((state) => state.correo);

  // -----------------------------
  // USER DISPLAY SEGÚN RUTA
  // -----------------------------
  const displayName = isCrmLocation ? nombreCrm : posNombre;
  const displayEmail = isCrmLocation ? correoCrm : posCorreo;

  // -----------------------------
  // NOTIFICACIONES (solo UI, sin server)
  // -----------------------------
  const [openDeleteAllNoti, setOpenDeleteAllNoti] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Por ahora no pegamos al servidor: lista vacía
  const notifications: UiNotificacionDTO[] = [];
  const isLoadingNotis = false;
  const secureNotifications = notifications;

  const deleteNoti = async (_id: number) => {
    toast.info("El módulo de notificaciones aún no está listo en el servidor.");
  };

  const deleteAllNotis = async () => {
    setIsDeletingAll(true);
    try {
      toast.info(
        "El módulo de notificaciones aún no está listo en el servidor."
      );
    } finally {
      setIsDeletingAll(false);
      setOpenDeleteAllNoti(false);
    }
  };

  // -----------------------------
  // DECODE TOKENS POS
  // -----------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("authTokenPos");
    if (!storedToken) return;
    try {
      const decoded = jwtDecode<UserToken>(storedToken);
      setUserNombre(decoded.nombre);
      setUserCorreo(decoded.correo);
      setActivo(decoded.activo);
      setRol(decoded.rol);
      setUserId(decoded.sub);
      setSucursalId(decoded.sucursalId);
    } catch (error) {
      console.error("Error decoding authTokenPos:", error);
    }
  }, [
    setUserNombre,
    setUserCorreo,
    setActivo,
    setRol,
    setUserId,
    setSucursalId,
  ]);

  // -----------------------------
  // DECODE TOKENS CRM
  // -----------------------------
  useEffect(() => {
    const storedTokenCRM = localStorage.getItem("tokenAuthCRM");
    if (!storedTokenCRM) return;

    try {
      const decodedCrm = jwtDecode<UserCrmToken>(storedTokenCRM);
      setNombreCrm(decodedCrm.nombre);
      setCorreoCrm(decodedCrm.correo);
      setActivoCrm(decodedCrm.activo);
      setRolCrm(decodedCrm.rol);
      setUserIdCrm(decodedCrm.id);
      setEmpresaIdCrm(decodedCrm.empresaId);
    } catch (error) {
      console.error("Error decodificando tokenAuthCRM:", error);
    }
  }, [
    setNombreCrm,
    setCorreoCrm,
    setActivoCrm,
    setRolCrm,
    setUserIdCrm,
    setEmpresaIdCrm,
  ]);

  // -----------------------------
  // INFO SUCURSAL (CRM API)
  // -----------------------------
  const { data: sucursalInfo } = useCrmQuery<Sucursal>(
    ["sucursal-info", sucursalId],
    `sucursales/get-info-sucursal/${sucursalId}`,
    undefined,
    { enabled: !!sucursalId }
  );

  // -----------------------------
  // HELPERS
  // -----------------------------
  function getInitials(name?: string | null) {
    if (!name) return "??";
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "??";
    const a = words[0]?.[0] ?? "";
    const b = words[1]?.[0] ?? words[0]?.[1] ?? "";
    const initials = (a + b).toUpperCase();
    return initials || "??";
  }

  const handleLogout = () => {
    if (isCrmLocation) {
      localStorage.removeItem("tokenAuthCRM");
      toast.info("Sesión en CRM cerrada");
    } else {
      localStorage.removeItem("authTokenPos");
      toast.info("Sesión en POS cerrada");
    }
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col flex-1 w-full">
          {/* HEADER */}
          <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex px-2 items-center justify-between">
              {/* LADO IZQUIERDO: Logo + sucursal */}
              <div className="flex items-center gap-2">
                <SidebarTrigger className="h-8 w-8 -ml-1" />
                <Link to={isCrmLocation ? "/crm" : "/"}>
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  />
                </Link>
                <p className="text-xs sm:text-sm truncate max-w-[160px] sm:max-w-xs">
                  {sucursalInfo?.nombre || ""}
                </p>
              </div>

              {/* LADO DERECHO: Toggle tema + switch CRM/POS + notis + user */}
              <div className="flex items-center space-x-2">
                <ModeToggle />

                {/* Botón para cambiar entre CRM / POS */}
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  <Link to={isCrmLocation ? "/" : "/crm"}>
                    {isCrmLocation ? "Ir a POS" : "Ir a CRM"}
                  </Link>
                </Button>

                <NotificationsSheet
                  notifications={secureNotifications}
                  isLoading={isLoadingNotis}
                  onDelete={deleteNoti}
                  countBadge={secureNotifications.length}
                  deleteAllNotis={deleteAllNotis}
                  openDeleteAllNoti={openDeleteAllNoti}
                  setOpenDeleteAllNoti={setOpenDeleteAllNoti}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full p-0"
                      aria-label="User menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="h-8 w-8 bg-[#29daa5] text-white font-semibold uppercase flex items-center justify-center">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{displayName || "Usuario"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AtSign className="mr-2 h-4 w-4" />
                      <span>{displayEmail || "correo@ejemplo.com"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full">{children || <Outlet />}</div>
          </main>

          {/* FOOTER */}
          <footer className="border-t bg-background">
            <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-3">
              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                &copy; 2025 Nova Sistemas. Todos los derechos reservados
              </p>
            </div>
          </footer>
        </div>
      </SidebarProvider>

      {/* Dialog para eliminar todas las notificaciones (solo UI) */}
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
    </div>
  );
}
