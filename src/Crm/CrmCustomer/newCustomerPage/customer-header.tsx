"use client";
import {
  User,
  FilePlus,
  FilePenLine,
  Printer,
  Ticket,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  getEstadoOperandoClienteColorBadge,
  returnStatusClient,
} from "../../Utils/Utils2";
import {
  ClienteDetailsDto,
  EstadoCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";

interface PlantillasInterface {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
}

interface CustomerHeaderProps {
  cliente: ClienteDetailsDto;
  plantillas: PlantillasInterface[];
  setOpenCreateContrato: (open: boolean) => void;
}

export function CustomerHeader({
  cliente,
  plantillas,
  setOpenCreateContrato,
}: CustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Información del cliente */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-1 truncate">
          <User className="h-4 w-4 dark:text-white" />
          <span className="truncate">
            {cliente.nombre} {cliente.apellidos}
          </span>
        </h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>#{cliente.id}</span>
          <span>•</span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] py-0.5 px-1",
              getEstadoOperandoClienteColorBadge(
                returnStatusClient(cliente.estadoCliente as EstadoCliente)
              )
            )}
          >
            {returnStatusClient(cliente.estadoCliente as EstadoCliente)}
          </Badge>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-1">
        {cliente.contratoServicioInternet ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs bg-transparent"
              >
                <FilePenLine className="h-3 w-3 mr-1" />
                <span className="hidden xs:inline">Contrato</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="flex items-center gap-2 text-xs"
                onClick={() => setOpenCreateContrato(true)}
              >
                <FilePenLine className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {plantillas.map((plantilla) => (
                <DropdownMenuItem asChild key={plantilla.id}>
                  <Link
                    to={`/crm/contrato/${
                      cliente.contratoServicioInternet!.id
                    }/vista?plantilla=${plantilla.id}`}
                    className="flex items-center gap-2 w-full text-xs"
                  >
                    <Printer className="h-4 w-4" />
                    {plantilla.nombre}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs bg-transparent"
            onClick={() => setOpenCreateContrato(true)}
          >
            <FilePlus className="h-3 w-3 mr-1" />
            Contrato
          </Button>
        )}

        <Link to={`/crm/tickets`}>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs bg-transparent"
          >
            <Ticket className="h-3 w-3 mr-1" />
            Ticket
          </Button>
        </Link>

        <Link to={`/crm/cliente-edicion/${cliente.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs bg-transparent"
          >
            <UserCog className="h-3 w-3 mr-1" />
            Editar
          </Button>
        </Link>
      </div>
    </div>
  );
}
