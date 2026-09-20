import { RolTecnicoOperacionCliente } from "@/Crm/features/instalaciones/enums";
import { EditarInstalacionFormValues } from "../schema/editar-stalacion.schema";
import { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { ActualizarClienteInstalacionPayload } from "@/Crm/features/instalaciones/edicion-instalaciones";

function optionalTrimmed(value: string | null | undefined): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function moneyToNumber(value: string): number {
  const normalized = value.trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCoordinates(value: string): {
  latitud: number | null;
  longitud: number | null;
} {
  const normalized = value.trim();

  if (!normalized) {
    return {
      latitud: null,
      longitud: null,
    };
  }

  const [latitudRaw, longitudRaw] = normalized.split(",");

  return {
    latitud: Number(latitudRaw.trim()),
    longitud: Number(longitudRaw.trim()),
  };
}

export function toActualizarInstalacionPayload(
  values: EditarInstalacionFormValues,
  detalleActual: ClienteInstalacionDetalle,
): ActualizarClienteInstalacionPayload {
  const coordinates = parseCoordinates(values.coordenadas);

  const tecnicosActuales = new Map(
    detalleActual.tecnicos
      .filter(
        (
          tecnico,
        ): tecnico is typeof tecnico & {
          tecnicoId: number;
        } => tecnico.tecnicoId !== null,
      )
      .map((tecnico) => [tecnico.tecnicoId, tecnico]),
  );

  const tecnicos = values.tecnicoIds.map((tecnicoId) => {
    const actual = tecnicosActuales.get(tecnicoId);

    const esResponsable = tecnicoId === values.tecnicoResponsableId;

    let rol: RolTecnicoOperacionCliente;

    if (esResponsable) {
      rol = RolTecnicoOperacionCliente.RESPONSABLE;
    } else if (
      actual?.esResponsable ||
      actual?.rol === RolTecnicoOperacionCliente.RESPONSABLE
    ) {
      /*
       * Si era responsable y ahora deja de
       * serlo, pasa a apoyo.
       */
      rol = RolTecnicoOperacionCliente.APOYO;
    } else {
      /*
       * Conserva roles especiales ya existentes:
       * SUPERVISOR, COBRADOR, OTRO, etc.
       */
      rol = actual?.rol ?? RolTecnicoOperacionCliente.APOYO;
    }

    return {
      tecnicoId,

      rol,

      esResponsable,

      tiempoMinutos: actual?.tiempoMinutos ?? null,

      observaciones: actual?.observaciones ?? null,
    };
  });

  return {
    tipo: values.tipo,

    asesorId: values.asesorId,

    ticketId: values.ticketId,

    descripcion: values.descripcion.trim(),

    motivo: optionalTrimmed(values.motivo),

    observaciones: optionalTrimmed(values.observaciones),

    fechaProgramada: values.fechaProgramada || null,

    direccionInstalacion: optionalTrimmed(values.direccionInstalacion),

    referenciaUbicacion: optionalTrimmed(values.referenciaUbicacion),

    latitud: coordinates.latitud,

    longitud: coordinates.longitud,

    costos: {
      costoInstalacion: moneyToNumber(values.costos.costoInstalacion),

      costoMateriales: moneyToNumber(values.costos.costoMateriales),

      costoManoObra: moneyToNumber(values.costos.costoManoObra),

      costoOtros: moneyToNumber(values.costos.costoOtros),

      montoCobradoCliente: moneyToNumber(values.costos.montoCobradoCliente),

      notasCostos: optionalTrimmed(values.costos.notas),
    },

    tecnicos,
  };
}
