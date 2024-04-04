/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  maskitoPrefixPostprocessorGenerator,
  maskitoAddOnFocusPlugin,
  maskitoRemoveOnBlurPlugin,
  maskitoCaretGuard,
} from "@maskito/kit";
import type { MaskInputPresetConfig } from "..";

export const CurrencyReaisMaskConfig = {
  inputProps: {
    type: "tel",
  },
  maskitoOptions: {
    postprocessors: [maskitoPrefixPostprocessorGenerator("R$ ")],
    plugins: [
      maskitoAddOnFocusPlugin("R$ "),
      maskitoRemoveOnBlurPlugin("R$ "),
      maskitoCaretGuard((value) => {
        let startPoint = 0;
        if (value.at(0) === "R") {
          startPoint++;
          if (value.at(1) === "$") {
            startPoint++;
            if (value.at(2) === " ") {
              startPoint++;
            }
          }
        }
        return [startPoint, value.length];
      }),
    ],
    mask: ({ value }) => {
      const digitsBeforeComma =
        value.split(",").at(0)?.replaceAll(/\D/g, "")?.length || 1;

      const digitsWithDotSeparation = [] as Array<RegExp | string>;
      for (let i = 0; i < digitsBeforeComma - 1; i++) {
        if (i !== 0 && i % 3 === 0) {
          digitsWithDotSeparation.push(".");
        }
        digitsWithDotSeparation.push(/\d/);
      }
      digitsWithDotSeparation.reverse();

      return [
        "R",
        "$",
        " ",
        /[1-9]/,
        ...digitsWithDotSeparation,
        ",",
        /\d/,
        /\d/,
      ];
    },
  },
} satisfies MaskInputPresetConfig;

export function getNumberFromCurrencyReais(value?: string | number) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const [integerPartWithDots, cents] = value.replace(/^\R\$? ?/, "").split(",");
  const integer = (integerPartWithDots || "0").replace(/\D/g, "");

  return Number(`${integer}.${cents || "0"}`);
}
