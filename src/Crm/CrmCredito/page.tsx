import { CreditoForm } from "./form/credito-form";
import { CreditoFormValues } from "./form/schema.zod";

// Mock data para demo
const mockClientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María García" },
  { id: 3, nombre: "Carlos López" },
  { id: 4, nombre: "Ana Martínez" },
];

const mockUsuarios = [
  { id: 1, nombre: "Admin Sistema" },
  { id: 2, nombre: "Vendedor 1" },
  { id: 3, nombre: "Gerente" },
];

function CrmCreditoMainPage() {
  const handleSubmit = (data: CreditoFormValues) => {
    console.log("Crédito creado:", data);
    alert("Crédito creado exitosamente. Ver consola para detalles.");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <CreditoForm
        onSubmit={handleSubmit}
        clientes={mockClientes}
        usuarios={mockUsuarios}
      />
    </div>
  );
}

export default CrmCreditoMainPage;
