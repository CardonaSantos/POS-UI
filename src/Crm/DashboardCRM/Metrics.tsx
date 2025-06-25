interface MetricsSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

// Componente de sección de métricas
export function MetricsSection({ title, children, icon }: MetricsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}
