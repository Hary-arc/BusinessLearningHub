
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Batches" 
        subtitle="View your enrolled batches and schedules" 
      />
      {/* Add batches content here */}
    </div>
  );
}
