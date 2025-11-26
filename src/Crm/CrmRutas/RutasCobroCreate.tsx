"use client";
import { useEffect, useState } from "react";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Users,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  DollarSign,
} from "lucide-react";
// Componentes auxiliares que ya tienes
import { SelectCobradores } from "./SelectCobradores";
import { SelectZonaFacturacion } from "./SelectZonaFacturacion";
import { SelectSectoresMulti } from "./SelectSectores";
// Tipos
import { type CreateRutaDto } from "./rutas-types";
import { useRutasCreate } from "../CrmHooks/hooks/useRutasCreate";
import { TableBaseGeneric } from "../Utils/Components/TableBaseTanstakGeneric";
import { columnsClientesRutaCreate } from "./_table_clientes_create/columns_create_ruta";
import { RowSelectionState } from "@tanstack/react-table";
import { AdvancedDialogCRM } from "../_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";

export function RutasCobroCreate() {
  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedFacturaIds, setSelectedFacturaIds] = useState<Set<string>>(
    new Set()
  );
  const [totalSeleccionado, setTotalSeleccionado] = useState<number>(0);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const empresaId = useStoreCrm((s) => s.empresaId) ?? 0;
  // ViewModel desde el hook (server-side filters/pagination)
  const vm = useRutasCreate(empresaId);
  // UI local: datos del formulario de la ruta
  const [nuevaRuta, setNuevaRuta] = useState<CreateRutaDto>({
    nombreRuta: "",
    EmpresaId: empresaId,
    facturasIds: [],
    cobradorId: "",
    observaciones: "",
    clientesIds: [],
  });
  console.log("La nueva ruta con los seleccionados es: ", nuevaRuta);

  console.log("facturas seleccionadas son: ", vm.selected);

  useEffect(() => {
    const next: RowSelectionState = {};
    vm.clientes.forEach((c) => {
      if (selectedClientIds.has(String(c.id))) next[String(c.id)] = true;
    });
    setRowSelection(next);
  }, [vm.clientes, selectedClientIds]); //  👈 añade selectedClientIds

  const recomputeTotal = (factIds: Set<string>): number => {
    let sum = 0;
    vm.clientes.forEach((c) => {
      (c.facturas ?? []).forEach((f) => {
        if (factIds.has(String(f.id))) sum += Number(f.montoFactura || 0);
      });
    });
    return sum;
  };

  const handleRowSelectionChange = (
    upd: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => {
    const next = typeof upd === "function" ? upd(rowSelection) : upd;

    const nextClients = new Set(selectedClientIds);
    const nextFacts = new Set(selectedFacturaIds);

    vm.clientes.forEach((c) => {
      const id = String(c.id);
      const isNow = !!next[id];
      const was = nextClients.has(id);

      if (isNow && !was) {
        nextClients.add(id);
        (c.facturas ?? []).forEach((fx) => nextFacts.add(String(fx.id)));
      }
      if (!isNow && was) {
        nextClients.delete(id);
        (c.facturas ?? []).forEach((fx) => nextFacts.delete(String(fx.id)));
      }
    });

    setSelectedClientIds(nextClients);
    setSelectedFacturaIds(nextFacts);
    setRowSelection(next);
    setTotalSeleccionado(recomputeTotal(nextFacts));
  };

  const selectedCount = selectedClientIds.size; // clientes seleccionados
  const totalACobrar = totalSeleccionado; // suma de facturas seleccionadas

  // Derivados desde selección actual (página actual)
  const selectedClientes = vm.clientes.filter(
    (c) => rowSelection[String(c.id)]
  );

  // Handlers de formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevaRuta((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelecZona = (options: OptionSelected[]) => {
    const nuevosIds = options.map((o) => o.value); // ← string[]
    vm.setZonasFacturacionIDs(nuevosIds);
    vm.setPage(1);
  };

  const handleSelecSectores = (options: OptionSelected[]) => {
    const nuevosIds = options.map((o) => o.value); // ← string[]
    vm.setSectorIDs(nuevosIds);
    vm.setPage(1);
  };

  const facturasIds = selectedClientes
    .flatMap((c) => c.facturas ?? [])
    .map((f) => String(f.id));
  console.log("Las facturas son: ", facturasIds);

  const createRuta = async () => {
    const facturasIds = Array.from(selectedFacturaIds);
    console.log("Las facturas a enviar son: ", facturasIds);

    try {
      await vm.create({
        nombreRuta: nuevaRuta.nombreRuta,
        cobradorId: nuevaRuta.cobradorId,
        observaciones: nuevaRuta.observaciones,
        facturasIds,
      });

      // limpia UI local
      setNuevaRuta({
        nombreRuta: "",
        EmpresaId: empresaId,
        cobradorId: "",
        observaciones: "",
        clientesIds: [],
        facturasIds: [],
      });
      setSelectedClientIds(new Set());
      setSelectedFacturaIds(new Set());
      setTotalSeleccionado(0);
      setRowSelection({});
      setOpenCreate(false);
      toast.success("Ruta creada exitosamente");
    } catch (err: any) {
      console.error(err);
      toast.error(getApiErrorMessageAxios(err));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRuta();
  };

  console.log("Los clientes son: ", vm.clientes);
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Datos de la ruta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary dark:text-white" />
            Datos de la Ruta
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombreRuta" className="text-base">
              Nombre de la Ruta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombreRuta"
              name="nombreRuta"
              placeholder="Ej: Ruta Centro"
              value={nuevaRuta.nombreRuta}
              onChange={handleInputChange}
              className="text-base"
              required
            />
          </div>

          {/* Cobrador */}
          <div className="space-y-2">
            <Label htmlFor="cobrador" className="text-base">
              Cobrador Asignado
            </Label>
            <SelectCobradores
              value={nuevaRuta.cobradorId}
              onChange={(value) =>
                setNuevaRuta((prev) => ({ ...prev, cobradorId: value }))
              }
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="observaciones" className="text-base">
              Observaciones
            </Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              value={nuevaRuta.observaciones || ""}
              onChange={handleInputChange}
              rows={3}
              className="resize-none text-base"
            />
          </div>

          {/* Resumen selección */}
          <Card className="md:col-span-2 bg-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Resumen de la selección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Clientes seleccionados</span>
                </div>
                <Badge variant="outline">{selectedCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total a cobrar</span>
                </div>
                <span className="font-semibold">
                  Q{totalACobrar.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={() => setOpenCreate(true)}
            type="button"
            variant="outline"
            className="w-full md:max-w-lg"
          >
            {vm.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>Crear Ruta de Cobro</>
            )}
          </Button>

          {(selectedCount === 0 || !nuevaRuta.nombreRuta) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  {!nuevaRuta.nombreRuta && (
                    <p>Debe ingresar un nombre para la ruta.</p>
                  )}
                  {selectedCount === 0 && (
                    <p>Debe seleccionar al menos un cliente.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Selección de clientes */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex flex-wrap items-center gap-2 w-full">
              {/* Buscar (server-side) */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-8 w-full"
                  value={vm.search}
                  onChange={(e) => {
                    vm.setSearch(e.target.value);
                    vm.setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Filtros (server-side) */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado-filter">Estado del cliente</Label>
                <Select
                  onValueChange={(value) => {
                    vm.setEstado(value as EstadoCliente | "TODOS");
                    vm.setPage(1);
                  }}
                  value={vm.estado}
                >
                  <SelectTrigger id="estado-filter">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos</SelectItem>
                    <SelectItem value={EstadoCliente.ACTIVO}>
                      Activos
                    </SelectItem>
                    <SelectItem value={EstadoCliente.ATRASADO}>
                      Atrasados
                    </SelectItem>
                    <SelectItem value={EstadoCliente.MOROSO}>
                      Morosos
                    </SelectItem>
                    <SelectItem value={EstadoCliente.PAGO_PENDIENTE}>
                      Pago Pendiente
                    </SelectItem>
                    <SelectItem value={EstadoCliente.PENDIENTE_ACTIVO}>
                      Pendiente Activo
                    </SelectItem>
                    <SelectItem value={EstadoCliente.SUSPENDIDO}>
                      Suspendido
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zona de facturación */}
              <div className="space-y-2">
                <Label htmlFor="zona-filter">Zona de facturación</Label>
                <SelectZonaFacturacion
                  zonas={vm.zonas}
                  value={vm.zonasFacturacionIDs} // string[]
                  onChange={handleSelecZona}
                />
              </div>

              {/* Sectores */}
              <div className="space-y-2">
                <Label htmlFor="sector-filter">Sectores</Label>
                <SelectSectoresMulti
                  sectores={vm.sectores}
                  value={vm.sectorIDs} // string[]
                  onChange={handleSelecSectores}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TableBaseGeneric
            tableLayout="fixed"
            density="compact"
            stickyHeader={false}
            onRefetch={vm.refetchClientes}
            isFetching={vm.isFetchingClientes}
            isLoading={vm.isInitialClientes}
            columns={columnsClientesRutaCreate}
            data={vm.clientes}
            serverPagination
            total={vm.total}
            pageIndex={vm.page - 1}
            pageSize={vm.perPage}
            onPageChange={(pi, ps) => {
              if (ps !== vm.perPage) {
                vm.setPerPage(ps);
                vm.setPage(1);
                return;
              }
              vm.setPage(pi + 1);
            }}
            getRowId={(r) => String(r.id)}
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={handleRowSelectionChange}
            getRowCanSelect={(row) =>
              ((row.facturasPendientes ?? row.facturas?.length) || 0) > 0
            }
          />
        </CardContent>
      </Card>

      <AdvancedDialogCRM
        type="confirmation"
        title="Confirmar creación de la ruta de cobro"
        description="¿Deseas crear esta ruta de cobro con la información ingresada? Podrás editarla más adelante desde el módulo de rutas."
        onOpenChange={setOpenCreate}
        open={openCreate}
        confirmButton={{
          label: "Sí, crear ruta",
          disabled: vm.isSubmitting,
          loading: vm.isSubmitting,
          loadingText: "Creando ruta...",
          onClick: () => createRuta(),
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: vm.isSubmitting,
          loadingText: "Cancelando...",
          onClick: () => setOpenCreate(false),
        }}
      />
    </form>
  );
}
