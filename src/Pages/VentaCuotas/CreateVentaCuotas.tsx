import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Calendar,
  ClipboardList,
  CreditCard,
  DollarSign,
  Loader2,
  Package,
  Percent,
  Plus,
  Save,
  SendHorizonal,
  ShoppingCart,
  Trash,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectM, { SingleValue } from "react-select";

import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import "react-datepicker/dist/react-datepicker.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditoRegistro } from "./CreditosType";
import { CreditRecordsTable } from "./CreditosRegistros";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestigoForm {
  nombre: string;
  direccion: string;
  telefono: string;
}

interface Producto {
  productoId: number;
  cantidad: number;
  precioVenta: number;
}

interface FormData {
  clienteId: number;
  usuarioId: string;
  sucursalId: number;
  totalVenta: number;
  cuotaInicial: number;
  cuotasTotales: number;
  fechaInicio: string;
  estado: string;
  dpi: string;
  testigos: TestigoForm[];
  fechaContrato: string;
  montoVenta: number;
  garantiaMeses: string;
  productos: Producto[];
  diasEntrePagos: number;
  interes: number;
}

interface CustomersToCredit {
  id: number;
  nombre: string;
  telefono: string;
  dpi: string;
  creadoEn: string;
}

interface Precio {
  id: number;
  precio: number;
}

interface Stock {
  id: number;
  cantidad: number;
  fechaIngreso: string;
  fechaVencimiento: string | null;
}

interface ProductToCredit {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  precioCostoActual: number;
  precios: Precio[];
  stock: Stock[];
}

