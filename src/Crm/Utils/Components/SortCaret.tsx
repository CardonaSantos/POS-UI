// fuera, un pequeño componente para la flechita
import { motion } from "framer-motion";
export function SortCaret({ sorted }: { sorted: false | "asc" | "desc" }) {
  return (
    <motion.span
      animate={{
        rotate: sorted === "asc" ? 180 : 0,
        opacity: sorted ? 1 : 0.35,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="text-xs"
    >
      ▲
    </motion.span>
  );
}
