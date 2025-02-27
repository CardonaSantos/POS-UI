import { useState, useEffect } from "react";
import {
  Truck,
  User,
  Plus,
  X,
  Edit,
  SendIcon,
  PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axios from "axios";
import { ProductsInventary } from "@/Types/Inventary/ProductsInventary";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import SelectM from "react-select"; // Importación correcta de react-select

type Provider = {
  id: number;
  nombre: string;
};

type StockEntry = {
  productoId: number;
  cantidad: number;
  costoTotal: number;
  fechaIngreso: string;
  fechaVencimiento?: string;
  precioCosto: number;
  proveedorId: number;
};

interface GroupedStock {
  nombre: string; // Name of the branch
  cantidad: number; // Total quantity of stock
}

export default function Stock() {
  const [cantidad, setCantidad] = useState<string>("");
  const [precioCosto, setPrecioCosto] = useState<number>(0);
  // const [precioCosto, setPrecioCosto] = useState<number | "">(""); // Permite un estado vacío inicial o un número
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [fechaIngreso, setFechaIngreso] = useState<Date>(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<StockEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isDialogInspect, setIsDialogInspect] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const sucursalId = useStore((state) => state.sucursalId);
  const recibidoPorId = useStore((state) => state.userId);
  const usuarioNombre = useStore((state) => state.userNombre);
  console.log("Lo que vamos a enviar es: ", stockEntries);

  console.log("El id del user logueado es: ", recibidoPorId);

  const calculateTotalCost = (
    cantidad: number,
    precioCosto: number
  ): number => {
    const cantidadNum = parseFloat(cantidad.toString());
    const precioCostoNum = parseFloat(precioCosto.toString());

    if (!isNaN(cantidadNum) && !isNaN(precioCostoNum)) {
      return cantidadNum * precioCostoNum;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    const cantidadNum = parseFloat(cantidad);
    const precioCostoNum = precioCosto;
    console.log("La cantidad num: ", cantidadNum);
    console.log("La preciocostoNum: ", precioCostoNum);

    if (!isNaN(cantidadNum) && !isNaN(precioCostoNum)) {
      setCostoTotal(cantidadNum * precioCostoNum);
    } else {
      setCostoTotal(0);
    }
  }, [cantidad, precioCosto, editingEntry]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!cantidad) newErrors.cantidad = "La cantidad es requerida";
    if (!precioCosto) newErrors.precioCosto = "El precio de costo es requerido";
    if (!fechaIngreso)
      newErrors.fechaIngreso = "La fecha de ingreso es requerida";
    if (!selectedProductId) newErrors.product = "Debe seleccionar un producto";
    if (!selectedProviderId)
      newErrors.provider = "Debe seleccionar un proveedor";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEntry = () => {
    if (validateForm()) {
      const newEntry: StockEntry = {
        productoId: parseInt(selectedProductId),
        cantidad: parseInt(cantidad),
        costoTotal: calculateTotalCost(parseInt(cantidad), precioCosto), // Usa la nueva función
        fechaIngreso: fechaIngreso.toISOString(),
        fechaVencimiento: fechaVencimiento?.toISOString(),
        precioCosto: precioCosto,
        proveedorId: parseInt(selectedProviderId),
      };

      if (
        stockEntries.some((prod) => prod.productoId === newEntry.productoId)
      ) {
        toast.info("El producto ya está en la lista. Añade uno nuevo");
        return;
      }

      if (newEntry.cantidad <= 0 || newEntry.precioCosto <= 0) {
        toast.warning("No se permiten valores negativo o menores a cero");
        return;
      }

      if (isNaN(newEntry.cantidad) || isNaN(newEntry.precioCosto)) {
        // Manejar el caso donde los valores no son números válidos
        console.error("Valores no numéricos ingresados.");
        return;
      }
      setStockEntries([...stockEntries, newEntry]);
      resetForm();
      toast.success("Producto añadido");
      setProductToShow(null);
    }
  };

  const resetForm = () => {
    setSelectedProductId(""); // Reseteamos el valor del select a un valor vacío
    setCantidad(""); // Reseteamos la cantidad
    setPrecioCosto(0); // Reseteamos el precio de costo
    // setSelectedProviderId(""); // Reseteamos el proveedor
    setFechaIngreso(new Date()); // Reseteamos la fecha de ingreso
    setFechaVencimiento(null); // Reseteamos la fecha de vencimiento
    // setSelectedProviderId("");
    setErrors({});
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("id proveedor: ", selectedProviderId);

  const handleSubmit = async () => {
    if (isSubmitting || isDisableSubmit) return;

    setIsDisableSubmit(true);
    setIsSubmitting(true);

    console.log("LOS DATOS A ENVIAR SON:", {
      stockEntries,
      proveedorId: Number(selectedProviderId),
    });

    // Validación de cantidad en stockEntries
    if (stockEntries.some((stock) => stock.cantidad <= 0)) {
      toast.warning("Las adiciones no deben ser negativas");
      setIsSubmitting(false);
      setIsDisableSubmit(false);
      return;
    }

    console.log("Enviando entradas de stock:", stockEntries);

    try {
      const response = await axios.post(`${API_URL}/stock`, {
        stockEntries,
        proveedorId: Number(selectedProviderId),
        sucursalId,
        recibidoPorId,
      });

      if (response.status === 201) {
        toast.success("Stocks añadidos exitosamente");
        setTimeout(() => {
          window.location.reload(); // Considera si esto es realmente necesario
        }, 1000);
      }
    } catch (error) {
      console.error("Error al registrar los stocks:", error);
      toast.error("Error al registrar los stocks");
      setIsDisableSubmit(false); // Reseteo en caso de error
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeEntry = (index: number) => {
    setStockEntries(stockEntries.filter((_, i) => i !== index));
  };

  const editEntry = (entry: StockEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const updateEntry = () => {
    if (editingEntry) {
      const updatedEntry = {
        ...editingEntry,
        costoTotal: calculateTotalCost(
          editingEntry.cantidad,
          editingEntry.precioCosto
        ), // Usa la nueva función
      };

      const updatedEntries = stockEntries.map((entry) =>
        entry.productoId === updatedEntry.productoId ? updatedEntry : entry
      );
      setStockEntries(updatedEntries);
      setIsEditDialogOpen(false);
      setEditingEntry(null);
      toast.success("Instancia editada");
    }
  };

  const [productsInventary, setProductsInventary] = useState<
    ProductsInventary[]
  >([]);

  interface SucursalProductSelect {
    id: number;
    nombre: string;
  }

  interface StockProductoSelect {
    cantidad: number;
    id: number;
    sucursal: SucursalProductSelect;
  }
  interface ProductoSelect {
    id: number;
    nombreProducto: string;
    precioCostoActual: number;
    stock: StockProductoSelect[];
  }
  const [productToShow, setProductToShow] = useState<ProductoSelect | null>(
    null
  );

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/products/for-inventary`
      );
      if (response.status === 200) {
        setProductsInventary(response.data);
        console.log("la data es: ", response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los productos");
    }
  };
  const [proveedores, setProveedores] = useState<Provider[]>();
  const getProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/proveedor/`);
      if (response.status === 200) {
        setProveedores(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los productos");
    }
  };
  useEffect(() => {
    getProducts();
    getProviders();
  }, []);

  const totalStock = stockEntries.reduce(
    (total, producto) => total + producto.cantidad * producto.precioCosto,
    0
  );
  console.log("Productos son: ", productsInventary);

  console.log("El producto seleccionado es: ", productToShow);
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Agregar Stock de Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <SelectM
                  placeholder="Seleccionar producto"
                  options={productsInventary.map((product) => ({
                    value: product.id.toString(),
                    label: `${product.nombre} (${product.codigoProducto})`,
                  }))}
                  className="basic-select text-black"
                  classNamePrefix="select"
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setSelectedProductId(selectedOption.value.toString());
                      const selectedProduct = productsInventary.find(
                        (product) =>
                          product.id.toString() ===
                          selectedOption.value.toString()
                      );

                      if (selectedProduct) {
                        setProductToShow({
                          id: selectedProduct.id,
                          nombreProducto: selectedProduct.nombre,
                          precioCostoActual: selectedProduct.precioCostoActual,
                          stock: selectedProduct.stock.map((s) => ({
                            cantidad: s.cantidad,
                            id: s.id,
                            sucursal: {
                              id: s.sucursal.id,
                              nombre: s.sucursal.nombre,
                            },
                          })),
                        });
                        setPrecioCosto(selectedProduct.precioCostoActual);
                      }
                    } else {
                      setSelectedProductId("");
                      setProductToShow(null); // Resetea el valor si no hay selección
                    }
                  }}
                  value={
                    selectedProductId
                      ? productsInventary
                          .filter(
                            (product) =>
                              product.id.toString() === selectedProductId
                          )
                          .map((product) => ({
                            value: product.id.toString(),
                            label: `${product.nombre} (${product.codigoProducto})`,
                          }))[0]
                      : null // Si no hay valor seleccionado, el select queda vacío
                  }
                />
                {errors.product && (
                  <p className="text-sm text-red-500">{errors.product}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Proveedor</Label>
              <Select
                onValueChange={setSelectedProviderId}
                value={selectedProviderId}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores &&
                    proveedores.map((provider) => (
                      <SelectItem
                        key={provider.id}
                        value={provider.id.toString()}
                      >
                        <span className="flex items-center">
                          <Truck className="mr-2 h-4 w-4" />
                          {provider.nombre}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.provider && (
                <p className="text-sm text-red-500">{errors.provider}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ingrese la cantidad"
              />
              {errors.cantidad && (
                <p className="text-sm text-red-500">{errors.cantidad}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="precioCosto">Precio de costo producto</Label>
              <Input
                id="precioCosto"
                type="number"
                readOnly
                value={precioCosto || ""} // Asegura que sea un string si está vacío
                onChange={(e) => setPrecioCosto(Number(e.target.value))}
                placeholder="Ingrese el precio de costo"
              />

              {errors.precioCosto && (
                <p className="text-sm text-red-500">{errors.precioCosto}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="costoTotal">Costo total</Label>
              <Input
                id="costoTotal"
                type="number"
                value={costoTotal.toFixed(2)}
                readOnly
                className=""
              />
            </div>
            <div className="space-y-2 block">
              <Label className="block">Fecha de ingreso</Label>{" "}
              {/* Se asegura que Label esté en bloque */}
              <input
                className="block w-full bg-transparent"
                type="date"
                onChange={(e) => setFechaIngreso(new Date(e.target.value))}
              />
              {errors.fechaIngreso && (
                <p className="text-sm text-red-500">{errors.fechaIngreso}</p>
              )}
            </div>
            <div className="space-y-2 block">
              <Label className="block">Fecha de vencimiento (opcional)</Label>
              <input
                value={
                  fechaVencimiento
                    ? fechaVencimiento.toISOString().split("T")[0]
                    : ""
                }
                className="block w-full bg-transparent"
                type="date"
                onChange={(e) => setFechaVencimiento(new Date(e.target.value))}
              />
              {errors.fechaVencimiento && (
                <p className="text-sm text-red-500">
                  {errors.fechaVencimiento}
                </p>
              )}
            </div>
            <div className="space-y-2 block">
              {productToShow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      Stocks disponibles
                    </CardTitle>
                    <CardDescription>Existencias disponibles</CardDescription>
                    <CardContent>
                      <div className="mt-4">
                        {Object.entries(
                          productToShow.stock.reduce<
                            Record<string, GroupedStock>
                          >((acc, stock) => {
                            // Group by sucursal name and sum quantities
                            const sucursalName = stock.sucursal.nombre;
                            if (!acc[sucursalName]) {
                              acc[sucursalName] = {
                                nombre: sucursalName,
                                cantidad: 0,
                              };
                            }
                            acc[sucursalName].cantidad += stock.cantidad;
                            return acc;
                          }, {})
                        ).map(([sucursalName, { cantidad }]) => (
                          <div
                            key={sucursalName}
                            className="flex justify-between"
                          >
                            <span className="text-sm">{sucursalName}</span>
                            <span className="text-sm">{cantidad} uds</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Registrado por: {usuarioNombre}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button type="button" onClick={handleAddEntry} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar a la lista
            </Button>
            {/* BOTON PARA ACCIONAR EL VER LA LISTA DE PRODUCTOS */}

            <Dialog open={isDialogInspect} onOpenChange={setIsDialogInspect}>
              <DialogTrigger asChild>
                <Button
                  variant={"destructive"}
                  className="w-full"
                  type="button"
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  Añadir lista
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-[800px]">
                <DialogHeader>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Productos a añadirles stock
                  </h3>
                </DialogHeader>

                {stockEntries.length > 0 ? (
                  <>
                    {/* Contenedor scrolleable solo para los productos */}
                    <div className="mt-8 max-h-72 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Costo</TableHead>
                            <TableHead>Costo Total</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stockEntries.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {
                                  productsInventary.find(
                                    (p) => p.id === entry.productoId
                                  )?.nombre
                                }
                              </TableCell>
                              <TableCell>{entry.cantidad}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("es-GT", {
                                  style: "currency",
                                  currency: "GTQ",
                                }).format(entry.precioCosto)}
                              </TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("es-GT", {
                                  style: "currency",
                                  currency: "GTQ",
                                }).format(entry.costoTotal)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editEntry(entry)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEntry(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Botones y totales fuera del contenedor scrolleable */}
                    <div className="mt-4">
                      <Button
                        variant={"secondary"}
                        type="button"
                        className="w-full"
                      >
                        {totalStock ? (
                          <>
                            Total:{" "}
                            {new Intl.NumberFormat("es-GT", {
                              style: "currency",
                              currency: "GTQ",
                            }).format(totalStock)}
                          </>
                        ) : (
                          "Seleccione productos"
                        )}
                      </Button>
                      <Button
                        disabled={isDisableSubmit}
                        className="w-full mt-4"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Confirmar registro
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center justify-center">
                    Seleccione productos a añadir stock
                  </p>
                )}

                <DialogFooter className="flex text-center items-center justify-center">
                  <DialogDescription className="text-center"></DialogDescription>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>

        <div className="w-full  border p-4 rounded-md mt-2">
          <div>
            <h3 className="text-md font-semibold mb-4 text-center">Lista</h3>
          </div>

          {stockEntries.length > 0 ? (
            <>
              {/* Contenedor scrolleable solo para los productos */}
              <div className="mt-8 max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Costo</TableHead>
                      <TableHead>Costo Total</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {
                            productsInventary.find(
                              (p) => p.id === entry.productoId
                            )?.nombre
                          }
                        </TableCell>
                        <TableCell>{entry.cantidad}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(entry.precioCosto)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(entry.costoTotal)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editEntry(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Botones y totales fuera del contenedor scrolleable */}
              <div className="mt-4">
                <Button variant={"secondary"} type="button" className="w-full">
                  {totalStock ? (
                    <>
                      Total:{" "}
                      {new Intl.NumberFormat("es-GT", {
                        style: "currency",
                        currency: "GTQ",
                      }).format(totalStock)}
                    </>
                  ) : (
                    "Seleccione productos"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center justify-center">
              Seleccione productos a añadir stock
            </p>
          )}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Editar Entrada de Stock
              </DialogTitle>
            </DialogHeader>
            {editingEntry && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    id="edit-cantidad"
                    type="number"
                    value={editingEntry.cantidad}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        cantidad: parseInt(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={updateEntry}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
