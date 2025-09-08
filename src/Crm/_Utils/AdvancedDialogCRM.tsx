"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Trash2,
  Send,
  Settings,
  Loader2,
  Save,
  AlertCircle,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
type IconCfgNode = { node: React.ReactNode };
type IconCfgPreset = {
  k: AdvancedDialogIconKey;
  icon: React.ComponentType<any>;
  bg: string;
  fc: string;
  br: string;
  sh: string;
};
/* =========================================================
 * Tipos
 * =======================================================*/

export type AdvancedDialogType =
  | "confirmation"
  | "destructive"
  | "warning"
  | "success"
  | "info"
  | "custom";

const advancedIconConfigs = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-100 dark:bg-amber-900/20",
    fc: "text-amber-600 dark:text-amber-400",
    br: "border-amber-200 dark:border-amber-800",
    sh: "shadow-amber-200/50 dark:shadow-amber-900/50",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-100 dark:bg-green-900/20",
    fc: "text-green-600 dark:text-green-400",
    br: "border-green-200 dark:border-green-800",
    sh: "shadow-green-200/50 dark:shadow-green-900/50",
  },
  info: {
    icon: Info,
    bg: "bg-blue-100 dark:bg-blue-900/20",
    fc: "text-blue-600 dark:text-blue-400",
    br: "border-blue-200 dark:border-blue-800",
    sh: "shadow-blue-200/50 dark:shadow-blue-900/50",
  },
  delete: {
    icon: Trash2,
    bg: "bg-red-100 dark:bg-red-900/20",
    fc: "text-red-600 dark:text-red-400",
    br: "border-red-200 dark:border-red-800",
    sh: "shadow-red-200/50 dark:shadow-red-900/50",
  },
  send: {
    icon: Send,
    bg: "bg-blue-100 dark:bg-blue-900/20",
    fc: "text-blue-600 dark:text-blue-400",
    br: "border-blue-200 dark:border-blue-800",
    sh: "shadow-blue-200/50 dark:shadow-blue-900/50",
  },
  settings: {
    icon: Settings,
    bg: "bg-gray-100 dark:bg-gray-800/50",
    fc: "text-gray-600 dark:text-gray-400",
    br: "border-gray-200 dark:border-gray-700",
    sh: "shadow-gray-200/50 dark:shadow-gray-800/50",
  },
  alert: {
    icon: AlertCircle,
    bg: "bg-amber-100 dark:bg-amber-900/20",
    fc: "text-amber-600 dark:text-amber-400",
    br: "border-amber-200 dark:border-amber-800",
    sh: "shadow-amber-200/50 dark:shadow-amber-900/50",
  },
  shield: {
    icon: ShieldAlert,
    bg: "bg-red-100 dark:bg-red-900/20",
    fc: "text-red-600 dark:text-red-400",
    br: "border-red-200 dark:border-red-800",
    sh: "shadow-red-200/50 dark:shadow-red-900/50",
  },
  help: {
    icon: HelpCircle,
    bg: "bg-purple-100 dark:bg-purple-900/20",
    fc: "text-purple-600 dark:text-purple-400",
    br: "border-purple-200 dark:border-purple-800",
    sh: "shadow-purple-200/50 dark:shadow-purple-900/50",
  },
  custom: {
    icon: Info,
    bg: "bg-gray-100 dark:bg-gray-800/50",
    fc: "text-gray-600 dark:text-gray-400",
    br: "border-gray-200 dark:border-gray-700",
    sh: "shadow-gray-200/50 dark:shadow-gray-800/50",
  },
};
type AdvancedDialogIconKey = keyof typeof advancedIconConfigs;

export type AdvancedDialogIcon = AdvancedDialogIconKey | React.ReactNode;

export interface AdvancedDialogButton {
  label: string;
  onClick?: (
    e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLButtonElement>
  ) => void | Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean; // controlado
  icon?: React.ReactNode;
  loadingText?: string;
  autoFocus?: boolean; // enfoque inicial
}

export interface AdvancedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // contenido
  title: string;
  subtitle?: string;
  description?: React.ReactNode;
  question?: string;

  // visual
  type?: AdvancedDialogType;
  icon?: AdvancedDialogIcon;
  showIcon?: boolean;
  iconAnimation?: boolean;

  // acciones
  confirmButton?: AdvancedDialogButton;
  cancelButton?: AdvancedDialogButton;
  customButtons?: AdvancedDialogButton[];
  onConfirm?: () => void | Promise<void>; // NUEVO: ergonomía
  autoCloseOnSuccess?: boolean; // default true
  confirmFormId?: string; // NUEVO: submit form

  // diseño
  maxWidth?: "sm" | "md" | "lg" | "xl";
  showDivider?: boolean;
  footerAlign?: "start" | "end" | "between" | "center";

  // cierre
  preventClose?: boolean;
  closeOnOutsideClick?: boolean; // default true
  closeOnEscape?: boolean; // default true

  // portal/animaciones
  forceMount?: boolean;

  children?: React.ReactNode;
  contentCard?: boolean;
}

