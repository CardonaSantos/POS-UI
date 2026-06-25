"use client";

import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

interface Props {
  customerId: number;
}

function EmptyImages({ customerId }: Props) {
  return (
    <AppEmptyState
      preset="empty"
      variant="dashed"
      size="md"
      align="center"
      icon={<Ghost size={26} />}
      title="Sin recursos disponibles"
      description="Aún no hay imágenes o archivos cargados para este cliente."
      action={
        <AppButton asChild variant="secondary" size="sm" width="auto">
          <Link to={`/crm/cliente-edicion/${customerId}`}>Actualizar</Link>
        </AppButton>
      }
    />
  );
}

export default EmptyImages;
