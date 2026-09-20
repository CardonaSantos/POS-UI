import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Eraser } from "lucide-react";
import SignaturePad from "signature_pad";

import { AppButton } from "@/components/app/primitives/app-button";

import type {
  TicketSignaturePadHandle,
  TicketSignaturePadProps,
} from "../types/ticket-signature-pad.types";

type SignatureData = ReturnType<SignaturePad["toData"]>;

interface CanvasCssSize {
  width: number;
  height: number;
  ratio: number;
}

const INITIAL_CANVAS_SIZE: CanvasCssSize = {
  width: 0,
  height: 0,
  ratio: 1,
};

/**
 * Cuando el canvas cambia de tamaño no queremos deformar
 * ni cortar la firma.
 *
 * Ajustamos todos los puntos proporcionalmente y centramos
 * el resultado dentro del nuevo canvas.
 */
function fitSignatureData(
  data: SignatureData,
  previousWidth: number,
  previousHeight: number,
  nextWidth: number,
  nextHeight: number,
): SignatureData {
  if (
    previousWidth <= 0 ||
    previousHeight <= 0 ||
    nextWidth <= 0 ||
    nextHeight <= 0
  ) {
    return data;
  }

  const scale = Math.min(
    nextWidth / previousWidth,
    nextHeight / previousHeight,
  );

  const renderedWidth = previousWidth * scale;

  const renderedHeight = previousHeight * scale;

  const offsetX = (nextWidth - renderedWidth) / 2;

  const offsetY = (nextHeight - renderedHeight) / 2;

  return data.map((group) => ({
    ...group,

    points: group.points.map((point) => ({
      ...point,

      x: point.x * scale + offsetX,

      y: point.y * scale + offsetY,
    })),
  }));
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}

export const TicketSignaturePad = forwardRef<
  TicketSignaturePadHandle,
  TicketSignaturePadProps
