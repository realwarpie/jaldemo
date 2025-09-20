import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardMetrics } from "./DashboardMetrics";
import { RiskStatusCard } from "./RiskStatusCard";
import { InteractiveMap } from "./InteractiveMap";
import { AlertCard } from "./AlertCard";
import { TrendChart } from "./TrendChart";
import { DataEntryForm } from "./DataEntryForm";
import { BarChart3, Map, AlertTriangle, TrendingUp, FileText, History } from "lucide-react";

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className = "" }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  //todo: remove mock functionality - replace with real dashboard data
  const recentAlerts = [
    {
      id: "alert-001",
      title: "Potential Cholera Outbreak",
      severity: "critical" as const,
      status: "active" as const,
      location: "Imphal District, Manipur",
      affectedPopulation: 15000,
      timestamp: "2 hours ago",
      description: "Elevated cholera risk detected based on increased case reports and contaminated water source analysis.",
      riskFactors: [
        "Heavy rainfall in past 72 hours",
        "Contaminated water supply at Langol area",
        "15 confirmed cases with cholera symptoms"
      ],
      estimatedCases: 25,
      confidence: 87
    },
    {
      id: "alert-002",
      title: "Water Quality Alert", 
      severity: "medium" as const,
      status: "verified" as const,
      location: "Silchar District, Assam",
      affectedPopulation: 8000,
      timestamp: "6 hours ago",
      description: "Water contamination detected at multiple test sites in the region.",
      riskFactors: [
        "E. coli levels above WHO standards",
        "7 cases reported in past 48 hours"
      ],
      estimatedCases: 12,
      confidence: 72
    }
  ];

  const riskStatusData = [
    {
      level: "high" as const,
      title: "Imphal PHC",
      location: "Manipur West",
      lastUpdated: "30 minutes ago",
      factors: ["Heavy rainfall", "5+ new cases", "Contaminated water source"]
    },
    {
      level: "medium" as const,
      title: "Silchar PHC", 
      location: "Cachar District",
      lastUpdated: "1 hour ago",
      factors: ["Moderate rainfall", "2 new cases", "Water testing pending"]
    },
    {
      level: "low" as const,
      title: "Guwahati PHC",
      location: "Kamrup District", 
      lastUpdated: "2 hours ago",
      factors: ["Normal water quality", "No recent cases"]
    }
  ];

  return (
    <div className={`space-y-6 ${className}`} data-testid="dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              JalSuraksha Dashboard
            </h2>
            <p className="text-muted-foreground">
              Real-time water-borne disease surveillance for Northeast India
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              All Systems Operational
            </Badge>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <section data-testid="dashboard-metrics-section">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          System Performance Metrics
        </h3>
        <DashboardMetrics />
      </section>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" data-testid="dashboard-tabs">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" data-testid="tab-overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="map" data-testid="tab-map" className="gap-2">
            <Map className="h-4 w-4" />
            Risk Map
          </TabsTrigger>
          <TabsTrigger value="alerts" data-testid="tab-alerts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="data-entry" data-testid="tab-data-entry" className="gap-2">
            <FileText className="h-4 w-4" />
            Data Entry
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6" data-testid="overview-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Status Cards */}
            <div>
              <h4 className="text-md font-semibold text-foreground mb-4">Current Risk Status</h4>
              <div className="space-y-4">
                {riskStatusData.map((risk, index) => (
                  <RiskStatusCard
                    key={index}
                    level={risk.level}
                    title={risk.title}
                    location={risk.location}
                    lastUpdated={risk.lastUpdated}
                    factors={risk.factors}
                  />
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div>
              <h4 className="text-md font-semibold text-foreground mb-4">Recent Alerts</h4>
              <div className="space-y-4">
                {recentAlerts.map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onVerify={(id) => console.log('Verify alert:', id)}
                    onResolve={(id) => console.log('Resolve alert:', id)}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" data-testid="map-content">
          <InteractiveMap onPHCClick={(phc) => console.log('PHC selected:', phc)} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4" data-testid="alerts-content">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">Alert Management</h4>
            <div className="flex gap-2">
              <Badge variant="outline">5 Active</Badge>
              <Badge variant="outline">3 Verified</Badge>
              <Badge variant="outline">12 Resolved</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onVerify={(id) => console.log('Verify alert:', id)}
                onResolve={(id) => console.log('Resolve alert:', id)}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" data-testid="trends-content">
          <TrendChart chartType="cases" timeRange="30d" />
        </TabsContent>

        <TabsContent value="data-entry" data-testid="data-entry-content">
          <DataEntryForm onSubmit={(data) => console.log('Form submitted:', data)} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4" data-testid="history-content">
          <Card>
            <CardHeader>
              <CardTitle>Historical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">247</div>
                  <div className="text-sm text-muted-foreground">Total Outbreaks Prevented</div>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">3.4 days</div>
                  <div className="text-sm text-muted-foreground">Average Lead Time</div>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">94.2%</div>
                  <div className="text-sm text-muted-foreground">Detection Accuracy</div>
                </div>
              </div>
              <TrendChart chartType="outbreaks" timeRange="1y" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}