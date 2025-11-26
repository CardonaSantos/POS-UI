import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";
import { Button } from "@/components/ui/button";
import { formattShortFecha } from "@/utils/formattFechas";
import {
  Activity,
  Cable,
  Clock,
  Edit,
  Globe,
  KeyRound,
  Server,
  Trash2,
  User,
} from "lucide-react";

interface MkProps {
  mk: MikrotikRoutersResponse;
  handleSelectToEdit: (mk: MikrotikRoutersResponse) => void;
  isToUpdate: boolean;
  handleOpenDelete: (mk: MikrotikRoutersResponse) => void;
}

function MikroTikCard({ mk, handleSelectToEdit, handleOpenDelete }: MkProps) {
  const maskedPassword = mk.passwordEnc ? "********" : "—";

  return (
    <Card className="h-full border border-border/60 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold leading-tight">
              {mk.nombre ?? "Sin nombre"}
            </h2>
          </div>
          <CardDescription className="text-xs line-clamp-2">
            {mk.descripcion ?? "Sin descripción"}
          </CardDescription>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
              mk.activo
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <Activity className="mr-1 h-3 w-3" />
            {mk.activo ? "Activo" : "Inactivo"}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            SSH&nbsp;
            <span className="font-semibold">{mk.sshPort}</span>
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
        {/* Acceso */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase text-muted-foreground tracking-wide">
            <User className="h-3.5 w-3.5" />
            <span>Acceso</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Usuario</p>
            <p className="font-medium break-all">{mk.usuario}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Contraseña</p>
            <p className="flex items-center gap-1 font-medium">
              <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
              {maskedPassword}
            </p>
          </div>
        </div>

        {/* Red */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase text-muted-foreground tracking-wide">
            <Globe className="h-3.5 w-3.5" />
            <span>Red</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Host</p>
            <p className="font-medium break-all">{mk.host}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">OLT asignada</p>
            <p className="font-medium flex items-center gap-1">
              <Cable className="h-3.5 w-3.5 text-muted-foreground" />
              {mk.oltId ?? "N/A"}
            </p>
          </div>
        </div>

        {/* Fechas */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase text-muted-foreground tracking-wide">
            <Clock className="h-3.5 w-3.5" />
            <span>Auditoría</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:text-[13px]">
            <div>
              <p className="text-muted-foreground">Creado en</p>
              <p className="font-medium">
                {mk.creadoEn ? formattShortFecha(mk.creadoEn) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Actualizado en</p>
              <p className="font-medium">
                {mk.actualizadoEn ? formattShortFecha(mk.actualizadoEn) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2 pt-2">
        <Button
          onClick={() => handleOpenDelete(mk)}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Eliminar
        </Button>
        <Button
          onClick={() => handleSelectToEdit(mk)}
          size="sm"
          className="h-8 px-3 text-xs"
        >
          <Edit className="mr-1.5 h-3.5 w-3.5" />
          Editar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MikroTikCard;
