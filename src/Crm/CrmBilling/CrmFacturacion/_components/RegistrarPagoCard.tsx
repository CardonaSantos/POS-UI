import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  FacturaInternetToPay,
  MetodoPagoFacturaInternet,
} from "@/Crm/features/factura-internet/factura-to-pay";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import dayjs from "dayjs";
import {
  Building,
  Coins,
  CreditCard,
  Loader2,
  Receipt,
  Save,
  Wallet,
} from "lucide-react";
import { NuevoPagoFormValues } from "../types/nuevoPago.interface";

interface RegistrarPagoCardProps {
  factura: FacturaInternetToPay;
  nuevoPago: NuevoPagoFormValues;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMetodoPagoChange: (value: MetodoPagoFacturaInternet) => void;
  onFechaPagoChange: (value: string) => void;
  onOpenConfirm: () => void;
  isSubmitting: boolean;
}
export const RegistrarPagoCard: React.FC<RegistrarPagoCardProps> = ({
  factura,
  nuevoPago,
  onInputChange,
  onMetodoPagoChange,
  onFechaPagoChange,
  onOpenConfirm,
  isSubmitting,
}) => {
  const saldo = factura.saldoPendiente ?? factura.montoPago ?? 0;
  const isDisabled =
    isSubmitting || !nuevoPago.montoPagado || nuevoPago.montoPagado <= 0;

  return (
    <Card className="print:hidden">
      <CardContent className="pt-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-xs">
          {/* Monto */}
          <div className="space-y-1.5">
            <Label htmlFor="montoPagado" className="text-[11px]">
              Monto a Pagar
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="montoPagado"
                name="montoPagado"
                type="number"
                step="0.01"
                className="pl-7 h-8 text-xs"
                value={nuevoPago.montoPagado || ""}
                onChange={onInputChange}
                required
                min={0.01}
                max={saldo}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Saldo pendiente: {formattMonedaGT(saldo)}
            </p>
          </div>

          {/* Método de pago */}
          <div className="space-y-1.5">
            <Label htmlFor="metodoPago" className="text-[11px]">
              Método de Pago
            </Label>
            <Select
              onValueChange={(value) =>
                onMetodoPagoChange(value as MetodoPagoFacturaInternet)
              }
              defaultValue={nuevoPago.metodoPago}
            >
              <SelectTrigger id="metodoPago" className="h-8 text-xs">
                <SelectValue placeholder="Seleccione un método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MetodoPagoFacturaInternet.EFECTIVO}>
                  <div className="flex items-center text-xs">
                    <Coins className="h-3.5 w-3.5 mr-2" />
                    Efectivo
                  </div>
                </SelectItem>

                <SelectItem value={MetodoPagoFacturaInternet.DEPOSITO}>
                  <div className="flex items-center text-xs">
                    <Building className="h-3.5 w-3.5 mr-2" />
                    Depósito
                  </div>
                </SelectItem>

                <SelectItem value={MetodoPagoFacturaInternet.TARJETA}>
                  <div className="flex items-center text-xs">
                    <CreditCard className="h-3.5 w-3.5 mr-2" />
                    Tarjeta
                  </div>
                </SelectItem>

                <SelectItem value={MetodoPagoFacturaInternet.OTRO}>
                  <div className="flex items-center text-xs">
                    <Wallet className="h-3.5 w-3.5 mr-2" />
                    Otro
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de pago */}
          <div className="space-y-1.5">
            <Label htmlFor="fechaPago" className="text-[11px]">
              Fecha de Pago
            </Label>
            <Input
              id="fechaPago"
              type="date"
              className="h-8 text-xs"
              value={dayjs(nuevoPago.fechaPago).format("YYYY-MM-DD")}
              onChange={(e) => onFechaPagoChange(e.target.value)}
            />
          </div>

          {/* No. boleta (solo depósito) */}
          {nuevoPago.metodoPago === MetodoPagoFacturaInternet.DEPOSITO && (
            <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
              <Label htmlFor="numeroBoleta" className="text-[11px]">
                No. Boleta
              </Label>
              <div className="relative">
                <Receipt className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="numeroBoleta"
                  name="numeroBoleta"
                  className="pl-7 h-8 text-xs"
                  value={nuevoPago.numeroBoleta || ""}
                  onChange={onInputChange}
                  placeholder="Ingrese número de boleta"
                  required
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-0 pb-2">
        <Button
          onClick={onOpenConfirm}
          type="button"
          className="w-full md:w-auto h-8 text-xs bg-zinc-900 hover:bg-zinc-800"
          disabled={isDisabled}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-3.5 w-3.5 " />
              Registrar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
