import { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getFacturasEliminadas } from "./api";
import { toast } from "sonner";
import axios from "axios";
import { formatearMoneda, formateDate } from "../Utils/FormateDate";

// Interface para mapear los datos
interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface FacturaEliminada {
  id: number;
  montoPago: number;
  motivo: string;
  fechaEliminacion: string;
  fechaPagoEsperada: string;
  periodo: string;
  facturaInternetId: number | null;
  usuario: Usuario;
}

const ITEMS_PER_PAGE = 5;

export default function DeletedInvoicesView() {
  const [eliminados, setEliminados] = useState<FacturaEliminada[]>([]);

  const getRegistros = async () => {
    try {
      const data = await getFacturasEliminadas();
      setEliminados(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data;
        if (apiError && apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("Error inesperado");
          console.log("Error completo:", error);
        }
      }
    } finally {
      console.log("Flujo finalizado");
    }
  };

  useEffect(() => {
    getRegistros();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  //   const [selectedInvoice, setSelectedInvoice] =
  //     useState<FacturaEliminada | null>(null);

  const totalPages = Math.ceil(eliminados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInvoices = eliminados.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return formateDate(dateString);
  };

  const formatCurrency = (amount: number) => {
    return formatearMoneda(amount);
  };

  const truncateText = (text: string, maxLength = 30) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getRoleBadgeVariant = (rol: string) => {
    return rol === "ADMIN" ? "default" : "secondary";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Facturas Eliminadas
          </h1>
          <p className="text-gray-600">
            Gestión de facturas eliminadas del sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registro de Facturas Eliminadas
          </CardTitle>
          <CardDescription>
            Total de {eliminados.length} facturas eliminadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Fecha Eliminación</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentInvoices.map((factura) => (
                  <TableRow key={factura.id}>
                    <TableCell className="font-medium">#{factura.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">
                            {factura.usuario?.nombre || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {factura.usuario?.correo || "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          {formatCurrency(factura.montoPago)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{factura.periodo}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {formatDate(factura.fechaEliminacion)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {truncateText(factura.motivo)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader className="pb-3">
                            <DialogTitle className="flex items-center gap-2 text-lg">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              Detalles de Factura Eliminada #{factura.id}
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                              Información completa de la factura eliminada
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Información del Usuario */}
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                <User className="h-4 w-4" />
                                Información del Usuario
                              </h3>
                              <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-md text-sm">
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    Nombre
                                  </span>
                                  <span className="font-medium">
                                    {factura.usuario?.nombre || "N/A"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    Correo
                                  </span>
                                  <span>
                                    {factura.usuario?.correo || "N/A"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    Rol
                                  </span>
                                  <Badge
                                    variant={getRoleBadgeVariant(
                                      factura.usuario?.rol || ""
                                    )}
                                    className="text-xs"
                                  >
                                    {factura.usuario?.rol || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Información de la Factura */}
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                <FileText className="h-4 w-4" />
                                Información de la Factura
                              </h3>
                              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-md text-sm">
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    Monto de Pago
                                  </span>
                                  <span className="text-base font-semibold text-green-600">
                                    {formatCurrency(factura.montoPago)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    Período
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {factura.periodo}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    Fecha Pago Esperada
                                  </span>
                                  <span>
                                    {formatDate(factura.fechaPagoEsperada)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 block">
                                    ID Factura Internet
                                  </span>
                                  <span>
                                    {factura.facturaInternetId
                                      ? `#${factura.facturaInternetId}`
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Información de Eliminación */}
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold flex items-center gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Información de Eliminación
                              </h3>
                              <div className="p-3 bg-red-50 rounded-md border border-red-200 space-y-2">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-xs font-medium text-gray-600 block">
                                      Fecha de Eliminación
                                    </span>
                                    <span className="font-medium text-red-700">
                                      {formatDate(factura.fechaEliminacion)}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-600 block mb-1">
                                    Motivo de Eliminación
                                  </span>
                                  <div className="text-sm p-2 bg-white rounded border text-gray-700">
                                    {factura.motivo}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(endIndex, eliminados.length)} de {eliminados.length}{" "}
              resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm">Página</span>
                <span className="text-sm font-medium">{currentPage}</span>
                <span className="text-sm">de</span>
                <span className="text-sm font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
