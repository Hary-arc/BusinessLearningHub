
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Course } from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import "@/components/ui/tabs.css";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminControlPanel() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const generateCertificateMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/certificates/generate/${userId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate certificate');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Certificate Generated",
        description: "The certificate has been generated successfully."
      });
    }
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update user status');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "User status has been updated successfully."
      });
    }
  });

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Admin Control Panel" 
        subtitle="Manage users, courses, and system-wide operations" 
      />

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="courses">Course Control</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Control user access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <Badge>{user.userType}</Badge>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => updateUserStatusMutation.mutate({ 
                          userId: user.id, 
                          status: 'suspended' 
                        })}
                      >
                        Suspend
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedUser(user.id)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Control</CardTitle>
              <CardDescription>Manage course visibility and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses?.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <Badge>{course.category}</Badge>
                      <Badge variant={course.published ? "default" : "secondary"}>
                        {course.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline">Review</Button>
                      <Button variant="outline">
                        {course.published ? "Unpublish" : "Publish"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Management</CardTitle>
              <CardDescription>Generate and manage certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.filter(u => u.userType === "student").map(student => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <Button 
                      onClick={() => generateCertificateMutation.mutate(student.id)}
                    >
                      Generate Certificate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
