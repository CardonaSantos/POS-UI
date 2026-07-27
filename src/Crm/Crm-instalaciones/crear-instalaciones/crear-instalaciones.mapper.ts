import { CrearClienteInstalacionPayload } from "@/Crm/features/instalaciones/crear-instalacion.payload";
import { CrearInstalacionFormValues } from "./zod.schema";

type CrearInstalacionPayloadContext = {
  empresaId: number;
  creadoPorId: number;
  asesorId?: number;
};

function toOptionalString(value?: string | null): string | undefined {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

function toOptionalNumber(value?: string | null): number | undefined {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toCrearInstalacionPayload(
  values: CrearInstalacionFormValues,
  context: CrearInstalacionPayloadContext,
): CrearClienteInstalacionPayload {
  const costos = {
    costoInstalacion: toOptionalNumber(values.costos.costoInstalacion),

    costoMateriales: toOptionalNumber(values.costos.costoMateriales),

    costoManoObra: toOptionalNumber(values.costos.costoManoObra),

    costoOtros: toOptionalNumber(values.costos.costoOtros),

    montoCobradoCliente: toOptionalNumber(values.costos.montoCobradoCliente),

    saldoPendiente: toOptionalNumber(values.costos.saldoPendiente),

    notas: toOptionalString(values.costos.notas),
  };

  const hasCostos = Object.values(costos).some((value) => value !== undefined);

  return {
    empresaId: context.empresaId,

    clienteId: values.clienteId as number,

    servicioInternetId: values.servicioInternetId ?? undefined,

    ticketId: values.ticketId ?? undefined,

    asesorId: values.asesorId,

    creadoPorId: context.creadoPorId,

    tipo: values.tipo,

    estado: values.estado,

    descripcion: toOptionalString(values.descripcion),

    motivo: toOptionalString(values.motivo),

    observaciones: toOptionalString(values.observaciones),

    fechaProgramada: values.fechaProgramada ?? undefined,

    fechaInicio: values.fechaInicio ?? undefined,

    direccionInstalacion: toOptionalString(values.direccionInstalacion),

    referenciaUbicacion: toOptionalString(values.referenciaUbicacion),

    coordenadas: toOptionalString(values.coordenadas),

    costos: hasCostos ? costos : undefined,

    tecnicos:
      values.tecnicoIds.length > 0
        ? values.tecnicoIds.map((tecnicoId) => ({
            tecnicoId,

            esResponsable:
              values.tecnicoResponsableId !== null
                ? tecnicoId === values.tecnicoResponsableId
                : false,
          }))
        : undefined,
  };
}
