import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";
import { useState } from "react";

type ChartType = "cases" | "rainfall" | "outbreaks";
type TimeRange = "7d" | "30d" | "90d" | "1y";

interface TrendChartProps {
  chartType?: ChartType;
  timeRange?: TimeRange;
  className?: string;
}

interface ChartDataPoint {
  date: string;
  cases?: number;
  rainfall?: number;
  outbreaks?: number;
  predicted?: number;
  actual?: number;
}

export function TrendChart({ 
  chartType = "cases", 
  timeRange = "30d",
  className = ""
}: TrendChartProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>(chartType);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(timeRange);

  //todo: remove mock functionality - replace with real trend data
  const generateMockData = (type: ChartType): ChartDataPoint[] => {
    const baseData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });

    if (type === "cases") {
      return baseData.map((item, i) => ({
        ...item,
        cases: Math.floor(Math.random() * 15) + 5,
        predicted: Math.floor(Math.random() * 10) + 8
      }));
    } else if (type === "rainfall") {
      return baseData.map((item, i) => ({
        ...item,
        rainfall: Math.floor(Math.random() * 50) + 10,
        cases: Math.floor(Math.random() * 12) + 3
      }));
    } else {
      return baseData.map((item, i) => ({
        ...item,
        outbreaks: Math.floor(Math.random() * 3),
        predicted: Math.floor(Math.random() * 2)
      }));
    }
  };

  const chartData = generateMockData(selectedChart);

  const chartConfig = {
    cases: {
      title: "Disease Cases Trend",
      color: "#ef4444",
      secondaryColor: "#f97316"
    },
    rainfall: {
      title: "Rainfall vs Cases Correlation",
      color: "#3b82f6",
      secondaryColor: "#ef4444"
    },
    outbreaks: {
      title: "Outbreak Predictions",
      color: "#8b5cf6",
      secondaryColor: "#06b6d4"
    }
  };

  const timeRangeLabels = {
    "7d": "7 Days",
    "30d": "30 Days",
    "90d": "90 Days",
    "1y": "1 Year"
  };

  const getTrendInfo = () => {
    const recent = chartData.slice(-7);
    const previous = chartData.slice(-14, -7);
    
    if (selectedChart === "cases") {
      const recentAvg = recent.reduce((sum, item) => sum + (item.cases || 0), 0) / recent.length;
      const previousAvg = previous.reduce((sum, item) => sum + (item.cases || 0), 0) / previous.length;
      const change = ((recentAvg - previousAvg) / previousAvg) * 100;
      
      return {
        trend: change > 0 ? "up" : "down",
        value: `${Math.abs(change).toFixed(1)}%`,
        isGood: change < 0
      };
    }
    
    return { trend: "neutral", value: "No change", isGood: true };
  };

  const trendInfo = getTrendInfo();

  const handleExport = () => {
    console.log(`Exporting ${selectedChart} chart data for ${selectedTimeRange}`);
  };

  return (
    <Card className={`${className}`} data-testid="trend-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {chartConfig[selectedChart].title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export-chart">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" data-testid="button-chart-settings">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge 
              variant={selectedChart === "cases" ? "default" : "outline"}
              className="cursor-pointer hover-elevate"
              onClick={() => setSelectedChart("cases")}
              data-testid="tab-cases"
            >
              Cases
            </Badge>
            <Badge 
              variant={selectedChart === "rainfall" ? "default" : "outline"}
              className="cursor-pointer hover-elevate"
              onClick={() => setSelectedChart("rainfall")}
              data-testid="tab-rainfall"
            >
              Rainfall
            </Badge>
            <Badge 
              variant={selectedChart === "outbreaks" ? "default" : "outline"}
              className="cursor-pointer hover-elevate"
              onClick={() => setSelectedChart("outbreaks")}
              data-testid="tab-outbreaks"
            >
              Outbreaks
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {Object.entries(timeRangeLabels).map(([key, label]) => (
              <Badge
                key={key}
                variant={selectedTimeRange === key ? "default" : "outline"}
                className="cursor-pointer hover-elevate text-xs"
                onClick={() => setSelectedTimeRange(key as TimeRange)}
                data-testid={`time-range-${key}`}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {trendInfo.trend !== "neutral" && (
            <>
              {trendInfo.trend === "up" ? (
                <TrendingUp className={`h-4 w-4 ${trendInfo.isGood ? "text-green-600" : "text-red-600"}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${trendInfo.isGood ? "text-green-600" : "text-red-600"}`} />
              )}
              <span className={trendInfo.isGood ? "text-green-600" : "text-red-600"}>
                {trendInfo.value} from last week
              </span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80" data-testid="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChart === "cases" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke={chartConfig.cases.color}
                  strokeWidth={2}
                  name="Actual Cases"
                  dot={{ fill: chartConfig.cases.color, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke={chartConfig.cases.secondaryColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Cases"
                  dot={{ fill: chartConfig.cases.secondaryColor, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : selectedChart === "rainfall" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="rainfall" 
                    fill={chartConfig.rainfall.color}
                    name="Rainfall (mm)"
                    opacity={0.8}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cases" 
                    stroke={chartConfig.rainfall.secondaryColor}
                    strokeWidth={2}
                    name="Cases"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="outbreaks" 
                  stroke={chartConfig.outbreaks.color}
                  strokeWidth={2}
                  name="Actual Outbreaks"
                  dot={{ fill: chartConfig.outbreaks.color, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke={chartConfig.outbreaks.secondaryColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Outbreaks"
                  dot={{ fill: chartConfig.outbreaks.secondaryColor, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}