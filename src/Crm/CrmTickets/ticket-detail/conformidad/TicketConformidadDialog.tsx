"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Link2, RefreshCw, Wrench } from "lucide-react";
import { toast } from "sonner";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  buildPublicConformidadUrl,
  getConformidadDialogState,
  getFirmaCliente,
  getUltimoEnlace,
  isConformidadNotFoundError,
} from "./ticket-conformidad.helpers";
import { TicketConformidadLinkResult } from "./TicketConformidadLinkResult";
import {
  useCrearTicketConformidad,
  useGenerarEnlaceTicketConformidad,
  useGetConformidadActual,
} from "@/Crm/CrmHooks/hooks/use-tickets-conformidad/use-tickets-conformidad.hook";
import { GenerarEnlaceTicketConformidadResponse } from "@/Crm/features/ticket-soporte-conformidad/ticket-soporte-conformidad.types";
import {
  TicketConformidadCanal,
  TicketConformidadDialogState,
} from "@/Crm/features/ticket-soporte-conformidad/enums";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

interface TicketConformidadDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  ticketId: number;
}

type GeneratedLinkState = {
  url: string;

  expiraEn: string;
};

interface NoneStateProps {
  busy: boolean;

  onGenerate: () => void;
}

interface RetrabajoStateProps {
  busy: boolean;

  onGenerate: () => void;
}

interface PendingStateProps {
  generatedLink: GeneratedLinkState | null;

  ultimoEnlaceExpiraEn: string | null;

  busy: boolean;

  onGenerate: () => void;

  onRegenerate: () => void;
}

interface ConformeStateProps {
  nombre: string | null;

  telefono: string | null;

  firmadoEn: string | null;
}

