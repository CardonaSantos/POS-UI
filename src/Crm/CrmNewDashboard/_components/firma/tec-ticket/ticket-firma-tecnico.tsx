"use client";

import { Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useCrearTicketConformidad,
  useGetConformidadActual,
  useRegistrarFirmaTecnico,
} from "@/Crm/CrmHooks/hooks/use-tickets-conformidad/use-tickets-conformidad.hook";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TicketConformidadDetalle } from "@/Crm/features/ticket-soporte-conformidad/ticket-soporte-conformidad.types";
import { TicketSignaturePadHandle } from "@/public/ticket-conformidad/Signature/types/ticket-signature-pad.types";
import { TicketSignaturePad } from "@/public/ticket-conformidad/Signature/components/TicketSignaturePad";
import { isAxiosError } from "axios";

function isHttpStatus(error: unknown, status: number): boolean {
  return isAxiosError(error) && error.response?.status === status;
}

export default function TicketFirmaTecnicoPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const ticketId = Number(id);

  const validTicketId = Number.isInteger(ticketId) && ticketId > 0;

  /*
   * Para respetar las reglas de hooks siempre
   * ejecutamos el hook. Cuando el parámetro es
   * inválido utilizamos 0, pero nunca dispararemos
   * la mutación en ese estado.
   */
  const safeTicketId = validTicketId ? ticketId : 0;

  const conformidadQuery = useGetConformidadActual(safeTicketId, validTicketId);

  const crearConformidad = useCrearTicketConformidad(safeTicketId);

  const [preparandoConformidad, setPreparandoConformidad] = useState(false);

  const [preparacionError, setPreparacionError] = useState<unknown>(null);

  /*
   * Evita que React dispare varias creaciones
   * mientras el query continúa momentáneamente
   * en estado 404.
   */
  const intentoAutomaticoRef = useRef(false);

  const noExisteConformidad = isHttpStatus(conformidadQuery.error, 404);

  const requiereNuevoCiclo =
    noExisteConformidad ||
    conformidadQuery.data?.resumen?.requiereRetrabajo === true;

  const prepararConformidad = useCallback(async () => {
    if (!validTicketId) {
      return;
    }

    setPreparacionError(null);

    setPreparandoConformidad(true);

    try {
      /*
       * Intentamos crear el ciclo.
       *
       * Si otro request lo creó justo antes,
       * backend puede devolver 409. En ese caso
       * simplemente consultamos nuevamente.
       */
      try {
        await crearConformidad.mutateAsync();
      } catch (error) {
        if (!isHttpStatus(error, 409)) {
          throw error;
        }
      }

      const refreshed = await conformidadQuery.refetch();

      if (!refreshed.data) {
        throw new Error("No fue posible preparar la conformidad del ticket.");
      }
    } catch (error) {
      setPreparacionError(error);
    } finally {
      setPreparandoConformidad(false);
    }
  }, [validTicketId, crearConformidad.mutateAsync, conformidadQuery.refetch]);

  useEffect(() => {
    if (!validTicketId || !requiereNuevoCiclo || intentoAutomaticoRef.current) {
      return;
    }

    intentoAutomaticoRef.current = true;

    void prepararConformidad();
  }, [validTicketId, requiereNuevoCiclo, prepararConformidad]);

  if (!validTicketId) {
    return (
      <PageTransitionCrm titleHeader="Firma técnica" variant="fade-pure">
        <AppEmptyState
          title="Ticket no válido"
          description="No fue posible identificar el ticket."
        />
      </PageTransitionCrm>
    );
  }

  /*
   * El 404 no se presenta como error al usuario.
   *
   * Para esta pantalla significa:
   * "el ticket todavía no tiene ciclo de conformidad",
   * y nosotros lo creamos automáticamente.
   */
  const visibleError =
    preparacionError ?? (noExisteConformidad ? null : conformidadQuery.error);

  const isPreparing =
    conformidadQuery.isLoading ||
    preparandoConformidad ||
    crearConformidad.isPending ||
    (requiereNuevoCiclo && preparacionError === null);

  const handleRetry = () => {
    if (preparacionError || requiereNuevoCiclo) {
      intentoAutomaticoRef.current = true;

      void prepararConformidad();

      return;
    }
    void conformidadQuery.refetch();
  };

  return (
    <PageTransitionCrm titleHeader="Firma técnica" variant="fade-pure">
      <AppStack gap="md">
        <AppDataState
          isLoading={isPreparing}
          isFetching={conformidadQuery.isFetching}
          error={visibleError}
          onRetry={handleRetry}
        >
          {conformidadQuery.data ? (
            <FirmaTecnicoContent
              ticketId={ticketId}
              conformidad={conformidadQuery.data}
            />
          ) : (
            <AppEmptyState
              title="Conformidad no disponible"
              description="No fue posible preparar el ciclo de conformidad del ticket."
            />
          )}
        </AppDataState>
      </AppStack>
    </PageTransitionCrm>
  );
}