/* =========================================================
 * CVA estilos
 * =======================================================*/

const contentWidth = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
} as const;

const footerVariants = cva("flex gap-3 pt-2 pb-2", {
  variants: {
    align: {
      start: "flex-col-reverse sm:flex-row sm:justify-start",
      end: "flex-col-reverse sm:flex-row sm:justify-end",
      between: "flex-col-reverse sm:flex-row sm:justify-between",
      center: "flex-col-reverse sm:flex-row sm:justify-center",
    },
  },
  defaultVariants: {
    align: "end",
  },
});

/* =========================================================
 * Componente
 * =======================================================*/

const typeConfigs: Record<
  AdvancedDialogType,
  {
    defaultIcon: AdvancedDialogIconKey;
    confirmVariant: AdvancedDialogButton["variant"];
    confirmLabel: string;
    confirmIcon: React.ReactNode;
  }
> = {
  confirmation: {
    defaultIcon: "info",
    confirmVariant: "default",
    confirmLabel: "Confirmar",
    confirmIcon: <Save className="mr-2 h-4 w-4" />,
  },
  destructive: {
    defaultIcon: "delete",
    confirmVariant: "destructive",
    confirmLabel: "Eliminar",
    confirmIcon: <Trash2 className="mr-2 h-4 w-4" />,
  },
  warning: {
    defaultIcon: "warning",
    confirmVariant: "default",
    confirmLabel: "Continuar",
    confirmIcon: <AlertTriangle className="mr-2 h-4 w-4" />,
  },
  success: {
    defaultIcon: "success",
    confirmVariant: "default",
    confirmLabel: "Continuar",
    confirmIcon: <CheckCircle className="mr-2 h-4 w-4" />,
  },
  info: {
    defaultIcon: "info",
    confirmVariant: "default",
    confirmLabel: "Entendido",
    confirmIcon: <Info className="mr-2 h-4 w-4" />,
  },
  custom: {
    defaultIcon: "info",
    confirmVariant: "default",
    confirmLabel: "Aceptar",
    confirmIcon: <Save className="mr-2 h-4 w-4" />,
  },
};

