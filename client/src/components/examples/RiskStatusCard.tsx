import { RiskStatusCard } from '../RiskStatusCard';

export default function RiskStatusCardExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
      <RiskStatusCard
        level="low"
        title="Guwahati PHC"
        location="Kamrup District"
        lastUpdated="2 hours ago"
        factors={["Normal water quality", "No recent cases", "Good sanitation"]}
        onClick={() => console.log('Low risk PHC clicked')}
      />
      <RiskStatusCard
        level="medium"
        title="Silchar PHC"
        location="Cachar District"
        lastUpdated="1 hour ago"
        factors={["Moderate rainfall", "2 new cases", "Water testing pending"]}
        onClick={() => console.log('Medium risk PHC clicked')}
      />
      <RiskStatusCard
        level="high"
        title="Imphal PHC"
        location="Manipur West"
        lastUpdated="30 minutes ago"
        factors={["Heavy rainfall", "5+ new cases", "Contaminated water source"]}
        onClick={() => console.log('High risk PHC clicked')}
      />
    </div>
  );
}