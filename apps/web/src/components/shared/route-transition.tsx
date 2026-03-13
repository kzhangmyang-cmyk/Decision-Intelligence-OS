"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

type RouteTransitionProps = {
  children: ReactNode;
};

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const transitionProps = reduceMotion
    ? {
        initial: { opacity: 1, y: 0, filter: "blur(0px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 1, y: 0, filter: "blur(0px)" },
      }
    : {
        initial: { opacity: 0, y: 8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -6, filter: "blur(3px)" },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={transitionProps.initial}
        animate={transitionProps.animate}
        exit={transitionProps.exit}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
