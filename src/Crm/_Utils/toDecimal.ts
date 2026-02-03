/**
 * Convierte un valor del a número decimal válido.
 * Si no es un número válido, retorna 0 o null según prefieras.
 */
export const toDecimal = (
  value: string | number | null | undefined,
): number => {
  if (value === null || value === undefined || value === "") return 0;

  // Si es string, reemplazamos comas por puntos antes de parsear
  const sanitized =
    typeof value === "string" ? value.replace(/,/g, ".") : value;

  const parsed = parseFloat(sanitized.toString());
  return isNaN(parsed) ? 0 : parsed;
};
