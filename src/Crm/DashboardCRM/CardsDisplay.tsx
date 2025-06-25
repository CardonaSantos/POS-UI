import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  subtitle?: string;
}

export function EnhancedStatCard({
  title,
  value,
  icon,
  trend,
  variant = "default",
  subtitle,
}: EnhancedStatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-500/20 bg-green-500/5";
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/5";
      case "danger":
        return "border-red-500/20 bg-red-500/5";
      case "info":
        return "border-blue-500/20 bg-blue-500/5";
      default:
        return "border-border bg-card";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "danger":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card
        className={`h-full transition-all duration-200 hover:shadow-lg ${getVariantStyles()}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                {title}
              </p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {trend && (
                <div className="flex items-center gap-1">
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      trend.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trend.value}% {trend.label}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`p-2 rounded-lg bg-background/50 ${getIconColor()}`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
