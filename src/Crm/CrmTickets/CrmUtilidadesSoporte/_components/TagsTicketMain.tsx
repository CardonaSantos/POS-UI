import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  PlusCircle,
  Loader2,
  Ticket,
  FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";
import { Badge } from "@/components/ui/badge";

interface PropsTagsMainPage {
  setSearchEtiqueta: React.Dispatch<React.SetStateAction<string>>;
  searchEtiqueta: string;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateDialogOpen: boolean;
  setStats: React.Dispatch<
    React.SetStateAction<{
      totalEtiquetas: number;
      totalTickets: number;
    }>
  >;

  stats: {
    totalEtiquetas: number;
    totalTickets: number;
  };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;

  setEtiquetas: React.Dispatch<React.SetStateAction<EtiquetaTicket[]>>;

  etiquetas: EtiquetaTicket[];
  filteredEtiquetas: EtiquetaTicket[];
  handleEditClick: (etiqueta: EtiquetaTicket) => void;
  handleDeleteClick: (id: number) => void;
}

function TagsTicketMain({
  searchEtiqueta,
  setIsCreateDialogOpen,
  setSearchEtiqueta,
  stats,
  isLoading,
  etiquetas,
  filteredEtiquetas,
  handleEditClick,
  handleDeleteClick,
}: PropsTagsMainPage) {
  const getTagColor = (id: number): string => {
    const colors = [
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    ];

    return colors[id % colors.length];
  };

  return (
    <div className="space-y-2">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar etiquetas..."
              className="pl-8 text-sm"
              value={searchEtiqueta}
              onChange={(e) => setSearchEtiqueta(e.target.value)}
            />
          </div>

          <Button
            className="gap-1 text-sm px-3"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Etiqueta</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-border/50">
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Etiquetas</p>
                <h3 className="text-lg font-semibold">
                  {stats.totalEtiquetas}
                </h3>
              </div>
              <Tag className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Tickets</p>
                <h3 className="text-lg font-semibold">{stats.totalTickets}</h3>
              </div>
              <Ticket className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Etiquetas</CardTitle>
          <CardDescription className="text-sm">
            Lista de etiquetas disponibles
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading && etiquetas.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : etiquetas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No hay etiquetas</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Crear nueva
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <ScrollArea className="max-h-[60vh] min-h-[250px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Etiqueta</TableHead>
                      <TableHead className="text-center text-sm">
                        Tickets
                      </TableHead>
                      <TableHead className="text-right text-sm w-[80px]">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredEtiquetas.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-6 text-muted-foreground text-sm"
                        >
                          Sin resultados para "{searchEtiqueta}"
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEtiquetas.map((etiqueta) => (
                        <TableRow key={etiqueta.id}>
                          <TableCell>
                            <Badge
                              className={`${getTagColor(etiqueta.id)} text-xs`}
                            >
                              <Tag className="mr-1 h-3 w-3" />
                              {etiqueta.nombre}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              disabled={!etiqueta.ticketsCount}
                            >
                              <Ticket className="h-3 w-3 mr-1" />
                              {etiqueta.ticketsCount || 0}
                            </Button>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-sm flex items-center gap-2"
                                  onClick={() => handleEditClick(etiqueta)}
                                >
                                  <Edit className="h-4 w-4" /> Editar
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="text-sm flex items-center gap-2 text-destructive"
                                  onClick={() => handleDeleteClick(etiqueta.id)}
                                >
                                  <Trash2 className="h-4 w-4" /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TagsTicketMain;
