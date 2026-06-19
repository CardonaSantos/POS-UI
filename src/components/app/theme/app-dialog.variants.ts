import { cva } from "class-variance-authority";

export const appDialogOverlayVariants = cva(
  [
    "fixed inset-0 z-[100]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ],
  {
    variants: {
      tone: {
        default: "bg-black/55",
        soft: "bg-black/40",
        strong: "bg-black/70",
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
      blur: "sm",
    },
  },
);

export const appDialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-[101]",
    "flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
    "overflow-hidden",
    "border border-[hsl(var(--app-border,var(--border)))]",
    "bg-[hsl(var(--app-popover,var(--background)))]",
    "text-[hsl(var(--app-popover-foreground,var(--foreground)))]",
    "shadow-xl",
    "duration-200",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
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
        compact: "max-h-[70vh]",
        default: "max-h-[85vh]",
        tall: "max-h-[92vh]",
        screen: "h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)]",
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
        true: "border-b border-[hsl(var(--app-border,var(--border)))] pb-3",
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
        true: "border-y border-[hsl(var(--app-border,var(--border)))]",
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
        true: "border-t border-[hsl(var(--app-border,var(--border)))] pt-3",
        false: "",
      },
    },
    defaultVariants: {
      divider: false,
    },
  },
);

export const appDialogTitleVariants = cva(
  "text-sm font-semibold leading-none tracking-tight text-[hsl(var(--app-foreground,var(--foreground)))]",
);

export const appDialogDescriptionVariants = cva(
  "text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
);
