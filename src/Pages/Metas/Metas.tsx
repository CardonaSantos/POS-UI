import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
  AlertTriangle,
  ArrowDownIcon,
  ArrowUpIcon,
  Banknote,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  Delete,
  Edit,
  FileText,
  Lock,
  MoreVertical,
  Percent,
  Store,
  Target,
  TargetIcon,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SelectComponent, { SingleValue } from "react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";

import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear"; // ES 2015
import advancedFormat from "dayjs/plugin/advancedFormat"; // ES 2015
import currency from "currency.js";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressBullet } from "@/components/ui/progress";

dayjs.extend(advancedFormat);
dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

const API_URL = import.meta.env.VITE_API_URL;
interface MetaCobros {
  id: number; // ID de la meta
  usuarioId: number; // ID del usuario al que pertenece la meta
  sucursalId: number; // ID de la sucursal asociada a la meta
  fechaCreado: string; // Fecha de creación de la meta (ISO 8601)
  fechaInicio: string; // Fecha de inicio de la meta (ISO 8601)
  fechaFin: string; // Fecha de fin de la meta (ISO 8601)
  montoMeta: number; // Monto objetivo de la meta
  montoActual: number; // Monto acumulado actual
  cumplida: boolean; // Indica si la meta fue cumplida
  fechaCumplida: string | null; // Fecha en que se cumplió la meta, si aplica
  numeroDepositos: number; // Número de depósitos asociados a la meta
  tituloMeta: string; // Título descriptivo de la meta
  DepositoCobro: DepositoCobro[]; // Lista de depósitos asociados a la meta
  sucursal: Sucursal; // Información de la sucursal
  usuario: Usuario; // Información del usuario
  estado: EstadoMetaCobro;
}

enum EstadoMetaCobro {
  CANCELADO = "CANCELADO",
  ABIERTO = "ABIERTO",
  FINALIZADO = "FINALIZADO",
  CERRADO = "CERRADO",
}

interface DepositoCobro {
  id: number; // ID del depósito
  usuarioId: number; // ID del usuario que realizó el depósito
  sucursalId: number; // ID de la sucursal asociada al depósito
  numeroBoleta: string; // Número de boleta o comprobante del depósito
  fechaRegistro: string; // Fecha de registro del depósito (ISO 8601)
  montoDepositado: number; // Monto del depósito realizado
  descripcion: string; // Descripción adicional del depósito
  metaCobroId: number; // ID de la meta a la que está asociado el depósito
}

interface Sucursal {
  id: number; // ID de la sucursal
  nombre: string; // Nombre de la sucursal
  direccion: string; // Dirección de la sucursal
  telefono: string; // Teléfonos de contacto
  pbx: string; // PBX de la sucursal
}

interface Usuario {
  id: number; // ID del usuario
  nombre: string; // Nombre del usuario
  rol: string; // Rol del usuario (por ejemplo, ADMIN, VENDEDOR, etc.)
}

enum EstadoMetaTienda {
  CANCELADO = "CANCELADO",
  ABIERTO = "ABIERTO",
  FINALIZADO = "FINALIZADO",
  CERRADO = "CERRADO",
}
enum EstadoMetaSelect {
  CANCELADO = "CANCELADO",
  CERRADO = "CERRADO",
  ABIERTO = "ABIERTO",
  // FINALIZADO = "FINALIZADO",
}

enum EstadoMetaSelectCumplida {
  CERRADO = "CERRADO",
  CANCELADO = "CANCELADO",
}

//INTERFACES PARA METAS DE TIENDAS
// Interfaz principal para la meta de ventas o tienda
interface MetaTienda {
  id: number; // ID único de la meta
  cumplida: boolean; // Indica si la meta ha sido cumplida
  fechaCumplida: string | null; // Fecha en que se cumplió la meta, si aplica
  fechaFin: string; // Fecha de finalización de la meta (ISO 8601)
  fechaInicio: string; // Fecha de inicio de la meta (ISO 8601)
  montoActual: number; // Progreso actual del monto
  montoMeta: number; // Monto objetivo de la meta
  numeroVentas: number; // Número total de ventas realizadas
  sucursalId: number; // ID de la sucursal asociada
  tituloMeta: string; // Título o descripción de la meta
  usuarioId: number; // ID del usuario asociado a la meta
  sucursal: SucursalMetaTiendas; // Detalles de la sucursal asociada
  usuario: UsuarioMetaTiendas; // Detalles del usuario asociado

  estado: EstadoMetaTienda;
}

// Interfaz para la sucursal
interface SucursalMetaTiendas {
  id: number; // ID único de la sucursal
  nombre: string; // Nombre de la sucursal
  telefono: string; // Teléfono(s) de la sucursal
  direccion: string; // Dirección de la sucursal
}

// Interfaz para el usuario
interface UsuarioMetaTiendas {
  id: number; // ID único del usuario
  nombre: string; // Nombre del usuario
  correo: string; // Correo electrónico del usuario
  rol: string; // Rol del usuario (e.g., ADMIN, VENDEDOR, etc.)
}

