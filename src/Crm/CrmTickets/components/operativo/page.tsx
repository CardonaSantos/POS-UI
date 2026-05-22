import { UsuarioToTicket } from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";
import TicketReportTopBar from "./filterts";
interface Props {
  tecnicos: Array<UsuarioToTicket>;
}
function OperativoMainPage({ tecnicos }: Props) {
  return (
    <div>
      <TicketReportTopBar tecnicos={tecnicos} />
    </div>
  );
}

export default OperativoMainPage;
