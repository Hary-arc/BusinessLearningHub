
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function QuizzesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Quizzes" 
        subtitle="View and take your course quizzes" 
      />
      {/* Add quizzes content here */}
    </div>
  );
}
