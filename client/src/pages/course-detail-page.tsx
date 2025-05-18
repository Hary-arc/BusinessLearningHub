
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Course, Review } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  FileText,
  Globe,
  Award,
  Play,
  CheckCircle,
  Users,
  BookOpen,
  BarChart,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const courseId = id;

  const { data: courseData, isLoading: isLoadingCourse } = useQuery<Course & { lessons: any[] }>({
    queryKey: [`/api/courses/${courseId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Network error' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error("Error fetching course:", err);
        throw err;
      }
    },
    enabled: !!courseId,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery<(Review & { user: any })[]>({
    queryKey: [`/api/courses/${courseId}/reviews`],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseId}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!courseId,
  });

  const { data: enrollment, isLoading: isLoadingEnrollment } = useQuery({
    queryKey: [`/api/user/enrollments/${courseId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/enrollments/${courseId}`);
        if (!res.ok) return null;
        return res.json();
      } catch (error) {
        return null;
      }
    },
    enabled: !!courseId && !!user
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/enrollments", { courseId });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to enroll");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/user/enrollments/${courseId}`],
      });
      toast({
        title: "Success!",
        description: "You have successfully enrolled in this course.",
      });
    },
    onError: (error) => {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-10 w-3/4 mt-4" />
                <Skeleton className="h-6 w-1/3 mt-2" />
                <Skeleton className="h-24 w-full mt-4" />
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Course not found
            </h1>
            <p className="mt-4 text-gray-500">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-8" onClick={() => navigate("/courses")}>
              Browse Courses
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const course = courseData;
  const lessons = courseData?.lessons || [];
  const formattedPrice = course?.price != null
    ? `${course.currency} ${(course.price / 100).toFixed(2)}`
    : "Free";

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in this course",
        variant: "destructive",
      });
      return;
    }
    enrollMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4">{course.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  {course.enrollmentCount || 0} students
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  {course.duration}h total
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  {lessons.length} lessons
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="rounded-lg shadow-xl w-full object-cover"
                style={{ maxHeight: "400px" }}
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Preview Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Master core concepts and principles",
                    "Build real-world projects",
                    "Gain practical experience",
                    "Learn industry best practices",
                    "Get personalized feedback",
                    "Earn a verified certificate",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                  <span>{lessons.length} lessons</span>
                  <span>{course.duration} hours total</span>
                </div>
                <Accordion type="single" collapsible className="border rounded-md">
                  {lessons.map((lesson, index) => (
                    <AccordionItem
                      key={lesson._id || `lesson-${index}`}
                      value={lesson._id || `lesson-${index}`}
                    >
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center">
                          <span className="mr-4 text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {lesson.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <div className="space-y-2">
                          <p className="text-gray-600">{lesson.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-primary">
                              <Play className="h-4 w-4 mr-2" />
                              <span>{lesson.duration} min</span>
                            </div>
                            {lesson.videoUrl && (
                              <Button variant="outline" size="sm">
                                Preview
                              </Button>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Student Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(course.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {course.rating} ({course.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {isLoadingReviews ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="ml-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20 mt-1" />
                          </div>
                        </div>
                        <Skeleton className="h-16 w-full mt-3" />
                      </div>
                    ))}
                  </div>
                ) : reviews?.length ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Avatar>
                            <AvatarImage src="" alt={review.user.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {review.user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <div className="font-medium">{review.user.fullName}</div>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet for this course.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  {formattedPrice}
                </div>

                {enrollment || enrollMutation.isSuccess ? (
                  <Button className="w-full mb-6" variant="secondary" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Enrolled
                  </Button>
                ) : (
                  <Button
                    className="w-full mb-6"
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending ? "Processing..." : "Enroll Now"}
                  </Button>
                )}

                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold">This course includes:</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 text-gray-400 mr-3" />
                      <span>Progress tracking</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Instructor</h3>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={course.instructorId?.imageUrl || ""}
                        alt={course.instructorId?.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {course.instructorId?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="font-medium">{course.instructorId?.name}</div>
                      <div className="text-sm text-gray-500">
                        {course.instructorId?.title || "Course Instructor"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
