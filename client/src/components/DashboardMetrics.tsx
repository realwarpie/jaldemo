import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Target, Users, AlertTriangle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  status?: "good" | "warning" | "critical";
}

function MetricCard({ title, value, subtitle, trend, trendValue, icon: Icon, status = "good" }: MetricCardProps) {
  const statusConfig = {
    good: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400", 
    critical: "text-red-600 dark:text-red-400"
  };

  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  const TrendIcon = trendIcon;

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${statusConfig[status]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1" data-testid={`metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        )}
        {trend && trendValue && TrendIcon && (
          <div className="flex items-center gap-1 text-xs">
            <TrendIcon className={`h-3 w-3 ${trend === "up" ? "text-green-600" : "text-red-600"}`} />
            <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
              {trendValue}
            </span>
            <span className="text-muted-foreground">from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardMetricsProps {
  className?: string;
}

export function DashboardMetrics({ className = "" }: DashboardMetricsProps) {
  //todo: remove mock functionality - replace with real metrics data
  const metrics = [
    {
      title: "Early Detection Rate",
      value: "73%",
      subtitle: "≥70% Target",
      trend: "up" as const,
      trendValue: "+3%",
      icon: Target,
      status: "good" as const
    },
    {
      title: "Active PHCs",
      value: "127",
      subtitle: "Northeast India",
      trend: "up" as const,
      trendValue: "+5",
      icon: Users,
      status: "good" as const
    },
    {
      title: "Alert Response Time",
      value: "2.4 hrs",
      subtitle: "Average response",
      trend: "down" as const,
      trendValue: "-0.3 hrs",
      icon: Clock,
      status: "good" as const
    },
    {
      title: "False Alarm Rate",
      value: "18%",
      subtitle: "≤20% Target",
      trend: "down" as const,
      trendValue: "-2%",
      icon: AlertTriangle,
      status: "good" as const
    },
    {
      title: "Lead Time",
      value: "3.2 days",
      subtitle: "Outbreak prediction",
      trend: "up" as const,
      trendValue: "+0.4 days",
      icon: TrendingUp,
      status: "good" as const
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${className}`} data-testid="dashboard-metrics">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}