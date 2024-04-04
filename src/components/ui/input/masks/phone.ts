import { type MaskitoMask } from "@maskito/core";
import { maskitoWithPlaceholder } from "@maskito/kit";
import type { MaskInputPresetConfig } from "..";

export const landlinePhonePattern = [
  "(",
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
] as const satisfies MaskitoMask;

export const mobilePhonePattern = [
  "(",
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
] as const satisfies MaskitoMask;

export const BrazilianPhoneMaskConfig = {
  inputProps: {
    type: "tel",
    placeholder: "(DDD) XXXXX-XXXX",
  },
  maskitoOptions: {
    ...maskitoWithPlaceholder("(__) ____-____"),
    mask: ({ value }) => {
      if (value.length <= landlinePhonePattern.length) {
        return landlinePhonePattern;
      }
      return mobilePhonePattern;
    },
  },
} satisfies MaskInputPresetConfig;
