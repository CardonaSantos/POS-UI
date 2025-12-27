import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  Activity,
  SquarePen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";

interface TicketSolucionesListProps {
  data: SolucionTicketItem[];
  onDelete: (id: number) => void
  itemsPerPage?: number;
  openToggleDelete: () => void
   handleSelectResolucion: (regist: SolucionTicketItem) => void
   handleSelectEdit: (regist: SolucionTicketItem) => void
}

export const TicketSolucionesList = ({
  data,
  itemsPerPage = 10,
  handleSelectEdit,
  handleSelectResolucion,
}: TicketSolucionesListProps) => {
  const pageSize = Math.min(itemsPerPage, 20);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const handlePrevious = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));

  const handleNext = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <Card className="w-full border-zinc-200 text-sm">
      {/* HEADER */}
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-zinc-500" />
            <div>
              <CardTitle className="text-sm font-semibold">
                Soluciones
              </CardTitle>
              <CardDescription className="text-xs">
                Catálogo general
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className="h-6 text-xs font-normal"
          >
            Total: {data.length}
          </Badge>
        </div>
      </CardHeader>

      {/* TABLE */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="w-[50px] text-center text-xs">
                  ID
                </TableHead>
                <TableHead className="min-w-[150px] text-xs">
                  Solución
                </TableHead>
                <TableHead className="hidden md:table-cell text-xs">
                  Descripción
                </TableHead>
                <TableHead className="text-center text-xs">
                  Uso
                </TableHead>
                <TableHead className="text-right text-xs pr-4">
                  Estado
                </TableHead>

                 <TableHead className="text-right text-xs pr-4">
                  Acción
                </TableHead>


              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <TableRow key={item.id} className="h-9">
                    <TableCell className="text-center text-xs text-zinc-500 py-1">
                      #{item.id}
                    </TableCell>

                    <TableCell className="py-1">
                      <div className="text-sm font-medium">
                        {item.solucion}
                      </div>
                      <div className="md:hidden text-[10px] text-zinc-400 truncate max-w-[180px]">
                        {item.descripcion}
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-zinc-500 truncate max-w-[250px] py-1">
                      {item.descripcion}
                    </TableCell>

                    <TableCell className="text-center py-1">
                      <div className="flex items-center justify-center gap-1">
                        <Activity className="h-3 w-3 text-zinc-400" />
                        <span className="text-xs font-medium">
                          {item.ticketsCount}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right py-1 pr-4">
                      {item.isEliminado ? (
                        <Badge
                          variant="destructive"
                          className="h-5 px-1.5 text-[10px]"
                        >
                          Baja
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] bg-emerald-100 text-emerald-700"
                        >
                          Activo
                        </Badge>
                      )}
                    </TableCell>


                      <TableCell className="text-right py-1 pr-4">
                                        <DropdownMenu>
                      <DropdownMenuTrigger>
                                        <Button
                                        size={'sm'}
                                          type="button"
                                          variant={'outline'}
                                        >
                                          <SquarePen
                                          size={12}
                                          />
                                        </Button>


                    </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                        onClick={()=> handleSelectResolucion(item)}
                        
                        
                        >Eliminar</DropdownMenuItem>
                        <DropdownMenuItem
                        onClick={()=> handleSelectEdit(item)}
                        >Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>



                    </TableCell>


                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-16 text-center text-xs text-zinc-500"
                  >
                    Sin registros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between p-2 px-4 bg-zinc-50/50">
          <span className="text-[10px] text-zinc-500">
            Página {currentPage} / {totalPages}
          </span>

          <div className="flex gap-1">
            <Button
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>

            <Button
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
