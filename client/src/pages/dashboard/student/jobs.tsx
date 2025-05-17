
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Jobs" 
        subtitle="Browse available job opportunities" 
      />
      {/* Add jobs content here */}
    </div>
  );
}
