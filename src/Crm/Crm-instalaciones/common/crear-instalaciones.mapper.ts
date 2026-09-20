import { CrearInstalacionFormValues } from "@/Crm/CrmHomologaciones/schema/schema";
import { PerfilHomologacionSelectMeta } from "@/Crm/features/pppoe-homologaciones/intefaces";
import {
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
} from "@/Crm/features/instalaciones/enums";

import { CrearClienteInstalacionPayload } from "./crear-instalacion.payload";

type HomologacionSeleccionadaPayload = PerfilHomologacionSelectMeta & {
  id: number;
};

type CrearInstalacionPayloadContext = {
  empresaId: number;
  homologacionSeleccionada: HomologacionSeleccionadaPayload | null;
};

function toOptionalString(value?: string | null): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
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
  const requierePrealtaPppoe =
    values.acceso.tecnologia === TecnologiaAccesoInternet.FIBRA_GPON &&
    values.acceso.metodoAutenticacion === MetodoAutenticacionInternet.PPPOE;

  const perfilHomologacionId = values.acceso.perfilHomologacionId;

  const homologacionValida =
    context.homologacionSeleccionada !== null &&
    perfilHomologacionId !== null &&
    context.homologacionSeleccionada.id === perfilHomologacionId;

  if (requierePrealtaPppoe && !homologacionValida) {
    throw new Error(
      "No fue posible resolver la homologación PPPoE seleccionada.",
    );
  }

  const servicioInternetId = requierePrealtaPppoe
    ? context.homologacionSeleccionada!.servicioInternetId
    : (values.servicioInternetId ?? undefined);

  const mikrotikRouterId = requierePrealtaPppoe
    ? context.homologacionSeleccionada!.mikrotikRouterId
    : (values.acceso.mikrotikRouterId ?? undefined);

  const costos = {
    costoInstalacion: toOptionalNumber(values.costos.costoInstalacion),
    costoMateriales: toOptionalNumber(values.costos.costoMateriales),
    costoManoObra: toOptionalNumber(values.costos.costoManoObra),
    costoOtros: toOptionalNumber(values.costos.costoOtros),
    // montoCobradoCliente: toOptionalNumber(values.costos.montoCobradoCliente),
    // saldoPendiente: toOptionalNumber(values.costos.saldoPendiente),
    notas: toOptionalString(values.costos.notas),
  };

  const hasCostos = Object.values(costos).some((value) => value !== undefined);

  return {
    empresaId: context.empresaId,

    clienteId: values.clienteId as number,

    // Se utiliza el servicio derivado de la homologación.
    servicioInternetId,

    ticketId: values.ticketId ?? undefined,

    // asesorId: values.asesorId ?? undefined,
    asesorId: values.asesorId,

    acceso: {
      modo: values.acceso.modo,
      tecnologia: values.acceso.tecnologia,
      metodoAutenticacion: values.acceso.metodoAutenticacion,

      // Se utiliza el router derivado de la homologación.
      ...(mikrotikRouterId === undefined
        ? {}
        : {
            mikrotikRouterId,
          }),
    },

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
              values.tecnicoResponsableId !== null &&
              tecnicoId === values.tecnicoResponsableId,
          }))
        : undefined,
  };
}
