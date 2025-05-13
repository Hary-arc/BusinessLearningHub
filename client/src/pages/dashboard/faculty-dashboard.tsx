import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CourseCard } from "@/components/course/course-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import "@/components/ui/tabs.css";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, Star, FilePlus } from "lucide-react";
import { Link } from "wouter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCourseSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const courseFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  published: z.boolean().default(false),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/faculty/courses"],
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      price: 49.99,
      category: "",
      published: false,
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      // Convert price from dollars to cents
      const formattedData = {
        ...data,
        price: Math.round(data.price * 100),
      };
      const res = await apiRequest("POST", "/api/courses", formattedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faculty/courses"] });
      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    createCourseMutation.mutate(data);
  };

  // Calculate stats
  const totalCourses = courses?.length || 0;
  const publishedCourses = courses?.filter(c => c.published)?.length || 0;
  const draftCourses = totalCourses - publishedCourses;
  const totalStudents = 68; // Mock data as we don't have this API endpoint
  const averageRating = courses?.length 
    ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader title="Faculty Dashboard" subtitle="Manage your courses and track student progress" />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <DashboardSidebar userType="faculty" />

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Course Management</h2>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new course. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter course title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter course description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Business">Business</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="Marketing">Marketing</SelectItem>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                  <SelectItem value="Management">Management</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="49.99" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Provide a URL for the course cover image
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Publish Course
                              </FormLabel>
                              <FormDescription>
                                Make the course visible to students
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={createCourseMutation.isPending}>
                          {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                title="Total Courses" 
                value={totalCourses.toString()} 
                icon={<BookOpen className="h-8 w-8 text-primary" />} 
                description="Courses created" 
              />
              <StatsCard 
                title="Published" 
                value={publishedCourses.toString()} 
                icon={<BookOpen className="h-8 w-8 text-green-600" />} 
                description="Visible to students" 
              />
              <StatsCard 
                title="Drafts" 
                value={draftCourses.toString()} 
                icon={<BookOpen className="h-8 w-8 text-orange-500" />} 
                description="Work in progress" 
              />
              <StatsCard 
                title="Students" 
                value={totalStudents.toString()} 
                icon={<Users className="h-8 w-8 text-blue-500" />} 
                description="Enrolled in your courses" 
              />
            </div>

            <Tabs defaultValue="all-courses" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="all-courses">All Courses</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>

              <TabsContent value="all-courses">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
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
                ) : courses?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(course => (
                      <Card key={course.id} className="overflow-hidden">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="h-40 w-full object-cover"
                        />
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <div className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary">
                              {course.category}
                            </div>
                            <div className={`px-2 py-1 text-xs font-medium rounded ${
                              course.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {course.published ? 'Published' : 'Draft'}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-600">{course.rating} ({course.reviewCount} reviews)</span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <p className="font-medium text-primary">${(course.price / 100).toFixed(2)}</p>
                          <Link href={`/dashboard/faculty/courses/${course.id}`}>
                            <Button variant="outline" size="sm">Edit Course</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Yet</h3>
                      <p className="text-gray-500 mb-4">Create your first course to get started</p>
                      <DialogTrigger asChild>
                        <Button>Create Course</Button>
                      </DialogTrigger>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="published">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : courses?.filter(c => c.published)?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.filter(c => c.published).map(course => (
                      <Card key={course.id} className="overflow-hidden">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="h-40 w-full object-cover"
                        />
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <div className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary">
                              {course.category}
                            </div>
                            <div className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                              Published
                            </div>
                          </div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-600">{course.rating} ({course.reviewCount} reviews)</span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <p className="font-medium text-primary">${(course.price / 100).toFixed(2)}</p>
                          <Link href={`/dashboard/faculty/courses/${course.id}`}>
                            <Button variant="outline" size="sm">Edit Course</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Published Courses</h3>
                      <p className="text-gray-500 mb-4">Publish a course to make it visible to students</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="drafts">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : courses?.filter(c => !c.published)?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.filter(c => !c.published).map(course => (
                      <Card key={course.id} className="overflow-hidden">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="h-40 w-full object-cover"
                        />
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <div className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary">
                              {course.category}
                            </div>
                            <div className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                              Draft
                            </div>
                          </div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <p className="font-medium text-primary">${(course.price / 100).toFixed(2)}</p>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">Publish</Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Draft Courses</h3>
                      <p className="text-gray-500 mb-4">All your courses are published</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}