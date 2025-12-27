
// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CreateSolucionTicketDto,  } from "./zod";
import { Save, Ticket } from "lucide-react";


// Definimos las props que recibe el componente
interface TicketSolucionesFormProps {
  form: UseFormReturn<CreateSolucionTicketDto>; // <--- La magia del tipado
  onSubmit: (data: CreateSolucionTicketDto) => void; // La función que se ejecuta al guardar
  isLoading?: boolean; // Opcional: para deshabilitar el botón mientras guarda
}


export const TicketSolucionesForm = ({
    form,
    onSubmit,
    isLoading,
}:TicketSolucionesFormProps) => {
  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-lg shadow-sm ">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-zinc-500" />
            <CardTitle className="text-xl font-semibold">Nueva Solución</CardTitle>
          </div>
          <CardDescription>
            Registra una posible solución para el ticket actual.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* CAMPO: Solución */}
              <FormField
                control={form.control}
                name="solucion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Solución</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Reinicio de Mikrotik" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CAMPO: Descripción */}
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Detallada</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe paso a paso la solución aplicada..." 
                        className="resize-none min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-zinc-500">
                      Sé específico para futuras referencias del equipo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Botón de Submit */}
              <Button type="submit" className="w-full flex gap-2">
                <Save className="h-4 w-4" />
                {isLoading?"Creando..." : "Guardar Solución"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};