type TipoMeta = "Tienda" | "Cobro"; // Tipo literal para restringir los valores posibles

interface MetaInterfaceDTO {
  usuarioId: number | null;
  tipoMeta: TipoMeta;
  tituloMeta: string;
  montoMeta: number;
  fechaFin: string;
  sucursalId: number;
}

interface UsuarioSucursal {
  id: number; // ID único del usuario
  nombre: string; // Nombre completo del usuario
  correo: string; // Correo electrónico del usuario
  sucursal: Sucursal; // Relación con la sucursal
}

interface Sucursal {
  id: number; // ID único de la sucursal
  nombre: string; // Nombre de la sucursal
}

interface OptionSelected {
  value: number;
  label: string;
}

interface EditMetaTiendaDialogProps {
  open: boolean;
  getMetasTienda: () => void;

  onClose: () => void;
  metaTienda: MetaTienda | null;
  // onUpdate: (updatedMeta: MetaTienda) => void; // Función para actualizar
}

interface EditMetaCobro {
  open: boolean;
  getMetasCobros: () => void;
  onClose: () => void;
  metaCobro: MetaCobros | null;
}

function Metas() {
  const userId = useStore((state) => state.userId) ?? 0;
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;

  const [metasCobros, setMetasCobros] = useState<MetaCobros[]>([]);
  const [metasTienda, setMetasTienda] = useState<MetaTienda[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSucursal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openUpdateMetaTienda, setOpenUpdateMetaTienda] = useState(false);
  const [openUpdateMetaCobro, setOpenUpdateMetaCobro] = useState(false);

  const [metaTiendaSelected, setMetaTiendaSelected] =
    useState<MetaTienda | null>(null);
  const [metaCobroSelected, setMetaCobroSelected] = useState<MetaCobros | null>(
    null
  );

  const [metasCobrosSummary, setMetasCobrosSummary] = useState<MetaCobros[]>(
    []
  );
  const [metasTiendaSummary, setMetasTiendaSummary] = useState<MetaTienda[]>(
    []
  );

  const [metaDto, setMetaDto] = useState<MetaInterfaceDTO>({
    usuarioId: 0,
    tipoMeta: "Tienda",
    tituloMeta: "",
    montoMeta: 0,
    fechaFin: "",
    sucursalId: sucursalId,
  });
  console.log("setstate: ", setSearchTerm);

  // ──────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────────────────────────────
  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);
  const safePercent = (num: number, den: number) =>
    den > 0 ? (num / den) * 100 : 0;

  const formatearMoneda = (monto: number) =>
    currency(monto, {
      symbol: "Q",
      separator: ",",
      decimal: ".",
      precision: 2,
    }).format();

  /** % del mes actual transcurrido (0..100) */
  const calcularReferenciaMes = () => {
    const hoy = dayjs();
    const totalDiasMes = hoy.daysInMonth();
    const diaActual = hoy.date();
    return (diaActual / totalDiasMes) * 100;
  };

  /** % del avance temporal de una meta según su ventana (0..100) */
  const refPctMeta = (inicioISO: string, finISO: string) => {
    const start = dayjs(inicioISO);
    const end = dayjs(finISO);
    const now = dayjs();
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) return 0;
    if (now.isSame(end) || now.isAfter(end)) return 100;
    if (now.isSame(start) || now.isBefore(start)) return 0;
    const pct =
      (now.diff(start, "millisecond") / end.diff(start, "millisecond")) * 100;
    return clamp(pct, 0, 100);
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // API calls
  // ──────────────────────────────────────────────────────────────────────────────
  const getMetasCobros = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/metas/get-all-cobros-metas/${sucursalId}`
      );
      if (response.status === 200) setMetasCobros(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los registros de metas de cobros");
    }
  };

  const getMetasTienda = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/metas/get-all-seller-goals/${sucursalId}`
      );
      if (response.status === 200) setMetasTienda(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los registros de metas de tiendas");
    }
  };

  const getMetasToSummary = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/metas/get-all-metas-to-summary`
      );
      if (response.status === 200) {
        setMetasTiendaSummary(response.data.metasTienda);
        setMetasCobrosSummary(response.data.metasCobros);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los registros de metas de tiendas");
    }
  };

  const getUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/metas/get-all-metas-users`);
      if (response.status === 200) setUsuarios(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar los usuarios");
    }
  };

  useEffect(() => {
    if (sucursalId) {
      getMetasCobros();
      getMetasTienda();
      getUsuarios();
      getMetasToSummary();
    }
  }, [sucursalId]);

  // ──────────────────────────────────────────────────────────────────────────────
  // Filtros y selects
  // ──────────────────────────────────────────────────────────────────────────────
  const filteredMetasTienda = metasTienda.filter(
    (meta) =>
      (meta.tituloMeta ? meta.tituloMeta.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      meta.sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMetasCobros = metasCobros.filter(
    (meta) =>
      (meta.tituloMeta ? meta.tituloMeta.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      meta.sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const optionsUsuarios = usuarios.map((user) => ({
    value: user.id,
    label: `${user.nombre} (${user.sucursal.nombre})`,
  }));

  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState<OptionSelected | null>(null);

  const handleChangeUser = (op: SingleValue<OptionSelected>) => {
    setOpcionSeleccionada(op);
    setMetaDto((prev) => ({
      ...prev,
      usuarioId: op?.value ?? null,
    }));
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Crear meta
  // ──────────────────────────────────────────────────────────────────────────────
  const handleSubmitGoal = async () => {
    try {
      const { usuarioId, tipoMeta, fechaFin, montoMeta } = metaDto;
      if (!usuarioId || !tipoMeta || !fechaFin || !montoMeta) {
        toast.info("Faltan datos para continuar");
        return;
      }
      const user = usuarios.find((u) => u.id === usuarioId);
      const endpoint =
        tipoMeta === "Tienda"
          ? `${API_URL}/metas`
          : `${API_URL}/metas/regist-new-meta-cobros`;

      const requestBody = {
        usuarioId,
        tipoMeta,
        tituloMeta: metaDto.tituloMeta || null,
        montoMeta,
        fechaFin: new Date(fechaFin),
        sucursalId: sucursalId,
      };

      const response = await axios.post(endpoint, requestBody);
      if (response.status === 201) {
        toast.success(`Meta registrada para el usuario ${user?.nombre}`);
        resetForm();
        getMetasCobros();
        getMetasTienda();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        metaDto.tipoMeta === "Tienda"
          ? "Error al crear meta de tienda"
          : "Error al crear meta de cobros"
      );
    }
  };

  const resetForm = () => {
    setMetaDto({
      usuarioId: null,
      tipoMeta: "Tienda",
      tituloMeta: "",
      montoMeta: 0,
      fechaFin: "",
      sucursalId: sucursalId,
    });
    setOpcionSeleccionada(null);
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Depósitos (Cobros)
  // ──────────────────────────────────────────────────────────────────────────────
  const [openDepositosDialog, setOpenDepositosDialog] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<MetaCobros>();
  const handleOpenDepositos = (meta: MetaCobros) => {
    setSelectedMeta(meta);
    setOpenDepositosDialog(true);
  };

  const [openDeletDepo, setOpenDeletDepo] = useState(false);
  const [selectedDepo, setSelectedDepo] = useState<DepositoCobro>();

  const onConfirmDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${API_URL}/metas/delete-one-payment/${selectedMeta?.id}/${id}`
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Depósito eliminado correctamente");
        setOpenDeletDepo(false);
        setOpenDepositosDialog(false);
        getMetasCobros();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar registro");
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Eliminación de metas
  // ──────────────────────────────────────────────────────────────────────────────
  const [openDeleteCobro, setOpenDeleteCobro] = useState(false);
  const [CobroToDelete, setCobroToDelete] = useState(0);
  const [passwordAdminCobro, setPasswordAdminCobro] = useState("");

  const [openDeleteG, setOpenDeleteG] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(0);
  const [passwordAdmin, setPasswordAdmin] = useState("");

  const handleDeleteMeta = async () => {
    try {
      if (!goalToDelete || !userId || !passwordAdmin || goalToDelete <= 0) {
        toast.info("Faltan datos para completar la acción");
        return;
      }
      const response = await axios.delete(
        `${API_URL}/metas/delete-one-goal/${goalToDelete}/${userId}`,
        { data: { passwordAdmin } }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Registro de meta eliminado");
        getMetasTienda();
        setOpenDeleteG(false);
        setPasswordAdmin("");
        setGoalToDelete(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el registro");
    }
  };

  const handleDeleteCobro = async () => {
    try {
      if (
        !CobroToDelete ||
        !userId ||
        !passwordAdminCobro ||
        CobroToDelete <= 0
      ) {
        toast.info("Faltan datos para completar la acción");
        return;
      }
      const response = await axios.delete(
        `${API_URL}/metas/delete-one-cobro-goal/${CobroToDelete}/${userId}`,
        { data: { passwordAdmin: passwordAdminCobro } }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Registro de meta eliminado");
        getMetasCobros();
        setOpenDeleteCobro(false);
        setPasswordAdminCobro("");
        setCobroToDelete(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el registro");
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Agregaciones y % seguros
  // ──────────────────────────────────────────────────────────────────────────────
  // COBROS
  const getMetasCobroTotal = () =>
    metasCobrosSummary.reduce((acc, meta) => acc + meta.montoMeta, 0);

  const getMetasCobroAvance = () =>
    metasCobrosSummary.reduce((acc, meta) => acc + meta.montoActual, 0);

  const getMetasCobroRestante = () =>
    Math.max(0, getMetasCobroTotal() - getMetasCobroAvance());

  const getPercentMetaCobro = () =>
    safePercent(getMetasCobroAvance(), getMetasCobroTotal());

  // TIENDAS
  const getMetasTiendaTotal = () =>
    metasTiendaSummary.reduce((acc, meta) => acc + meta.montoMeta, 0);

  const getMetasTiendaAvance = () =>
    metasTiendaSummary.reduce((acc, meta) => acc + meta.montoActual, 0);

  const getMetasTiendaRestante = () =>
    Math.max(0, getMetasTiendaTotal() - getMetasTiendaAvance());

  const getPercentTiendaCobro = () =>
    safePercent(getMetasTiendaAvance(), getMetasTiendaTotal());

  // COMBINADAS
  const metaTotal = getMetasCobroTotal() + getMetasTiendaTotal();
  const avanceTotal = getMetasCobroAvance() + getMetasTiendaAvance();
  const percentCombinado = safePercent(avanceTotal, metaTotal);

  // ──────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="asignar" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 ">
          <TabsTrigger value="asignar">
            <Target className="w-4 h-4 mr-2" />
            Asignar Metas
          </TabsTrigger>
          <TabsTrigger value="tiendas">
            <Store className="w-4 h-4 mr-2" />
            Metas de Tiendas
          </TabsTrigger>
          <TabsTrigger value="cobros" className="truncate">
            <CreditCard className="w-4 h-4 mr-2" />
            Metas de Cobros
          </TabsTrigger>
          <TabsTrigger value="totales">
            <CreditCard className="w-4 h-4 mr-2" />
            Totales
          </TabsTrigger>
        </TabsList>

        {/* ─────────────── Asignar ─────────────── */}
        <TabsContent value="asignar">
          <Card>
            <CardHeader>
              <CardTitle>Asignar Metas</CardTitle>
              <CardDescription>
                Asigna metas a usuarios y cobradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuario</Label>
                    <SelectComponent
                      isClearable
                      className="text-black"
                      placeholder="Seleccione un usuario"
                      id="usuario"
                      value={opcionSeleccionada}
                      options={optionsUsuarios}
                      onChange={handleChangeUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoMeta">Tipo de Meta</Label>
                    <Select
                      value={metaDto.tipoMeta}
                      onValueChange={(value: TipoMeta) =>
                        setMetaDto((prev) => ({ ...prev, tipoMeta: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={metaDto.tipoMeta} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tienda">Tienda</SelectItem>
                        <SelectItem value="Cobro">Cobro</SelectItem>
                      </SelectContent>
                    </Select>
                    {metaDto.tipoMeta && (
                      <p className="text-sm">
                        La meta seleccionada es de {metaDto.tipoMeta}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titulo">Titulo de la meta</Label>
                    <Input
                      value={metaDto.tituloMeta || ""}
                      onChange={(e) =>
                        setMetaDto((prev) => ({
                          ...prev,
                          tituloMeta: e.target.value,
                        }))
                      }
                      id="titulo"
                      placeholder="Meta del mes de enero 2025 (opcional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="montoMeta">Monto de la Meta</Label>
                    <Input
                      value={metaDto.montoMeta}
                      onChange={(e) =>
                        setMetaDto((prev) => ({
                          ...prev,
                          montoMeta: Number(e.target.value),
                        }))
                      }
                      id="montoMeta"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha Límite</Label>
                    <Input
                      value={metaDto.fechaFin}
                      onChange={(e) =>
                        setMetaDto((prev) => ({
                          ...prev,
                          fechaFin: e.target.value,
                        }))
                      }
                      id="fechaFin"
                      type="date"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  onClick={handleSubmitGoal}
                >
                  Asignar Meta
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────── Tiendas ─────────────── */}
        <TabsContent value="tiendas">
          <Card>
            <div className="flex gap-2 flex-col md:flex-row">
              <Card className="shadow-sm w-full m-2">
                <CardHeader className="py-1 px-4">
                  <CardTitle className="text-sm">
                    Resumen de metas de tiendas
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Meta total
                      </span>
                      <div className="flex items-center">
                        <TargetIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-bold">
                          {formatearMoneda(getMetasTiendaTotal())}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Avance
                      </span>
                      <div className="flex items-center">
                        <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                        <span className="text-sm font-bold">
                          {formatearMoneda(getMetasTiendaAvance())}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Faltante
                      </span>
                      <div className="flex items-center">
                        <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                        <span className="text-sm font-bold">
                          {formatearMoneda(getMetasTiendaRestante())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Progreso</span>
                      <span className="text-xs font-medium">
                        {getPercentTiendaCobro().toFixed(2)}%
                      </span>
                    </div>
                    <ProgressBullet
                      metaQ={getMetasTiendaTotal()}
                      actualQ={getMetasTiendaAvance()}
                      refPct={calcularReferenciaMes()} // 👈 agrega esto
                      className="h-6"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="py-2 text-lg font-semibold px-2 text-center">
              Metas de Tiendas
            </h2>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="h-5">
                      <TableHead className="py-0">Título</TableHead>
                      <TableHead className="py-0">Usuario</TableHead>
                      <TableHead className="py-0">Meta</TableHead>
                      <TableHead className="py-0">Actual</TableHead>
                      <TableHead className="py-0">Faltante</TableHead>
                      <TableHead className="py-0">%</TableHead>
                      <TableHead className="py-0">Ref.</TableHead>
                      <TableHead className="py-0">Dif.</TableHead>
                      <TableHead className="py-0">Estado</TableHead>
                      <TableHead className="py-0 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[0.8rem]">
                    {filteredMetasTienda.map((meta) => {
                      const porcentaje = safePercent(
                        meta.montoActual,
                        meta.montoMeta
                      );
                      const referencia = refPctMeta(
                        meta.fechaInicio,
                        meta.fechaFin
                      );
                      const diferencia = porcentaje - referencia;

                      return (
                        <TableRow key={meta.id} className="h-8">
                          <TableCell className="py-0">
                            {meta.tituloMeta || ""}
                          </TableCell>
                          <TableCell className="py-0">
                            {meta.usuario.nombre}
                          </TableCell>
                          <TableCell className="py-0">
                            {formatearMoneda(meta.montoMeta)}
                          </TableCell>
                          <TableCell className="py-0">
                            {formatearMoneda(meta.montoActual)}
                          </TableCell>
                          <TableCell className="py-0">
                            {formatearMoneda(
                              Math.max(0, meta.montoMeta - meta.montoActual)
                            )}
                          </TableCell>

                          <TableCell className="py-0">
                            <div className="flex items-center gap-1">
                              <Percent
                                className={`w-3 h-3 ${
                                  porcentaje >= 70
                                    ? "text-green-500"
                                    : porcentaje >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              <span>{porcentaje.toFixed(0)}%</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-0">
                            <div className="flex items-center gap-1">
                              <Clock
                                className={`w-3 h-3 ${
                                  referencia >= 70
                                    ? "text-green-500"
                                    : referencia >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              <span>{referencia.toFixed(0)}%</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-0">
                            <div className="flex items-center gap-1">
                              {diferencia >= 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              )}
                              <span
                                className={
                                  diferencia >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {Math.abs(diferencia).toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="py-0">
                            {meta.estado === EstadoMetaTienda.FINALIZADO ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="w-3 h-3" />
                                <span>Cumplida</span>
                              </div>
                            ) : meta.estado === EstadoMetaTienda.CERRADO ? (
                              <div className="flex items-center gap-1 text-violet-500">
                                <XCircle className="w-3 h-3" />
                                <span>Cerrada</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Clock className="w-3 h-3" />
                                <span>En progreso</span>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="py-0 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreVertical className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-36 shadow-lg rounded-md border border-gray-200"
                              >
                                <DropdownMenuItem
                                  onClick={() => {
                                    setOpenUpdateMetaTienda(true);
                                    setMetaTiendaSelected(meta);
                                  }}
                                  className="flex items-center gap-2 hover:bg-gray-100 text-xs py-1"
                                >
                                  <Edit className="h-3 w-3 text-blue-500" />
                                  <span>Actualizar</span>
                                </DropdownMenuItem>
                                <div className="h-px bg-gray-200 my-0.5" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setGoalToDelete(meta.id);
                                    setOpenDeleteG(true);
                                  }}
                                  className="flex items-center gap-2 text-red-500 hover:bg-red-100 text-xs py-1"
                                >
                                  <Delete className="h-3 w-3" />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────── Cobros ─────────────── */}
        <TabsContent value="cobros">
          <Card>
            <div className="flex gap-2 flex-col md:flex-row">
              <Card className="shadow-sm w-full m-2">
                <CardHeader className="py-1 px-4">
                  <CardTitle className="text-sm">
                    Resumen de metas de cobros
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Meta total
                      </span>
                      <div className="flex items-center">
                        <TargetIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-bold">
                          {formatearMoneda(getMetasCobroTotal())}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Avance
                      </span>
                      <div className="flex items-center">
                        <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                        <span className="text-sm font-bold">
                          {formatearMoneda(getMetasCobroAvance())}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Faltante
                      </span>
                      <div className="flex items-center">
                        <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                        <span className="text-sm font-bold">
                          {formatearMoneda(getMetasCobroRestante())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Progreso</span>
                      <span className="text-xs font-medium">
                        {getPercentMetaCobro().toFixed(2)}%
                      </span>
                    </div>
                    <ProgressBullet
                      metaQ={getMetasCobroTotal()}
                      actualQ={getMetasCobroAvance()}
                      refPct={calcularReferenciaMes()}
                      className="h-6"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="py-2 text-lg font-semibold px-2 text-center">
              Metas de Cobros
            </h2>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="h-5">
                      <TableHead className="py-0">Título</TableHead>
                      <TableHead className="py-0">Usuario</TableHead>
                      <TableHead className="py-0">Meta</TableHead>
                      <TableHead className="py-0">Actual</TableHead>
                      <TableHead className="py-0">Faltante</TableHead>
                      <TableHead className="py-0">%</TableHead>
                      <TableHead className="py-0">Ref.</TableHead>
                      <TableHead className="py-0">Dif.</TableHead>
                      <TableHead className="py-0">Estado</TableHead>
                      <TableHead className="py-0 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[0.8rem]">
                    {filteredMetasCobros.map((meta) => {
                      const porcentaje = safePercent(
                        meta.montoActual,
                        meta.montoMeta
                      );
                      const referencia = refPctMeta(
                        meta.fechaInicio,
                        meta.fechaFin
                      );
                      const diferencia = porcentaje - referencia;

                      return (
                        <TableRow key={meta.id} className="h-8">
                          <TableCell className="py-0">
                            {meta.tituloMeta || "Sin título"}
                          </TableCell>
                          <TableCell className="py-0">
                            {meta.usuario.nombre}
                          </TableCell>
                          <TableCell className="py-0">
                            {formatearMoneda(meta.montoMeta)}
                          </TableCell>
                          <TableCell className="py-0">
                            {formatearMoneda(meta.montoActual)}
                          </TableCell>
                          <TableCell className="py-0">
                            {formatearMoneda(
                              Math.max(0, meta.montoMeta - meta.montoActual)
                            )}
                          </TableCell>

                          <TableCell className="py-0">
                            <div className="flex items-center gap-1">
                              <Percent
                                className={`w-3 h-3 ${
                                  porcentaje >= 70
                                    ? "text-green-500"
                                    : porcentaje >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              <span>{porcentaje.toFixed(0)}%</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-0">
                            <div className="flex items-center gap-1">
                              <Clock
                                className={`w-3 h-3 ${
                                  referencia >= 70
                                    ? "text-green-500"
                                    : referencia >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              <span>{referencia.toFixed(0)}%</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-0">
                            <div className="flex items-center gap-1">
                              {diferencia >= 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              )}
                              <span
                                className={
                                  diferencia >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {Math.abs(diferencia).toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="py-0">
                            {meta.estado === EstadoMetaCobro.FINALIZADO ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="w-3 h-3" />
                                <span>Cumplida</span>
                              </div>
                            ) : meta.estado === EstadoMetaCobro.CERRADO ? (
                              <div className="flex items-center gap-1 text-violet-500">
                                <XCircle className="w-3 h-3" />
                                <span>Cerrada</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Clock className="w-3 h-3" />
                                <span>En progreso</span>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="py-0 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreVertical className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="end"
                                className="w-36 shadow-lg rounded-md border border-gray-200"
                              >
                                <DropdownMenuItem
                                  onClick={() => handleOpenDepositos(meta)}
                                  className="flex items-center gap-2 hover:bg-gray-100 text-xs py-1"
                                >
                                  <Coins className="h-3 w-3 text-yellow-500" />
                                  <span>Depósitos</span>
                                </DropdownMenuItem>

                                <div className="h-px bg-gray-200 my-0.5" />

                                <DropdownMenuItem
                                  onClick={() => {
                                    setMetaCobroSelected(meta);
                                    setOpenUpdateMetaCobro(true);
                                  }}
                                  className="flex items-center gap-2 hover:bg-gray-100 text-xs py-1"
                                >
                                  <Edit className="h-3 w-3 text-blue-500" />
                                  <span>Actualizar</span>
                                </DropdownMenuItem>

                                <div className="h-px bg-gray-200 my-0.5" />

                                <DropdownMenuItem
                                  onClick={() => {
                                    setCobroToDelete(meta.id);
                                    setOpenDeleteCobro(true);
                                  }}
                                  className="flex items-center gap-2 text-red-500 hover:bg-red-100 text-xs py-1"
                                >
                                  <Delete className="h-3 w-3" />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Dialog depósitos */}
              <Dialog
                open={openDepositosDialog}
                onOpenChange={setOpenDepositosDialog}
              >
                {selectedMeta && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Depósitos de{" "}
                        {selectedMeta.tituloMeta ? selectedMeta.tituloMeta : ""}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      {selectedMeta.DepositoCobro.length > 0 ? (
                        <div className="space-y-4">
                          {selectedMeta.DepositoCobro.map((deposito) => (
                            <div
                              key={deposito.id}
                              className="bg-muted rounded-lg p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Banknote className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">
                                    Boleta: {deposito.numeroBoleta}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => {
                                    setSelectedDepo(deposito);
                                    setOpenDeletDepo(true);
                                  }}
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label={`Eliminar depósito ${deposito.numeroBoleta}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Coins className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {formatearMoneda(deposito.montoDepositado)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {new Date(
                                    deposito.fechaRegistro
                                  ).toLocaleString()}
                                </span>
                              </div>
                              {deposito.descripcion && (
                                <div className="flex items-start space-x-2">
                                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                                  <p className="text-sm">
                                    {deposito.descripcion}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No hay depósitos registrados.
                        </p>
                      )}
                    </ScrollArea>
                    <DialogFooter>
                      <Button
                        onClick={() => setOpenDepositosDialog(false)}
                        className="w-full sm:w-auto"
                      >
                        Cerrar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Eliminar depósito */}
              <Dialog open={openDeletDepo} onOpenChange={setOpenDeletDepo}>
                {selectedDepo && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Confirmar Eliminación
                      </DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar el depósito con
                        boleta número {selectedDepo?.numeroBoleta}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => onConfirmDelete(selectedDepo.id)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setOpenDeletDepo(false)}
                      >
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────── Totales ─────────────── */}
        <TabsContent value="totales">
          {/* Resumen de metas de cobros */}
          <Card className="my-1 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                Resumen de metas de cobros
              </CardTitle>
              <CardDescription className="text-xs">
                Avance de todas las metas de cobro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Meta total
                  </span>
                  <div className="flex items-center">
                    <TargetIcon className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(getMetasCobroTotal())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Avance</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="mr-2 h-3 w-3 text-green-500" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(getMetasCobroAvance())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Faltante
                  </span>
                  <div className="flex items-center">
                    <ArrowDownIcon className="mr-2 h-3 w-3 text-red-500" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(getMetasCobroRestante())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Progreso</span>
                  <span className="text-xs font-medium">
                    {getPercentMetaCobro().toFixed(2)}%
                  </span>
                </div>
                {/* ⚠️ Aquí va SOLO COBROS */}
                <ProgressBullet
                  metaQ={getMetasCobroTotal()}
                  actualQ={getMetasCobroAvance()}
                  refPct={calcularReferenciaMes()}
                  className="h-6"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen de metas de tiendas */}
          <Card className="my-1 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                Resumen de metas de tiendas
              </CardTitle>
              <CardDescription className="text-xs">
                Avance de todas las metas de tienda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Meta total
                  </span>
                  <div className="flex items-center">
                    <TargetIcon className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(getMetasTiendaTotal())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Avance</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="mr-2 h-3 w-3 text-green-500" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(getMetasTiendaAvance())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Faltante
                  </span>
                  <div className="flex items-center">
                    <ArrowDownIcon className="mr-2 h-3 w-3 text-red-500" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(getMetasTiendaRestante())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Progreso</span>
                  <span className="text-xs font-medium">
                    {getPercentTiendaCobro().toFixed(2)}%
                  </span>
                </div>
                <ProgressBullet
                  metaQ={getMetasTiendaTotal()}
                  actualQ={getMetasTiendaAvance()}
                  refPct={calcularReferenciaMes()}
                  className="h-6"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen de metas combinadas */}
          <Card className="my-1 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                Resumen de metas combinadas
              </CardTitle>
              <CardDescription className="text-xs">
                Avance de todas las metas de cobro y tienda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Meta total
                  </span>
                  <div className="flex items-center">
                    <TargetIcon className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(metaTotal)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Avance</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="mr-2 h-3 w-3 text-green-500" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(avanceTotal)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Faltante
                  </span>
                  <div className="flex items-center">
                    <ArrowDownIcon className="mr-2 h-3 w-3 text-red-500" />
                    <span className="text-base font-semibold">
                      {formatearMoneda(Math.max(0, metaTotal - avanceTotal))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Progreso</span>
                  <span className="text-xs font-medium">
                    {percentCombinado.toFixed(2)}%
                  </span>
                </div>
                <ProgressBullet
                  metaQ={metaTotal}
                  actualQ={avanceTotal}
                  refPct={calcularReferenciaMes()}
                  className="h-6"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─────────────── Dialogs eliminación ─────────────── */}
      <Dialog open={openDeleteG} onOpenChange={setOpenDeleteG}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center">
              <p className="text-center">Confirmación de eliminación de meta</p>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Estás seguro de eliminar este registro? Esta acción no se puede
              deshacer.
            </p>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Input
                  onChange={(e) => setPasswordAdmin(e.target.value)}
                  value={passwordAdmin}
                  placeholder="Introduzca su contraseña de administrador"
                  type="password"
                  className="pl-10 pr-4 py-2"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteG(false)}
                className="w-full "
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteMeta}
                variant="destructive"
                className="w-full "
              >
                <Check className="mr-2 h-4 w-4" />
                Sí, eliminar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteCobro} onOpenChange={setOpenDeleteCobro}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center">
              <p className="text-center">
                Confirmación de eliminación de meta en cobros
              </p>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Estás seguro de eliminar este registro? Esta acción no se puede
              deshacer.
            </p>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Input
                  onChange={(e) => setPasswordAdminCobro(e.target.value)}
                  value={passwordAdminCobro}
                  placeholder="Introduzca su contraseña de administrador"
                  type="password"
                  className="pl-10 pr-4 py-2"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteCobro(false)}
                className="w-full "
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteCobro}
                variant="destructive"
                className="w-full "
              >
                <Check className="mr-2 h-4 w-4" />
                Sí, eliminar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edits */}
      <EditMetaTiendaDialog
        getMetasTienda={getMetasTienda}
        open={openUpdateMetaTienda}
        onClose={() => setOpenUpdateMetaTienda(false)}
        metaTienda={metaTiendaSelected}
      />
      <EditMetaCobroDialog
        getMetasCobros={getMetasCobros}
        open={openUpdateMetaCobro}
        onClose={() => setOpenUpdateMetaCobro(false)}
        metaCobro={metaCobroSelected}
      />
    </div>
  );
}

