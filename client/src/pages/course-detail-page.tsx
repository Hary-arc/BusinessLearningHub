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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const { data: course, isLoading: isLoadingCourse } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      return response.json();
    },
    enabled: !!id,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery<
    (Review & { user: any })[]
  >({
    queryKey: [`/api/courses/${courseId}/reviews`],
    enabled: !!courseId,
  });

  const { data: enrollment, isLoading: isLoadingEnrollment } = useQuery({
    queryKey: [`/api/user/enrollments/${courseId}`],
    enabled: !!courseId && !!user,
    // This API endpoint might not exist, but we're checking for enrollment status
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/enrollments/${courseId}`);
        if (!res.ok) return null;
        return res.json();
      } catch (error) {
        return null;
      }
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/enrollments", { courseId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/user/enrollments/${courseId}`],
      });
      toast({
        title: "Enrolled successfully",
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

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to enroll in this course",
      });
      navigate("/auth");
      return;
    }

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: course.price }),
      });
      const { orderId, keyId } = await orderResponse.json();

      // Initialize payment
      const paymentHandler = new window.Razorpay({
        key: keyId,
        amount: course.price,
        currency: "INR",
        name: "Business Learn",
        description: `Enrollment for ${course.title}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const { valid } = await verifyResponse.json();
            if (valid) {
              // Complete enrollment after successful payment
              enrollMutation.mutate();
            } else {
              toast({
                title: "Payment verification failed",
                description: "Please try again or contact support",
                variant: "destructive",
              });
            }
          } catch (error) {
            toast({
              title: "Payment verification failed",
              description: "Please try again or contact support",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      });

      paymentHandler.open();
    } catch (error) {
      toast({
        title: "Payment initialization failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  };

  // Format price from cents to dollars
  const formattedPrice = course
    ? `${course.currency} ${course.price.toFixed(2)}`
    : "";

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 bg-gray-50">
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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 bg-gray-50">
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

  // Dummy data for lessons
  const lessons = [
    {
      id: 1,
      title: "Module 1: Introduction to Business Marketing",
      content: "Understanding Your Target Market",
      duration: 15,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Module 2: Digital Marketing Essentials",
      content: "Social Media Strategies for Local Businesses",
      duration: 25,
      videoUrl: null,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Details */}
            <div className="lg:col-span-2">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: "400px" }}
              />

              <div className="mt-6">
                <Badge className="bg-primary-100 text-primary hover:bg-primary-200">
                  {course.category}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                  {course.title}
                </h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(course.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.rating} ({course.reviewCount} reviews)
                  </span>
                </div>

                <div className="mt-6 prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Description
                  </h2>
                  <p className="text-gray-700">{course.description}</p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What You'll Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span>
                        Effective marketing strategies for small businesses
                      </span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span>
                        Cost-effective customer acquisition techniques
                      </span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span>Building a sustainable local customer base</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span>Measuring marketing ROI for local businesses</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Course Content
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="border rounded-md"
                  >
                    {lessons.map((lesson) => (
                      <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`}>
                        <AccordionTrigger className="px-4">
                          {lesson.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Play className="h-4 w-4 mr-2 text-primary" />
                                <span>{lesson.content}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {lesson.duration} min
                              </span>
                            </div>
                            {lesson.videoUrl && (
                              <div className="mt-2">
                                <Button variant="outline" size="sm">
                                  <Play className="h-4 w-4 mr-2" />
                                  Watch Video
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Reviews
                  </h2>
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
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" alt={review.user.fullName} />
                              <AvatarFallback className="bg-primary-50 text-primary">
                                {review.user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <div className="font-medium">
                                {review.user.fullName}
                              </div>
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
                          <p className="mt-3 text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No reviews yet for this course.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <div className="text-3xl font-bold text-gray-900">
                  {formattedPrice}
                </div>

                <div className="mt-6">
                  {enrollment || enrollMutation.isSuccess ? (
                    <Button className="w-full" variant="secondary" disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Enrolled
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending
                        ? "Processing..."
                        : "Enroll Now"}
                    </Button>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span>10 hours of content</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span>25 lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Certificate of completion</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt="Instructor" />
                      <AvatarFallback className="bg-primary-50 text-primary">
                        IS
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        Instructor
                      </div>
                      <div className="text-sm text-gray-500">
                        Marketing Faculty
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Expert in business marketing with over 10 years of
                    experience helping small businesses grow their customer
                    base.
                  </p>
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