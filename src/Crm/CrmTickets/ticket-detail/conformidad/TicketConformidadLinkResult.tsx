"use client";
import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";

interface TicketConformidadLinkResultProps {
  url: string;

  expiraEn: string;

  onRegenerate?: () => void;

  regenerating?: boolean;

  disabled?: boolean;
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function copyTextToClipboard(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);

    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;

  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");

  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("No fue posible copiar el enlace.");
  }
}

export function TicketConformidadLinkResult({
  url,
  expiraEn,
  onRegenerate,
  regenerating = false,
  disabled = false,
}: TicketConformidadLinkResultProps) {
  const [copied, setCopied] = useState(false);

  const expiration = useMemo(() => {
    const date = new Date(expiraEn);

    const timestamp = date.getTime();

    return {
      label: formatDateTime(expiraEn),

      expired: Number.isNaN(timestamp) || Date.now() >= timestamp,
    };
  }, [expiraEn]);

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(url);

      setCopied(true);

      toast.success("Enlace copiado");

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      toast.error("No fue posible copiar el enlace.");
    }
  };

  const handleOpen = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AppStack gap="sm">
      {expiration.expired ? (
        <AppAlert tone="warning" title="El enlace ha expirado">
          Genera un enlace nuevo antes de enviarlo al cliente.
        </AppAlert>
      ) : (
        <AppAlert tone="success" title="Enlace listo para compartir">
          El cliente podrá abrir este enlace para registrar su respuesta de
          conformidad.
        </AppAlert>
      )}

      <AppCard variant="outline" size="sm" radius="md" className="p-2">
        <AppStack gap="sm">
          <AppInline align="center" gap="xs">
            <Link2 size={16} />

            <div className="min-w-0">
              <p className="text-sm font-semibold">Enlace público</p>

              <p className="text-xs text-[hsl(var(--app-muted-foreground))]">
                Válido hasta {expiration.label}
              </p>
            </div>
          </AppInline>

          <AppInput
            value={url}
            readOnly
            aria-label="Enlace público de conformidad"
          />

          <AppInline align="center" justify="end" gap="xs" wrap>
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={() => void handleCopy()}
              disabled={disabled}
            >
              {copied ? "Copiado" : "Copiar"}
            </AppButton>

            <AppButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink size={14} />}
              onClick={handleOpen}
              disabled={disabled}
            >
              Abrir
            </AppButton>

            {onRegenerate ? (
              <AppButton
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<RefreshCw size={14} />}
                loading={regenerating}
                loadingText="Generando..."
                onClick={onRegenerate}
                disabled={disabled}
              >
                Generar nuevo
              </AppButton>
            ) : null}
          </AppInline>
        </AppStack>
      </AppCard>
    </AppStack>
  );
}
