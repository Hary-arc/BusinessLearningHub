import { useQuery } from "@tanstack/react-query";
import { Enrollment, Subscription } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { EnrollmentCard } from "@/components/dashboard/enrollment-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import "@/components/ui/tabs.css";
import { BookOpen, Clock, Award, GraduationCap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Outlet } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery<(Enrollment & { course: any })[]>({
    queryKey: ["/api/user/enrollments"],
  });

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery<Subscription>({
    queryKey: ["/api/user/subscription"],
  });

  // Calculate stats
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter(e => e.completed)?.length || 0;
  const inProgressCourses = totalCourses - completedCourses;
  const averageProgress = enrollments?.length ? 
    Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 
    0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader title="Student Dashboard" subtitle="Track your learning progress and manage your courses" />
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar userType="student" />
          
          <main className="flex-1">
         
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                title="Enrolled Courses" 
                value={totalCourses.toString()} 
                icon={<BookOpen className="h-8 w-8 text-primary" />} 
                description="Total courses enrolled" 
                />
              <StatsCard 
                title="In Progress" 
                value={inProgressCourses.toString()} 
                icon={<Clock className="h-8 w-8 text-orange-500" />} 
                description="Courses being taken" 
                />
              <StatsCard 
                title="Completed" 
                value={completedCourses.toString()} 
                icon={<Award className="h-8 w-8 text-green-600" />} 
                description="Finished courses" 
                />
              <StatsCard 
                title="Average Progress" 
                value={`${averageProgress}%`} 
                icon={<BarChart3 className="h-8 w-8 text-blue-500" />} 
                description="Across all courses" 
                />
            </div>

            <Tabs defaultValue="my-courses" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="my-courses">My Courses</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="certificates" asChild>
                <Link href="/dashboard/student/certificates">Certificates</Link>
              </TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-courses">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                  <Link href="/courses">
                    <Button variant="outline" size="sm">Browse More Courses</Button>
                  </Link>
                </div>
                
                {isLoadingEnrollments ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-32 bg-gray-200 animate-pulse" />
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-8 w-full mt-4" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : enrollments?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrollments.map(enrollment => (
                      <Link href={`/courses/${enrollment.course.id}`} key={enrollment.id}>
                        <EnrollmentCard enrollment={enrollment} />
                      </Link>
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
              </TabsContent>
              
              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription>
                      Manage your current subscription plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingSubscription ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-8 w-1/4" />
                      </div>
                    ) : subscription ? (
                      <div>
                        <div className="mb-6">
                          <h3 className="text-lg font-medium text-gray-900 capitalize mb-1">
                            {subscription.planType} Plan
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Active until {new Date(subscription.endDate).toLocaleDateString()}
                          </p>
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <Progress value={75} className="h-2" />
                            </div>
                            <span className="text-sm text-gray-500">
                              25 days left
                            </span>
                          </div>
                        </div>
                        <Button variant="outline">Manage Plan</Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Active Subscription
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Subscribe to a plan to access premium course content
                        </p>
                        <Link href="/#subscription-plans">
                          <Button>View Plans</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificates">
                <Card>
                  <CardHeader>
                    <CardTitle>My Certificates</CardTitle>
                    <CardDescription>
                      Certificates earned for completed courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedCourses > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrollments?.filter(e => e.completed)?.map(enrollment => (
                          <Card key={enrollment.id} className="border-2 border-primary/20 relative overflow-hidden">
                            <div className="absolute -right-12 -top-12 h-24 w-24 bg-primary/10 rounded-full" />
                            <CardContent className="p-6">
                              <Award className="h-10 w-10 text-primary mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {enrollment.course.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                Completed on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                              </p>
                              <Button size="sm" variant="outline" className="mt-2">Download</Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Certificates Yet
                        </h3>
                        <p className="text-gray-500">
                          Complete courses to earn certificates
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}