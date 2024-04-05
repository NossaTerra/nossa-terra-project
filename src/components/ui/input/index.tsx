import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "src/utils/ui";
import { Button } from "../button";
import { useState } from "react";

import { useMaskito } from "@maskito/react";
import {
  type MaskitoOptions,
  type MaskitoElementPredicate,
} from "@maskito/core";
import { BrazilianPhoneMaskConfig } from "./masks/phone";
import { ZipCodeMaskConfig } from "./masks/zip-code";
import { CNPJ_MaskConfig, CPF_or_CNPJ_MaskConfig } from "./masks/cpf-cnpj";
import { RG_MaskConfig } from "./masks/rg";
import { CurrencyReaisMaskConfig } from "./masks/currency";

export interface MaskInputPresetConfig {
  inputProps?: Partial<HTMLInputElement>;
  maskitoOptions: MaskitoOptions;
}

export const MaskInputPresetConfigs = {
  BrazilianPhone: BrazilianPhoneMaskConfig,
  ZipCode: ZipCodeMaskConfig,

  RG: RG_MaskConfig,
  CNPJ: CNPJ_MaskConfig,
  CPF_or_CNPJ: CPF_or_CNPJ_MaskConfig,

  CurrencyReais: CurrencyReaisMaskConfig,
} as const satisfies Record<string, MaskInputPresetConfig>;

export type MaskInputPreset = keyof typeof MaskInputPresetConfigs;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: JSX.Element;
  maskPreset?: MaskInputPreset;
}

const getGuaranteedInputElement: MaskitoElementPredicate = (hostElement) => {
  const inputElement = hostElement.querySelector("input");
  if (!inputElement) {
    throw new Error("MaskedInput must have an input element as a child");
  }
  return inputElement;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ suffix, className, maskPreset, onChange, ...props }, ref) => {
    const maskConfig = maskPreset
      ? MaskInputPresetConfigs[maskPreset]
      : undefined;

    // NOTE: Using maskito through the parent to preserve the forward ref ref going to input
    const parentDivRef = useMaskito({
      options: maskConfig?.maskitoOptions,
      elementPredicate: getGuaranteedInputElement,
    });

    const onInput: React.FormEventHandler<HTMLInputElement> = React.useCallback(
      (event) => {
        onChange?.({
          ...event,
          target: event.currentTarget,
        });
      },
      [onChange],
    );

    return (
      <div className="flex items-center gap-3" ref={parentDivRef}>
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            // Custom Theme overrides
            "bg-backgroundPrimary",
            className,
          )}
          onInput={onInput}
          ref={ref}
          {...props}
          {...maskConfig?.inputProps}
        />
        {suffix}
      </div>
    );
  },
);

Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = React.useCallback(
      () => setShowPassword((prev) => !prev),
      [],
    );

    return (
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          className={cn("pr-8", className)}
          placeholder="Password"
          ref={ref}
        />
        <Button
          className="absolute right-1 top-1 h-7 w-7"
          onClick={toggleShowPassword}
          type="button"
          size="icon"
          variant="ghost"
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
