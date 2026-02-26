import React, { useEffect, useState } from "react";
import {
  deleteUserProfile,
  getProfiles,
  updateOneUserProfile,
} from "./ProfileConfig.api";
import { RolUsuario, UserProfile, UsersProfile } from "./interfacesProfile";
import { Loader, Trash2, UserCog, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate } from "../Utils/FormateDate";
import DialogEdit from "./DialogEdit";
import DialogDelete from "./DialogDelete";
import { toast } from "sonner";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useAuthStoreCRM } from "../CrmAuthRoutes/AuthStateCRM";

function CrmUsers() {
  const userRol = useAuthStoreCRM((state) => state.userRol);
  const isDisable = userRol !== "SUPER_ADMIN";

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [users, setUsers] = useState<UsersProfile[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    getProfiles()
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Error al cargar los perfiles");
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUser((prevData) =>
      prevData ? { ...prevData, [name]: value } : prevData,
    );
  };

  const handleRolChange = (value: string) => {
    setUser((prevData) =>
      prevData ? { ...prevData, rol: value as RolUsuario } : prevData,
    );
  };

  const handleActivoChange = (checked: boolean) => {
    setUser((prevData) =>
      prevData ? { ...prevData, activo: checked } : prevData,
    );
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSubmiting(true);
    try {
      await updateOneUserProfile(user.id, user);
      setOpenEdit(false);
      toast.success("Usuario actualizado correctamente");
      loadUsers();
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError("Error al actualizar el perfil");
      toast.error("Error al actualizar usuario");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    setIsSubmiting(true);
    try {
      await deleteUserProfile(user.id);
      setOpenDelete(false);
      loadUsers();
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      setError("Error al eliminar el usuario");
      toast.error("Ocurrió un error, no se puede eliminar el usuario");
    } finally {
      setIsSubmiting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
        <Loader className="w-6 h-6 animate-spin mb-2" />
        <h2 className="text-sm font-medium">Cargando usuarios...</h2>
      </div>
    );
  }

  return (
    <PageTransitionCrm
      titleHeader="Administrador de usuarios"
      subtitle=""
      variant="fade-pure"
    >
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cabecera limpia y estándar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            className="w-full sm:w-auto h-8 gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Recargar
          </Button>
        </div>

        {/* Tabla contenedora con border y rounded estándar (md) */}
        <div className="rounded-md border shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Creado</TableHead>
                  <TableHead className="text-right w-[100px]">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      {/* USUARIO E ID */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.nombre}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: #{user.id.toString().padStart(4, "0")}
                          </span>
                        </div>
                      </TableCell>

                      {/* CORREO */}
                      <TableCell className="text-muted-foreground">
                        {user.correo}
                      </TableCell>

                      {/* ROL */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal text-xs uppercase tracking-wider"
                        >
                          {user.rol.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      {/* ESTADO */}
                      <TableCell>
                        <Badge
                          variant={user.activo ? "default" : "secondary"}
                          className="font-normal"
                        >
                          {user.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      {/* CREADO EN */}
                      <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                        {formateDate(user.creadoEn)}
                      </TableCell>

                      {/* ACCIONES */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setUser(user);
                              setOpenEdit(true);
                            }}
                          >
                            <UserCog className="w-4 h-4" />
                          </Button>
                          <Button
                            disabled={isDisable}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setUser(user);
                              setOpenDelete(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <DialogEdit
        handleChange={handleChange}
        handleRolChange={handleRolChange}
        handleActivoChange={handleActivoChange}
        handleSaveChanges={handleSaveChanges}
        user={user}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        isSubmiting={isSubmiting}
      />

      <DialogDelete
        user={user}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        handleDeleteUser={handleDeleteUser}
        isSubmiting={isSubmiting}
      />
    </PageTransitionCrm>
  );
}

export default CrmUsers;
