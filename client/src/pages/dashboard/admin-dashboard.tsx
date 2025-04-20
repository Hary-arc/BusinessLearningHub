import { useQuery } from "@tanstack/react-query";
import { User, Course, Subscription } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from "recharts";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: users, isLoading: isLoadingUsers } = useQuery<Omit<User, "password">[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Calculate stats
  const totalUsers = users?.length || 0;
  const totalStudents = users?.filter(u => u.userType === "student")?.length || 0;
  const totalFaculty = users?.filter(u => u.userType === "faculty")?.length || 0;
  const totalAdmins = users?.filter(u => u.userType === "admin")?.length || 0;
  
  const totalCourses = courses?.length || 0;
  const totalRevenue = 12580; // Mock data as we don't have this API endpoint
  const activeSubscriptions = 45; // Mock data

  // Data for charts
  const userTypeData = [
    { name: "Students", value: totalStudents, color: "#3b82f6" },
    { name: "Faculty", value: totalFaculty, color: "#10b981" },
    { name: "Admins", value: totalAdmins, color: "#f59e0b" },
  ];

  const revenueData = [
    { name: "Jan", revenue: 1200 },
    { name: "Feb", revenue: 1900 },
    { name: "Mar", revenue: 1600 },
    { name: "Apr", revenue: 2400 },
    { name: "May", revenue: 2800 },
    { name: "Jun", revenue: 2600 },
  ];

  const courseEnrollmentData = [
    { name: "Marketing", enrollments: 45 },
    { name: "Finance", enrollments: 32 },
    { name: "Technology", enrollments: 28 },
    { name: "Management", enrollments: 20 },
    { name: "Business", enrollments: 15 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader title="Admin Dashboard" subtitle="Manage platform, users, and content" />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <DashboardSidebar userType="admin" />
          
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                title="Total Users" 
                value={totalUsers.toString()} 
                icon={<Users className="h-8 w-8 text-primary" />} 
                description="Platform users" 
              />
              <StatsCard 
                title="Total Courses" 
                value={totalCourses.toString()} 
                icon={<BookOpen className="h-8 w-8 text-blue-500" />} 
                description="Available courses" 
              />
              <StatsCard 
                title="Revenue" 
                value={`$${(totalRevenue / 100).toFixed(2)}`} 
                icon={<DollarSign className="h-8 w-8 text-green-600" />} 
                description="Total earnings" 
              />
              <StatsCard 
                title="Active Subscriptions" 
                value={activeSubscriptions.toString()} 
                icon={<TrendingUp className="h-8 w-8 text-orange-500" />} 
                description="Current subscribers" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue from subscriptions and courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, "Revenue"]}
                          labelStyle={{ color: "black" }}
                          contentStyle={{ backgroundColor: "white", borderRadius: "8px" }}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of user types on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Users"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View and manage platform users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingUsers ? (
                      <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : users?.length ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Username</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.fullName}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      user.userType === 'student' 
                                        ? 'bg-blue-50 text-blue-700 border-blue-300' 
                                        : user.userType === 'faculty' 
                                        ? 'bg-green-50 text-green-700 border-green-300'
                                        : 'bg-orange-50 text-orange-700 border-orange-300'
                                    }
                                  >
                                    {user.userType}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <h3 className="text-lg font-medium text-gray-900">No Users Found</h3>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>
                      View and manage platform courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingCourses ? (
                      <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : courses?.length ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {courses.map((course) => (
                              <TableRow key={course.id}>
                                <TableCell className="font-medium">{course.title}</TableCell>
                                <TableCell>{course.category}</TableCell>
                                <TableCell>${(course.price / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      course.published 
                                        ? 'bg-green-50 text-green-700 border-green-300' 
                                        : 'bg-orange-50 text-orange-700 border-orange-300'
                                    }
                                  >
                                    {course.published ? 'Published' : 'Draft'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {course.rating} 
                                    <span className="text-xs text-gray-500 ml-1">
                                      ({course.reviewCount})
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <h3 className="text-lg font-medium text-gray-900">No Courses Found</h3>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Course Enrollments</CardTitle>
                    <CardDescription>
                      Enrollment statistics by course category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={courseEnrollmentData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip formatter={(value) => [value, "Enrollments"]} />
                          <Bar dataKey="enrollments" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subscriptions">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                    <CardDescription>
                      View and manage user subscriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Mock subscription data since we don't have the API endpoint */}
                          <TableRow>
                            <TableCell className="font-medium">Emily Wilson</TableCell>
                            <TableCell>Professional</TableCell>
                            <TableCell>$79.00</TableCell>
                            <TableCell>2023-04-15</TableCell>
                            <TableCell>2023-05-15</TableCell>
                            <TableCell>
                              <Badge className="bg-green-50 text-green-700 border-green-300">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">David Martinez</TableCell>
                            <TableCell>Enterprise</TableCell>
                            <TableCell>$199.00</TableCell>
                            <TableCell>2023-03-22</TableCell>
                            <TableCell>2023-04-22</TableCell>
                            <TableCell>
                              <Badge className="bg-green-50 text-green-700 border-green-300">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">James Robinson</TableCell>
                            <TableCell>Basic</TableCell>
                            <TableCell>$29.00</TableCell>
                            <TableCell>2023-02-10</TableCell>
                            <TableCell>2023-03-10</TableCell>
                            <TableCell>
                              <Badge className="bg-red-50 text-red-700 border-red-300">
                                Expired
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Renew
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Subscription Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of subscription plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Basic", value: 18, color: "#3b82f6" },
                              { name: "Professional", value: 24, color: "#10b981" },
                              { name: "Enterprise", value: 3, color: "#f59e0b" },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: "Basic", value: 18, color: "#3b82f6" },
                              { name: "Professional", value: 24, color: "#10b981" },
                              { name: "Enterprise", value: 3, color: "#f59e0b" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, "Subscriptions"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
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
