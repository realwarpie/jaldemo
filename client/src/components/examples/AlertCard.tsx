import { AlertCard } from '../AlertCard';

export default function AlertCardExample() {
  //todo: remove mock functionality - replace with real alert data
  const mockAlerts = [
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
        "15 confirmed cases with cholera symptoms",
        "Poor sanitation infrastructure"
      ],
      estimatedCases: 25,
      confidence: 87
    },
    {
      id: "alert-002", 
      title: "Diarrhea Cluster Detection",
      severity: "medium" as const,
      status: "verified" as const,
      location: "Silchar District, Assam",
      affectedPopulation: 8000,
      timestamp: "6 hours ago",
      description: "Unusual increase in diarrhea cases reported from multiple PHCs in the region.",
      riskFactors: [
        "7 cases reported in past 48 hours",
        "Water quality issues in 2 villages",
        "Seasonal patterns suggest outbreak risk"
      ],
      estimatedCases: 12,
      confidence: 72
    },
    {
      id: "alert-003",
      title: "Water Quality Alert",
      severity: "high" as const,
      status: "resolved" as const,
      location: "Guwahati District, Assam", 
      affectedPopulation: 5000,
      timestamp: "1 day ago",
      description: "Water contamination detected at multiple test sites. Immediate intervention required.",
      riskFactors: [
        "E. coli levels above WHO standards",
        "Multiple contaminated water sources",
        "3 suspected cases under observation"
      ],
      estimatedCases: 8,
      confidence: 94
    }
  ];

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      {mockAlerts.map(alert => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onVerify={(id) => console.log('Verify alert:', id)}
          onResolve={(id) => console.log('Resolve alert:', id)}
          onViewDetails={(id) => console.log('View details:', id)}
        />
      ))}
    </div>
  );
}