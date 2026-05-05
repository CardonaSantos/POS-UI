export const getStatusStyles = (status: string): string => {
  const styles: Record<string, string> = {
    NUEVO:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
    ABIERTA:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
    EN_PROCESO:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30",
    PENDIENTE:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
    PENDIENTE_CLIENTE:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    PENDIENTE_TECNICO:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
    RESUELTA:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    CANCELADA:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
    ARCHIVADA:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
  return (
    styles[status] ||
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
  );
};

export const getPriorityStyles = (priority: string): string => {
  const styles: Record<string, string> = {
    BAJA: "text-slate-500 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20",
    MEDIA:
      "text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20",
    ALTA: "text-orange-600 bg-orange-50 border-orange-100 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
    URGENTE:
      "text-red-600 bg-red-50 border-red-100 font-semibold dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20",
  };
  return styles[priority] || "text-gray-500 bg-gray-50 border-gray-100";
};

export const LIVE_STATUSES = new Set([
  "NUEVO",
  "ABIERTA",
  "EN_PROCESO",
  "URGENTE",
]);

export const AVATAR_COLORS = [
  "bg-[#FF85A1] dark:bg-[#831843]",
  "bg-[#60A5FA] dark:bg-[#1E3A8A]",
  "bg-[#4ADE80] dark:bg-[#14532D]",
  "bg-[#FB923C] dark:bg-[#7C2D12]",
  "bg-[#A78BFA] dark:bg-[#4C1D95]",
  "bg-[#2DD4BF] dark:bg-[#134E4A]",
  "bg-[#FACC15] dark:bg-[#713F12]",
  "bg-[#818CF8] dark:bg-[#312E81]",
];
