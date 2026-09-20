import { memo } from "react";

import { AppBadge } from "@/components/app/primitives/app-badge";

import type { ClienteDesinstalacionDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";

import { formattShortFecha } from "@/utils/formattFechas";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

import { DetailItem, DetailSection } from "./desinstalacion-detail-ui";

function humanizeEnum(value: string | null) {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

function formatDate(value: string | null) {
  return value ? formattShortFecha(value) : "Sin fecha";
}

export const ResumenOperativoCard = memo(function ResumenOperativoCard({
  detalle,
}: {
  detalle: ClienteDesinstalacionDetalle;
}) {
  return (
    <DetailSection
      title="Resumen operativo"
      description="Estado y programación de la desinstalación."
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <DetailItem
          label="Estado"
          value={
            <AppBadge
              appearance="soft"
              size="xs"
              radius="full"
              tone={
                detalle.estado === "COMPLETADA"
                  ? "success"
                  : detalle.estado === "EN_PROCESO"
                    ? "primary"
                    : detalle.estado === "FALLIDA" ||
                        detalle.estado === "CANCELADA"
                      ? "danger"
                      : "info"
              }
            >
              {humanizeEnum(detalle.estado)}
            </AppBadge>
          }
        />

        <DetailItem label="Tipo" value={humanizeEnum(detalle.tipo)} />

        <DetailItem label="Motivo" value={humanizeEnum(detalle.motivo)} />

        <DetailItem
          label="Solicitud"
          value={formatDate(detalle.fechaSolicitud)}
        />

        <DetailItem
          label="Programada"
          value={formatDate(detalle.fechaProgramada)}
        />

        <DetailItem label="Inicio" value={formatDate(detalle.fechaInicio)} />

        <DetailItem
          label="Finalización"
          value={formatDate(detalle.fechaFinalizacion)}
        />

        <DetailItem
          label="Retiro de equipo"
          value={detalle.requiereRetiroEquipo ? "Requerido" : "No requerido"}
        />

        {detalle.observaciones ? (
          <DetailItem
            label="Observaciones"
            value={detalle.observaciones}
            className="col-span-2 sm:col-span-4"
          />
        ) : null}

        {detalle.resultado ? (
          <DetailItem
            label="Resultado"
            value={detalle.resultado}
            className="col-span-2 sm:col-span-4"
          />
        ) : null}
      </dl>
    </DetailSection>
  );
});

export const ClienteServicioCard = memo(function ClienteServicioCard({
  detalle,
}: {
  detalle: ClienteDesinstalacionDetalle;
}) {
  const clienteNombre = [detalle.cliente.nombre, detalle.cliente.apellidos]
    .filter(Boolean)
    .join(" ");

  return (
    <DetailSection
      title="Cliente y servicio"
      description="Cliente y servicio afectado por el retiro."
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <DetailItem
          label="Cliente"
          value={clienteNombre}
          className="col-span-2"
        />

        <DetailItem
          label="Teléfono"
          value={detalle.cliente.telefono ?? "Sin teléfono"}
        />

        <DetailItem label="DPI" value={detalle.cliente.dpi ?? "Sin DPI"} />

        <DetailItem
          label="Dirección"
          value={
            detalle.direccionServicio ??
            detalle.cliente.direccion ??
            "Sin dirección"
          }
          className="col-span-2"
        />

        <DetailItem
          label="Referencia"
          value={detalle.referenciaUbicacion ?? "Sin referencia"}
          className="col-span-2"
        />

        <DetailItem
          label="Servicio"
          value={detalle.servicioInternet?.nombre ?? "Sin servicio"}
        />

        <DetailItem
          label="Velocidad"
          value={detalle.servicioInternet?.velocidad ?? "-"}
        />

        <DetailItem
          label="Precio"
          value={
            detalle.servicioInternet
              ? formattMonedaGT(detalle.servicioInternet.precio ?? 0)
              : "-"
          }
        />
      </dl>
    </DetailSection>
  );
});

export const CostosDesinstalacionCard = memo(function CostosDesinstalacionCard({
  detalle,
}: {
  detalle: ClienteDesinstalacionDetalle;
}) {
  const costos = detalle.costos;

  const total =
    costos.costoDesinstalacion +
    costos.costoTransporte +
    costos.costoManoObra +
    costos.costoOtros;

  return (
    <DetailSection title="Costos">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
        <DetailItem
          label="Desinstalación"
          value={formattMonedaGT(costos.costoDesinstalacion)}
        />

        <DetailItem
          label="Transporte"
          value={formattMonedaGT(costos.costoTransporte)}
        />

        <DetailItem
          label="Mano de obra"
          value={formattMonedaGT(costos.costoManoObra)}
        />

        <DetailItem label="Otros" value={formattMonedaGT(costos.costoOtros)} />

        <DetailItem
          label="Total"
          value={
            <span className="font-semibold">{formattMonedaGT(total)}</span>
          }
        />

        <DetailItem
          label="Saldo cliente"
          value={formattMonedaGT(costos.saldoClienteAlMomento)}
        />
      </dl>
    </DetailSection>
  );
});

export const ParticipantesCard = memo(function ParticipantesCard({
  detalle,
}: {
  detalle: ClienteDesinstalacionDetalle;
}) {
  return (
    <DetailSection title="Participantes">
      <dl className="grid grid-cols-1 gap-y-3">
        <DetailItem
          label="Solicitado por"
          value={detalle.solicitadoPor?.nombre ?? "Sin registro"}
        />

        <DetailItem
          label="Ejecutado por"
          value={detalle.ejecutadoPor?.nombre ?? "Aún no ejecutado"}
        />

        <DetailItem
          label="Creado por"
          value={detalle.creadoPor?.nombre ?? "Sin registro"}
        />

        <DetailItem label="Técnicos" value={detalle.conteos.tecnicos} />
      </dl>
    </DetailSection>
  );
});

export const AutorizacionCard = memo(function AutorizacionCard({
  detalle,
}: {
  detalle: ClienteDesinstalacionDetalle;
}) {
  const autorizacion = detalle.ultimaAutorizacion;

  return (
    <DetailSection title="Autorización">
      {!autorizacion ? (
        <p className="text-xs text-muted-foreground">
          No existe una solicitud de autorización.
        </p>
      ) : (
        <dl className="grid grid-cols-1 gap-y-3">
          <DetailItem
            label="Estado"
            value={
              <AppBadge
                tone={
                  autorizacion.estado === "APROBADA"
                    ? "success"
                    : autorizacion.estado === "PENDIENTE"
                      ? "warning"
                      : autorizacion.estado === "RECHAZADA"
                        ? "danger"
                        : "neutral"
                }
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizeEnum(autorizacion.estado)}
              </AppBadge>
            }
          />

          <DetailItem
            label="Solicitada"
            value={formatDate(autorizacion.fechaSolicitud)}
          />

          <DetailItem
            label="Respondida"
            value={formatDate(autorizacion.fechaRespuesta)}
          />

          <DetailItem
            label="Autorizado por"
            value={autorizacion.autorizadoPor?.nombre ?? "-"}
          />

          {autorizacion.motivoSolicitud ? (
            <DetailItem label="Motivo" value={autorizacion.motivoSolicitud} />
          ) : null}

          {autorizacion.comentarioAutorizador ? (
            <DetailItem
              label="Comentario"
              value={autorizacion.comentarioAutorizador}
            />
          ) : null}
        </dl>
      )}
    </DetailSection>
  );
});
