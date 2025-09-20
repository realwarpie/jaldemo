import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, MapPin, Users, Droplets } from "lucide-react";

type AlertSeverity = "low" | "medium" | "high" | "critical";
type AlertStatus = "active" | "verified" | "resolved" | "false-alarm";

interface AlertData {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  location: string;
  affectedPopulation: number;
  timestamp: string;
  description: string;
  riskFactors: string[];
  estimatedCases: number;
  confidence: number;
}

interface AlertCardProps {
  alert: AlertData;
  onVerify?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onViewDetails?: (alertId: string) => void;
  className?: string;
}

const severityConfig = {
  low: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    label: "Low Risk"
  },
  medium: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    label: "Medium Risk"
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400", 
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
    label: "High Risk"
  },
  critical: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30", 
    borderColor: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    label: "Critical Risk"
  }
};

const statusConfig = {
  active: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  verified: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  resolved: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300",
  "false-alarm": "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
};

export function AlertCard({ 
  alert, 
  onVerify = () => {},
  onResolve = () => {},
  onViewDetails = () => {},
  className = ""
}: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  const handleVerify = () => {
    console.log(`Verifying alert: ${alert.id}`);
    onVerify(alert.id);
  };

  const handleResolve = () => {
    console.log(`Resolving alert: ${alert.id}`);
    onResolve(alert.id);
  };

  const handleViewDetails = () => {
    console.log(`Viewing details for alert: ${alert.id}`);
    onViewDetails(alert.id);
  };

  return (
    <Card 
      className={`hover-elevate transition-all duration-200 ${config.bgColor} ${config.borderColor} ${className}`}
      data-testid={`alert-card-${alert.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <CardTitle className="text-lg font-semibold text-foreground">{alert.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={config.badge}>{config.label}</Badge>
              <Badge className={statusConfig[alert.status]}>
                {alert.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {alert.confidence}% Confidence
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {alert.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {alert.affectedPopulation.toLocaleString()} affected
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="h-4 w-4" />
            ~{alert.estimatedCases} cases
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">{alert.description}</p>
        
        {alert.riskFactors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Key Risk Factors:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {alert.riskFactors.slice(0, 3).map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Alert generated: {alert.timestamp}
          </span>
          
          <div className="flex items-center gap-2">
            {alert.status === "active" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleVerify}
                data-testid={`button-verify-${alert.id}`}
              >
                Verify
              </Button>
            )}
            {(alert.status === "verified" || alert.status === "active") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResolve}
                data-testid={`button-resolve-${alert.id}`}
              >
                Resolve
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm"
              onClick={handleViewDetails}
              data-testid={`button-details-${alert.id}`}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}