function FirmaTecnicoContent({
  ticketId,
  conformidad,
}: {
  ticketId: number;
  conformidad: TicketConformidadDetalle | null;
}) {
  const navigate = useNavigate();

  const signatureRef = useRef<TicketSignaturePadHandle | null>(null);

  const [firmaVacia, setFirmaVacia] = useState(true);

  const conformidadId = conformidad?.id ?? null;

  const registrarFirma = useRegistrarFirmaTecnico(conformidadId, ticketId);

  const yaFirmado = conformidad?.resumen?.tieneFirmaTecnico === true;

  const handleGuardarFirma = async () => {
    if (!conformidadId) {
      toast.error("No existe una conformidad asociada al ticket.");

      return;
    }

    const signaturePad = signatureRef.current;

    if (!signaturePad || signaturePad.isEmpty()) {
      toast.error("Debe registrar su firma antes de continuar.");

      return;
    }

    try {
      const file = await signaturePad.toFile({
        fileName: "firma-tecnico.png",
      });

      if (!file) {
        toast.error("No fue posible generar el archivo de firma.");

        return;
      }

      const formData = new FormData();

      formData.append("firma", file);

      await registrarFirma.mutateAsync(formData);

      toast.success("Firma técnica registrada correctamente.");

      navigate(`/crm/ticket-detalles/${ticketId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Error registrando firma técnica:", error);

      /*
       * Si tu crm.useMutationApi ya muestra
       * automáticamente el error, podemos
       * incluso quitar este toast posteriormente.
       */
      toast.error("No fue posible registrar la firma técnica.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <AppStack gap="md">
        <AppCard variant="outline" size="xs" className="p-1">
          <AppStack gap="xs" className="text-xs">
            <p className="text-xs text-muted-foreground">Ticket #{ticketId}</p>

            {conformidad?.ticket?.titulo ? (
              <p className="text-xs">{conformidad.ticket.titulo}</p>
            ) : null}

            {conformidad?.cliente?.nombreCompleto ? (
              <p className="text-xs text-muted-foreground">
                Cliente: {conformidad.cliente.nombreCompleto}
              </p>
            ) : null}
          </AppStack>
        </AppCard>

        {yaFirmado ? (
          <AppEmptyState
            title="Firma técnica registrada"
            description="Ya se ha registrado la firma del técnico."
          />
        ) : (
          <AppCard variant="outline" size="sm">
            <AppStack gap="md">
              <TicketSignaturePad
                ref={signatureRef}
                disabled={registrarFirma.isPending}
                // description="Firme dentro del recuadro utilizando el dedo, un lápiz táctil o el mouse."
                onEmptyChange={setFirmaVacia}
              />

              <AppButton
                type="button"
                size="lg"
                variant="primary"
                width="full"
                leftIcon={<Save className="h-5 w-5" aria-hidden="true" />}
                loading={registrarFirma.isPending}
                loadingText="Guardando firma..."
                disabled={firmaVacia || registrarFirma.isPending}
                onClick={handleGuardarFirma}
              >
                Guardar firma
              </AppButton>
            </AppStack>
          </AppCard>
        )}
      </AppStack>
    </div>
  );
}
