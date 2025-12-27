import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, X, Settings2 } from "lucide-react";

import { useCreateTicketSoluciones, useDeleteTicketSoluciones, useGetTicketSoluciones, useUpdateTicketSoluciones } from "@/Crm/CrmHooks/hooks/use-ticket-soluciones/useTicketSoluciones";
import { CreateSolucionTicketDto, createSolucionTicketSchema } from "./form/zod"; // Asegúrate que la ruta sea correcta
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import { TicketSolucionesForm } from "./form/form";
import { TicketSolucionesList } from "./map/map-regists";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";
import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog"


function SolucionesTicketMain() {
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const [openEdit, setOpenEdit] = useState<boolean>(false)

  const [selectedResolucion, setSelectedResolucion] = useState<SolucionTicketItem | null>(null)

  const { data: ticketS, isLoading: isLoadingList } = useGetTicketSoluciones();
  const ticketSolutions = ticketS || [];

  const form = useForm<CreateSolucionTicketDto>({
    resolver: zodResolver(createSolucionTicketSchema),
    defaultValues: {
      solucion: "",
      descripcion: "",
      isEliminado: false,
    },
  });

  // Mutación y Handlers
  const createTicketSolucion = useCreateTicketSoluciones();
  const updateTicketSolution = useUpdateTicketSoluciones();
  const deleteTicketSolucion = useDeleteTicketSoluciones(selectedResolucion?.id?? 0);
  const openToggleDelete = ()=> setOpenDelete(!openDelete)

  const handleSelectResolucion = (regist:SolucionTicketItem)=> {
    setSelectedResolucion(regist)
    setOpenDelete(true)
  }

  const handleSelectEdit=(regist:SolucionTicketItem)=> {
    setSelectedResolucion(regist)
    setOpenEdit(true)
    form.reset({
      descripcion: regist.descripcion,
      solucion: regist.solucion,
    })
  }

  const handleToggleShow = () => {
    form.reset({
        descripcion:"",
        isEliminado: false,
        solucion: ""
      })
    setShowCreate(!showCreate);
  };

  const onSubmit = (data: CreateSolucionTicketDto) => {
    toast.promise(createTicketSolucion.mutateAsync(data), {
      loading: 'Creando nuevo registro...',
      success: () => {
        form.reset({
          descripcion: "",
          isEliminado: false,
          solucion: ""
        });
        setShowCreate(false); // Cerramos el formulario al terminar con éxito
        return "Registro creado exitosamente";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const onSubmitEdit = (data:Partial<CreateSolucionTicketDto>)=> {
    const payload = {
      descripcion: data.descripcion,
      solucion: data.solucion,
      id: selectedResolucion?.id,
    }
    toast.promise(
      updateTicketSolution.mutateAsync(payload), {
        loading: "Editando...",
        success: ()=> {
          form.reset({
          descripcion: "",
          isEliminado: false,
          solucion: "",
        });
        setOpenEdit(false)
          return "Actualizado"
        },
        error: (error)=> getApiErrorMessageAxios(error)
      }
    )
  }

const onDelete = () => {
  if (!selectedResolucion) {
    toast.info("Seleccione un registro");
    return;
  }

  if (!selectedResolucion.id) {
    toast.error("Error: El registro seleccionado no tiene un ID válido.");
    return;
  }

  toast.promise(
    deleteTicketSolucion.mutateAsync(selectedResolucion.id), 
    {
      loading: "Eliminando registro...",
      success: () => {
        form.reset({
          descripcion: "",
          isEliminado: false,
          solucion: ""
        });
        setSelectedResolucion(null); 
        setOpenDelete(false);
        return "Registro eliminado";
      },
      error: (error) => getApiErrorMessageAxios(error)
    }
  );
};
  console.log('resolucion seleccionado: ', selectedResolucion);

  return (
    <div className="flex flex-col gap-8 p-6 mx-auto w-full ">
      
      {/* --- ENCABEZADO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="" />
            Catálogo de Soluciones
          </h2>
          
        </div>

        <Button
          onClick={handleToggleShow}
          variant={showCreate ? "destructive" : "default"} // Cambia color si está abierto
          size="sm"
          className="shadow-sm"
        >
          {showCreate ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Nueva Solución
            </>
          )}
        </Button>
      </div>

      <Separator className="my-2" />

      {/* --- AREA DE CREACIÓN (Condicional) --- */}
      {showCreate && (
        <div className="w-full flex justify-center rounded-lg border border-dashed ">
          <div className="w-full max-w-lg">
             <TicketSolucionesForm
                form={form}
                onSubmit={onSubmit}
                isLoading={createTicketSolucion.isPending}
              />
          </div>
        </div>
      )}

      {/* --- LISTADO DE REGISTROS --- */}
      <div className="w-full">
        {isLoadingList ? (
           // Skeleton simple o texto de carga
           <div className="text-center py-10 text-zinc-500">Cargando catálogo...</div>
        ) : (
          <TicketSolucionesList 
          handleSelectEdit={handleSelectEdit}
          handleSelectResolucion={handleSelectResolucion}
          openToggleDelete={openToggleDelete}
          onDelete={onDelete}
          data={ticketSolutions} 
            itemsPerPage={5}
          />
        )}
      </div>
      <AdvancedDialogCRM
        type="destructive"
        title="Eliminación de resolución de ticket"
        description="Se eliminará el siguiente registro, y sus referencias en otros tickets usados. ¿Estás seguro?"
        open={openDelete}
        onOpenChange={setOpenDelete}
        confirmButton={{
          label: 'Si, continuar',
          disabled: deleteTicketSolucion.isPending,
          loading: deleteTicketSolucion.isPending,
          loadingText: 'Eliminando registro',
          onClick: onDelete,
          variant: 'destructive'
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: deleteTicketSolucion.isPending,
          onClick: openToggleDelete,
        }}
      />

      <Dialog
      open={openEdit}
      onOpenChange={setOpenEdit}
      >
        <DialogContent>

          <TicketSolucionesForm
          form={form}
          onSubmit={onSubmitEdit}
          isLoading={updateTicketSolution.isPending}
          />
      </DialogContent>
      </Dialog>
    </div>
  );
}

export default SolucionesTicketMain;