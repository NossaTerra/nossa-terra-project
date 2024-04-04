import { maskitoWithPlaceholder } from "@maskito/kit";
import type { MaskInputPresetConfig } from "..";

export const ZipCodeMaskConfig = {
  inputProps: {
    type: "tel",
    placeholder: "Ex: 99999- 999",
  },
  maskitoOptions: {
    ...maskitoWithPlaceholder("_____-___"),
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
  },
} satisfies MaskInputPresetConfig;
