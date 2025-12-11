import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  MoreVertical,
  CreditCard,
  User,
  Building2,
  Package,
  FileText,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  DeleteIcon,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { CreditoRegistro } from "./CreditosType";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import currency from "currency.js";
import { useStore } from "@/components/Context/ContextSucursal";
import { useApiMutation } from "@/hooks/genericoCall/genericoCallHook";
const API_URL = import.meta.env.VITE_API_URL;
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

interface CreditRecordsTableProps {
  getCredits: () => Promise<void>;
  records: CreditoRegistro[];
  sucursalId: number;
  userId: number;
}

interface Cuota {
  id: number;
  creadoEn: string;
  estado: string;
  fechaPago: string;
  monto: number;
  comentario: string;
  usuario: {
    id: number;
    nombre: string;
  };
}
interface CuotasCardProps {
  cuotas: Cuota[];
}
//===================================================>
interface Plantillas {
  id: number;
  texto: string;
  nombre: string;
}

const FormatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

export function CreditRecordsTable({
  records,
  sucursalId,
  userId,
  getCredits,
}: CreditRecordsTableProps) {
  console.log("Registros actualizados en hijo:", records); // <-- Debe cambiar después de eliminar
  const [selectedRecord, setSelectedRecord] = useState<CreditoRegistro | null>(
    null
  );
  const [plantillas, setPlantillas] = useState<Plantillas[]>([]);

  const getAllPlantillas = async () => {
    try {
      const response = await axios.get(`${API_URL}/cuotas/get/plantillas`);
      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  useEffect(() => {
    getAllPlantillas();
  }, []);

  const calcularCuotas = () => {
    if (selectedRecord) {
      const montoInteres =
        selectedRecord.totalVenta * (selectedRecord.interes / 100);
      const montoTotalConInteres = selectedRecord.montoTotalConInteres;
      const saldoRestante = montoTotalConInteres - selectedRecord.cuotaInicial;
      const pagoPorCuota = saldoRestante / selectedRecord.cuotasTotales;

      return {
        saldoRestante,
        montoInteres,
        montoTotalConInteres,
        pagoPorCuota,
      };
    }
    return {
      saldoRestante: 0,
      montoInteres: 0,
      montoTotalConInteres: 0,
      pagoPorCuota: 0,
    };
  };

  const calcularMontoInteres = (totalVenta: number, interes: number) => {
    const montoInteres = totalVenta * (interes / 100);
    const montoTotalConInteres = totalVenta + montoInteres;
    return {
      montoTotalConInteres,
    };
  };

  const [passwordAdmin, setPasswordAdmin] = useState("");
  const [creditId, setCreditId] = useState<number | null>(null);
  const [openDeleteCredit, setOpenDeleteCredit] = useState(false);

  const [selectedID, setSelectedID] = useState<number | null>(null);

  const [openCloseCredito, setOpenCloseCredito] = useState<boolean>(false);

  const cambiarEstadoCredito = useApiMutation(
    "patch",
    `cuotas/close-credit-regist/${selectedID}`,
    {}
  );

  const handleCloseCredito = async () => {
    if (!selectedID) {
      toast.info("Seleccione un crédito");
      return;
    }
    const toastId = toast.loading("Cerrando crédito...");
    try {
      await cambiarEstadoCredito.mutateAsync({});
      toast.success("Crédito cerrado correctamente", { id: toastId });
      setOpenCloseCredito(false);
      setSelectedID(null);
      await getCredits();
    } catch (error) {
      console.error(error);
      toast.error("Error al cerrar el crédito", { id: toastId });
    }
  };

  const handleDeleteCreditRegist = async () => {
    if (!passwordAdmin || !creditId) {
      toast.info("Complete los datos requeridos");
      return;
    }

    const toastId = toast.loading("Eliminando registro de crédito...");

    try {
      const response = await axios.delete(
        `${API_URL}/cuotas/delete-one-credit-regist`,
        {
          data: { passwordAdmin, userId, sucursalId, creditId },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registro eliminado correctamente", { id: toastId });

        setOpenDeleteCredit(false);
        setCreditId(null);
        setPasswordAdmin("");
        await getCredits();
      }
    } catch (error) {
      // Actualiza el toast en caso de error
      toast.error("Error al eliminar registro", { id: toastId });
      console.error(error);
    }
  };

  function CuotasCard({ cuotas }: CuotasCardProps) {
    const [cuotaID, setCuotaID] = useState(0);
    const sucursalID = sucursalId;
    const userId = useStore((state) => state.userId) ?? 0;
    // const sucursalId = useStore((state) => state.sucursalId) ?? 0;

    const [openDeletePayment, setOpenDeletePayment] = useState(false);
    const [password, setPassword] = useState("");

    const handleDeletePaymentCuota = async () => {
      try {
        const response = await axios.delete(
          `${API_URL}/cuotas/delete-one-payment-cuota`,
          {
            data: {
              sucursalID: sucursalID,
              password: password,
              cuotaID: cuotaID,
              userId: userId,
            },
          }
        );

        if (response.status === 200) {
          setOpenDeletePayment(false);
          setCuotaID(0);
          setPassword("");
          setSelectedRecord(null);
          await getCredits();
          toast.success("Registro de pago eliminado");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al eliminar registro de pago");
      }
    };

    return (
      <>
        <Card className="w-full shadow-sm my-2">
          <CardHeader>
            <h2 className="font-bold text-center">Historial de pagos</h2>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comentarios</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuotas?.length > 0 ? (
                  cuotas
                    .sort(
                      (a, b) =>
                        new Date(a.creadoEn).getTime() -
                        new Date(b.creadoEn).getTime()
                    )
                    .map((cuota, index) => (
                      <TableRow key={cuota.id || "sin-id"}>
                        <TableCell className="font-medium">
                          #{index + 1}
                        </TableCell>
                        <TableCell
                          className={`font-bold text-sm ${
                            cuota.estado === "PENDIENTE"
                              ? "text-red-600" // Rojo oscuro para pagos pendientes
                              : cuota.estado === "PAGADA"
                              ? "text-green-600" // Verde para pagos completados
                              : "text-blue-500" // Azul para otros estados
                          }`}
                        >
                          {cuota.estado ?? "Desconocido"}
                        </TableCell>
                        <TableCell>
                          {cuota.fechaPago
                            ? FormatearFecha(cuota.fechaPago)
                            : "Sin fecha"}
                        </TableCell>
                        <TableCell>
                          {cuota.monto !== undefined
                            ? formatearMoneda(cuota.monto)
                            : "Sin monto"}
                        </TableCell>
                        <TableCell className="text-[0.8rem]">
                          {cuota.comentario ?? "Sin comentarios"}
                        </TableCell>
                        <TableCell className="text-[0.8rem]">
                          {cuota.usuario?.nombre ?? "Usuario no asignado"}
                        </TableCell>

                        <TableCell className="flex justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link to={`/cuota/comprobante/${cuota.id}`}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Imprimir Comprobante"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Imprimir Comprobante</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell
                          colSpan={5} // Esto asegura que la celda ocupe todas las columnas
                          className=""
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setOpenDeletePayment(true);
                                    setCuotaID(cuota.id);
                                  }}
                                  variant="outline"
                                  size="icon"
                                  aria-label="eliminar-pago"
                                >
                                  <DeleteIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar registro de pago</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5} // Esto asegura que la celda ocupe todas las columnas
                      className=""
                    >
                      <p>No hay cuotas pagadas disponibles</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog onOpenChange={setOpenDeletePayment} open={openDeletePayment}>
          <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center justify-center">
                <AlertTriangle className="h-6 w-6" />
                Eliminación de registro de pago de cuota
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <DialogDescription className=" text-center">
                ¿Estás seguro de que deseas eliminar este registro?
              </DialogDescription>
              <DialogDescription className=" font-semibold text-center">
                Esta acción es irreversible y el saldo será descontado de la
                sucursal.
              </DialogDescription>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Ingrese su contraseña para confirmar"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12" // Espacio para el icono
                  aria-label="Contraseña de confirmación"
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpenDeletePayment(false)}
                className="w-full sm:w-1/2 order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletePaymentCuota}
                disabled={!password.trim()}
                className="w-full sm:w-1/2 order-1 sm:order-2 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Sí, eliminar registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const [filtro, setFiltro] = useState<string>("");

  const filtrados = records?.filter((rec) => {
    const lowerCaseFiltro = filtro.trim().toLocaleLowerCase();
    return (
      rec?.cliente?.nombre?.toLocaleLowerCase().includes(lowerCaseFiltro) ||
      rec?.cliente?.telefono?.toLocaleLowerCase().includes(lowerCaseFiltro) ||
      rec?.cliente?.direccion?.toLocaleLowerCase().includes(lowerCaseFiltro) ||
      rec?.cliente?.dpi?.toLocaleLowerCase().includes(lowerCaseFiltro)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = filtrados.slice(indexOfFirstItem, indexOfLastItem);
  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Créditos</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          className="w-full my-5"
          placeholder="Buscar por nombre, telefono, dirección, dpi"
          onChange={(e) => setFiltro(e.target.value)}
          value={filtro}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Venta Total</TableHead>
              <TableHead>Monto con interés</TableHead>
              <TableHead>Total Pagado</TableHead>
              <TableHead>Por pagar</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Ver Detalles</TableHead>
              <TableHead>Imprimir</TableHead>
              <TableHead>Eliminar</TableHead>
              <TableHead>Cerrar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems &&
              currentItems.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>#{record.id}</TableCell>
                  <TableCell>{record.cliente.nombre}</TableCell>
                  <TableCell>{formatearMoneda(record.totalVenta)}</TableCell>

                  <TableCell>
                    {formatearMoneda(
                      calcularMontoInteres(record.totalVenta, record.interes)
                        .montoTotalConInteres
                    )}
                  </TableCell>

                  <TableCell>{formatearMoneda(record.totalPagado)}</TableCell>

                  <TableCell>
                    {formatearMoneda(
                      record.montoTotalConInteres - record.totalPagado
                    )}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        record.estado === "ACTIVA"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="flex justify-center items-center"
                      variant={"outline"}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {plantillas &&
                          plantillas.map((plantilla) => (
                            <Link
                              to={`/imprimir/contrato/${record.id}/${plantilla.id}`}
                            >
                              <DropdownMenuItem key={plantilla.id}>
                                <FileText className="mr-2 h-4 w-4" />
                                Imprimir con: {plantilla.nombre}
                              </DropdownMenuItem>
                            </Link>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell>
                    <Button
                      className="flex justify-center items-center"
                      variant={"outline"}
                      onClick={() => {
                        setCreditId(record.id);
                        setOpenDeleteCredit(true);
                      }}
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button
                      className="flex justify-center items-center"
                      variant={
                        record.estado === "ACTIVA" ? "outline" : "default"
                      }
                      onClick={() => {
                        setOpenCloseCredito(true);
                        setSelectedID(record.id);
                      }}
                    >
                      {record.estado === "ACTIVA" ? "Cerrar" : "Activar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        {/* Aumentamos un poco el ancho máximo para aprovechar las 3 columnas */}
        <DialogContent className="max-w-6xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Detalle del Registro</DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <ScrollArea className="max-h-[80vh]">
              <div className="p-4 space-y-4">
                {/* GRID PRINCIPAL: 3 COLUMNAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* COLUMNA 1: CLIENTE Y TESTIGOS */}
                  <div className="space-y-3">
                    <Card>
                      <CardHeader className="p-3 pb-2 bg-muted/20">
                        <CardTitle className="text-sm font-semibold flex items-center">
                          <User className="mr-2 h-4 w-4" /> Cliente
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-sm grid gap-1">
                        <div className="flex justify-between border-b pb-1">
                          <span className="font-medium">DPI:</span>
                          <span>{selectedRecord.dpi}</span>
                        </div>
                        <div className="pt-1">
                          <p className="font-bold">
                            {selectedRecord.cliente.nombre}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {selectedRecord.cliente.direccion ??
                              "Sin dirección"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {selectedRecord.cliente.telefono ?? "Sin teléfono"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Testigos compactos */}
                    <Card>
                      <CardHeader className="p-3 pb-2 bg-muted/20">
                        <CardTitle className="text-sm font-semibold flex items-center">
                          <User className="mr-2 h-4 w-4" /> Testigos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-sm space-y-2">
                        {selectedRecord.testigos
                          .filter((t) => t.nombre)
                          .map((testigo, index) => (
                            <div
                              key={index}
                              className="text-xs border-l-2 pl-2 border-primary/20"
                            >
                              <p className="font-medium">{testigo.nombre}</p>
                              <span className="text-muted-foreground">
                                {testigo.telefono}
                              </span>
                            </div>
                          ))}
                        {selectedRecord.testigos.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            Sin testigos
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* COLUMNA 2: CRÉDITO (La información más densa) */}
                  <div className="space-y-3">
                    <Card className="h-full">
                      <CardHeader className="p-3 pb-2 bg-muted/20">
                        <CardTitle className="text-sm font-semibold flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" /> Estado
                          Financiero
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-sm">
                        {/* Grid interno para alinear montos a la derecha */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm">
                          <span className="text-muted-foreground">
                            Venta Total:
                          </span>
                          <span className="text-right font-medium">
                            {formatearMoneda(selectedRecord.totalVenta)}
                          </span>

                          <span className="text-muted-foreground">
                            Enganche:
                          </span>
                          <span className="text-right font-medium">
                            {formatearMoneda(selectedRecord.cuotaInicial)}
                          </span>

                          <span className="text-muted-foreground">
                            Cuotas (Total/Pag):
                          </span>
                          <span className="text-right">
                            {selectedRecord.cuotasTotales} /{" "}
                            {selectedRecord.cuotas.length}
                          </span>

                          <span className="text-muted-foreground">
                            Valor Cuota:
                          </span>
                          <span className="text-right font-medium">
                            {formatearMoneda(calcularCuotas().pagoPorCuota)}
                          </span>

                          <span className="text-muted-foreground">
                            Interés:
                          </span>
                          <span className="text-right">
                            {selectedRecord.interes}%
                          </span>

                          <div className="col-span-2 border-t my-1"></div>

                          <span className="font-semibold">
                            Total con Interés:
                          </span>
                          <span className="text-right font-bold text-green-600">
                            {formatearMoneda(
                              calcularCuotas().montoTotalConInteres
                            )}
                          </span>

                          <span className="font-semibold">Pagado:</span>
                          <span
                            className={`text-right font-bold ${
                              selectedRecord.totalPagado <
                              calcularCuotas().montoTotalConInteres
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatearMoneda(selectedRecord.totalPagado)}
                          </span>

                          <span className="font-semibold mt-1">
                            Saldo Pendiente:
                          </span>
                          <span className="text-right font-bold text-red-500 text-base mt-1">
                            {formatearMoneda(
                              selectedRecord.montoTotalConInteres -
                                selectedRecord.totalPagado
                            )}
                          </span>

                          <div className="col-span-2 mt-2 pt-2 border-t flex justify-between items-center">
                            <span className="text-muted-foreground text-xs">
                              Estado:
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                selectedRecord.estado === "COMPLETADA"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {selectedRecord.estado}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* COLUMNA 3: PRODUCTOS Y ADMIN */}
                  <div className="space-y-3">
                    <Card>
                      <CardHeader className="p-3 pb-2 bg-muted/20">
                        <CardTitle className="text-sm font-semibold flex items-center">
                          <Package className="mr-2 h-4 w-4" /> Productos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {/* Lista compacta tipo tabla */}
                        <div className="max-h-[200px] overflow-y-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                              <tr>
                                <th className="p-2 font-medium">Prod</th>
                                <th className="p-2 font-medium">Cant</th>
                                <th className="p-2 font-medium text-right">
                                  Precio
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedRecord.productos.map((p) => (
                                <tr
                                  key={p.id}
                                  className="border-b last:border-0"
                                >
                                  <td className="p-2">
                                    <div className="font-medium">
                                      {p.producto.nombre}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                      {p.producto.codigoProducto}
                                    </div>
                                  </td>
                                  <td className="p-2">{p.cantidad}</td>
                                  <td className="p-2 text-right">
                                    {formatearMoneda(p.precioVenta)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Info Admin Fusionada */}
                    <Card>
                      <CardHeader className="p-3 pb-2 bg-muted/20">
                        <CardTitle className="text-sm font-semibold flex items-center">
                          <Building2 className="mr-2 h-4 w-4" /> Datos Internos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Sucursal:
                          </span>
                          <span className="font-medium">
                            {selectedRecord.sucursal.nombre}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Vendedor:
                          </span>
                          <span className="font-medium">
                            {selectedRecord.usuario.nombre}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha:</span>
                          <span>
                            {FormatearFecha(selectedRecord.fechaInicio)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* ZONA INFERIOR: COMENTARIOS Y TABLA DE CUOTAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card>
                    <CardHeader className="p-3 pb-2 bg-muted/20">
                      <CardTitle className="text-sm font-semibold flex items-center">
                        <MessageSquareText className="mr-2 h-4 w-4" />{" "}
                        Comentarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 text-sm min-h-[80px]">
                      <p className="text-muted-foreground italic text-xs">
                        {selectedRecord.comentario ||
                          "Sin comentarios registrados."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Asumiendo que CuotasCard puede renderizarse aquí o lo pones full width abajo */}
                  <div className="border rounded-md p-2">
                    {/* Envuelto en un div simple para que no ocupe tanto padding si el componente trae Card interno */}
                    <CuotasCard cuotas={selectedRecord.cuotas} />
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setOpenCloseCredito} open={openCloseCredito}>
        <DialogContent /* ... */>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center justify-center">
              <AlertTriangle className="h-6 w-6" />
              {/** título dinámico */}
              {records.find((r) => r.id === selectedID)?.estado === "ACTIVA"
                ? "Finalización de crédito"
                : "Activación de crédito"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <DialogDescription className=" text-center">
              {records.find((r) => r.id === selectedID)?.estado === "ACTIVA"
                ? "¿Estás seguro de que deseas cerrar este registro?"
                : "¿Estás seguro de que deseas activar este registro?"}
            </DialogDescription>
          </div>

          <DialogFooter /* ... */>
            <Button
              variant="destructive"
              onClick={handleCloseCredito} // sigue usando el mismo handler
            >
              <Trash2 className="h-4 w-4" />
              {records.find((r) => r.id === selectedID)?.estado === "ACTIVA"
                ? "Sí, cerrar registro"
                : "Sí, activar registro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setOpenDeleteCredit} open={openDeleteCredit}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center justify-center">
              <AlertTriangle className="h-6 w-6" />
              Eliminación de registro de crédito
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <DialogDescription className=" text-center">
              ¿Estás seguro de que deseas eliminar este registro?
            </DialogDescription>
            <DialogDescription className=" font-semibold text-center">
              Esta acción es irreversible y el saldo será descontado de la
              sucursal.
            </DialogDescription>
            <div className="relative">
              <Input
                type="password"
                placeholder="Ingrese su contraseña para confirmar"
                value={passwordAdmin}
                onChange={(e) => setPasswordAdmin(e.target.value)}
                className="pr-12" // Espacio para el icono
                aria-label="Contraseña de confirmación"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteCredit(false)}
              className="w-full sm:w-1/2 order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCreditRegist}
              disabled={!passwordAdmin.trim()}
              className="w-full sm:w-1/2 order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Sí, eliminar registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="w-full flex justify-center items-center">
        <div className="flex items-center justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button onClick={() => onPageChange(1)}>Primero</Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationPrevious>
              </PaginationItem>

              {/* Sistema de truncado */}
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-muted-foreground">...</span>
                  </PaginationItem>
                </>
              )}

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                if (
                  page === currentPage ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {currentPage < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <span className="text-muted-foreground">...</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => onPageChange(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationNext>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant={"destructive"}
                  onClick={() => onPageChange(totalPages)}
                >
                  Último
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardFooter>
    </Card>
  );
}
