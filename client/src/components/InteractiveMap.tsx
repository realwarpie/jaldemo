import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ZoomIn, ZoomOut, Layers } from "lucide-react";

interface PHCLocation {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: [number, number];
  riskLevel: "low" | "medium" | "high";
  cases: number;
  lastUpdate: string;
}

interface InteractiveMapProps {
  className?: string;
  onPHCClick?: (phc: PHCLocation) => void;
}

export function InteractiveMap({ className = "", onPHCClick = () => {} }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPHC, setSelectedPHC] = useState<PHCLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //todo: remove mock functionality - replace with real PHC data
  const phcLocations: PHCLocation[] = [
    {
      id: "phc-001",
      name: "Guwahati PHC",
      district: "Kamrup",
      state: "Assam",
      coordinates: [26.1445, 91.7362],
      riskLevel: "low",
      cases: 2,
      lastUpdate: "2 hours ago"
    },
    {
      id: "phc-002", 
      name: "Silchar PHC",
      district: "Cachar",
      state: "Assam",
      coordinates: [24.8333, 92.7789],
      riskLevel: "medium",
      cases: 7,
      lastUpdate: "1 hour ago"
    },
    {
      id: "phc-003",
      name: "Imphal PHC", 
      district: "Imphal West",
      state: "Manipur",
      coordinates: [24.8170, 93.9368],
      riskLevel: "high",
      cases: 15,
      lastUpdate: "30 minutes ago"
    },
    {
      id: "phc-004",
      name: "Shillong PHC",
      district: "East Khasi Hills", 
      state: "Meghalaya",
      coordinates: [25.5788, 91.8933],
      riskLevel: "low",
      cases: 1,
      lastUpdate: "3 hours ago"
    },
    {
      id: "phc-005",
      name: "Agartala PHC",
      district: "West Tripura",
      state: "Tripura", 
      coordinates: [23.8315, 91.2868],
      riskLevel: "medium",
      cases: 4,
      lastUpdate: "45 minutes ago"
    }
  ];

  const riskColors = {
    low: "#22c55e",
    medium: "#eab308", 
    high: "#ef4444"
  };

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Initialize leaflet map would go here
    console.log("Map component mounted");

    return () => clearTimeout(timer);
  }, []);

  const handlePHCClick = (phc: PHCLocation) => {
    setSelectedPHC(phc);
    onPHCClick(phc);
    console.log(`PHC clicked: ${phc.name} - ${phc.riskLevel} risk`);
  };

  const handleZoomIn = () => {
    console.log("Zoom in triggered");
  };

  const handleZoomOut = () => {
    console.log("Zoom out triggered");
  };

  return (
    <Card className={`${className}`} data-testid="interactive-map">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Northeast India - PHC Risk Map</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn} data-testid="button-zoom-in">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut} data-testid="button-zoom-out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" data-testid="button-layers">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef}
          className="relative w-full h-96 bg-muted rounded-lg overflow-hidden"
          data-testid="map-container"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Simulated map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 400 300">
                    <path d="M50,50 Q200,20 350,80 L350,250 Q200,280 50,250 Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              
              {/* PHC markers */}
              {phcLocations.map((phc, index) => (
                <div
                  key={phc.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover-elevate"
                  style={{
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 12)}%`
                  }}
                  onClick={() => handlePHCClick(phc)}
                  data-testid={`marker-${phc.id}`}
                >
                  <div className="relative">
                    <MapPin 
                      className="h-6 w-6 drop-shadow-lg" 
                      style={{ color: riskColors[phc.riskLevel] }}
                      fill="currentColor"
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border shadow-lg rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      {phc.name}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {selectedPHC && (
          <div className="mt-4 p-3 bg-accent/50 rounded-lg" data-testid="selected-phc-info">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground">{selectedPHC.name}</h4>
              <Badge className={`
                ${selectedPHC.riskLevel === "low" ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : ""}
                ${selectedPHC.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300" : ""}
                ${selectedPHC.riskLevel === "high" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : ""}
              `}>
                {selectedPHC.riskLevel.charAt(0).toUpperCase() + selectedPHC.riskLevel.slice(1)} Risk
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{selectedPHC.district}, {selectedPHC.state}</p>
              <p>Active cases: {selectedPHC.cases}</p>
              <p>Last updated: {selectedPHC.lastUpdate}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}