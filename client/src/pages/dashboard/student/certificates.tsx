
import { useQuery } from "@tanstack/react-query";
import { Enrollment } from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function CertificatesList() {
  const { data: enrollments } = useQuery<(Enrollment & { course: any })[]>({
    queryKey: ["/api/user/enrollments"],
  });

  const completedCourses = enrollments?.filter(e => e.completed) || [];

  if (completedCourses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-500">
            Complete courses to earn certificates
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {completedCourses.map(enrollment => (
        <Card key={enrollment.id} className="border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-24 w-24 bg-primary/10 rounded-full" />
          <CardContent className="p-6">
            <Award className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {enrollment.course.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Completed on {new Date(enrollment.completedAt || '').toLocaleDateString()}
            </p>
            <Button size="sm" variant="outline" className="mt-2">Download</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="My Certificates" 
        subtitle="View and download your earned certificates" 
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CertificatesList />
      </Suspense>
    </div>
  );
}
