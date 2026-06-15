import * as React from "react";
import Select, {
  type ActionMeta,
  type ClassNamesConfig,
  type GroupBase,
  type Props as ReactSelectProps,
  type SelectInstance,
  type SingleValue,
  type StylesConfig,
} from "react-select";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSelectControlVariants,
  appSelectIndicatorVariants,
  appSelectMenuVariants,
  appSelectMessageVariants,
  appSelectOptionVariants,
  appSelectTextVariants,
  appSelectValueContainerVariants,
} from "../theme/app-react-select.variants";

export type AppSelectValue = string | number;

export interface AppSelectOption<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
> {
  value: TValue;
  label: string;
  description?: string;
  isDisabled?: boolean;
  meta?: TMeta;
}

type AppSelectControlVariantProps = VariantProps<
  typeof appSelectControlVariants
>;

interface AppSelectVisualProps {
  variant?: AppSelectControlVariantProps["variant"];
  size?: AppSelectControlVariantProps["size"];
  radius?: AppSelectControlVariantProps["radius"];
  intent?: AppSelectControlVariantProps["intent"];
  fieldWidth?: AppSelectControlVariantProps["fieldWidth"];
}

export interface AppSingleSelectProps<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>
  extends
    Omit<
      ReactSelectProps<
        AppSelectOption<TValue, TMeta>,
        false,
        GroupBase<AppSelectOption<TValue, TMeta>>
      >,
      | "isMulti"
      | "options"
      | "value"
      | "onChange"
      | "classNames"
      | "unstyled"
      | "styles"
      | "getOptionValue"
      | "getOptionLabel"
      | "noOptionsMessage"
      | "loadingMessage"
    >,
    AppSelectVisualProps {
  value?: TValue | null;
  options: Array<AppSelectOption<TValue, TMeta>>;
  selectedOption?: AppSelectOption<TValue, TMeta> | null;
  onChange?: (
    value: TValue | null,
    option: AppSelectOption<TValue, TMeta> | null,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => void;
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  noOptionsText?: string;
  loadingText?: string;
  portalToBody?: boolean;
  selectStyles?: StylesConfig<
    AppSelectOption<TValue, TMeta>,
    false,
    GroupBase<AppSelectOption<TValue, TMeta>>
  >;
}

function buildAppSingleSelectClassNames<TValue extends AppSelectValue, TMeta>({
  variant,
  size,
  radius,
  intent,
  fieldWidth,
  invalid,
  containerClassName,
  controlClassName,
  menuClassName,
  optionClassName,
}: {
  variant?: AppSelectVisualProps["variant"];
  size?: AppSelectVisualProps["size"];
  radius?: AppSelectVisualProps["radius"];
  intent?: AppSelectVisualProps["intent"];
  fieldWidth?: AppSelectVisualProps["fieldWidth"];
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
}): ClassNamesConfig<
  AppSelectOption<TValue, TMeta>,
  false,
  GroupBase<AppSelectOption<TValue, TMeta>>
> {
  const resolvedIntent = invalid ? "error" : intent;

  return {
    container: () =>
      cn(fieldWidth === "auto" ? "w-auto" : "w-full", containerClassName),

    control: ({ isFocused, isDisabled }) =>
      cn(
        appSelectControlVariants({
          variant,
          size,
          radius,
          intent: resolvedIntent,
          fieldWidth,
          isFocused,
          isDisabled,
        }),
        controlClassName,
      ),

    valueContainer: () =>
      cn(
        appSelectValueContainerVariants({
          size,
        }),
      ),

    input: () =>
      cn(
        appSelectTextVariants({
          size,
          tone: "value",
        }),
        "m-0 p-0",
      ),

    placeholder: () =>
      cn(
        appSelectTextVariants({
          size,
          tone: "placeholder",
        }),
      ),

    singleValue: () =>
      cn(
        appSelectTextVariants({
          size,
          tone: "value",
        }),
      ),

    indicatorsContainer: () => "h-full",

    indicatorSeparator: () => "hidden",

    dropdownIndicator: ({ selectProps }) =>
      cn(
        appSelectIndicatorVariants({
          size,
        }),
        selectProps.menuIsOpen && "rotate-180",
      ),

    clearIndicator: () =>
      cn(
        appSelectIndicatorVariants({
          size,
        }),
      ),

    loadingIndicator: () =>
      cn(
        appSelectIndicatorVariants({
          size,
        }),
      ),

    menu: () =>
      cn(
        appSelectMenuVariants({
          radius,
        }),
        menuClassName,
      ),

    menuList: () =>
      cn(
        "py-1",
        "max-h-[var(--app-select-menu-max-height)]",
        "overflow-y-auto",
      ),

    option: ({ isFocused, isSelected, isDisabled }) =>
      cn(
        appSelectOptionVariants({
          size,
          isFocused,
          isSelected,
          isDisabled,
        }),
        optionClassName,
      ),

    noOptionsMessage: () =>
      cn(
        appSelectMessageVariants({
          size,
        }),
      ),

    loadingMessage: () =>
      cn(
        appSelectMessageVariants({
          size,
        }),
      ),
  };
}

function AppSingleSelectInner<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  {
    value = null,
    selectedOption,
    options,
    onChange,
    invalid = false,
    variant,
    size,
    radius,
    intent,
    fieldWidth,
    containerClassName,
    controlClassName,
    menuClassName,
    optionClassName,
    placeholder = "Seleccione una opción",
    noOptionsText = "Sin opciones",
    loadingText = "Cargando...",
    isClearable = true,
    isSearchable = true,
    isDisabled,
    isLoading,
    portalToBody = true,
    menuPortalTarget,
    menuPosition,
    selectStyles,
    ...props
  }: AppSingleSelectProps<TValue, TMeta>,
  ref: React.ForwardedRef<
    SelectInstance<
      AppSelectOption<TValue, TMeta>,
      false,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
  >,
) {
  const selected = React.useMemo(() => {
    if (value === null || value === undefined) return null;

    if (selectedOption && selectedOption.value === value) {
      return selectedOption;
    }

    return options.find((option) => option.value === value) ?? null;
  }, [options, selectedOption, value]);

  const classNames = React.useMemo(
    () =>
      buildAppSingleSelectClassNames<TValue, TMeta>({
        variant,
        size,
        radius,
        intent,
        fieldWidth,
        invalid,
        containerClassName,
        controlClassName,
        menuClassName,
        optionClassName,
      }),
    [
      variant,
      size,
      radius,
      intent,
      fieldWidth,
      invalid,
      containerClassName,
      controlClassName,
      menuClassName,
      optionClassName,
    ],
  );

  const resolvedMenuPortalTarget =
    menuPortalTarget ??
    (portalToBody && typeof document !== "undefined"
      ? document.body
      : undefined);

  const handleChange = (
    newValue: SingleValue<AppSelectOption<TValue, TMeta>>,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => {
    onChange?.(newValue?.value ?? null, newValue ?? null, actionMeta);
  };

  return (
    <Select<
      AppSelectOption<TValue, TMeta>,
      false,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
      ref={ref}
      unstyled
      isMulti={false}
      value={selected}
      options={options}
      onChange={handleChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      isLoading={isLoading}
      placeholder={placeholder}
      classNames={classNames}
      menuPortalTarget={resolvedMenuPortalTarget}
      menuPosition={resolvedMenuPortalTarget ? "fixed" : menuPosition}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: "var(--app-select-menu-z-index)",
        }),
        ...selectStyles,
      }}
      getOptionValue={(option) => String(option.value)}
      getOptionLabel={(option) => option.label}
      isOptionDisabled={(option) => Boolean(option.isDisabled)}
      noOptionsMessage={() => noOptionsText}
      loadingMessage={() => loadingText}
      {...props}
    />
  );
}

const AppSingleSelect = React.forwardRef(AppSingleSelectInner) as <
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  props: AppSingleSelectProps<TValue, TMeta> & {
    ref?: React.ForwardedRef<
      SelectInstance<
        AppSelectOption<TValue, TMeta>,
        false,
        GroupBase<AppSelectOption<TValue, TMeta>>
      >
    >;
  },
) => React.ReactElement;

export { AppSingleSelect };
