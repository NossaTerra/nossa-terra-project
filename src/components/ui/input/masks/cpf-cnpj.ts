import { type MaskitoMask } from "@maskito/core";
import { maskitoWithPlaceholder } from "@maskito/kit";
import type { MaskInputPresetConfig } from "..";

export const cnpjPattern = [
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
] as const satisfies MaskitoMask;

export const CNPJ_MaskConfig = {
  inputProps: {
    type: "tel",
    placeholder: "__.___.___/____-__",
  },
  maskitoOptions: {
    ...maskitoWithPlaceholder("__.___.___/____-__"),
    mask: cnpjPattern,
  },
};

export const cpfPattern = [
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
] as const satisfies MaskitoMask;

export const CPF_or_CNPJ_MaskConfig = {
  inputProps: {
    type: "tel",
    placeholder: "___.___.___-__",
  },
  maskitoOptions: {
    ...maskitoWithPlaceholder("___.___.___-__"),

    mask: ({ value }) => {
      if (value.length <= cpfPattern.length) {
        return cpfPattern;
      } else {
        return cnpjPattern;
      }
    },
  },
} satisfies MaskInputPresetConfig;