export function AdvancedDialogCRM(props: AdvancedDialogProps) {
  const {
    open,
    onOpenChange,
    title,
    subtitle,
    description,
    question,
    type = "confirmation",
    icon,
    showIcon = true,
    iconAnimation = true,
    confirmButton,
    cancelButton,
    customButtons,
    maxWidth = "md",
    preventClose = false,
    // showDivider = true,
    children,
    contentCard = true,
    onConfirm,
    autoCloseOnSuccess = true,
    confirmFormId,
    footerAlign = "end",
    closeOnOutsideClick = true,
    closeOnEscape = true,
    forceMount,
  } = props;

  const ids = React.useMemo(
    () => ({
      titleId: `advdlg-title-${Math.random().toString(36).slice(2)}`,
      descId: `advdlg-desc-${Math.random().toString(36).slice(2)}`,
    }),
    []
  );

  const cfg = typeConfigs[type];

  const iconCfg: IconCfgNode | IconCfgPreset = React.useMemo(() => {
    if (React.isValidElement(icon)) return { node: icon };
    if (typeof icon === "string" && icon in advancedIconConfigs) {
      const k = icon as AdvancedDialogIconKey;
      return { k, ...advancedIconConfigs[k] };
    }
    const k = cfg.defaultIcon;
    return { k, ...advancedIconConfigs[k] };
  }, [icon, cfg.defaultIcon]);

  // loading interno para onConfirm (uncontrolled)
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const finalConfirm: AdvancedDialogButton = {
    label: cfg.confirmLabel,
    variant: cfg.confirmVariant,
    icon: cfg.confirmIcon,
    onClick: undefined,
    ...confirmButton,
  };
  const finalCancel: AdvancedDialogButton = {
    label: "Cancelar",
    variant: "outline",
    icon: <X className="mr-2 h-4 w-4" />,
    ...cancelButton,
  };

  const handleConfirm = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prioridad: confirmFormId → onConfirm → confirmButton.onClick
    if (confirmFormId) {
      const form = document.getElementById(
        confirmFormId
      ) as HTMLFormElement | null;
      if (form) {
        // dispara submit nativo (compatible con RHF)
        form.requestSubmit ? form.requestSubmit() : form.submit();
      }
      return;
    }

    const runner = onConfirm ?? finalConfirm.onClick;
    if (!runner) {
      if (autoCloseOnSuccess) onOpenChange(false);
      return;
    }

    // si el botón ya controla loading, respetamos; si no, usamos interno
    const isControlledLoading = finalConfirm.loading !== undefined;

    try {
      if (!isControlledLoading) setConfirmLoading(true);
      await Promise.resolve(runner(e));
      if (autoCloseOnSuccess) onOpenChange(false);
    } finally {
      if (!isControlledLoading) setConfirmLoading(false);
    }
  };

  // bloqueo de cierre por click afuera / ESC cuando preventClose
  const onInteractOutside = (ev: Event) => {
    if (preventClose || !closeOnOutsideClick) ev.preventDefault();
  };
  const onEscapeKeyDown = (ev: KeyboardEvent) => {
    if (preventClose || !closeOnEscape) ev.preventDefault();
  };

  const renderIcon = () => {
    if (!showIcon) return null;

    const iconNode =
      "node" in iconCfg
        ? iconCfg.node
        : React.createElement(iconCfg.icon, { className: "h-8 w-8" });

    const shouldPulse =
      iconAnimation &&
      "k" in iconCfg &&
      (iconCfg.k === "warning" || iconCfg.k === "alert");

    return (
      <div className="flex justify-center mt-6">
        <div
          className={cn(
            "rounded-full p-3 shadow-lg border-4 border-white dark:border-gray-800",
            (iconCfg as any).sh
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full",
              (iconCfg as any).bg,
              (iconCfg as any).br,
              shouldPulse && "animate-pulse"
            )}
          >
            <div className={(iconCfg as any).fc}>{iconNode}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // forceMount={forceMount}
        forceMount={forceMount ? true : undefined}
        className={cn(
          "p-0 overflow-hidden rounded-xl border-0 shadow-xl",
          contentWidth[maxWidth]
        )}
        onInteractOutside={onInteractOutside}
        onEscapeKeyDown={onEscapeKeyDown}
        aria-labelledby={ids.titleId}
        aria-describedby={ids.descId}
      >
        {renderIcon()}

        <DialogHeader className="pt-8 px-6 pb-2">
          <DialogTitle
            id={ids.titleId}
            className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200"
          >
            {title}
          </DialogTitle>
          {(subtitle || description) && (
            <DialogDescription asChild>
              <div
                id={ids.descId}
                className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400"
              >
                {subtitle && <p>{subtitle}</p>}
                {/* description acepta ReactNode */}
                {description && <div className="mt-1">{description}</div>}
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="px-6 py-4">
          {(question || children) &&
            (contentCard ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-5 bg-gray-50 dark:bg-gray-800/50 shadow-inner">
                {question && (
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200 text-center">
                    {question}
                  </h3>
                )}
                {children && <div className="mt-2">{children}</div>}
              </div>
            ) : (
              <div className="mb-5">
                {question && (
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200 text-center">
                    {question}
                  </h3>
                )}
                {children && <div className="mt-2">{children}</div>}
              </div>
            ))}

          {props.showDivider !== false && (
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-5" />
          )}

          {/* Footer */}
          <div className={footerVariants({ align: footerAlign })}>
            {/* Custom buttons */}
            {customButtons?.map((b, i) => (
              <Button
                key={i}
                type="button"
                variant={b.variant ?? "default"}
                onClick={b.onClick}
                disabled={b.disabled || b.loading}
                autoFocus={b.autoFocus}
                className="w-full rounded-lg py-2.5 transition-all duration-200"
              >
                {b.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {b.loadingText ?? "Cargando..."}
                  </>
                ) : (
                  <>
                    {b.icon}
                    {b.label}
                  </>
                )}
              </Button>
            ))}

            {/* Default buttons si no hay customButtons */}
            {!customButtons && (
              <>
                <Button
                  type="button"
                  variant={finalCancel.variant ?? "outline"}
                  onClick={finalCancel.onClick ?? (() => onOpenChange(false))}
                  disabled={finalCancel.disabled}
                  className="w-full rounded-lg py-2.5 transition-all duration-200"
                >
                  {finalCancel.icon}
                  {finalCancel.label}
                </Button>

                <Button
                  type="button"
                  variant={finalConfirm.variant ?? "default"}
                  onClick={handleConfirm}
                  disabled={
                    finalConfirm.disabled ||
                    finalConfirm.loading ||
                    confirmLoading
                  }
                  autoFocus={finalConfirm.autoFocus}
                  className="w-full rounded-lg py-2.5 transition-all duration-200"
                >
                  {finalConfirm.loading || confirmLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {finalConfirm.loadingText ?? "Procesando..."}
                    </>
                  ) : (
                    <>
                      {finalConfirm.icon}
                      {finalConfirm.label}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
