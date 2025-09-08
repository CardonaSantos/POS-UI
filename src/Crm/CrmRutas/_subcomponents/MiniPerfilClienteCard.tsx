import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { ClienteInternetFromRuta } from "../rutas-types";
import { Badge, Home, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { returnStatusClient } from "@/Crm/Utils/Utils2";
import { getClienteEstadoBadgeClass } from "@/Crm/Utils/EstadoBadgeClienteOperando";
import { getEstadoClienteLabel } from "@/Crm/Utils/StatusCliente";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipBoard } from "@/utils/clipBoard";
import { openNumberPhone } from "@/utils/openNumberPhone";
import { Link } from "react-router-dom";

interface PropMiniPerfilCard {
  cliente: ClienteInternetFromRuta;
}

function MiniPerfilClienteCard({ cliente }: PropMiniPerfilCard) {
  return (
    <div>
      <div key={cliente.id} className="p-3 bg-muted rounded-md">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            <p className="text-xs hover:text-blue-500 hover:underline">
              <Link to={`/crm/cliente/${cliente.id}`}>
                {cliente.nombre} {cliente.apellidos || ""}
              </Link>
            </p>
          </div>
          <Badge
            className={cn(
              "text-[9px]",
              getClienteEstadoBadgeClass(
                getEstadoClienteLabel(cliente.estadoCliente)
              )
            )}
          >
            {returnStatusClient(cliente.estadoCliente)}
          </Badge>
        </div>

        <div className="grid grid-cols-2">
          {cliente.telefono && (
            <div className="flex items-center gap-2 mt-1 text-xs">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-between items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Tel: {cliente.telefono}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Opciones de contacto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => copyToClipBoard(cliente.telefono ?? "")}
                  >
                    Copiar número
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => openNumberPhone(cliente.telefono ?? "")}
                  >
                    Llamar al número
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {cliente.telefonoReferencia && (
            <div className="flex items-center gap-2 mt-1 text-xs">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-between items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Tel. Ref: {cliente.telefonoReferencia}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Opciones de contacto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      copyToClipBoard(cliente.telefonoReferencia ?? "")
                    }
                  >
                    Copiar número
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      openNumberPhone(cliente.telefonoReferencia ?? "")
                    }
                  >
                    Llamar al número
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {cliente.direccion && (
          <div className="flex items-start gap-2 mt-1  text-xs">
            <Home className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <span>Dirección: {cliente.direccion}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="text-xs">
            <span className="font-medium">
              Saldo pendiente: {formattMonedaGT(cliente.saldoPendiente ?? 0)}
            </span>
            {cliente.facturasPendientes && cliente.facturasPendientes > 0 && (
              <span className="text-xs text-muted-foreground ml-2">
                ({cliente.facturasPendientes} facturas)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniPerfilClienteCard;
