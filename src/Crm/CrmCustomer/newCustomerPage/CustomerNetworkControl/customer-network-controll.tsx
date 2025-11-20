import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";
interface BillingTabProps {
  cliente: ClienteDetailsDto;
}
function CustomerNetworkControl({ cliente }: BillingTabProps) {
  console.log("El cliente es: ", cliente);

  return (
    <div>
      <h2>Próximamente...</h2>
    </div>
  );
}

export default CustomerNetworkControl;
