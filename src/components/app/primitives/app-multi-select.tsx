import * as React from "react";
import Select, {
  type ActionMeta,
  type ClassNamesConfig,
  type GroupBase,
  type MultiValue,
  type Props as ReactSelectProps,
  type SelectInstance,
  type StylesConfig,
} from "react-select";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSelectControlVariants,
  appSelectIndicatorVariants,
  appSelectMenuVariants,
  appSelectMessageVariants,
  appSelectMultiValueLabelVariants,
  appSelectMultiValueRemoveVariants,
  appSelectMultiValueVariants,
  appSelectOptionVariants,
  appSelectTextVariants,
  appSelectValueContainerVariants,
} from "../theme/app-react-select.variants";
import type { AppSelectOption, AppSelectValue } from "./app-single-select";

type AppSelectControlVariantProps = VariantProps<
  typeof appSelectControlVariants
>;

interface AppMultiSelectVisualProps {
  variant?: AppSelectControlVariantProps["variant"];
  size?: AppSelectControlVariantProps["size"];
  radius?: AppSelectControlVariantProps["radius"];
  intent?: AppSelectControlVariantProps["intent"];
  fieldWidth?: AppSelectControlVariantProps["fieldWidth"];
}

export interface AppMultiSelectProps<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>
  extends
    Omit<
      ReactSelectProps<
        AppSelectOption<TValue, TMeta>,
        true,
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
    AppMultiSelectVisualProps {
  value?: TValue[];
  options: Array<AppSelectOption<TValue, TMeta>>;
  selectedOptions?: Array<AppSelectOption<TValue, TMeta>>;
  onChange?: (
    values: TValue[],
    options: Array<AppSelectOption<TValue, TMeta>>,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => void;
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  multiValueClassName?: string;
  noOptionsText?: string;
  loadingText?: string;
  portalToBody?: boolean;
  selectStyles?: StylesConfig<
    AppSelectOption<TValue, TMeta>,
    true,
    GroupBase<AppSelectOption<TValue, TMeta>>
  >;
}

function buildAppMultiSelectClassNames<TValue extends AppSelectValue, TMeta>({
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
  multiValueClassName,
}: {
  variant?: AppMultiSelectVisualProps["variant"];
  size?: AppMultiSelectVisualProps["size"];
  radius?: AppMultiSelectVisualProps["radius"];
  intent?: AppMultiSelectVisualProps["intent"];
  fieldWidth?: AppMultiSelectVisualProps["fieldWidth"];
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  multiValueClassName?: string;
}): ClassNamesConfig<
  AppSelectOption<TValue, TMeta>,
  true,
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
        "gap-1 flex-wrap",
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

    multiValue: () =>
      cn(
        appSelectMultiValueVariants({
          size,
          radius,
        }),
        multiValueClassName,
      ),

    multiValueLabel: () =>
      cn(
        appSelectMultiValueLabelVariants({
          size,
        }),
      ),

    multiValueRemove: () =>
      cn(
        appSelectMultiValueRemoveVariants({
          size,
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
          radius: radius === "full" ? "lg" : radius,
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

function AppMultiSelectInner<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  {
    value = [],
    selectedOptions,
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
    multiValueClassName,
    placeholder = "Seleccione opciones",
    noOptionsText = "Sin opciones",
    loadingText = "Cargando...",
    isClearable = true,
    isSearchable = true,
    closeMenuOnSelect = false,
    hideSelectedOptions = false,
    isDisabled,
    isLoading,
    portalToBody = false,
    menuPortalTarget,
    menuPosition,
    selectStyles,
    ...props
  }: AppMultiSelectProps<TValue, TMeta>,
  ref: React.ForwardedRef<
    SelectInstance<
      AppSelectOption<TValue, TMeta>,
      true,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
  >,
) {
  const selected = React.useMemo(() => {
    if (selectedOptions?.length) {
      return selectedOptions;
    }

    if (!value.length) {
      return [];
    }

    const selectedValueSet = new Set(value);

    return options.filter((option) => selectedValueSet.has(option.value));
  }, [options, selectedOptions, value]);

  const classNames = React.useMemo(
    () =>
      buildAppMultiSelectClassNames<TValue, TMeta>({
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
        multiValueClassName,
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
      multiValueClassName,
    ],
  );

  const resolvedMenuPortalTarget =
    menuPortalTarget ??
    (portalToBody && typeof document !== "undefined"
      ? document.body
      : undefined);

  const handleChange = (
    newValue: MultiValue<AppSelectOption<TValue, TMeta>>,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => {
    const nextOptions = [...newValue];
    const nextValues = nextOptions.map((option) => option.value);

    onChange?.(nextValues, nextOptions, actionMeta);
  };

  return (
    <Select<
      AppSelectOption<TValue, TMeta>,
      true,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
      ref={ref}
      unstyled
      isMulti
      value={selected}
      options={options}
      onChange={handleChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      closeMenuOnSelect={closeMenuOnSelect}
      hideSelectedOptions={hideSelectedOptions}
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

const AppMultiSelect = React.forwardRef(AppMultiSelectInner) as <
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  props: AppMultiSelectProps<TValue, TMeta> & {
    ref?: React.ForwardedRef<
      SelectInstance<
        AppSelectOption<TValue, TMeta>,
        true,
        GroupBase<AppSelectOption<TValue, TMeta>>
      >
    >;
  },
) => React.ReactElement;

export { AppMultiSelect };
