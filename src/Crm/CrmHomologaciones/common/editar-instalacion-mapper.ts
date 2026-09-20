import { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { EditarInstalacionFormValues } from "../schema/editar-stalacion.schema";

export function toEditarInstalacionFormValues(
  detalle: ClienteInstalacionDetalle,
): EditarInstalacionFormValues {
  const tecnicoResponsable =
    detalle.tecnicos.find(
      (tecnico) => tecnico.esResponsable && tecnico.tecnicoId !== null,
    ) ?? null;

  const tecnicoIds = detalle.tecnicos
    .map((tecnico) => tecnico.tecnicoId)
    .filter((id): id is number => id !== null);

  const coordenadas =
    detalle.ubicacion.latitud !== null && detalle.ubicacion.longitud !== null
      ? `${detalle.ubicacion.latitud}, ${detalle.ubicacion.longitud}`
      : "";

  return {
    tipo: detalle.tipo,

    asesorId: detalle.asesorId ?? null,

    ticketId: detalle.ticketId ?? null,

    descripcion: detalle.descripcion ?? "",

    motivo: detalle.motivo ?? "",

    observaciones: detalle.observaciones ?? "",

    fechaProgramada: detalle.fechaProgramada?.slice(0, 10) ?? null,

    direccionInstalacion: detalle.ubicacion.direccion ?? "",

    referenciaUbicacion: detalle.ubicacion.referencia ?? "",

    coordenadas,

    tecnicoIds,

    tecnicoResponsableId: tecnicoResponsable?.tecnicoId ?? null,

    costos: {
      costoInstalacion: String(detalle.costos.costoInstalacion ?? 0),

      costoMateriales: String(detalle.costos.costoMateriales ?? 0),

      costoManoObra: String(detalle.costos.costoManoObra ?? 0),

      costoOtros: String(detalle.costos.costoOtros ?? 0),

      montoCobradoCliente: String(detalle.costos.montoCobradoCliente ?? 0),

      notas: detalle.costos.notas ?? "",
    },
  };
}