interface OptionTypeTS {
  label: string;
  value: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateVentaCuotaForm() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const userId = useStore((state) => state.userId) ?? 0;

  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomersToCredit[]>([]);
  const [products, setProducts] = useState<ProductToCredit[]>([]);
  const [creditos, setCreditos] = useState<CreditoRegistro[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    clienteId: 0,
    usuarioId: "",
    sucursalId: sucursalId,
    totalVenta: 0,
    cuotaInicial: 0,
    cuotasTotales: 0,
    fechaInicio: "",
    estado: "ACTIVA",
    dpi: "",
    testigos: [],
    fechaContrato: "",
    montoVenta: 0,
    garantiaMeses: "",
    productos: [],
    diasEntrePagos: 0,
    interes: 0,
  });

  const [productSelected, setProductSelected] =
    useState<ProductToCredit | null>(null);
  const [customerSelected, setCustomerSelected] =
    useState<SingleValue<OptionTypeTS> | null>(null);

  const [selectedPrice, setSelectedPrice] = useState<Precio | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  };

  // ===== TOP DASHBOARD: RESUMEN CRÉDITOS (tipado con CreditoRegistro) =====
  const creditSummary = useMemo(() => {
    if (!creditos || creditos.length === 0) {
      return {
        totalCredits: 0,
        activeCredits: 0,
        paidCredits: 0,
        pendingCredits: 0,
        totalAmount: 0,
        collectedAmount: 0,
        pendingAmount: 0,
        pendingInstallments: 0, // 👈 NUEVO
      };
    }

    let totalAmount = 0;
    let collectedAmount = 0;
    let pendingAmount = 0;
    let activeCredits = 0;
    let paidCredits = 0;
    let pendingInstallments = 0; // 👈 NUEVO

    creditos.forEach((c: CreditoRegistro) => {
      const estadoUpper = (c.estado ?? "").toUpperCase();

      const isActive = ["ACTIVA", "ACTIVO"].includes(estadoUpper);
      const isPaid = [
        "PAGADO",
        "PAGADA",
        "CANCELADO",
        "CANCELADA",
        "FINALIZADO",
        "FINALIZADA",
      ].includes(estadoUpper);

      if (isActive) activeCredits++;
      if (isPaid) paidCredits++;

      // 💱 montos
      const creditTotal =
        typeof c.montoTotalConInteres === "number" && c.montoTotalConInteres > 0
          ? c.montoTotalConInteres
          : c.totalVenta || 0;

      const pagado = c.totalPagado || 0;
      const pendiente = Math.max(creditTotal - pagado, 0);

      totalAmount += creditTotal;
      collectedAmount += pagado;
      pendingAmount += pendiente;

      // 🧮 cuotas pendientes (por crédito)
      (c.cuotas ?? []).forEach((q) => {
        const qEstado = (q.estado ?? "").toUpperCase();
        const cuotaPagada = [
          "PAGADO",
          "PAGADA",
          "CANCELADO",
          "CANCELADA",
        ].includes(qEstado);

        if (!cuotaPagada) {
          pendingInstallments += 1;
        }
      });
    });

    const totalCredits = creditos.length;
    const pendingCredits = Math.max(totalCredits - paidCredits, 0);

    return {
      totalCredits,
      activeCredits,
      paidCredits,
      pendingCredits,
      totalAmount,
      collectedAmount,
      pendingAmount,
      pendingInstallments, // 👈 NUEVO
    };
  }, [creditos]);

  const {
    totalCredits,
    activeCredits,
    paidCredits,
    pendingCredits,
    collectedAmount,
    pendingAmount,
    pendingInstallments,
  } = creditSummary;

  // ===== HANDLERS FORM =====

  const handleChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "fechaInicio" | "fechaContrato"
  ) => {
    const dateStr = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: dateStr,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestigoChange = (
    index: number,
    field: keyof TestigoForm,
    value: string
  ) => {
    const newTestigos = [...formData.testigos];
    newTestigos[index] = { ...newTestigos[index], [field]: value };
    setFormData((prev) => ({ ...prev, testigos: newTestigos }));
  };

  const addTestigo = () => {
    setFormData((prev) => ({
      ...prev,
      testigos: [...prev.testigos, { nombre: "", direccion: "", telefono: "" }],
    }));
  };

  const removeTestigo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testigos: prev.testigos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.clienteId || Number(formData.clienteId) <= 0) {
      toast.info("Debe seleccionar un cliente.");
      setIsLoading(false);
      return;
    }

    if (!formData.cuotaInicial || Number(formData.cuotaInicial) <= 0) {
      toast.info("La cuota inicial debe ser mayor a 0.");
      setIsLoading(false);
      return;
    }

    if (!formData.cuotasTotales || Number(formData.cuotasTotales) <= 0) {
      toast.info("Debe especificar la cantidad de cuotas totales.");
      setIsLoading(false);
      return;
    }

    if (!formData.diasEntrePagos || Number(formData.diasEntrePagos) <= 0) {
      toast.info("Debe especificar los días entre pagos.");
      setIsLoading(false);
      return;
    }

    if (!formData.interes) {
      toast.info("Debe especificar el interés del crédito.");
      setIsLoading(false);
      return;
    }

    if (!totalVentaCrédito || Number(totalVentaCrédito) <= 0) {
      toast.info("El monto total de la venta debe ser mayor a 0.");
      setIsLoading(false);
      return;
    }

    if (!formData.productos || formData.productos.length === 0) {
      toast.info("Debe agregar al menos un producto a la venta.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/cuotas`, {
        ...formData,
        clienteId: Number(formData.clienteId),
        usuarioId: Number(userId),
        sucursalId: Number(sucursalId),
        totalVenta: Number(formData.cuotaInicial),
        montoTotalConInteres: montoTotalConInteres,
        cuotaInicial: Number(formData.cuotaInicial),
        cuotasTotales: Number(formData.cuotasTotales),
        montoVenta: Number(totalVentaCrédito),
        garantiaMeses: Number(formData.garantiaMeses),
        fechaInicio: formData.fechaInicio,
        fechaContrato: formData.fechaContrato,
      });

      if (response.status === 201) {
        toast.success("Se ha registrado correctamente el crédito.");

        setFormData({
          clienteId: 0,
          usuarioId: "",
          sucursalId: sucursalId,
          totalVenta: 0,
          cuotaInicial: 0,
          cuotasTotales: 0,
          fechaInicio: "",
          estado: "ACTIVA",
          dpi: "",
          testigos: [],
          fechaContrato: "",
          montoVenta: 0,
          garantiaMeses: "",
          productos: [],
          diasEntrePagos: 0,
          interes: 0,
        });

        setCustomerSelected(null);
        setOpenCreate(false);

        // Si quieres mantener el comportamiento original:
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error al crear la venta a cuota:", error);
      toast.info(
        "No se pudo registrar el crédito. Verifique la disponibilidad de los productos, los datos ingresados y vuelva a intentarlo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===== FETCH DATA =====

  const getClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/client/get-clients`);
      if (response.status === 200) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir datos de clientes");
    }
  };

  const getProductos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/sucursal/${sucursalId}`
      );
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir datos de productos");
    }
  };

  const getRegistCredits = async () => {
    try {
      const response = await axios.get(`${API_URL}/cuotas/get/credits`);
      setCreditos(response.data as CreditoRegistro[]);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener registros");
    }
  };

  useEffect(() => {
    getClientes();
    getProductos();
    getRegistCredits();
  }, []);

  // ===== OPTIONS & SELECCIONES =====

  const handleChangeSelectCustomer = (option: SingleValue<OptionTypeTS>) => {
    setCustomerSelected(option);
    if (option) {
      setFormData((previaData) => ({
        ...previaData,
        clienteId: option.value,
      }));
    }
  };

  const optionsProductsFormat = products.map((prod) => ({
    value: prod.id,
    label: `${prod.nombre} (${prod.codigoProducto})`,
  }));

  const optionsCustomersFormat = customers.map((cust) => ({
    value: cust.id,
    label: `${cust.nombre} - ${cust.telefono} (${cust.dpi})`,
  }));

  const handleChangeSelectProduct = (option: OptionTypeTS) => {
    const product = products.find((prod) => prod.id === option.value);
    setProductSelected(product || null);
    setSelectedPrice(product?.precios[0] || null);
    setQuantity(1);
  };

  const handleChangeSelectPrice = (option: OptionTypeTS) => {
    const price = productSelected?.precios.find(
      (precio) => precio.id === option.value
    );
    setSelectedPrice(price || null);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const optionsPricesFormat =
    productSelected?.precios.map((price) => ({
      value: price.id,
      label: `${price.precio}`,
    })) || [];

  const handleAddProduct = () => {
    if (productSelected && selectedPrice) {
      if (productSelected.id <= 0 || selectedPrice.precio <= 0) {
        toast.info("Faltan datos");
        return;
      }

      if (
        formData.productos.find(
          (prod) => prod.productoId === productSelected.id
        )
      ) {
        toast.info("Producto ya está en la lista");
        return;
      }

      const newProduct: Producto = {
        productoId: productSelected.id,
        cantidad: quantity,
        precioVenta: selectedPrice.precio,
      };

      const newMontoVenta =
        formData.montoVenta + newProduct.precioVenta * quantity;
      const newTotalVenta =
        formData.totalVenta + newProduct.precioVenta * quantity;

      setFormData((prev) => ({
        ...prev,
        productos: [...prev.productos, newProduct],
        montoVenta: newMontoVenta,
        totalVenta: newTotalVenta,
      }));

      toast.success("Producto añadido");
      setProductSelected(null);
      setSelectedPrice(null);
      setQuantity(1);
    }
  };

  const handleDeleteFromData = (id: number) => {
    const updatedProductos = formData.productos.filter(
      (product) => product.productoId !== id
    );

    setFormData((prev) => ({
      ...prev,
      productos: updatedProductos,
    }));

    const newMontoVenta = updatedProductos.reduce(
      (total, product) => total + product.precioVenta * product.cantidad,
      0
    );
    const newTotalVenta = newMontoVenta;

    setFormData((prevData) => ({
      ...prevData,
      montoVenta: newMontoVenta,
      totalVenta: newTotalVenta,
    }));

    toast.success("Producto eliminado de la lista");
  };

  const totalVentaCrédito = formData.productos.reduce(
    (total, prod) => total + prod.precioVenta * prod.cantidad,
    0
  );

  const calcularCuotas = () => {
    if (
      formData.totalVenta &&
      formData.cuotaInicial &&
      formData.interes &&
      formData.cuotasTotales
    ) {
      const montoInteres = formData.totalVenta * (formData.interes / 100);
      const montoTotalConInteres = formData.totalVenta + montoInteres;
      const saldoRestante = montoTotalConInteres - formData.cuotaInicial;
      const pagoPorCuota = saldoRestante / formData.cuotasTotales;

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

  const { saldoRestante, montoInteres, montoTotalConInteres, pagoPorCuota } =
    calcularCuotas();

  return (
    <Tabs defaultValue="account" className="w-full px-2 py-2">
      {/* TOP: MINI DASHBOARD + TABS */}
      <div className="w-full flex flex-col items-center gap-4 mb-4">
        {/* MINI DASHBOARD CRÉDITOS */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Card className="border border-muted/60 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Créditos totales
                </p>
                <p className="text-xl font-semibold">{totalCredits}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {paidCredits} pagados
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <CreditCard className="w-4 h-4 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted/60 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Activos
                </p>
                <p className="text-xl font-semibold">{activeCredits}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {pendingCredits} en seguimiento
                </p>
              </div>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/40 p-2">
                <ClipboardList className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted/60 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Monto cobrado
                </p>
                <p className="text-lg font-semibold">
                  {formatearMoneda(collectedAmount)}
                </p>
              </div>
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 p-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted/60 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Pendiente por cobrar
                </p>
                <p className="text-lg font-semibold">
                  {formatearMoneda(pendingAmount)}
                </p>
              </div>
              <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted/60 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Cuotas pendientes por cobrar
                </p>
                <p className="text-lg font-semibold">{pendingInstallments}</p>
              </div>
              <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABS */}
        <TabsList className="flex w-full justify-center">
          <TabsTrigger value="account" className="flex-1 text-center">
            Registros de Créditos
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1 text-center">
            Registrar Nuevo Crédito
          </TabsTrigger>
        </TabsList>
      </div>

      {/* LISTA DE CRÉDITOS */}
      <TabsContent value="account" className="w-full">
        <div className="w-full  mx-auto">
          <Card className="border border-muted/60 shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Historial de créditos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <CreditRecordsTable
                userId={userId}
                sucursalId={sucursalId}
                getCredits={getRegistCredits}
                records={creditos}
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* CREAR NUEVO CRÉDITO */}
      <TabsContent value="password" className="w-full">
        <Card className="w-full  mx-auto shadow-sm border border-muted/60">
          <CardHeader className="py-3 px-4 bg-muted/40 dark:bg-muted/10">
            <CardTitle className="text-lg font-semibold text-center flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Crear nuevo crédito
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SECCIÓN PRODUCTOS */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Productos del crédito
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {formData.productos.length} producto(s)
                  </span>
                </div>
                <Separator className="border-t border-gray-200 dark:border-gray-700" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <Label className="text-xs">Producto</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <SelectM
                              className="text-black text-sm"
                              placeholder="Seleccione un producto"
                              isClearable
                              value={
                                productSelected
                                  ? {
                                      value: productSelected.id,
                                      label: productSelected.nombre,
                                    }
                                  : null
                              }
                              onChange={(option) =>
                                handleChangeSelectProduct(
                                  option as OptionTypeTS
                                )
                              }
                              options={optionsProductsFormat}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Seleccione el producto a vender
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {productSelected && (
                    <div className="space-y-1">
                      <Label className="text-xs">Precio</Label>
                      <SelectM
                        isClearable
                        placeholder="Seleccione un precio"
                        className="text-black text-sm"
                        value={
                          selectedPrice
                            ? {
                                value: selectedPrice.id,
                                label: `${selectedPrice.precio}`,
                              }
                            : null
                        }
                        onChange={(option) =>
                          handleChangeSelectPrice(option as OptionTypeTS)
                        }
                        options={optionsPricesFormat}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs">Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      className="w-full h-8 text-xs"
                      variant="default"
                      type="button"
                      onClick={handleAddProduct}
                      disabled={!productSelected || !selectedPrice}
                    >
                      <ShoppingCart className="mr-1 h-3 w-3" />
                      Agregar
                    </Button>
                  </div>
                </div>

                {formData.productos?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium mb-1">
                      Productos seleccionados
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {formData.productos?.map((productForm) => {
                        const productoFind = products.find(
                          (prod) => prod.id === productForm.productoId
                        );
                        if (!productoFind) return null;

                        return (
                          <Card
                            key={productForm.productoId}
                            className="overflow-hidden border border-blue-100 dark:border-blue-900"
                          >
                            <CardContent className="p-2.5">
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                    {productoFind.nombre}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5"
                                    >
                                      Cant: {productForm.cantidad}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1.5"
                                    >
                                      {formatearMoneda(productForm.precioVenta)}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleDeleteFromData(productForm.productoId)
                                  }
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                                >
                                  <Trash className="h-3 w-3" />
                                  <span className="sr-only">
                                    Eliminar producto
                                  </span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* CLIENTE Y CONDICIONES */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Datos del cliente y condiciones
                  </h3>
                </div>
                <Separator className="border-t border-gray-200 dark:border-gray-700" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <Users className="h-3 w-3" /> Cliente
                    </Label>
                    <SelectM
                      placeholder="Seleccione un cliente"
                      value={
                        customerSelected
                          ? {
                              value: customerSelected.value,
                              label: customerSelected.label,
                            }
                          : null
                      }
                      options={optionsCustomersFormat}
                      onChange={handleChangeSelectCustomer}
                      isClearable
                      className="text-black text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Fecha de inicio</Label>
                    <input
                      type="date"
                      id="fechaInicio"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={(e) => handleChangeDate(e, "fechaInicio")}
                      className="w-full h-8 px-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Cuota inicial
                    </Label>
                    <Input
                      id="cuotaInicial"
                      name="cuotaInicial"
                      type="number"
                      step="1"
                      required
                      value={formData.cuotaInicial}
                      onChange={handleInputChange}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <ClipboardList className="h-3 w-3" /> Nº de cuotas
                    </Label>
                    <Input
                      type="number"
                      id="cuotasTotales"
                      name="cuotasTotales"
                      value={formData.cuotasTotales}
                      onChange={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        )
                      }
                      className="h-8 text-sm"
                      placeholder="Ej: 12"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Garantía (meses)
                    </Label>
                    <Input
                      id="garantiaMeses"
                      name="garantiaMeses"
                      type="number"
                      required
                      step="1"
                      value={formData.garantiaMeses}
                      onChange={handleInputChange}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Días entre pagos
                    </Label>
                    <Select
                      name="diasEntrePagos"
                      value={formData.diasEntrePagos.toString()}
                      onValueChange={(value) => {
                        const event = {
                          target: {
                            name: "diasEntrePagos",
                            value: value,
                          },
                        };
                        handleInputChange(
                          event as React.ChangeEvent<HTMLInputElement>
                        );
                      }}
                    >
                      <SelectTrigger className="w-full h-8 text-sm">
                        <SelectValue placeholder="Seleccione intervalo" />
                      </SelectTrigger>
                      <SelectContent>
                        {[7, 15, 30, 45, 60].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} días
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Interés
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="interes"
                        name="interes"
                        type="number"
                        required
                        step="1"
                        value={formData.interes}
                        onChange={handleInputChange}
                        className="h-8 text-sm"
                      />
                      <span className="text-xs font-medium">%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Total venta
                    </Label>
                    <Input
                      id="totalVenta"
                      name="totalVenta"
                      type="number"
                      step="1"
                      required
                      value={totalVentaCrédito}
                      readOnly
                      className="h-8 text-sm bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* RESUMEN DEL CRÉDITO */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-md p-3 space-y-3">
                <h3 className="text-sm font-semibold text-center">
                  Resumen del crédito
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <DollarSign className="text-green-600 dark:text-green-400 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Saldo restante
                      </p>
                      <p className="text-sm font-semibold">
                        {formatearMoneda(saldoRestante)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Percent className="text-blue-600 dark:text-blue-400 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Monto de interés
                      </p>
                      <p className="text-sm font-semibold">
                        {formatearMoneda(montoInteres)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                      <BarChart className="text-orange-600 dark:text-orange-400 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Total con interés
                      </p>
                      <p className="text-sm font-semibold">
                        {formatearMoneda(montoTotalConInteres)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <Calendar className="text-purple-600 dark:text-purple-400 h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Pago por cuota
                      </p>
                      <p className="text-sm font-semibold">
                        {typeof pagoPorCuota === "number" &&
                        !isNaN(pagoPorCuota) &&
                        isFinite(pagoPorCuota)
                          ? formatearMoneda(pagoPorCuota)
                          : "Calculando..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TESTIGOS */}
              <Accordion
                type="single"
                collapsible
                className="w-full border rounded-md overflow-hidden"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Testigos ({formData.testigos.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 py-3">
                    <div className="space-y-3">
                      {formData.testigos.map((testigo, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-4 gap-2"
                        >
                          <Input
                            placeholder="Nombre"
                            value={testigo.nombre}
                            onChange={(e) =>
                              handleTestigoChange(
                                index,
                                "nombre",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                          />
                          <Input
                            placeholder="Dirección"
                            value={testigo.direccion}
                            onChange={(e) =>
                              handleTestigoChange(
                                index,
                                "direccion",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm md:col-span-2"
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Teléfono"
                              value={testigo.telefono}
                              onChange={(e) =>
                                handleTestigoChange(
                                  index,
                                  "telefono",
                                  e.target.value
                                )
                              }
                              className="h-8 text-sm flex-1"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeTestigo(index)}
                              className="h-8 w-8 flex-shrink-0"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addTestigo}
                        variant="outline"
                        size="sm"
                        className="mt-1"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Agregar testigo
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* BOTÓN CONFIRMACIÓN */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setOpenCreate(true)}
                  type="button"
                  className="px-5 h-9 text-sm font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Iniciar registro
                </Button>
              </div>

              {/* DIALOG CONFIRMACIÓN */}
              <Dialog onOpenChange={setOpenCreate} open={openCreate}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-lg">
                      Confirmar registro
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm">
                      ¿Deseas crear este registro de crédito con la información
                      actual?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Button
                      variant="outline"
                      onClick={() => setOpenCreate(false)}
                      className="w-full h-9 text-sm"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      type="submit"
                      className="w-full h-9 text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <SendHorizonal className="mr-2 h-4 w-4" />
                          Confirmar
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
