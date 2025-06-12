import { motion } from "framer-motion";

export function TableSkeleton() {
  // Create an array of 5 skeleton rows
  const skeletonRows = Array(5).fill(null);

  return (
    <table className="w-full border-collapse text-xs">
      <thead className="bg-gray-50 dark:bg-transparent dark:border-b dark:border-gray-800">
        <tr>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            ID
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Cliente
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Cantidad
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Fecha Creado
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Fecha Pago
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Teléfono
          </th>
          <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
            Estado
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
                className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800"
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
                className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
