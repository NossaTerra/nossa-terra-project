import { maskitoWithPlaceholder } from "@maskito/kit";
import type { MaskInputPresetConfig } from "..";
import { type MaskitoMask } from "@maskito/core";

export const zipCodePattern = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
] as const satisfies MaskitoMask;

export const ZipCodeMaskConfig = {
  inputProps: {
    type: "tel",
    placeholder: "Ex: 99999- 999",
  },
  maskitoOptions: {
    ...maskitoWithPlaceholder("_____-___"),
    mask: zipCodePattern,
  },
} satisfies MaskInputPresetConfig;
