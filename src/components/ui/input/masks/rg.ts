import { type MaskitoMask } from "@maskito/core";
import { maskitoWithPlaceholder } from "@maskito/kit";
import type { MaskInputPresetConfig } from "..";

const rgPatternShort = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
] as const satisfies MaskitoMask;

const rgPatternLong = [
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
] as const satisfies MaskitoMask;

export const RG_MaskConfig = {
  inputProps: {
    type: "tel",
  },
  maskitoOptions: {
    ...maskitoWithPlaceholder("______-_"),
    mask: ({ value }) => {
      if (value.length <= rgPatternShort.length) {
        return rgPatternShort;
      } else {
        return rgPatternLong;
      }
    },
  },
} satisfies MaskInputPresetConfig;
