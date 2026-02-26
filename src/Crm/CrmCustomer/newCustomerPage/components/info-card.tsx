import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface InfoItem {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  divider?: boolean;
}

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  items?: InfoItem[];
  children?: ReactNode;
  className?: string;
}

export function InfoCard({
  title,
  icon: Icon,
  action,
  items,
  children,
  className = "",
}: InfoCardProps) {
  return (
    <Card
      className={`border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-100">
            {Icon && (
              <Icon className="h-4 w-4 mr-2 text-primary dark:text-white flex-shrink-0" />
            )}
            {title}
          </CardTitle>
          {action && <div>{action}</div>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {items && items.length > 0 && (
          <dl className="grid gap-2 m-0">
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col sm:grid sm:grid-cols-3 sm:items-start gap-1 sm:gap-0 ${
                  item.divider
                    ? "border-t border-gray-100 dark:border-gray-800 pt-3 mt-3"
                    : ""
                }`}
              >
                <dt className="font-medium text-muted-foreground flex items-center sm:pt-0.5">
                  {item.icon && (
                    <item.icon className="h-3.5 w-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                  )}
                  {item.label}:
                </dt>
                <dd className="sm:col-span-2 break-words text-gray-900 dark:text-gray-50">
                  {/* Si no hay valor, mostramos un fallback elegante */}
                  {item.value || (
                    <span className="italic opacity-60">No especificado</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {/* Renderizamos el children por si necesitas meter tablas complejas dentro */}
        {children}
      </CardContent>
    </Card>
  );
}
