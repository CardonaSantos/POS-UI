"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "../features/zonas-facturacion/FacturacionZonaTypes";
import { Search, Plus, RefreshCw, Users, FileText, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import {
  useDeleteZona,
  useGetZonasFacturacion,
  usePatchZona,
  usePostZona,
} from "../CrmHooks/hooks/use-zonas-facturacion/use-zonas-facturacion";
import ZonaTable from "./components/ZonaTable";
import CreateZonaDialog from "./components/CreateZonaDialog";
import EditZonaDialog from "./components/EditZonaDialogProps";
import DeleteZonaDialog from "./components/DeleteZonaDialog";

// ---------------------------------------------------------------------------
// Default form state
// ---------------------------------------------------------------------------
const defaultNuevaZona = (empresaId: number): NuevaFacturacionZona => ({
  nombre: "",
  empresaId,
  diaGeneracionFactura: 10,
  enviarRecordatorioGeneracion: false,
  diaPago: 20,
  enviarAvisoPago: false,
  diaRecordatorio: 5,
  enviarRecordatorio1: false,
  diaSegundoRecordatorio: 15,
  enviarRecordatorio2: false,
  horaRecordatorio: "08:00:00",
  enviarRecordatorio: true,
  diaCorte: 25,
  suspenderTrasFacturas: 2,
  creadoEn: "",
  actualizadoEn: "",
  email: false,
  whatsapp: true,
  sms: false,
  llamada: false,
  telegram: false,
});

// ---------------------------------------------------------------------------
// Stat card (no shadow, border only)
// ---------------------------------------------------------------------------
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  description,
  value,
}) => (
  <div className="rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3">
    <div className="shrink-0 text-muted-foreground">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground leading-none">{label}</p>
      <p className="text-xl font-semibold text-foreground leading-tight mt-1">
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-none truncate">
        {description}
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const FacturacionZonaManage: React.FC = () => {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  // ── Queries & mutations ──────────────────────────────────────────────────
  const { data: zonas = [], isLoading, refetch } = useGetZonasFacturacion();
  const { mutateAsync: postZona, isPending: isCreating } = usePostZona();
  const { mutateAsync: patchZona, isPending: isPatching } = usePatchZona();
  const deleteZonaMutation = useDeleteZona; // factory per id — called inside handler

  // ── Local UI state ───────────────────────────────────────────────────────
  const [searchZona, setSearchZona] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingZona, setEditingZona] = useState<FacturacionZona | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteZonaId, setDeleteZonaId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSubmitZona = async (zonaData: NuevaFacturacionZona) => {
    await postZona(zonaData);
    toast.success("Nueva zona de facturación creada");
    await refetch();
    setIsCreateOpen(false);
  };

  const handleSaveEdit = async (updatedZona: FacturacionZona) => {
    await patchZona(updatedZona);
    toast.success("Zona de facturación actualizada");
    await refetch();
    setIsEditOpen(false);
    setEditingZona(null);
  };

  const handleEditClick = (zona: FacturacionZona) => {
    setEditingZona(zona);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteZonaId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteZonaId === null) return;
    setIsDeleting(true);
    try {
      const { mutateAsync: deleteZona } = deleteZonaMutation(deleteZonaId);
      await deleteZona({} as FacturacionZona);
      toast.success("Zona de facturación eliminada");
      await refetch();
      setIsDeleteOpen(false);
      setDeleteZonaId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────
  const filteredZonas = zonas.filter((z) =>
    z.nombre.toLowerCase().includes(searchZona.toLowerCase()),
  );

  const totalClientes = zonas.reduce(
    (acc, z) => acc + (z.clientesCount ?? 0),
    0,
  );
  const totalFacturas = zonas.reduce(
    (acc, z) => acc + (z.facturasCount ?? 0),
    0,
  );

  const skeletonValue = <Skeleton className="h-7 w-12 mt-0.5" />;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <PageTransitionCrm
      titleHeader="Zonas de facturación"
      subtitle=""
      variant="fade-pure"
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar zona..."
            className="pl-8"
            value={searchZona}
            onChange={(e) => setSearchZona(e.target.value)}
            aria-label="Buscar zona de facturación"
          />
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            aria-label="Actualizar lista"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:ml-1.5">Actualizar</span>
          </Button>

          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="ml-1.5">Nueva zona</span>
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <StatCard
          icon={<Map className="h-4 w-4" />}
          label="Total zonas"
          description="Zonas de facturación configuradas"
          value={isLoading ? skeletonValue : zonas.length}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Total clientes"
          description="Clientes asignados a zonas"
          value={isLoading ? skeletonValue : totalClientes}
        />
        <StatCard
          icon={<FileText className="h-4 w-4" />}
          label="Total facturas"
          description="Facturas generadas en todas las zonas"
          value={isLoading ? skeletonValue : totalFacturas}
        />
      </div>

      {/* ── Table section ── */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="text-sm font-medium text-foreground">
              Zonas de facturación
            </p>
            <p className="text-xs text-muted-foreground">
              {filteredZonas.length} de {zonas.length} zonas
            </p>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : zonas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Map className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Sin zonas de facturación
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cree una nueva zona para comenzar.
                </p>
              </div>
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="ml-1.5">Nueva zona</span>
              </Button>
            </div>
          ) : filteredZonas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Sin resultados para &quot;{searchZona}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Intente con otro término de búsqueda.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchZona("")}
              >
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            <ZonaTable
              zonas={filteredZonas}
              searchTerm={searchZona}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* ── Dialogs ── */}
      <CreateZonaDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialData={defaultNuevaZona(empresaId)}
        onSubmit={handleSubmitZona}
        isLoading={isCreating}
      />

      <EditZonaDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        zona={editingZona}
        onSave={handleSaveEdit}
        isLoading={isPatching}
      />

      <DeleteZonaDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </PageTransitionCrm>
  );
};

export default FacturacionZonaManage;
