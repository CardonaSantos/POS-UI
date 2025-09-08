type QueryStatusProps = {
  loading?: boolean;
  errors?: unknown[];
  onRetry?: () => void;
  children: React.ReactNode;
};

export function QueryStatus({
  loading,
  errors = [],
  onRetry,
  children,
}: QueryStatusProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        <div className="h-24 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3">
        <div className="font-medium">Ocurrieron errores al cargar.</div>
        <ul className="list-disc ml-5 text-sm">
          {errors.map((e, i) => (
            <li key={i}>{String((e as any)?.message ?? e)}</li>
          ))}
        </ul>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-sm underline">
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