export function TicketConformidadDialog({
  open,
  onOpenChange,
  ticketId,
}: TicketConformidadDialogProps) {
  const [generatedLink, setGeneratedLink] = useState<GeneratedLinkState | null>(
    null,
  );

  /*
   * Cuando inicialmente NO existe conformidad,
   * primero debemos crearla.
   *
   * La mutación de generar enlace depende del
   * conformidadId que aparecerá en el siguiente
   * render.
   */
  const [generateAfterCreate, setGenerateAfterCreate] = useState(false);

  const actualQuery = useGetConformidadActual(ticketId, open);

  const conformidad = actualQuery.data;

  const queryIs404 = isConformidadNotFoundError(actualQuery.error);

  const realQueryError = queryIs404 ? undefined : actualQuery.error;

  const state = useMemo(
    () => getConformidadDialogState(conformidad, actualQuery.error),
    [conformidad, actualQuery.error],
  );

  const conformidadId = conformidad?.id ?? null;

  const createMutation = useCrearTicketConformidad(ticketId);

  const generateMutation = useGenerarEnlaceTicketConformidad(
    conformidadId,
    ticketId,
  );

  const ultimoEnlace = useMemo(
    () => (conformidad ? getUltimoEnlace(conformidad) : null),
    [conformidad],
  );

  const firmaCliente = useMemo(
    () => (conformidad ? getFirmaCliente(conformidad) : null),
    [conformidad],
  );

  const isBusy =
    createMutation.isPending ||
    generateMutation.isPending ||
    generateAfterCreate;

  const storeGeneratedLink = useCallback(
    (response: GenerarEnlaceTicketConformidadResponse) => {
      setGeneratedLink({
        url: buildPublicConformidadUrl(response.token),
        expiraEn: response.expiraEn,
      });
    },
    [],
  );

  const generateForCurrentConformidad = useCallback(async () => {
    if (!conformidadId) {
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        canal: TicketConformidadCanal.LINK,
      });

      storeGeneratedLink(result);

      toast.success("Enlace de conformidad generado");
    } catch (error) {
      toast.error(getApiErrorMessageAxios(error));
    }
  }, [conformidadId, generateMutation, storeGeneratedLink]);

  /*
   * Segunda parte del flujo de un solo clic:
   *
   * una vez creada y cargada la conformidad,
   * generamos automáticamente el enlace.
   */
  useEffect(() => {
    if (!generateAfterCreate || !conformidadId) {
      return;
    }

    setGenerateAfterCreate(false);

    void generateForCurrentConformidad();
  }, [conformidadId, generateAfterCreate, generateForCurrentConformidad]);

  /*
   * Limpia el URL temporal de memoria al cambiar
   * de ticket o al cerrar completamente el dialog.
   *
   * El token no se persiste en frontend.
   */
  useEffect(() => {
    setGeneratedLink(null);
    setGenerateAfterCreate(false);
  }, [ticketId]);

  const handleGenerateLink = async () => {
    setGeneratedLink(null);

    /*
     * Ya tenemos un ciclo pendiente:
     * sólo generar enlace.
     */
    if (state === TicketConformidadDialogState.PENDIENTE) {
      await generateForCurrentConformidad();

      return;
    }

    /*
     * El ticket nunca ha tenido conformidad.
     *
     * Crear ciclo PENDIENTE.
     * Luego el useEffect generará el enlace
     * cuando aparezca conformidadId.
     */
    if (
      state === TicketConformidadDialogState.NONE ||
      state === TicketConformidadDialogState.REQUIERE_RETRABAJO
    ) {
      try {
        setGenerateAfterCreate(true);

        await createMutation.mutateAsync(undefined);

        await actualQuery.refetch();
      } catch (error) {
        setGenerateAfterCreate(false);

        toast.error(getApiErrorMessageAxios(error));
      }
    }
  };

  const handleRegenerate = async () => {
    await generateForCurrentConformidad();
  };

  const handleRetryQuery = () => {
    void actualQuery.refetch();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    /*
     * Evitamos cerrar accidentalmente el diálogo
     * mientras se está creando/generando.
     */
    if (!nextOpen && isBusy) {
      return;
    }

    if (!nextOpen) {
      setGeneratedLink(null);
      setGenerateAfterCreate(false);
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="lg">
        <AppDialogHeader>
          <AppDialogTitle>Conformidad del cliente</AppDialogTitle>
        </AppDialogHeader>

        <AppDialogBody>
          <AppDataState
            isLoading={actualQuery.isLoading}
            isFetching={actualQuery.isFetching}
            error={realQueryError}
            onRetry={handleRetryQuery}
            loadingVariant="skeleton-card"
            errorTitle="No se pudo cargar la conformidad"
          >
            <AppStack gap="md">
              {state === TicketConformidadDialogState.NONE ? (
                <NoneState
                  busy={isBusy}
                  onGenerate={() => void handleGenerateLink()}
                />
              ) : null}

              {state === TicketConformidadDialogState.PENDIENTE &&
              conformidad ? (
                <PendingState
                  generatedLink={generatedLink}
                  ultimoEnlaceExpiraEn={ultimoEnlace?.expiraEn ?? null}
                  busy={isBusy}
                  onGenerate={() => void handleGenerateLink()}
                  onRegenerate={() => void handleRegenerate()}
                />
              ) : null}

              {state === TicketConformidadDialogState.CONFORME &&
              conformidad ? (
                <ConformeState
                  nombre={firmaCliente?.nombreFirmante ?? null}
                  telefono={firmaCliente?.telefonoFirmante ?? null}
                  firmadoEn={
                    firmaCliente?.firmadoEn ?? conformidad.respondidoEn
                  }
                />
              ) : null}

              {state === TicketConformidadDialogState.REQUIERE_RETRABAJO ? (
                <RetrabajoState
                  busy={isBusy}
                  onGenerate={() => void handleGenerateLink()}
                />
              ) : null}
            </AppStack>
          </AppDataState>
        </AppDialogBody>

        <AppDialogFooter>
          <AppButton
            type="button"
            variant="secondary"
            onClick={() => handleOpenChange(false)}
            disabled={isBusy}
          >
            Cerrar
          </AppButton>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}

/* =========================================================
 * ESTADOS
 * ======================================================= */

function NoneState({ busy, onGenerate }: NoneStateProps) {
  return (
    <AppStack gap="sm">
      <AppAlert tone="info" title="Sin solicitud de conformidad">
        Este ticket todavía no tiene un ciclo de conformidad registrado.
      </AppAlert>

      <AppInline justify="end" gap="xs">
        <AppButton
          type="button"
          variant="primary"
          leftIcon={<Link2 size={15} />}
          loading={busy}
          loadingText="Generando..."
          onClick={onGenerate}
        >
          Generar enlace
        </AppButton>
      </AppInline>
    </AppStack>
  );
}

function PendingState({
  generatedLink,
  ultimoEnlaceExpiraEn,
  busy,
  onGenerate,
  onRegenerate,
}: PendingStateProps) {
  return (
    <AppStack gap="sm">
      <AppInline align="center" gap="xs" wrap>
        <AppBadge tone="warning" appearance="soft" size="xs" radius="full">
          Pendiente
        </AppBadge>

        <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
          Esperando respuesta del cliente
        </span>
      </AppInline>

      {generatedLink ? (
        <TicketConformidadLinkResult
          url={generatedLink.url}
          expiraEn={generatedLink.expiraEn}
          onRegenerate={onRegenerate}
          regenerating={busy}
        />
      ) : (
        <>
          {ultimoEnlaceExpiraEn ? (
            <AppAlert
              tone="warning"
              title="La conformidad ya tiene un enlace registrado"
            >
              Por seguridad el token original no se almacena y la URL anterior
              no puede reconstruirse. Si necesitas volver a compartirla, genera
              un enlace nuevo.
            </AppAlert>
          ) : (
            <AppAlert tone="info" title="Pendiente de compartir">
              La conformidad está creada, pero todavía necesitas generar el
              enlace que recibirá el cliente.
            </AppAlert>
          )}

          <AppInline justify="end" gap="xs">
            <AppButton
              type="button"
              variant="primary"
              leftIcon={
                ultimoEnlaceExpiraEn ? (
                  <RefreshCw size={15} />
                ) : (
                  <Link2 size={15} />
                )
              }
              loading={busy}
              loadingText="Generando..."
              onClick={onGenerate}
            >
              {ultimoEnlaceExpiraEn ? "Generar nuevo enlace" : "Generar enlace"}
            </AppButton>
          </AppInline>
        </>
      )}
    </AppStack>
  );
}

function ConformeState({ nombre, telefono, firmadoEn }: ConformeStateProps) {
  return (
    <AppStack gap="sm">
      <AppAlert tone="success" title="Cliente conforme">
        El cliente completó correctamente el proceso de conformidad.
      </AppAlert>

      <AppInline align="center" gap="xs">
        <CheckCircle2 size={16} />

        <div className="min-w-0">
          <p className="text-sm font-semibold">{nombre || "Cliente"}</p>

          {telefono ? (
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              {telefono}
            </p>
          ) : null}

          {firmadoEn ? (
            <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
              Firmado {formattFechaWithMinutes(firmadoEn)}
            </p>
          ) : null}
        </div>
      </AppInline>
    </AppStack>
  );
}

function RetrabajoState({ busy, onGenerate }: RetrabajoStateProps) {
  return (
    <AppStack gap="sm">
      <AppAlert tone="warning" title="El cliente requiere retrabajo">
        El cliente indicó que el trabajo realizado todavía no es conforme.
      </AppAlert>

      <AppInline align="center" gap="xs">
        <Wrench size={16} />

        <div className="min-w-0">
          <p className="text-sm font-semibold">Requiere retrabajo</p>

          <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
            El ciclo anterior ya fue respondido. Cuando corresponda, puedes
            generar una nueva solicitud para que el cliente vuelva a confirmar
            el trabajo.
          </p>
        </div>
      </AppInline>

      <AppInline justify="end" gap="xs">
        <AppButton
          type="button"
          variant="primary"
          leftIcon={<RefreshCw size={15} />}
          loading={busy}
          loadingText="Generando..."
          onClick={onGenerate}
        >
          Generar nueva solicitud
        </AppButton>
      </AppInline>
    </AppStack>
  );
}
