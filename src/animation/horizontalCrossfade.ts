import { type Transition, type Variants } from "framer-motion";

export enum Direction {
  Left = "left",
  Right = "right",
}

export const variants = {
  enter: (direction: Direction) => ({
    x: direction === Direction.Left ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === Direction.Left ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
  }),
} as const satisfies Variants;

export const transition: Transition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};
