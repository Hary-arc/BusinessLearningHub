
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function FacultyCoursesPage() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/faculty/courses"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader 
          title="My Courses" 
          subtitle="Manage your created courses" 
        />
        <Link href="/courses/new">
          <Button>Create New Course</Button>
        </Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {courses?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <Card key={course.id} className="overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="h-40 w-full object-cover"
                  />
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant={course.published ? "success" : "secondary"}>
                        {course.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                    <Link href={`/courses/${course.id}/edit`}>
                      <Button variant="outline" className="w-full">Edit Course</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Yet</h3>
                <p className="text-gray-500 mb-4">Create your first course to get started.</p>
                <Link href="/courses/new">
                  <Button>Create Course</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
