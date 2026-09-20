import { memo } from "react";

import {
  Building2,
  ExternalLink,
  Fingerprint,
  MapPin,
  MapPinned,
  MessageCircle,
  MessageSquareText,
  Navigation,
  Phone,
  UserRound,
} from "lucide-react";

import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { getCoordinatesUrl } from "../tecnico-instalacion-detalle.utils";

import { DetailValueRow } from "./detail-value-row";
import { DetalleSectionCard } from "./detalle-section-card";

type ClienteUbicacionCardProps = {
  cliente: DetalleInstalacionTecnicaResponse["cliente"];

  ubicacion: DetalleInstalacionTecnicaResponse["ubicacion"];
};

export const ClienteUbicacionCard = memo(function ClienteUbicacionCard({
  cliente,
  ubicacion,
}: ClienteUbicacionCardProps) {
  const mapsUrl = getCoordinatesUrl(ubicacion.latitud, ubicacion.longitud);

  const zona = [cliente.sector, cliente.municipio, cliente.departamento]
    .filter(Boolean)
    .join(" · ");

  return (
    <DetalleSectionCard
      id="cliente-ubicacion"
      title="Cliente y ubicación"
      icon={UserRound}
    >
      <AppStack gap="sm">
        {/* Identificación */}
        <AppGrid
          cols={{
            base: 1,
            sm: 2,
          }}
          gap="xs"
        >
          <DetailValueRow
            icon={UserRound}
            label="Cliente"
            value={cliente.nombreCompleto}
            emphasize
          />

          {cliente.dpi ? (
            <DetailValueRow
              icon={Fingerprint}
              label="DPI"
              value={cliente.dpi}
            />
          ) : null}
        </AppGrid>

        {/* Contactos */}
        {cliente.telefono ? (
          <ContactBlock
            label="Teléfono principal"
            telefono={cliente.telefono}
            clienteNombre={cliente.nombreCompleto}
          />
        ) : null}

        {cliente.telefonoReferencia ? (
          <ContactBlock
            label="Teléfono de referencia"
            telefono={cliente.telefonoReferencia}
            clienteNombre={cliente.nombreCompleto}
          />
        ) : null}

        {/* Ubicación de la instalación */}
        {ubicacion.direccion || ubicacion.referencia || zona || mapsUrl ? (
          <div
            className="
                rounded-[var(--app-radius-md)]
                border
                border-[hsl(var(--app-border,var(--border)))]
                bg-[hsl(var(--app-muted,var(--muted)))/0.24]
                px-3 py-2.5
              "
          >
            <AppStack gap="sm">
              {ubicacion.direccion ? (
                <InfoBlock
                  icon={MapPinned}
                  label="Dirección de instalación"
                  value={ubicacion.direccion}
                  emphasize
                />
              ) : null}

              {ubicacion.referencia ? (
                <InfoBlock
                  icon={Navigation}
                  label="Referencia"
                  value={ubicacion.referencia}
                />
              ) : null}

              {zona ? (
                <InfoBlock
                  icon={Building2}
                  label="Sector y localidad"
                  value={zona}
                />
              ) : null}

              {mapsUrl ? (
                <AppInline gap="xs" wrap fullWidth>
                  <AppButton asChild size="xs" variant="outline">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Abrir ubicación de la instalación en el mapa"
                    >
                      <ExternalLink aria-hidden="true" />
                      Abrir mapa
                    </a>
                  </AppButton>
                </AppInline>
              ) : null}
            </AppStack>
          </div>
        ) : null}

        {/* Dirección registrada del cliente */}
        {cliente.direccion ? (
          <InfoBlock
            icon={MapPin}
            label="Dirección registrada del cliente"
            value={cliente.direccion}
          />
        ) : null}

        {/* Observaciones */}
        {cliente.observaciones ? (
          <InfoBlock
            icon={MessageSquareText}
            label="Observaciones del cliente"
            value={cliente.observaciones}
          />
        ) : null}
      </AppStack>
    </DetalleSectionCard>
  );
});

type ContactBlockProps = {
  label: string;

  telefono: string;

  clienteNombre: string;
};

const ContactBlock = memo(function ContactBlock({
  label,
  telefono,
  clienteNombre,
}: ContactBlockProps) {
  const telUrl = getTelephoneUrl(telefono);

  const whatsappUrl = getWhatsAppUrl(telefono);

  return (
    <div
      className="
        rounded-[var(--app-radius-md)]
        border
        border-[hsl(var(--app-border,var(--border)))]
        px-3 py-2.5
      "
    >
      <AppStack gap="xs">
        <AppInline align="start" gap="xs" wrap={false} fullWidth>
          <Phone
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground">{label}</p>

            <p className="mt-0.5 text-sm font-medium text-foreground">
              {telefono}
            </p>
          </div>
        </AppInline>

        <AppInline gap="xs" wrap fullWidth>
          <AppButton asChild size="xs" variant="outline">
            <a
              href={telUrl}
              aria-label={`Llamar al ${telefono} de ${clienteNombre}`}
            >
              <Phone aria-hidden="true" />
              Llamar · {telefono}
            </a>
          </AppButton>

          <AppButton asChild size="xs" variant="outline">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir WhatsApp con el número ${telefono}`}
            >
              <MessageCircle aria-hidden="true" />
              WhatsApp · {telefono}
            </a>
          </AppButton>
        </AppInline>
      </AppStack>
    </div>
  );
});

type InfoBlockProps = {
  icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;

  label: string;

  value: string;

  emphasize?: boolean;
};

const InfoBlock = memo(function InfoBlock({
  icon: Icon,
  label,
  value,
  emphasize = false,
}: InfoBlockProps) {
  return (
    <AppInline align="start" gap="xs" wrap={false} fullWidth>
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>

        <p
          className={
            emphasize
              ? "mt-0.5 whitespace-pre-wrap text-sm font-medium text-foreground"
              : "mt-0.5 whitespace-pre-wrap text-sm text-foreground"
          }
        >
          {value}
        </p>
      </div>
    </AppInline>
  );
});

function getTelephoneUrl(telefono: string): string {
  const normalized = telefono.trim().replace(/[^\d+]/g, "");

  return `tel:${normalized}`;
}

function getWhatsAppUrl(telefono: string): string {
  const digits = telefono.replace(/\D/g, "");

  /**
   * Los teléfonos locales de Guatemala normalmente
   * llegan al CRM con 8 dígitos.
   *
   * WhatsApp necesita el código internacional.
   */
  const internationalNumber = digits.length === 8 ? `502${digits}` : digits;

  return `https://wa.me/${internationalNumber}`;
}
