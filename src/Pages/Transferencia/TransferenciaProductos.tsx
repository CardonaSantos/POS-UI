"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Building,
  Building2,
  Check,
  ChevronsUpDown,
  Layers2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/components/Context/ContextSucursal";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const API_URL = import.meta.env.VITE_API_URL;

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  stock: Array<{ sucursalId: number; cantidad: number }>;
}

interface Sucursal {
  id: number;
  nombre: string;
}

interface TransferenciaData {
  productoId: number;
  cantidad: number;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  usuarioEncargadoId: number | null;
}

export default function TransferenciaProductos() {
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [selectedSucursalDestino, setSelectedSucursalDestino] =
    useState<Sucursal | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [openProduct, setOpenProduct] = useState(false);
  const [openSucursal, setOpenSucursal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const encargadoId = useStore((state) => state.userId);

  const [truncar, setTruncar] = useState(false);

  const handleSubmit = async () => {
    try {
      // Evita múltiples envíos
      if (truncar) return;

      setTruncar(true);

      // Verifica si hay un producto y sucursal destino seleccionados
      if (!selectedProduct || !selectedSucursalDestino) {
        toast.error("Por favor selecciona un producto y una sucursal destino");
        setTruncar(false); // Restablece el estado en caso de fallo
        return;
      }

      // Busca la sucursal de origen que tenga stock disponible
      const sucursalOrigen = selectedProduct.stock.find((s) => s.cantidad > 0);
      if (!sucursalOrigen) {
        toast.error("No hay stock disponible en la sucursal de origen");
        setTruncar(false); // Restablece el estado en caso de fallo
        return;
      }

      // Prepara los datos de transferencia
      const transferenciaData: TransferenciaData = {
        productoId: selectedProduct.id,
        cantidad,
        sucursalOrigenId: sucursalOrigen.sucursalId,
        sucursalDestinoId: selectedSucursalDestino.id,
        usuarioEncargadoId: encargadoId, // ID de usuario fijo para este ejemplo
      };

      // Realiza la solicitud de transferencia
      const response = await axios.post(
        `${API_URL}/transferencia-producto/`,
        transferenciaData
      );

      if (response.status === 201) {
        toast.success("Producto transferido correctamente");
        getProductos(); // Actualiza los productos después de la transferencia

        console.log("Datos de transferencia:", transferenciaData);

        // Restablece los estados
        setOpenDialog(false);
        setSelectedProduct(null);
        setSelectedSucursalDestino(null);
        setCantidad(1);
      } else {
        throw new Error("Error en la transferencia");
      }
    } catch (error) {
      console.error("Error al transferir el producto:", error);
      toast.error(
        "Error al transferir el producto. Por favor, intenta de nuevo."
      );
    } finally {
      // Restablece el estado de truncar independientemente de si hubo éxito o error
      setTruncar(false);
    }
  };

  const sucursalId = useStore((state) => state.sucursalId);
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]); // Array vacío por defecto

  const getProductos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/products/to-transfer/${sucursalId}`
      );
      if (response.status === 200) {
        setProductos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir productos");
    }
  };
  //
  useEffect(() => {
    const getProductos = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products/products/to-transfer/${sucursalId}`
        );
        if (response.status === 200) {
          setProductos(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir productos");
      }
    };
    if (sucursalId) {
      getProductos();
    }
  }, [sucursalId]);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/sucursales/sucursales-to-transfer`
        );
        if (response.status === 200) {
          setSucursales(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir productos");
      }
    };
    getSucursales();
  }, []);
  console.log("Las sucursales son: ", sucursales);
  console.log("Los productos son: ", productos);
  console.log("EL id seleccionado es: ", selectedProduct);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Transferencia de Productos
      </h1>
      <div className="space-y-4">
        <Popover open={openProduct} onOpenChange={setOpenProduct}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProduct}
              className="w-full justify-between"
            >
              {selectedProduct
                ? selectedProduct.nombre
                : "Seleccionar producto..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command className="rounded-lg border shadow-md md:min-w-[450px]">
              <CommandInput placeholder="Buscar producto..." />
              <CommandList>
                <CommandEmpty>No se encontraron productos.</CommandEmpty>
                <CommandGroup heading="Producto a transferir stock">
                  {productos &&
                    productos.map((producto) => (
                      <CommandItem
                        key={producto.id}
                        value={producto.nombre}
                        onSelect={() => {
                          setSelectedProduct(producto);
                          setOpenProduct(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProduct?.id === producto.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <Box />
                        {producto.nombre}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Card className="">
          <CardHeader className="  p-4 rounded-t-md">
            <CardTitle className="text-lg font-bold text-center">
              Cantidad disponible
            </CardTitle>
            <CardDescription className="text-md text-center">
              La cantidad a transferir no debe ser mayor a la disponible
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {selectedProduct ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  Total en Stocks:{" "}
                  {selectedProduct.stock.reduce(
                    (total, stock) => total + stock.cantidad,
                    0
                  )}
                </h2>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <h2 className="text-xl font-semibold">
                  Seleccione un producto para ver la cantidad disponible
                </h2>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="cantidad">Cantidad a transferir</Label>
          <Input
            id="cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            min={1}
          />
        </div>
        <Popover open={openSucursal} onOpenChange={setOpenSucursal}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProduct}
              className="w-full justify-between"
            >
              {selectedSucursalDestino
                ? selectedSucursalDestino.nombre
                : "Seleccionar producto..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command className="rounded-lg border shadow-md md:min-w-[450px]">
              <CommandInput placeholder="Buscar producto..." />
              <CommandList>
                <CommandEmpty>No se encontraron productos.</CommandEmpty>
                <CommandGroup heading="Producto a transferir stock">
                  {sucursales &&
                    sucursales
                      .filter((sucursal) => sucursal.id !== sucursalId)
                      .map((sucursal) => (
                        <CommandItem
                          key={sucursal.id}
                          value={sucursal.nombre}
                          onSelect={() => {
                            setSelectedSucursalDestino(sucursal);
                            setOpenSucursal(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSucursalDestino?.id === sucursal.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <Building />
                          {sucursal.nombre}
                        </CommandItem>
                      ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="w-full"
              disabled={
                !selectedProduct || !selectedSucursalDestino || cantidad < 1
              }
            >
              Realizar Transferencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Confirmar Transferencia
              </DialogTitle>
              <DialogDescription className="text-center">
                ¿Estás seguro de que deseas realizar esta transferencia?
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              {/* Producto */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label htmlFor="producto" className="text-right">
                    Producto
                  </Label>
                  <Box />
                </div>
                <div id="producto" className="text-right">
                  {selectedProduct?.nombre}
                </div>
              </div>

              {/* Cantidad */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label htmlFor="cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Layers2 />
                </div>
                <div id="cantidad" className="text-right">
                  {cantidad}
                </div>
              </div>

              {/* Destino */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label htmlFor="destino" className="text-right">
                    Destino
                  </Label>
                  <Building2 width={20} />
                </div>
                <div id="destino" className="text-right">
                  {selectedSucursalDestino?.nombre}
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-center">
              <Button
                className="w-full"
                disabled={truncar}
                onClick={handleSubmit}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}