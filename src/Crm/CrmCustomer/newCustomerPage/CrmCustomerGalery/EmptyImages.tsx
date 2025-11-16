import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  customerId: number;
}
function EmptyImages({ customerId }: Props) {
  return (
    <div>
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Ghost />
          </EmptyMedia>
          <EmptyTitle>Sin recursos disponibles</EmptyTitle>
          <EmptyDescription>
            Oops, parece que aún no hay nada cargado
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to={`/crm/cliente-edicion/${customerId}`}>
            <Button variant="outline" size="sm">
              Actualizar
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default EmptyImages;
