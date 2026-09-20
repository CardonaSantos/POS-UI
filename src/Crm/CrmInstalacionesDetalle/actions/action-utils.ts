export function optionalTrimmed(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function optionalNullableTrimmed(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function localDateTimeToIso(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("La fecha ingresada no es válida.");
  }

  return parsed.toISOString();
}

export function getFileError(file: File | null) {
  if (!file) return "Seleccione una imagen.";
  if (!file.type.startsWith("image/")) {
    return "El archivo debe ser una imagen.";
  }
  return null;
}

export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}