>(function TicketSignaturePad(
  {
    disabled = false,

    // required = false,

    invalid = false,

    error,

    // label = "Firma del cliente",

    description = "",

    onEmptyChange,
  },
  ref,
) {
  const generatedId = useId();

  const labelId = `${generatedId}-label`;

  const descriptionId = `${generatedId}-description`;

  const errorId = `${generatedId}-error`;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const signaturePadRef = useRef<SignaturePad | null>(null);

  const canvasSizeRef = useRef<CanvasCssSize>(INITIAL_CANVAS_SIZE);

  const interactionEnabledRef = useRef(true);

  const onEmptyChangeRef = useRef(onEmptyChange);

  const emptyRef = useRef(true);

  const [isEmpty, setIsEmpty] = useState(true);

  /*
   * Evita reconstruir SignaturePad si el padre
   * recrea el callback durante un render.
   */
  useEffect(() => {
    onEmptyChangeRef.current = onEmptyChange;
  }, [onEmptyChange]);

  const syncEmptyState = useCallback((nextIsEmpty: boolean) => {
    if (emptyRef.current === nextIsEmpty) {
      return;
    }

    emptyRef.current = nextIsEmpty;

    setIsEmpty(nextIsEmpty);

    onEmptyChangeRef.current?.(nextIsEmpty);
  }, []);

  const clear = useCallback(() => {
    const signaturePad = signaturePadRef.current;

    if (!signaturePad) {
      return;
    }

    signaturePad.clear();

    syncEmptyState(true);
  }, [syncEmptyState]);

  const isPadEmpty = useCallback(() => {
    return signaturePadRef.current?.isEmpty() ?? true;
  }, []);

  const toBlob = useCallback(async () => {
    const signaturePad = signaturePadRef.current;

    const canvas = canvasRef.current;

    if (!signaturePad || !canvas || signaturePad.isEmpty()) {
      return null;
    }

    return canvasToPngBlob(canvas);
  }, []);

  const toFile = useCallback(
    async (options?: { fileName?: string }) => {
      const blob = await toBlob();

      if (!blob) {
        return null;
      }

      return new File([blob], options?.fileName ?? "firma-cliente.png", {
        type: "image/png",

        lastModified: Date.now(),
      });
    },
    [toBlob],
  );

  useImperativeHandle(
    ref,
    () => ({
      clear,

      isEmpty: isPadEmpty,

      toBlob,

      toFile,
    }),
    [clear, isPadEmpty, toBlob, toFile],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    const signaturePad = signaturePadRef.current;

    if (!canvas || !signaturePad) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const nextWidth = Math.max(1, Math.round(rect.width));

    const nextHeight = Math.max(1, Math.round(rect.height));

    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    const previous = canvasSizeRef.current;

    const sameSize =
      previous.width === nextWidth &&
      previous.height === nextHeight &&
      previous.ratio === ratio;

    if (sameSize) {
      return;
    }

    /*
     * Guardamos los puntos antes de modificar width/height,
     * porque cambiar esas propiedades limpia físicamente
     * un canvas.
     */
    const data = signaturePad.toData();

    const hadSignature = data.length > 0;

    canvas.width = Math.round(nextWidth * ratio);

    canvas.height = Math.round(nextHeight * ratio);

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    /*
     * Trabajamos en coordenadas CSS mientras la resolución
     * física del canvas utiliza devicePixelRatio.
     */
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    if (hadSignature && previous.width > 0 && previous.height > 0) {
      const fittedData = fitSignatureData(
        data,
        previous.width,
        previous.height,
        nextWidth,
        nextHeight,
      );

      signaturePad.fromData(fittedData);
    } else {
      signaturePad.clear();
    }

    canvasSizeRef.current = {
      width: nextWidth,
      height: nextHeight,
      ratio,
    };

    syncEmptyState(signaturePad.isEmpty());
  }, [syncEmptyState]);

  /*
   * Inicialización única del pad.
   */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const signaturePad = new SignaturePad(canvas, {
      minWidth: 0.8,

      maxWidth: 2.4,

      throttle: 16,

      minDistance: 2,

      /*
       * La superficie visual será blanca, pero la
       * exportación permanece transparente.
       */
      backgroundColor: "rgba(0, 0, 0, 0)",

      penColor: "rgb(17, 24, 39)",
    });

    signaturePadRef.current = signaturePad;

    interactionEnabledRef.current = true;

    const handleEndStroke = () => {
      syncEmptyState(signaturePad.isEmpty());
    };

    signaturePad.addEventListener("endStroke", handleEndStroke);

    const frameId = window.requestAnimationFrame(resizeCanvas);

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });

      resizeObserver.observe(canvas);
    }

    /*
     * También captura orientación / DPR / resize general.
     */
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(frameId);

      resizeObserver?.disconnect();

      window.removeEventListener("resize", resizeCanvas);

      signaturePad.removeEventListener("endStroke", handleEndStroke);

      signaturePad.off();

      signaturePadRef.current = null;
    };
  }, [resizeCanvas, syncEmptyState]);

  /*
   * Habilitar/deshabilitar interacción sin destruir
   * la firma existente.
   */
  useEffect(() => {
    const signaturePad = signaturePadRef.current;

    if (!signaturePad) {
      return;
    }

    const shouldEnable = !disabled;

    if (interactionEnabledRef.current === shouldEnable) {
      return;
    }

    if (shouldEnable) {
      signaturePad.on();
    } else {
      signaturePad.off();
    }

    interactionEnabledRef.current = shouldEnable;
  }, [disabled]);

  const describedBy = [descriptionId, invalid && error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
    >
      <div className="mb-2 flex items-start justify-between gap-3 p-2">
        <div className="min-w-0">
          <p id={labelId} className="text-sm font-medium">
            {/* {label} */}

            {/* {required && (
              <span aria-hidden="true" className="ml-1 text-destructive">
                *
              </span>
            )} */}
          </p>

          <p
            id={descriptionId}
            className="mt-0.5 text-xs leading-relaxed text-muted-foreground"
          >
            {description}
          </p>
        </div>

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          leftIcon={<Eraser size={14} aria-hidden="true" />}
          disabled={disabled || isEmpty}
          onClick={clear}
        >
          Limpiar
        </AppButton>
      </div>

      <div
        className={[
          "relative overflow-hidden rounded-md border bg-white",
          "transition-colors",
          invalid ? "border-destructive" : "border-border",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        {isEmpty && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
            aria-hidden="true"
          >
            <div>
              <p className="text-sm font-medium text-slate-400">Firme aquí</p>

              <p className="mt-1 text-xs text-slate-400">
                Use su dedo, lápiz o mouse
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={[
            "block h-[300px] w-full",
            "sm:h-[340px]",
            "md:h-[380px]",
            "touch-none select-none",
            disabled ? "cursor-not-allowed" : "cursor-crosshair",
          ].join(" ")}
          style={{
            touchAction: "none",
          }}
          aria-label="Área para dibujar la firma manuscrita"
          aria-invalid={invalid || undefined}
        >
          Su navegador no permite capturar una firma mediante canvas.
        </canvas>
      </div>

      {invalid && error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-destructive"
        >
          {error}
        </p>
      )}

      <span className="sr-only" aria-live="polite">
        {isEmpty ? "La firma está vacía." : "Firma capturada."}
      </span>
    </div>
  );
});

TicketSignaturePad.displayName = "TicketSignaturePad";
