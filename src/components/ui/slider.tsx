"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { type ClassNameProps, cn } from "src/utils/ui";
import { useCallback, useState } from "react";
import { biggestTwoPointsKmDistanceInBrazil } from "~/utils/constants";
import { useRouter } from "next/router";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-slate-900 dark:bg-slate-50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

interface SearchSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root>,
  ClassNameProps {
  minDistanceKm?: number;
}

function SearchSlider({
  className,
  max: maxSliderValue = 100,
  minDistanceKm = 5,
  ...rest
}: SearchSliderProps) {
  const minSliderValue =
    maxSliderValue * (minDistanceKm / biggestTwoPointsKmDistanceInBrazil);

  const router = useRouter();
  const distanceQueryParam = Array.isArray(router.query.distance)
    ? router.query.distance.at(0)
    : router.query.distance;
  const initialValue =
    distanceQueryParam !== undefined && !isNaN(Number(distanceQueryParam))
      ? maxSliderValue *
      (Number(distanceQueryParam) / biggestTwoPointsKmDistanceInBrazil)
      : maxSliderValue;

  const [thumbPosition, setThumbPosition] = useState<number>(initialValue);

  const kmDistanceFromSliderValue = useCallback(
    (value: number) => {
      return (
        biggestTwoPointsKmDistanceInBrazil *
        (value / maxSliderValue)
      ).toFixed(0);
    },
    [maxSliderValue],
  );

  const handleValueChange = useCallback(
    (valuesArray: number[]) => {
      const newValue = valuesArray.at(0);
      if (newValue === undefined) {
        return;
      }
      setThumbPosition(newValue);

      const distance = kmDistanceFromSliderValue(newValue);
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, distance },
        },
        undefined,
        { shallow: true },
      );
    },
    [kmDistanceFromSliderValue, router],
  );

  return (
    <div className="flex w-full flex-col pb-2 pt-4 ">
      <SliderPrimitive.Root
        value={[thumbPosition]}
        onValueChange={handleValueChange}
        max={maxSliderValue}
        min={minSliderValue}
        className={cn(
          "relative flex  w-full touch-none select-none items-center rounded-md bg-slate-200 pb-2 pt-4",
          className,
        )}
        {...rest}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-green-200 dark:bg-green-200">
          <SliderPrimitive.Range className="absolute h-full bg-accent dark:bg-accent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="dark:headingSecondary block h-5 w-5 rounded-full border-2 border-green-900 bg-headingSecondary ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-700 dark:ring-offset-green-700 dark:focus-visible:ring-green-300" />{" "}
      </SliderPrimitive.Root>
      <span className="ml-auto mt-3">
        {" "}
        {thumbPosition === maxSliderValue
          ? "Mostrar Resultados para todo Brasil"
          : `Mostrar Resultados até ${kmDistanceFromSliderValue(
            thumbPosition,
          )} km`}
      </span>
    </div>
  );
}

export { Slider, SearchSlider };
