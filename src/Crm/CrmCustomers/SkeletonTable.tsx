import { motion } from "framer-motion";

export function ClientTableSkeleton() {
  const skeletonRows = Array(5).fill(null);

  return (
    <table className="w-full border-collapse text-xs">
      <thead className="bg-gray-50 dark:bg-transparent dark:border-b dark:border-gray-800">
        <tr>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            ID
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Nombre Completo
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Teléfono
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            IP
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Servicios
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Zona de Facturación
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
        {skeletonRows.map((_, index) => (
          <tr key={index} className="bg-white dark:bg-transparent">
            <td className="px-3 py-2 text-center">
              <motion.div
                className="h-4 w-6 mx-auto rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
            <td className="px-3 py-2">
              <motion.div
                className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
            <td className="px-3 py-2">
              <motion.div
                className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
            <td className="px-3 py-2">
              <motion.div
                className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
            <td className="px-3 py-2">
              <motion.div
                className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
            <td className="px-3 py-2">
              <motion.div
                className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
            <td className="px-3 py-2">
              <div className="flex justify-center">
                <motion.div
                  className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
