import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

interface RiskStatusCardProps {
  level: RiskLevel;
  title: string;
  location: string;
  lastUpdated: string;
  factors?: string[];
  onClick?: () => void;
}

const riskConfig = {
  low: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    label: "Low Risk"
  },
  medium: {
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    label: "Medium Risk"
  },
  high: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    label: "High Risk"
  }
};

export function RiskStatusCard({ 
  level, 
  title, 
  location, 
  lastUpdated, 
  factors = [],
  onClick = () => {}
}: RiskStatusCardProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <Card 
      className={`hover-elevate cursor-pointer transition-all duration-200 ${config.bgColor} ${config.borderColor}`}
      onClick={() => {
        console.log(`Risk card clicked: ${title} - ${level} risk`);
        onClick();
      }}
      data-testid={`card-risk-${level}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="flex items-center gap-2">
          <Badge className={config.badge}>{config.label}</Badge>
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {factors.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground mb-2">Risk Factors:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {factors.slice(0, 3).map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs text-muted-foreground" data-testid={`text-last-updated-${level}`}>
          Last updated: {lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}