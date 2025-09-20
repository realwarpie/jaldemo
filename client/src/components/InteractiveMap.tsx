import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ZoomIn, ZoomOut, Layers } from "lucide-react";
import 'leaflet/dist/leaflet.css';

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
  const leafletMapRef = useRef<any>(null);
  const [selectedPHC, setSelectedPHC] = useState<PHCLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

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
      initializeMap();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  const initializeMap = async () => {
    if (!mapRef.current || mapReady) return;

    try {
      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default;
      
      // Create map centered on Northeast India
      const map = L.map(mapRef.current).setView([25.5, 92.5], 6);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add markers for each PHC
      phcLocations.forEach(phc => {
        const markerIcon = L.divIcon({
          html: `<div style="color: ${riskColors[phc.riskLevel]}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>`,
          className: 'custom-marker-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        });
        
        const marker = L.marker(phc.coordinates, { icon: markerIcon })
          .addTo(map)
          .bindTooltip(phc.name)
          .on('click', () => handlePHCClick(phc));
      });
      
      leafletMapRef.current = map;
      setMapReady(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const handlePHCClick = (phc: PHCLocation) => {
    setSelectedPHC(phc);
    onPHCClick(phc);
    console.log(`PHC clicked: ${phc.name} - ${phc.riskLevel} risk`);
    
    // If we have a map reference, fly to the PHC location
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo(phc.coordinates, 9, {
        animate: true,
        duration: 1
      });
    }
  };

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
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