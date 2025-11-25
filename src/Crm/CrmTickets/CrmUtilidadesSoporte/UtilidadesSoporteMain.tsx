"use client";
import type React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tag,
  Save,
  AlertCircle,
  Loader2,
  Ticket,
  CheckCheck,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";
import TagsTicketMain from "./_components/TagsTicketMain";
import {
  ReusableTabs,
  TabItem,
} from "@/Crm/Utils/Components/tabs/reusable-tabs";
import SolucionesTicketMain from "./_components/SolucionesTicketMain";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface NuevaEtiquetaTicket {
  nombre: string;
}

// Componente principal
const EtiquetaTicketManage: React.FC = () => {
  const [etiquetas, setEtiquetas] = useState<EtiquetaTicket[]>([]);
  const [searchEtiqueta, setSearchEtiqueta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState<NuevaEtiquetaTicket>({
    nombre: "",
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEtiqueta, setEditingEtiqueta] = useState<EtiquetaTicket | null>(
    null
  );
  const [deleteEtiquetaId, setDeleteEtiquetaId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("TicketTags");
  const [stats, setStats] = useState({
    totalEtiquetas: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    fetchEtiquetas();
  }, []);

  const fetchEtiquetas = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/tags-ticket`);
      if (response.status === 200) {
        setEtiquetas(response.data);

        const totalTickets = response.data.reduce(
          (acc: number, curr: EtiquetaTicket) => acc + (curr.ticketsCount || 0),
          0
        );

        setStats({
          totalEtiquetas: response.data.length,
          totalTickets,
        });

        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar etiquetas:", err);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNuevaEtiqueta({ nombre: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editingEtiqueta) {
      setEditingEtiqueta((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } else {
      setNuevaEtiqueta((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitEtiqueta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!nuevaEtiqueta.nombre.trim()) {
        throw new Error("El nombre de la etiqueta no puede estar vacío");
      }

      if (
        etiquetas.some(
          (e) => e.nombre.toLowerCase() === nuevaEtiqueta.nombre.toLowerCase()
        )
      ) {
        throw new Error("Ya existe una etiqueta con este nombre");
      }

      const response = await axios.post(
        `${VITE_CRM_API_URL}/tags-ticket`,
        nuevaEtiqueta
      );

      if (response.status === 201) {
        toast.success("Etiqueta creada exitosamente");
        await fetchEtiquetas();
        resetForm();
        setIsCreateDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error al crear etiqueta:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (etiqueta: EtiquetaTicket) => {
    setEditingEtiqueta(etiqueta);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEtiqueta) return;

    setIsLoading(true);

    try {
      if (!editingEtiqueta.nombre.trim()) {
        throw new Error("El nombre de la etiqueta no puede estar vacío");
      }
      if (
        etiquetas.some(
          (e) =>
            e.id !== editingEtiqueta.id &&
            e.nombre.toLowerCase() === editingEtiqueta.nombre.toLowerCase()
        )
      ) {
        throw new Error("Ya existe una etiqueta con este nombre");
      }

      setTimeout(() => {
        setEtiquetas(
          etiquetas.map((e) =>
            e.id === editingEtiqueta.id ? editingEtiqueta : e
          )
        );

        setIsEditDialogOpen(false);
        setEditingEtiqueta(null);
        setIsLoading(false);

        toast.success("Etiqueta actualizada correctamente");
      }, 600);
    } catch (err: any) {
      console.error("Error al actualizar etiqueta:", err);

      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteEtiquetaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteEtiquetaId === null) return;

    setIsLoading(true);

    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/tags-ticket/delete-ticket/${deleteEtiquetaId}`
      );

      if (response.status === 200) {
        toast.success("Etiqueta eliminada exitosamente");
        await fetchEtiquetas();
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      console.error("Error al eliminar etiqueta:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEtiquetas = etiquetas.filter((etiqueta) =>
    etiqueta.nombre.toLowerCase().includes(searchEtiqueta.toLowerCase())
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabs: Array<TabItem> = [
    {
      label: "Tags Ticket",
      value: "TicketTags",
      icon: <Ticket size={16} />,
      content: (
        <TagsTicketMain
          etiquetas={etiquetas}
          filteredEtiquetas={filteredEtiquetas}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          isCreateDialogOpen={isCreateDialogOpen}
          isLoading={isLoading}
          searchEtiqueta={searchEtiqueta}
          setEtiquetas={setEtiquetas}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          setIsLoading={setIsLoading}
          setSearchEtiqueta={setSearchEtiqueta}
          setStats={setStats}
          stats={stats}
        />
      ),
    },
    {
      label: "Soluciones Ticket",
      value: "soluciones",
      content: <SolucionesTicketMain />,
      icon: <CheckCheck size={16} />,
    },
  ];

  return (
    <PageTransitionCrm titleHeader="Utilidades Soporte" variant="fade-pure">
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        defaultValue="TicketTags"
        handleTabChange={handleTabChange}
      />

      {/* Diálogo para Crear Etiqueta */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Etiqueta</DialogTitle>
            <DialogDescription>
              Ingrese un nombre único para la nueva etiqueta de tickets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEtiqueta}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Etiqueta</Label>
                <div className="relative">
                  <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    name="nombre"
                    className="pl-8"
                    placeholder="Ej: Soporte Técnico"
                    value={nuevaEtiqueta.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  El nombre debe ser único y descriptivo
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !nuevaEtiqueta.nombre.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Etiqueta"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Etiqueta</DialogTitle>
            <DialogDescription>
              Modifique el nombre de la etiqueta y guarde los cambios.
            </DialogDescription>
          </DialogHeader>
          {editingEtiqueta && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre de la Etiqueta</Label>
                <div className="relative">
                  <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-nombre"
                    name="nombre"
                    className="pl-8"
                    value={editingEtiqueta.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="gap-2"
              disabled={isLoading || !editingEtiqueta?.nombre.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta etiqueta? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Si hay tickets asociados a esta etiqueta, se eliminará la
                relación con ellos.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransitionCrm>
  );
};

export default EtiquetaTicketManage;
