import { Transition, Variants } from "framer-motion";

export const makeFadeSlide = (
  direction: "up" | "down" | "left" | "right" = "up",
  distance = 8,
  transition: Transition = {
    type: "spring",
    bounce: 0.25,
    visualDuration: 0.35,
  }
): Variants => {
  const offset = { x: 0, y: 0 };

  if (direction === "up") offset.y = distance;

  if (direction === "down") offset.y = -distance;
  if (direction === "left") offset.x = distance;

  if (direction === "right") offset.x = -distance;

  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0, transition },
    exit: { opacity: 0, ...offset, transition },
  };
};
