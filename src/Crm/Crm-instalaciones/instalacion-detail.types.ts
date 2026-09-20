import type { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { PlantillasInterface } from "../features/plantilla-contratos/plantilla-contratos";

export type InstalacionDetailViewProps = {
  instalacion: ClienteInstalacionDetalle;
  empresaId: number;
  onOpenEvidence: (index: number) => void;
  plantillas: PlantillasInterface[];
};

export type InstalacionDetailTab = "detalle" | "auditoria" | "pppoe";
