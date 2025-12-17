import { cn } from "@/lib/utils";

interface MessageTextProps {
  body: string;
  isOutbound: boolean;
}

export function MessageText({ body, isOutbound }: MessageTextProps) {
  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2 text-sm max-w-[85%] break-words",
        isOutbound
          ? "bg-teal-600 text-white dark:bg-[#0ea577] ml-auto"
          : // Light Mode: Morado muy claro.
            // Dark Mode: Usamos un morado muy oscuro (violet-900) y le bajamos la opacidad
            // para que se mezcle con el fondo negro, haciéndolo más sutil.
            "bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100"
      )}
    >
      <p className="whitespace-pre-wrap">{body}</p>
    </div>
  );
}
