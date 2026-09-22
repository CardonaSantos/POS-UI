import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  PowerOff,
  RefreshCcw,
  RotateCcw,
  UserCheck,
  UserCog,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { formateDate } from "../Utils/FormateDate";
import { ROL_USUARIO_OPTIONS, RolUsuario } from "../features/users/users-rol";

import type { UsersProfile } from "./interfacesProfile";
import type {
  UpdateOneUserPayload,
  UserRoleFilter,
  UserSortField,
  UserStatusFilter,
} from "./ProfileConfig.types";
import {
  useDeactivateUserProfileMutation,
  useProfilesQuery,
  useUpdateOneUserProfileMutation,
} from "./ProfileConfig.hooks";
import { useUsersAdminTable } from "./useUsersAdminTable";
import { UserDeactivateDialog } from "./UserDeactivateDialog";
import { UserEditDialog } from "./UserEditDialog";
import { getRolUsuarioLabel } from "./users-rol";

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

function CrmUsers() {
  const userRol = useStoreCrm((state) => state.rol);
  const canManageRoles = userRol === RolUsuario.SUPER_ADMIN;
  const canDeactivate = userRol === RolUsuario.SUPER_ADMIN;

  const usersQuery = useProfilesQuery();
  const updateMutation = useUpdateOneUserProfileMutation();
  const deactivateMutation = useDeactivateUserProfileMutation();

  const users = usersQuery.data ?? [];
  const table = useUsersAdminTable(users);

  const [editingUser, setEditingUser] = useState<UsersProfile | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<UsersProfile | null>(
    null,
  );

  const roleOptions = useMemo(
    () => [{ value: "ALL", label: "Todos los roles" }, ...ROL_USUARIO_OPTIONS],
    [],
  );

  const openEdit = (user: UsersProfile) => setEditingUser(user);
  const openDeactivate = (user: UsersProfile) => setDeactivatingUser(user);

  const handleSave = async (payload: UpdateOneUserPayload) => {
    if (!editingUser) return;

    try {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        payload,
      });
      setEditingUser(null);
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("No se pudo actualizar el usuario");
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingUser) return;

    try {
      await deactivateMutation.mutateAsync(deactivatingUser.id);
      setDeactivatingUser(null);
      toast.success("Usuario desactivado correctamente");
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      toast.error("No se pudo desactivar el usuario");
    }
  };

  const renderSortButton = (label: string, field: UserSortField) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1.5 px-3"
      onClick={() => table.toggleSort(field)}
    >
      {label}
      <SortIcon
        active={table.sortField === field}
        direction={table.sortDirection}
      />
    </Button>
  );

  if (usersQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <PageTransitionCrm
      titleHeader="Administrador de usuarios"
      subtitle="Gestiona roles, estado y acceso de los usuarios del CRM"
      variant="fade-pure"
    >
      <div className="space-y-4">
        {usersQuery.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              No fue posible cargar los usuarios. Intenta recargar la
              información.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">Usuarios</p>
                <p className="text-lg font-semibold leading-none">
                  {table.stats.total}
                </p>
              </div>

              <Users className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">Activos</p>
                <p className="text-lg font-semibold leading-none">
                  {table.stats.active}
                </p>
              </div>

              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">Inactivos</p>
                <p className="text-lg font-semibold leading-none">
                  {table.stats.inactive}
                </p>
              </div>

              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_220px_190px_auto]">
              <Input
                value={table.search}
                onChange={(event) => table.setSearch(event.target.value)}
                placeholder="Buscar por nombre, correo, teléfono, rol o ID..."
              />

              <Select
                value={table.role}
                onValueChange={(value) =>
                  table.setRole(value as UserRoleFilter)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={table.status}
                onValueChange={(value) =>
                  table.setStatus(value as UserStatusFilter)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activos</SelectItem>
                  <SelectItem value="INACTIVE">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 gap-1.5"
                  onClick={table.clearFilters}
                  disabled={!table.hasActiveFilters}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Limpiar
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 gap-1.5"
                  onClick={() => void usersQuery.refetch()}
                  disabled={usersQuery.isFetching}
                >
                  <RefreshCcw
                    className={`h-3.5 w-3.5 ${
                      usersQuery.isFetching ? "animate-spin" : ""
                    }`}
                  />
                  Recargar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-md border bg-background">
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    {renderSortButton("Usuario", "nombre")}
                  </TableHead>
                  <TableHead>{renderSortButton("Correo", "correo")}</TableHead>
                  <TableHead>{renderSortButton("Rol", "rol")}</TableHead>
                  <TableHead className="w-[120px]">
                    {renderSortButton("Estado", "activo")}
                  </TableHead>
                  <TableHead className="w-[160px] text-right">
                    {renderSortButton("Creado", "creadoEn")}
                  </TableHead>
                  <TableHead className="w-[110px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {table.rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No hay usuarios que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.rows.map((user) => (
                    <TableRow
                      key={user.id}
                      className={!user.activo ? "opacity-70" : undefined}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.nombre}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: #{user.id.toString().padStart(4, "0")}
                            {user.telefono ? ` · ${user.telefono}` : ""}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {user.correo}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {getRolUsuarioLabel(user.rol)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant={user.activo ? "default" : "secondary"}>
                          {user.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {formateDate(user.creadoEn)}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Editar usuario"
                            onClick={() => openEdit(user)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Desactivar usuario"
                            disabled={!canDeactivate || !user.activo}
                            onClick={() => openDeactivate(user)}
                          >
                            <PowerOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {table.total === 0
                ? "0 resultados"
                : `Mostrando ${table.startIndex + 1}-${table.endIndex} de ${table.total}`}
            </p>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Select
                value={String(table.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>

              <span className="min-w-[84px] text-center text-xs text-muted-foreground">
                Página {table.page} de {table.totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={table.page <= 1}
                onClick={() => table.setPage(table.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={table.page >= table.totalPages}
                onClick={() => table.setPage(table.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UserEditDialog
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open && !updateMutation.isPending) setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSave}
        isSaving={updateMutation.isPending}
        canChangeRole={canManageRoles}
      />

      <UserDeactivateDialog
        open={deactivatingUser !== null}
        onOpenChange={(open) => {
          if (!open && !deactivateMutation.isPending) setDeactivatingUser(null);
        }}
        user={deactivatingUser}
        onConfirm={handleDeactivate}
        isPending={deactivateMutation.isPending}
      />
    </PageTransitionCrm>
  );
}

export default CrmUsers;
