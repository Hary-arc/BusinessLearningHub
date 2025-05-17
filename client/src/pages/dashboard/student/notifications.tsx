
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Notifications" 
        subtitle="View your recent notifications and updates" 
      />
      {/* Add notifications content here */}
    </div>
  );
}
