
import { useQuery } from "@tanstack/react-query";
import { Enrollment } from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EnrollmentCard } from "@/components/dashboard/enrollment-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudentCoursesPage() {
  const { data: enrollments, isLoading } = useQuery<(Enrollment & { course: any })[]>({
    queryKey: ["/api/user/enrollments"],
  });

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="My Courses" 
        subtitle="View and manage your enrolled courses" 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-32 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : enrollments?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map(enrollment => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
