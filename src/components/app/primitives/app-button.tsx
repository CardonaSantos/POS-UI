import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { appButtonVariants } from "../theme/app-button.variants";
export interface AppButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof appButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      width,
      asChild = false,
      loading = false,
      loadingText,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const content = (
      <>
        {loading ? (
          <Loader2
            className="h-3.5 w-3.5 shrink-0 animate-spin"
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}

        {loading && loadingText ? loadingText : children}

        {!loading && rightIcon}
      </>
    );

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={isDisabled || undefined}
        data-loading={loading ? "true" : undefined}
        className={cn(
          appButtonVariants({
            variant,
            size,
            radius,
            width,
          }),
          className,
        )}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

AppButton.displayName = "AppButton";

export { AppButton, appButtonVariants };
