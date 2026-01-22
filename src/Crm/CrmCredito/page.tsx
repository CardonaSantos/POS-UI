import { useGetUsuarios } from "@/Crm/CrmHooks/useGetUsuarios/useUsuarios";
import { CreditoForm } from "./form/credito-form";
import { CreditoFormValues } from "./form/schema.zod";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";
import { useGetUsersToSelect } from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";

function CrmCreditoMainPage() {
  const { data: clientes } = useGetCustomerToSelect();
  const { data: users } = useGetUsersToSelect();

  const clientesSecure = clientes ? clientes : [];

  const usersSecure = users ? users : [];

  console.log("clientes son: ", clientesSecure);

  const handleSubmit = (data: CreditoFormValues) => {
    console.log("Crédito creado:", data);
    alert("Crédito creado exitosamente. Ver consola para detalles.");
  };

  const clienteOptions = clientesSecure.map((c) => ({
    value: c.id,
    label: c.nombre,
  }));

  const usuarioOptions = usersSecure.map((u) => ({
    value: u.id,
    label: u.nombre,
  }));

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <div className="">
        <CreditoForm
          onSubmit={handleSubmit}
          clientes={clienteOptions}
          usuarios={usuarioOptions}
        />
      </div>
    </PageTransitionCrm>
  );
}

export default CrmCreditoMainPage;
