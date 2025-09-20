import { TrendChart } from '../TrendChart';

export default function TrendChartExample() {
  return (
    <div className="p-4">
      <TrendChart chartType="cases" timeRange="30d" />
    </div>
  );
}