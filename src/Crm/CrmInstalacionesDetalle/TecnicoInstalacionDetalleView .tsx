import { memo } from "react";

import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";

import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";

import { AccesosPppoeCard } from "./components/accesos-pppoe-card";
import { ClienteUbicacionCard } from "./components/cliente-ubicacion-card";
import { CostosInstalacionCard } from "./components/costos-instalacion-card";
import { EquiposCard } from "./components/equipos-card";
import { EvidenciasCard } from "./components/evidencias-card";
import { InstalacionWorkflowCard } from "./components/instalacion-workflow-card";
import { ParticipantesCard } from "./components/participantes-card";
import { TrabajoCard } from "./components/trabajo-card";

import type { InstalacionDetalleActionRequest } from "./tecnico-instalacion-detalle.utils";

type TecnicoInstalacionDetalleViewProps = {
  detalle: DetalleInstalacionTecnicaResponse;

  onBack: () => void;

  onAction: (request: InstalacionDetalleActionRequest) => void;
};

export const TecnicoInstalacionDetalleView = memo(
  function TecnicoInstalacionDetalleView({
    detalle,
    onAction,
  }: TecnicoInstalacionDetalleViewProps) {
    return (
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <AppStack gap="sm">
          <InstalacionWorkflowCard detalle={detalle} onAction={onAction} />

          <div
            className="
        grid min-w-0 gap-3
        lg:grid-cols-[minmax(0,1fr)_18rem]
        lg:items-start
      "
          >
            <AppStack gap="sm">
              <ClienteUbicacionCard
                cliente={detalle.cliente}
                ubicacion={detalle.ubicacion}
              />

              <AccesosPppoeCard detalle={detalle} onAction={onAction} />

              <TrabajoCard trabajo={detalle.trabajo} />

              <EvidenciasCard evidencias={detalle.evidencias} />
            </AppStack>

            <AppStack gap="sm">
              <EquiposCard equipos={detalle.equipos} />

              <CostosInstalacionCard detalle={detalle} />

              <ParticipantesCard participantes={detalle.participantes} />
            </AppStack>
          </div>
        </AppStack>
      </AppContainer>
    );
  },
);
