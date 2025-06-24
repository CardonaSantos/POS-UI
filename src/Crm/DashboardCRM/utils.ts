export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Try modern API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("🚧 Clipboard API falló, intentando fallback", err);
    }
  }
  return false;
}
