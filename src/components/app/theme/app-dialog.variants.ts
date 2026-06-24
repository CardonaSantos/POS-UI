import { cva } from "class-variance-authority";

export const appDialogOverlayVariants = cva(
  [
    "fixed inset-0 z-[100]",
    "bg-[hsl(var(--app-dialog-overlay-bg,var(--app-confirm-overlay-bg)))]",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0",
    "data-[state=closed]:fade-out-0",
  ],
  {
    variants: {
      tone: {
        default: "",
        soft: "opacity-80",
        strong: "opacity-100",
      },
      blur: {
        none: "",
        sm: "backdrop-blur-[1px]",
        md: "backdrop-blur-sm",
        lg: "backdrop-blur-md",
      },
    },
    defaultVariants: {
      tone: "default",
      blur: "none",
    },
  },
);

export const appDialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-[101]",
    "flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
    "overflow-hidden",
    "border border-[hsl(var(--app-dialog-border,var(--app-border)))]",
    "bg-[hsl(var(--app-dialog-bg,var(--app-popover,var(--background))))]",
    "text-[hsl(var(--app-dialog-foreground,var(--app-popover-foreground,var(--foreground))))]",
    "shadow-[var(--app-dialog-shadow,var(--app-confirm-shadow))]",
    "outline-none",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0",
    "data-[state=closed]:fade-out-0",
  ],
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        full: "max-w-[calc(100vw-2rem)]",
      },
      viewport: {
        compact: "max-h-[70dvh]",
        default: "max-h-[85dvh]",
        tall: "max-h-[92dvh]",
        screen: "h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)]",
      },
      radius: {
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      size: "lg",
      viewport: "default",
      radius: "md",
      padding: "md",
    },
  },
);

export const appDialogHeaderVariants = cva(
  "flex shrink-0 flex-col gap-1.5 pr-7",
  {
    variants: {
      divider: {
        true: "border-b border-[hsl(var(--app-dialog-border,var(--app-border)))] pb-3",
        false: "",
      },
    },
    defaultVariants: {
      divider: false,
    },
  },
);

export const appDialogBodyVariants = cva(
  "min-h-0 flex-1 overflow-y-auto overscroll-contain",
  {
    variants: {
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
      divider: {
        true: "border-y border-[hsl(var(--app-dialog-border,var(--app-border)))]",
        false: "",
      },
    },
    defaultVariants: {
      padding: "none",
      divider: false,
    },
  },
);

export const appDialogFooterVariants = cva(
  "flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  {
    variants: {
      divider: {
        true: "border-t border-[hsl(var(--app-dialog-border,var(--app-border)))] pt-3",
        false: "",
      },
    },
    defaultVariants: {
      divider: false,
    },
  },
);

export const appDialogTitleVariants = cva(
  "text-sm font-semibold leading-none tracking-tight text-[hsl(var(--app-dialog-foreground,var(--app-foreground,var(--foreground))))]",
);

export const appDialogDescriptionVariants = cva(
  "text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
);