export function EditMetaTiendaDialog({
  open,
  onClose,
  metaTienda,
  getMetasTienda,
}: EditMetaTiendaDialogProps) {
  const [formData, setFormData] = useState<MetaTienda | null>(null);
  const userRol = useStore((state) => state.userRol);

  useEffect(() => {
    if (metaTienda) {
      // Clonar el objeto para evitar modificar el estado original
      setFormData({ ...metaTienda });
    }
  }, [metaTienda]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (formData) {
      try {
        const response = await axios.patch(
          `${API_URL}/metas/update-one-meta/${formData.id}`,
          {
            tituloMeta: formData.tituloMeta,
            EstadoMetaTienda: formData.estado,
            montoMeta: Number(formData.montoMeta),
            montoActual: Number(formData.montoActual),
          }
        );

        if (response.status === 200) {
          toast.success("Registro actualizado");
          // onUpdate(formData); // Enviar solo los datos editados al backend
          onClose();
          await getMetasTienda();
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al actualizar");
      }
    }
  };

  const handleChangeEstadoMetaTienda = (estado: EstadoMetaTienda) => {
    setFormData((dataPrev) =>
      dataPrev
        ? {
            ...dataPrev,
            estado: estado,
          }
        : null
    );
  };

  console.log("La data cambiando es: ", formData);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center justify-center ">
            <Edit className="h-5 w-5 text-blue-500" />
            Editar Meta de Tienda
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Título de la Meta</label>
            <Input
              name="tituloMeta"
              value={formData?.tituloMeta || ""}
              onChange={handleInputChange}
              placeholder="Título de la meta"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Monto Meta</label>
            <Input
              name="montoMeta"
              type="number"
              value={formData?.montoMeta || ""}
              onChange={handleInputChange}
              placeholder="Monto objetivo"
            />
          </div>

          {userRol == "SUPER_ADMIN" ? (
            <div>
              <label className="text-sm font-medium">Monto Actual</label>
              <Input
                name="montoActual"
                type="number"
                value={formData?.montoActual || ""}
                onChange={handleInputChange}
                placeholder="Monto objetivo"
              />
            </div>
          ) : null}

          <Select onValueChange={handleChangeEstadoMetaTienda}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={formData?.estado ?? "Seleccione un estado"}
              />
            </SelectTrigger>
            <SelectContent>
              {formData?.estado === EstadoMetaTienda.FINALIZADO
                ? Object.values(EstadoMetaSelectCumplida).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))
                : Object.values(EstadoMetaSelect).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
            className="w-full sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditMetaCobroDialog({
  open,
  onClose,
  metaCobro,
  getMetasCobros,
}: EditMetaCobro) {
  const [formDataCobro, setFormDataCobro] = useState<MetaCobros | null>(null);

  useEffect(() => {
    if (metaCobro) {
      // Clonar el objeto para evitar modificar el estado original
      setFormDataCobro({ ...metaCobro });
    }
  }, [metaCobro]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formDataCobro) return;
    const { name, value } = e.target;
    setFormDataCobro((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (formDataCobro) {
      console.log("El id del registro de cobro: ", formDataCobro.id);

      try {
        const response = await axios.patch(
          `${API_URL}/metas/update-one-meta-cobro/${formDataCobro.id}`,
          {
            tituloMeta: formDataCobro.tituloMeta,
            EstadoMetaTienda: formDataCobro.estado,
            montoMeta: formDataCobro.montoMeta,
          }
        );

        if (response.status === 200) {
          toast.success("Registro actualizado");
          // onUpdate(formData); // Enviar solo los datos editados al backend
          onClose();
          await getMetasCobros();
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al actualizar");
      }
    }
  };

  const handleChangeEstadoMetaTienda = (estado: EstadoMetaCobro) => {
    setFormDataCobro((dataPrev) =>
      dataPrev
        ? {
            ...dataPrev,
            estado: estado,
          }
        : null
    );
  };

  console.log("La data cambiando es: ", formDataCobro);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center justify-center ">
            <Edit className="h-5 w-5 text-blue-500" />
            Editar Meta de Cobros
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Título de la Meta</label>
            <Input
              name="tituloMeta"
              value={formDataCobro?.tituloMeta || ""}
              onChange={handleInputChange}
              placeholder="Título de la meta"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Monto Meta</label>
            <Input
              name="montoMeta"
              type="number"
              value={formDataCobro?.montoMeta || ""}
              onChange={handleInputChange}
              placeholder="Monto objetivo"
            />
          </div>

          <Select onValueChange={handleChangeEstadoMetaTienda}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={formDataCobro?.estado ?? "Seleccione un estado"}
              />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EstadoMetaSelect).map((estado) => (
                <SelectItem key={estado} value={estado ?? ""}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="destructive" onClick={onClose} className="w-full ">
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="default" className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Metas;
