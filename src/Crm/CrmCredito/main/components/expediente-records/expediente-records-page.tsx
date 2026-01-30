import { FileText } from "lucide-react";
import { ExpedienteItem } from "./expediente-item";
import { ClienteExpedienteDto } from "@/Crm/features/expediente-cliente/expediente.interface";

interface Props {
  expedientes: Array<ClienteExpedienteDto>;
  handleSelectToDelete: (id: number) => void;
}

function ExpedienteRecordsPage({ expedientes, handleSelectToDelete }: Props) {
  return (
    <div>
      {expedientes.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No hay expedientes registrados
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {expedientes.map((expediente) => (
            <ExpedienteItem
              key={expediente.id}
              expediente={expediente}
              handleSelectToDelete={handleSelectToDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpedienteRecordsPage;
